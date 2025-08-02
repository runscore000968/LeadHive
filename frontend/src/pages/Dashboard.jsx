import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { BarChart3, Users, Target, Clock, Phone, User, TrendingUp, Zap } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalLeads: 0,
    leadsPending: 0,
    leadsContacted: 0
  })
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingLeadId, setUpdatingLeadId] = useState(null)
  const [animatedStats, setAnimatedStats] = useState({
    totalAgents: 0,
    totalLeads: 0,
    leadsPending: 0,
    leadsContacted: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      // Fetch agents
      const agentsResponse = await axios.get('/api/agents', config)
      const totalAgents = agentsResponse.data.agents.length

      // Fetch all leads
      const leadsResponse = await axios.get('/api/upload/leads/all', config)
      const leads = leadsResponse.data.leads || []

      const newStats = {
        totalAgents,
        totalLeads: leads.length,
        leadsPending: leads.filter(lead => lead.status === 'pending').length,
        leadsContacted: leads.filter(lead => lead.status === 'contacted').length
      }

      setStats(newStats)
      setRecentLeads(leads.slice(0, 5))
      
      // Animate numbers after data is loaded
      animateNumbers(newStats)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const animateNumbers = (targetStats) => {
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps
    
    Object.keys(targetStats).forEach(key => {
      const target = targetStats[key]
      let current = 0
      const increment = target / steps
      
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setAnimatedStats(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }))
      }, stepDuration)
    })
  }

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      setUpdatingLeadId(leadId)
      const token = localStorage.getItem('token')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      await axios.put(`/api/leads/${leadId}/status`, { status: newStatus }, config)
      
      // Update local state
      setRecentLeads(prevLeads => 
        prevLeads.map(lead => 
          lead._id === leadId ? { ...lead, status: newStatus } : lead
        )
      )

      // Update stats
      const updatedStats = {
        ...stats,
        leadsPending: newStatus === 'pending' 
          ? stats.leadsPending + 1
          : stats.leadsPending - 1,
        leadsContacted: newStatus === 'contacted' 
          ? stats.leadsContacted + 1 
          : stats.leadsContacted - 1
      }
      
      setStats(updatedStats)
      setAnimatedStats(updatedStats)

      toast.success(`Lead status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating lead status:', error)
      toast.error('Failed to update lead status')
    } finally {
      setUpdatingLeadId(null)
    }
  }

  const StatCard = ({ title, value, icon: Icon, gradient, delay = 0 }) => (
    <div 
      className={`relative overflow-hidden rounded-2xl shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl ${gradient} p-1`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 h-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
            <p className="text-3xl font-bold text-white">
              {loading ? (
                <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
              ) : (
                <span className="tabular-nums">{value.toLocaleString()}</span>
              )}
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
            <span className="text-green-300 text-sm font-medium">Live</span>
            <span className="text-white/60 text-sm ml-2">Real-time data</span>
          </div>
        </div>
      </div>
      
      {/* Animated background particles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
      </div>
    )
  }

  const statCards = [
    { title: 'Total Agents', value: animatedStats.totalAgents, icon: Users, gradient: 'bg-gradient-to-br from-blue-500 to-blue-700', delay: 0 },
    { title: 'Total Leads', value: animatedStats.totalLeads, icon: Target, gradient: 'bg-gradient-to-br from-purple-500 to-purple-700', delay: 200 },
    { title: 'Pending Leads', value: animatedStats.leadsPending, icon: Clock, gradient: 'bg-gradient-to-br from-amber-500 to-orange-600', delay: 400 },
    { title: 'Contacted Leads', value: animatedStats.leadsContacted, icon: Zap, gradient: 'bg-gradient-to-br from-green-500 to-emerald-600', delay: 600 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-slate-300 text-lg">Real-time insights and lead management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, index) => (
            <div key={card.title} className="animate-slide-up" style={{ animationDelay: `${card.delay}ms` }}>
              <StatCard {...card} />
            </div>
          ))}
        </div>

        {/* Recent Leads Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-slide-up" style={{ animationDelay: '800ms' }}>
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-8 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-purple-300" />
                Recent Leads
              </h2>
              <div className="px-4 py-2 bg-white/10 rounded-full">
                <span className="text-white/90 text-sm font-medium">{recentLeads.length} leads</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {recentLeads.length > 0 ? (
              <div className="space-y-4">
                {recentLeads.map((lead, index) => (
                  <div
                    key={lead._id}
                    className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl animate-slide-up"
                    style={{ animationDelay: `${1000 + index * 100}ms` }}
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{lead.firstName}</h3>
                          <div className="flex items-center text-slate-300 mt-1">
                            <Phone className="w-4 h-4 mr-2" />
                            <a href={`tel:${lead.phone}`} className="hover:text-purple-300 transition-colors">
                              {lead.phone}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between lg:justify-end space-x-4">
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">Assigned to</p>
                          <p className="text-white font-medium">{lead.agent?.name || 'Unknown'}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            lead.status === 'pending' 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}>
                            {lead.status}
                          </span>
                          
                          {lead.status === 'pending' ? (
                            <button
                              onClick={() => updateLeadStatus(lead._id, 'contacted')}
                              disabled={updatingLeadId === lead._id}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                              {updatingLeadId === lead._id ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  <span>Updating...</span>
                                </div>
                              ) : (
                                'Mark Contacted'
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => updateLeadStatus(lead._id, 'pending')}
                              disabled={updatingLeadId === lead._id}
                              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                              {updatingLeadId === lead._id ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  <span>Updating...</span>
                                </div>
                              ) : (
                                'Mark Pending'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No recent leads found</p>
              </div>
            )}
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
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  )
}

export default Dashboard