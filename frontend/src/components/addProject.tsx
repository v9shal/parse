import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
  const   {token,username}  = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [smallDescription, setSmallDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [skillsRequired, setSkillsRequired] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    if (!title || !description || !deadline || !status) {
      setResponseMessage('Please fill in all required fields');
      return;
    }

    const projectData = {
      title,
      smallDescription,
      description,
      deadline,
      status,
      skillsRequired,
      username
    };

    try {
      const response = await axios.post(
        `http://localhost:7000/pro/addProject`, 
        projectData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log(token)

      if (response.status === 201) {
        setResponseMessage(response.data.message);
        
        // Clear form fields
        setTitle('');
        setSmallDescription('');
        setDescription('');
        setDeadline('');
        setStatus('');
        setSkillsRequired('');

        // Optional: Redirect to projects page or show success message
        navigate('/home'); // Or wherever you want to redirect
      } else {
        setResponseMessage('Unexpected response from the server.');
      }
    } catch (error: any) {
      console.error('Error adding project:', error);
      console.log(token);
      setResponseMessage(
        error.response?.data?.message || 'Failed to add the project. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-slate-900/60 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Add New Project</h1>
          <p className="text-slate-300 text-sm">Manage your tasks and projects effectively.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="w-full px-4 py-3 bg-slate-900/40 text-white rounded-xl border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
          </div>

          {/* Short Description Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Short Description
            </label>
            <input
              type="text"
              value={smallDescription}
              onChange={(e) => setSmallDescription(e.target.value)}
              placeholder="Brief project overview"
              className="w-full px-4 py-3 bg-slate-900/40 text-white rounded-xl border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
          </div>

          {/* Full Description Textarea */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Full Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed project description"
              className="w-full px-4 py-3 bg-slate-900/40 text-white rounded-xl border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 min-h-[120px]"
            />
          </div>

          {/* Deadline Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/40 text-white rounded-xl border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Project Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/40 text-white rounded-xl border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            >
              <option value="" disabled>Select status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Skills Required Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Skills Required
            </label>
            <input
              type="text"
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              placeholder="Enter required skills"
              className="w-full px-4 py-3 bg-slate-900/40 text-white rounded-xl border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Create Project
          </button>
        </form>
        <>{responseMessage}</>
      </div>
    </div>
  );
};

export default AddProject;