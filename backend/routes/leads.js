const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

// Update lead status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'contacted', 'converted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.status = status;
    await lead.save();

    res.json({
      success: true,
      message: 'Lead status updated successfully',
      lead
    });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;