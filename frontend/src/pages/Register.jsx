import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
  });
  const [loading, setLoading] = useState(false);
  const { name, email, password, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/auth/register', { name, email, password, role }, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="form-card animate-float-glow">
        <div className="form-header">
          <div className="icon-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white gradient-text mt-2">Create an Account</h2>
        </div>
        <div className="form-body">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input 
              name="name" 
              type="text" 
              required 
              placeholder="Full Name" 
              value={name} 
              onChange={handleChange} 
              className="form-input" 
            />
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="Email Address" 
              value={email} 
              onChange={handleChange} 
              className="form-input" 
            />
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="Password" 
              value={password} 
              onChange={handleChange} 
              className="form-input" 
            />
            <select 
              name="role" 
              value={role} 
              onChange={handleChange} 
              className="form-input"
            >
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
            <button 
              type="submit" 
              disabled={loading} 
              className="submit-btn"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: linear-gradient(-45deg,
            #667eea, #764ba2, #f093fb, #f5576c,
            #4facfe, #00f2fe, #43e97b, #38f9d7,
            #fa709a, #fee140, #a8edea, #fed6e3
          );
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 50% 100%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 0%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .form-card {
          width: 100%;
          max-width: 400px;
          border-radius: 1rem;
          overflow: hidden;
          background: white;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .form-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: headerGradient 6s ease infinite;
          background-size: 400% 400%;
          text-align: center;
          padding: 2rem 1rem;
          position: relative;
        }

        @keyframes headerGradient {
          0%, 100% {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          33% {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
          66% {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }
        }

        .form-body {
          background: white;
          padding: 1.5rem;
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }

        .gradient-text {
          background: linear-gradient(to right, #fff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        .animate-float-glow {
          animation: float 6s ease-in-out infinite, glow 3s ease-in-out infinite alternate;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          from { box-shadow: 0 0 20px rgba(102, 126, 234, 0.5); }
          to { box-shadow: 0 0 30px rgba(118, 75, 162, 0.7); }
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background-color: #f8fafc;
        }

        .form-input:focus {
          outline: none;
          transform: translateY(-2px);
          border-color: #818cf8;
          box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.1), 0 2px 4px -1px rgba(102, 126, 234, 0.06);
          background-color: white;
        }

        .submit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem;
          width: 100%;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3), 0 2px 4px -1px rgba(102, 126, 234, 0.2);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(102, 126, 234, 0.3), 0 4px 6px -2px rgba(102, 126, 234, 0.2);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
        }

        .submit-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }

        .submit-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .icon-pulse svg {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7));
          }
          50% { 
            transform: scale(1.1);
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.9));
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
