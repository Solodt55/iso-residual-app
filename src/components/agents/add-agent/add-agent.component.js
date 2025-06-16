import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './add-agent.component.css';
import { createAgent, reauditAgents } from '../../../api/agents.api'; // Ensure this is correct
import { TextField, Typography } from '@mui/material';

const AddAgent = ({organizationID, authToken}) => {
  const navigate = useNavigate();
  const [agent, setAgent] = useState({
    fName: '',
    lName: '',
    email: '',
    password: '',
    role_id: '5',
    type: 'tracer',
    merchants: [] // Empty merchants array for now
  });

  const iso_token = localStorage.getItem('iso_token');

  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAgent({
      ...agent,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({}); // Clear previous errors
    
    try {
      console.log('Starting user creation request...');
      console.log('Request URL:', `${process.env.REACT_APP_ISO_BACKEND_URL}/user/create`);
      console.log('Request payload:', agent);
      
      // First create the user
      const userResponse = await fetch(`${process.env.REACT_APP_ISO_BACKEND_URL}/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${iso_token}`
        },
        body: JSON.stringify(agent)
      });

      // Try to parse the response regardless of status
      let userData;
      try {
        const text = await userResponse.text(); // Get response as text first
        console.log('Raw response:', text);
        userData = JSON.parse(text); // Try to parse as JSON
      } catch (error) {
        console.error('Error parsing response:', error);
        throw new Error('Invalid response from server');
      }

      // Handle Laravel validation errors (422 status code)
      if (userResponse.status === 422 && userData.errors) {
        console.log('Validation errors:', userData.errors);
        setValidationErrors(userData.errors);
        return;
      }

      // Handle other error responses
      if (!userResponse.ok) {
        console.log('Response not OK, status:', userResponse.status);
        if (userData.message) {
          console.log('Error message:', userData.message);
          setValidationErrors({ general: [userData.message] });
          return;
        }
        throw new Error('Failed to create user');
      }

      const userId = userData?.data?.id;
      console.log('User created successfully, ID:', userId);

      if (userId) {
        agent.user_id = String(userId);
      }

      // If user creation successful, proceed with agent creation
      console.log('Creating agent with data:', agent);
      const agentResponse = await createAgent(organizationID, agent, authToken);
      
      // Handle successful creation
      console.log('Agent created successfully:', agentResponse);
      navigate(`/agents/${agentResponse.data.agentID}`);
    } catch (error) {
      console.error('Detailed error in handleSubmit:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      // Handle other errors
      setValidationErrors({ general: [error.message] });
    }
  };

  return (
    <div className="add-agent-container bg-zinc-900 p-10 rounded-lg shadow-lg w-full max-w-md w-full">
      <h2 className='pb-6 mb-6 border-b border-yellow-400/20 text-lg font-semibold text-white mb-4'>Add Agent</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          <div className="form-group flex-1">
            <label className='block font-medium text-gray-300 mb-2'>First Name</label>
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
            <label className='block font-medium text-gray-300 mb-2'>Last Name</label>
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
            <label className='block font-medium text-gray-300 mb-2'>Phone</label>
            <input
              type="text"
              name="phone"
              className='w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
              onChange={handleInputChange}
              placeholder="Phone"
              required
            />
          </div>
          <div className="form-group flex-1">
            <label className='block font-medium text-gray-300 mb-2'>Email</label>
            <input
              type="email"
              name="email"
              className='w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.email[0]}</p>
            )}
          </div>
        </div>

        <div className="form-group mb-4">
          <label className='block font-medium text-gray-300 mb-2'>Password</label>
          <input
            type="password"
            name="password"
            className='w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
            onChange={handleInputChange}
            placeholder="Password"
            required
          />

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

        {validationErrors.general && (
          <Typography color="error" variant="body2">
            {validationErrors.general[0]}
          </Typography>
        )}

        <button type="submit" className="submit-button w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded font-medium uppercase transition duration-200 dsabled:opacity-50">
          Add Agent
        </button>
      </form>
    </div>
  );
};

export default AddAgent;
