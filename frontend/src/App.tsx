import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { setCredentials, clearCredentials } from './features/auth/authSlice';
import ProtectedRoute from './ProtectedRoute';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import AddProject from './components/addProject';
import ProjectById from './pages/projectById';
import ProjectByTitle from './pages/ProjectByTitle';
import Profile from './pages/profile';
import { useEffect, useState } from 'react';

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axios.post(
          `http://localhost:7000/api/auth/verify`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'http://localhost:5173', // Add this line
            },
            withCredentials: true,
            timeout: 5000 // Add a timeout to help diagnose issues
          }
        );

        if (response.status === 200 && response.data.user) {
          dispatch(
            setCredentials({
              username: response.data.user.username,
              token: response.data.user.token,
              role: response.data.user.role,
            })
          );
        }
      } catch (error) {
        dispatch(clearCredentials());
        console.error('Session verification failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dash" /> : <Navigate to="/login" />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dash"
        element={<ProtectedRoute element={<Dashboard />} />}
      />
      <Route
        path="/home"
        element={<ProtectedRoute element={<Home />} />}
      />
      <Route
        path="/addProject"
        element={<ProtectedRoute element={<AddProject />} />}
      />
      <Route
        path="/project/:projectId"
        element={<ProtectedRoute element={<ProjectById />} />}
      />
      <Route
        path="/project"
        element={<ProtectedRoute element={<ProjectByTitle />} />}
      />
      <Route
      path='/profile'
      element={<ProtectedRoute element={<Profile/>}/>}
      />
    </Routes>
  );
}

export default App;
