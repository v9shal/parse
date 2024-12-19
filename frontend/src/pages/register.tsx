import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState<String|any>('');
  const [password, setPassword] = useState<String|any>('');
  const [message, setMessage] = useState<String|any>('');
  const [role,setRole]=useState<String|any>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7000/api/auth/register', {
        username,
        password,
        role
      });
      if(response.status===200){
        console.log('hello')
      }
      setMessage('User registered successfully!');
    } catch (error: any) {
      setMessage('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </div>
          <div>
            <label>Role</label>
          <input
            type='text'
            placeholder='User or Provider'
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
