import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const Upload = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [distribution, setDistribution] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
      } else {
        toast.error('Please select a valid CSV, XLS, or XLSX file')
        setFile(null)
      }
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })

      setDistribution(response.data.distribution)
      toast.success(response.data.message)
      setFile(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed'
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Animated grid */}
        <div className="absolute w-full h-full bg-[radial-gradient(#ffffff11_1px,transparent_1px)] bg-[length:20px_20px] animate-moveBg" />
        {/* Glowing orbs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-pink-500 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-400 opacity-20 rounded-full blur-3xl animate-ping" />
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white opacity-10 rounded-full w-1 h-1 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="z-10 w-full max-w-2xl p-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">Upload Leads</h1>

        <form onSubmit={handleUpload} className="space-y-6">
          <motion.label
            htmlFor="file-upload"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative block w-full p-6 text-center border-2 border-dashed border-white/30 rounded-xl transition-all duration-300 cursor-pointer hover:bg-white/10"
          >
            <motion.div animate={{ scale: file ? 1.05 : 1, rotate: file ? 5 : 0 }} className="text-sm">
              {file ? (
                <p className="text-green-300 font-medium">{file.name}</p>
              ) : (
                <>
                  <p className="text-white">Drag & drop or click to upload</p>
                  <p className="text-xs text-white/60">CSV, XLS, XLSX up to 5MB</p>
                </>
              )}
            </motion.div>
            <input id="file-upload" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="sr-only" />
          </motion.label>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!file || uploading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all duration-300"
          >
            {uploading ? 'Uploading...' : 'Upload and Distribute'}
          </motion.button>
        </form>

        <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-xl text-sm text-white/80">
          <h3 className="font-semibold mb-2">File Format Requirements:</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>CSV, XLS, or XLSX format only</li>
            <li>Required columns: FirstName, Phone</li>
            <li>Optional column: Notes</li>
            <li>Leads will be distributed equally among active agents</li>
          </ul>
        </div>

        {distribution && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Distribution Results</h2>
            <div className="grid gap-6">
              {distribution.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4, rotateX: 5, rotateY: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="p-4 bg-white/10 border border-white/20 rounded-xl shadow-md"
                >
                  <h3 className="font-bold">{item.agent.name} ({item.agent.email})</h3>
                  <p className="text-sm text-white/70">Assigned {item.leads.length} leads</p>
                  <details className="mt-2 text-sm">
                    <summary className="cursor-pointer text-blue-300">View assigned leads</summary>
                    <div className="mt-2 space-y-1 text-xs text-white/60">
                      {item.leads.slice(0, 5).map((lead) => (
                        <div key={lead._id}>{lead.firstName} - {lead.phone}</div>
                      ))}
                      {item.leads.length > 5 && (
                        <div className="text-white/40">... and {item.leads.length - 5} more</div>
                      )}
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-white text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            🎉 Upload Success!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regular <style> tag for React */}
      <style>
        {`
          @keyframes moveBg {
            0% { background-position: 0 0; }
            100% { background-position: 1000px 1000px; }
          }
          .animate-moveBg {
            animation: moveBg 30s linear infinite;
          }

          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
          }
          .animate-float {
            animation: float 6s linear infinite;
          }
        `}
      </style>
    </div>
  )
}

export default Upload
