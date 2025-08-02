import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('/api/auth/login', formData)
      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        setIsAuthenticated(true)
        toast.success('Login successful!')
        navigate('/dashboard')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-animation py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating particles and glow */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200 opacity-20 blur-3xl animate-float1"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-indigo-200 opacity-20 blur-3xl animate-float2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-purple-200 opacity-20 blur-3xl animate-float3"></div>

        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white opacity-10 ${i % 2 === 0 ? 'w-2 h-2' : 'w-1 h-1'}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 8}s infinite ease-in-out ${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden relative z-10 border border-white/20">
        <div className="header-gradient-animation py-6 relative">
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
          <div className="absolute -bottom-5 -left-10 w-40 h-20 bg-blue-400/20 rounded-full animate-wave"></div>
          <div className="absolute -bottom-8 -right-10 w-60 h-30 bg-indigo-400/20 rounded-full animate-wave-delay"></div>

          <div className="flex justify-center relative z-10">
            <div className="hover:rotate-12 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-2 text-center text-3xl font-bold text-white">Sign in to your account</h2>
        </div>

        <div className="px-8 py-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-blue-500"
                >
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style>
        {`
          /* 12-color background animation */
          @keyframes gradientCycle {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .bg-gradient-animation {
            background: linear-gradient(-45deg,
              #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee,
              #fddb92, #a1c4fd, #c2e9fb, #d4fc79,
              #96e6a1, #84fab0, #8fd3f4, #a18cd1);
            background-size: 300% 300%;
            animation: gradientCycle 30s ease infinite;
          }

          /* Header 3-color pair gradient cycle */
          @keyframes headerCycle {
            0%, 33% {
              background: linear-gradient(to right, #667eea, #764ba2);
            }
            33%, 66% {
              background: linear-gradient(to right, #ff758c, #ff7eb3);
            }
            66%, 100% {
              background: linear-gradient(to right, #43e97b, #38f9d7);
            }
          }
          .header-gradient-animation {
            animation: headerCycle 15s ease infinite;
            background-size: 200% 200%;
          }

          @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-20px) translateX(10px); } }
          @keyframes float1 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-30px) translateX(-15px); } }
          @keyframes float2 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-25px) translateX(20px); } }
          @keyframes float3 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-15px) translateX(-20px); } }
          @keyframes wave { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }

          .animate-float1 { animation: float1 15s ease-in-out infinite; }
          .animate-float2 { animation: float2 18s ease-in-out infinite; }
          .animate-float3 { animation: float3 12s ease-in-out infinite; }
          .animate-wave { animation: wave 8s ease-in-out infinite; }
          .animate-wave-delay { animation: wave 8s ease-in-out infinite 2s; }
        `}
      </style>
    </div>
  )
}

export default Login
