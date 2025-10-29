
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/authApi.js';

const Login = ({ onLoginSuccess }) => {
  const [localUsername, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const { token } = await login(localUsername, password);
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', localUsername);
      if (onLoginSuccess) {
        onLoginSuccess(token);
      }
      navigate('/dashboard');
    } catch (error) {
      setError(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container bg-zinc-900 p-10 rounded-lg shadow-lg w-full max-w-md">
        <div className='pb-6 mb-6 border-b border-yellow-400/20'>
          <h2>Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className='block font-medium text-gray-300 mb-2'>Username:</label>
            <input
              type="text"
              className='w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className='block font-medium text-gray-300 mb-2'>Password:</label>
            <input
              type="password"
              className='w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-message text-red-400 mt-2">{error}</p>}
          <button
            type="submit"
            className='w-full bg-[#69932f] hover:bg-[#69932f] text-white py-3 rounded font-medium uppercase transition duration-200 disabled:opacity-50'
            style={{ backgroundColor: '#69932f', color: '#fff', border: 'none' }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className='mt-1 text-center text-xs text-yellow-400/60 btn-new'>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
