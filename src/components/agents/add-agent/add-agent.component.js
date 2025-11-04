import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './add-agent.component.css';
// import { createAgent, reauditAgents } from '../../../api/agents.api'; // Ensure this is correct
// import { TextField, Typography } from '@mui/material';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AddAgent = ({organizationID, authToken}) => {
  const navigate = useNavigate();
  const [agent, setAgent] = useState({
    fName: '',
    lName: '',
    agentSplit: '',
    company: '',
    companySplit: '',
    manager: '',
    managerSplit: '',
    organization: '',
    username: '',
    email: '',
    password: '',
    isAdmin: false,
    role_id: '5',
    type: 'tracer',
    clients: [],
    additional_splits: [],
    user_id: null
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAgent({
      ...agent,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

    // (Removed validation from render body. Will move to handleSubmit)
  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[@$!%*#?&]/.test(password);
    return hasUppercase && hasNumber && hasSpecial;
  };

  // Helper to validate and convert percentage fields
  const parsePercent = (val) => {
    if (val === '' || val === null) return null;
    const num = Number(val);
    if (Number.isInteger(num) && num >= 0 && num <= 100) return num;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    // Required fields validation
    const newErrors = {};
    if (!agent.fName.trim()) newErrors.fName = 'First name is required';
    if (!agent.lName.trim()) newErrors.lName = 'Last name is required';
    if (!agent.organization.trim()) newErrors.organization = 'Organization is required';
    if (!agent.username.trim()) newErrors.username = 'Username is required';
    if (!agent.email.trim()) newErrors.email = 'Email is required';
    if (!agent.password.trim()) newErrors.password = 'Password is required';
    if (agent.isAdmin === undefined || agent.isAdmin === null) newErrors.isAdmin = 'isAdmin is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Frontend password validation
    if (!validatePassword(agent.password)) {
      setValidationErrors({
        password: [
          'Password must contain at least one uppercase letter, one number, and one special character (@$!%*#?&).'
        ]
      });
      return;
    }

    // Validate percentage fields
    const agentSplit = parsePercent(agent.agentSplit);
    const companySplit = parsePercent(agent.companySplit);
    const managerSplit = parsePercent(agent.managerSplit);
    if (
      (agent.agentSplit && agentSplit === null) ||
      (agent.companySplit && companySplit === null) ||
      (agent.managerSplit && managerSplit === null)
    ) {
      setValidationErrors({ general: ['Splits must be whole numbers between 0 and 100, or left blank.'] });
      return;
    }

    // Build request body
    const body = {
      fName: agent.fName,
      lName: agent.lName,
      agentSplit: agent.agentSplit || null,
      company: agent.company,
      companySplit: agent.companySplit || null,
      manager: agent.manager,
      managerSplit: agent.managerSplit || null,
      user_id: null,
      organization: agent.organization,
      username: agent.username,
      email: agent.email,
      password: agent.password,
      isAdmin: !!agent.isAdmin,
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_ISO_BACKEND_URL}/v2/agents/organizations/${organizationID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add agent');
      setAgent({
        fName: '',
        lName: '',
        agentSplit: '',
        company: '',
        companySplit: '',
        manager: '',
        managerSplit: '',
        organization: '',
        username: '',
        email: '',
        password: '',
        isAdmin: false,
        role_id: '5',
        type: 'tracer',
        clients: [],
        additional_splits: [],
        user_id: null
      });
      alert('Agent added successfully!');
      navigate('/agents');
    } catch (error) {
      setValidationErrors({ general: [error.message || 'Something went wrong.'] });
    }
  };
  

  return (
    <div className="add-agent-container bg-zinc-900 p-10 rounded-lg shadow-lg w-full max-w-md w-full">
      <h2 className='pb-6 mb-6 border-b border-yellow-400/20 text-lg font-semibold text-white mb-4'>Add Agent</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          <div className="form-group flex-1">
            <label className='block font-medium text-gray-300 mb-2'>First Name<span style={{color:'red'}}>*</span></label>
            <input
              type="text"
              name="fName"
              className='w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
              value={agent.fName}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
          </div>
          <div className="form-group flex-1">
            <label className='block font-medium text-gray-300 mb-2'>Last Name<span style={{color:'red'}}>*</span></label>
            <input
              type="text"
              name="lName"
              className='w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
              value={agent.lName}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="form-group flex-1">
            <label className='block font-medium text-gray-300 mb-2'>Agent Split (%)</label>
            <input
              type="number"
              name="agentSplit"
              className='w-full px-4 py-2 rounded bg-gradient-to-r from-green-400 to-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all duration-200'
              value={agent.agentSplit}
              onChange={e => {
                let val = e.target.value;
                if (val === "") val = "";
                else if (Number(val) > 100) val = "100";
                else if (Number(val) < 0) val = "0";
                setAgent(prev => ({ ...prev, agentSplit: val }));
              }}
              placeholder="Agent Split (0-100)"
              min="0"
              max="100"
              step="1"
            />
          </div>
          <div className="form-group flex-1">
            <label className='block font-medium text-gray-300 mb-2'>Company</label>
            <input
              type="text"
              name="company"
              className='w-full px-4 py-2 rounded bg-gradient-to-r from-green-400 to-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all duration-200'
              value={agent.company}
              onChange={handleInputChange}
              placeholder="Company"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="form-group flex-1">
            <label className='block font-medium text-gray-300 mb-2'>Company Split (%)</label>
            <input
              type="number"
              name="companySplit"
              className='w-full px-4 py-2 rounded bg-gradient-to-r from-green-400 to-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all duration-200'
              value={agent.companySplit}
              onChange={e => {
                let val = e.target.value;
                if (val === "") val = "";
                else if (Number(val) > 100) val = "100";
                else if (Number(val) < 0) val = "0";
                setAgent(prev => ({ ...prev, companySplit: val }));
              }}
              placeholder="Company Split (0-100)"
              min="0"
              max="100"
              step="1"
            />
          </div>
          <div className="form-group flex-1">
            <label className='block font-medium text-gray-300 mb-2'>Manager</label>
            <input
              type="text"
              name="manager"
              className='w-full px-4 py-2 rounded bg-gradient-to-r from-green-400 to-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all duration-200'
              value={agent.manager}
              onChange={handleInputChange}
              placeholder="Manager"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="form-group flex-1">
            <label className='block font-medium text-gray-300 mb-2'>Manager Split (%)</label>
            <input
              type="number"
              name="managerSplit"
              className='w-full px-4 py-2 rounded bg-gradient-to-r from-green-400 to-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all duration-200'
              value={agent.managerSplit}
              onChange={e => {
                let val = e.target.value;
                if (val === "") val = "";
                else if (Number(val) > 100) val = "100";
                else if (Number(val) < 0) val = "0";
                setAgent(prev => ({ ...prev, managerSplit: val }));
              }}
              placeholder="Manager Split (0-100)"
              min="0"
              max="100"
              step="1"
            />
          </div>
          <div className="form-group flex-1">
                         <label className='block font-medium text-gray-300 mb-2'>Organization<span style={{color:'red'}}>*</span></label>
            <input
              type="text"
              name="organization"
              className='w-full px-4 py-2 rounded bg-gradient-to-r from-green-400 to-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md transition-all duration-200'
              value={agent.organization}
              onChange={handleInputChange}
              placeholder="Organization (e.g. Tracer, C2FS)"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="form-group flex-1">
                         <label className='block font-medium text-gray-300 mb-2'>Username<span style={{color:'red'}}>*</span></label>
            <input
              type="text"
              name="username"
              className='w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
              value={agent.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="form-group flex-1">
                         <label className='block font-medium text-gray-300 mb-2'>Email<span style={{color:'red'}}>*</span></label>
            <input
              type="email"
              name="email"
              className='w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
              value={agent.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.email[0]}</p>
            )}
          </div>
        </div>

        {/* <div className="form-group mb-4">
                     <label className='block font-medium text-gray-300 mb-2'>Password<span style={{color:'red'}}>*</span></label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className='w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10'
              value={agent.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              style={{ paddingRight: '2.5rem' }}
            />
           <span
             onClick={() => setShowPassword((prev) => !prev)}
             style={{
               position: 'absolute',
               right: '1rem',
               cursor: 'pointer',
               color: '#aaa',
               zIndex: 2,
               display: 'flex',
               alignItems: 'center',
               height: '100%',
               top: 0,
               bottom: 0,
             }}
             tabIndex={0}
             aria-label={showPassword ? 'Hide password' : 'Show password'}
             onMouseDown={e => e.preventDefault()}
           >
             {showPassword ? <FaEyeSlash /> : <FaEye />}
           </span>
          </div>
          {validationErrors.password && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.password[0]}</p>
          )}
        </div> */}

        

        <div className="form-group mb-4">
          <label className='block font-medium text-gray-300 mb-2'>Password</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className='w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10'
              onChange={handleInputChange}
              placeholder="Password"
              required
              style={{ paddingRight: '2.5rem' }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '1rem',
                cursor: 'pointer',
                color: '#aaa',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                top: 0,
                bottom: 0,
              }}
              tabIndex={0}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {validationErrors.password && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.password[0]}</p>
          )}

          <input
            type="hidden"
            name="role_id"
            value="5"
            onChange={handleInputChange}
          />

          <input
            type="hidden"
            name="type"
            value="tracer"
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group mb-4">
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <label className='font-medium text-gray-300 mb-2 py-2' style={{marginBottom: 0}}>Is Admin<span style={{color:'red'}}>*</span></label>
               <input
                 type="checkbox"
                 name="isAdmin"
                 checked={agent.isAdmin}
                 onChange={handleInputChange}
                 style={{ width: '18px', height: '18px', minWidth: '18px', maxWidth: '18px', minHeight: '18px', maxHeight: '18px', verticalAlign: 'middle' }}
               />
             </div>
        </div>

        {validationErrors.general && (
          <p className="text-red-500 text-sm mt-1">
            {validationErrors.general[0]}
          </p>
        )}

        <button type="submit" className="submit-button w-full bg-[#69932f] hover:bg-[#69932f] text-white py-3 rounded font-medium uppercase transition duration-200 dsabled:opacity-50">
          Add Agent
        </button>
      </form>
    </div>
  );
};

export default AddAgent;
