import { useState, useEffect } from 'react'
import axios from 'axios'

const Agents = () => {
  const [agents, setAgents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/agents', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAgents(response.data.agents)
    } catch (error) {
      console.error('Failed to fetch agents')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/agents', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setAgents([...agents, response.data.agent])
      setFormData({ name: '', email: '', mobile: '', password: '' })
      setShowForm(false)
      console.log('Agent created successfully')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create agent'
      console.error(message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`/api/agents/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        setAgents(agents.filter(agent => agent._id !== id))
        console.log('Agent deleted successfully')
      } catch (error) {
        console.error('Failed to delete agent')
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex justify-center items-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-transparent border-t-purple-400 border-r-pink-400 rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-t-blue-400 border-r-cyan-400 rounded-full animate-spin animation-delay-200"></div>
          <div className="absolute top-4 left-4 w-12 h-12 border-4 border-transparent border-t-pink-400 border-r-purple-400 rounded-full animate-spin animation-delay-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-pulse">
                Agents Management
              </h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">
                  {showForm ? '✕ Cancel' : '+ Add Agent'}
                </span>
              </button>
            </div>

            {showForm && (
              <div className="mb-8 backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-xl transform animate-slideDown">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="group">
                      <label className="block text-sm font-medium text-white/80 mb-2 transform group-focus-within:text-purple-300 transition-colors duration-200">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 backdrop-blur-sm"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter agent name"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-white/80 mb-2 transform group-focus-within:text-purple-300 transition-colors duration-200">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 backdrop-blur-sm"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-white/80 mb-2 transform group-focus-within:text-purple-300 transition-colors duration-200">
                        Mobile
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 backdrop-blur-sm"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-white/80 mb-2 transform group-focus-within:text-purple-300 transition-colors duration-200">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        required
                        minLength="6"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 backdrop-blur-sm"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password (min 6 chars)"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">✓ Create Agent</span>
                  </button>
                </div>
              </div>
            )}

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white/90 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {agents.map((agent, index) => (
                      <tr 
                        key={agent._id} 
                        className="hover:bg-white/5 transition-all duration-300 transform hover:scale-[1.01] animate-fadeIn"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {agent.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                          {agent.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                          {agent.mobile}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full backdrop-blur-sm transform hover:scale-110 transition-all duration-200 ${
                            agent.isActive 
                              ? 'bg-green-500/20 text-green-300 border border-green-400/30 shadow-lg shadow-green-500/20' 
                              : 'bg-red-500/20 text-red-300 border border-red-400/30 shadow-lg shadow-red-500/20'
                          }`}>
                            {agent.isActive ? '● Active' : '○ Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(agent._id)}
                            className="text-red-400 hover:text-red-300 transform hover:scale-110 transition-all duration-200 hover:drop-shadow-lg font-semibold"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Agents