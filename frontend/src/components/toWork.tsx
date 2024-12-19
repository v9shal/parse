import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import mongoose from 'mongoose';

const ToWork = () => {
  const { role, username,token } = useSelector((state: any) => state.auth);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const {projectId}=useParams<{projectId:string}>();

  const handleApply = async () => {
    setIsApplying(true);
    try {
      // Convert projectId to a valid ObjectId
      const validProjectId = new mongoose.Types.ObjectId(projectId);
      
      const response = await axios.post('http://localhost:7000/api/apply/project', {
        project_id: validProjectId.toString(),
        username,
      },{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'Application/json'
        }
      });
      setSuccess(response.data.message);
    } catch (err: any) {
      // Use proper error responses
      if (err.response?.status === 409) {
        setError('You have already applied to this project.');
      } else if (err.message === 'Invalid Project ID format') {
        setError('Invalid Project ID provided.');
      } else {
        setError(err.response?.data?.message || 'There was an error applying for the project.');
      }
    } finally {
      setIsApplying(false);
    }
  };
  if (role === 'Provider') {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Hello, {username}</h1>
        <p>As a Provider, you can apply to work on a project.</p>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
          disabled={isApplying}
        >
          {isApplying ? 'Applying...' : 'Apply to Project'}
        </button>
        {success && <p className="text-green-500 mt-4">{success}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  return null;
};

export default ToWork;
