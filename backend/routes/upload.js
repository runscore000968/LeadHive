const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Agent = require('../models/Agent');
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV, XLS, and XLSX files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload and distribute leads
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const uploadBatch = Date.now().toString();
    let leads = [];

    // Parse file based on type
    if (fileExtension === '.csv') {
      leads = await parseCSV(filePath);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      leads = await parseExcel(filePath);
    } else {
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    // Validate leads
    const validLeads = leads.filter(lead => 
      lead.firstName && lead.phone && lead.phone.toString().trim() !== ''
    );

    if (validLeads.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No valid leads found in the file' });
    }

    // Get active agents
    const agents = await Agent.find({ isActive: true });
    if (agents.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No active agents found' });
    }

    // Distribute leads among agents
    const distributedLeads = distributeLeads(validLeads, agents);

    // Save leads to database
    const savedLeads = await Lead.insertMany(distributedLeads.map(lead => ({
      ...lead,
      uploadBatch
    })));

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Group leads by agent
    const leadsByAgent = {};
    savedLeads.forEach(lead => {
      const agentId = lead.agent.toString();
      if (!leadsByAgent[agentId]) {
        leadsByAgent[agentId] = [];
      }
      leadsByAgent[agentId].push(lead);
    });

    // Get agent details
    const agentDetails = await Agent.find({ _id: { $in: Object.keys(leadsByAgent) } });
    
    const result = agentDetails.map(agent => ({
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email
      },
      leads: leadsByAgent[agent._id.toString()] || []
    }));

    res.json({
      success: true,
      message: `Successfully uploaded and distributed ${savedLeads.length} leads among ${agents.length} agents`,
      distribution: result
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Get leads by agent or all leads
router.get('/leads/:agentId', auth, async (req, res) => {
  try {
    const { agentId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Prepare query - if agentId is 'all', don't filter by agent
    const query = agentId === 'all' ? {} : { agent: agentId };

    const leads = await Lead.find(query)
      .populate('agent', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      leads,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to parse CSV
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          firstName: data.FirstName || data.firstName || data.firstname || '',
          phone: data.Phone || data.phone || '',
          notes: data.Notes || data.notes || ''
        });
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Helper function to parse Excel
function parseExcel(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    return data.map(row => ({
      firstName: row.FirstName || row.firstName || row.firstname || '',
      phone: row.Phone || row.phone || '',
      notes: row.Notes || row.notes || ''
    }));
  } catch (error) {
    throw new Error('Error parsing Excel file');
  }
}

// Helper function to distribute leads among agents
function distributeLeads(leads, agents) {
  const distributed = [];
  const agentCount = agents.length;
  
  leads.forEach((lead, index) => {
    const agentIndex = index % agentCount;
    distributed.push({
      ...lead,
      agent: agents[agentIndex]._id
    });
  });
  
  return distributed;
}

module.exports = router;