import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ProviderApproval from '../components/providerAproval';
import { ProjectDetails, DetailedProjectInfo, Provider } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:7000',
  withCredentials: true,
});

const ProfileUser: React.FC = () => {
  const { username, token } = useSelector((state: any) => state.auth);

  const [projectApplied, setProjectApplied] = useState<ProjectDetails[]>([]);
  const [selectedProject, setSelectedProject] = useState<DetailedProjectInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/pro/getProjectByusername/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.data && Array.isArray(response.data.fetchedprojects)) {
        setProjectApplied(response.data.fetchedprojects);
        if (response.data.fetchedprojects.length > 0) {
          handleProjectSelect(response.data.fetchedprojects[0]);
        }
      } else {
        setError('Invalid project data received');
      }
    } catch (err: any) {
      console.error('Fetch Projects Error:', err);
      setError(err.response?.data?.message || 'Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectProviders = async (projectId: string): Promise<Provider[]> => {
    try {
      const response = await api.get(`/api/getPendingProvider/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.providers || [];
    } catch (err) {
      console.error('Project Providers Fetch Error:', err);
      return [];
    }
  };

  const handleProjectSelect = async (project: ProjectDetails) => {
    try {
      const providers = await fetchProjectProviders(project._id);
      setSelectedProject({
        project,
        providers,
      });
    } catch (err) {
      console.error('Project Selection Error:', err);
    }
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
    if (username && token) {
      fetchProjects();
    }
  }, [username, token]);

  const getStatusColor = (status: string) => {
    const statusColors = {
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    };
    return statusColors[status.toLowerCase() as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-pulse text-xl text-slate-600 dark:text-slate-300">
          Loading Projects...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-xl text-red-600 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <section className="mb-8 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            User Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Welcome back, <span className="font-semibold">{username}</span>
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
                <span>Your Projects</span>
                <span className="ml-2 px-2 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded-full">
                  {projectApplied.length}
                </span>
              </h2>

              {projectApplied.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p>No projects available</p>
                  <p className="text-sm mt-2">Your applied projects will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projectApplied.map((project) => (
                    <div
                      key={project._id}
                      onClick={() => handleProjectSelect(project)}
                      className={`border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedProject?.project._id === project._id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                          {project.title || 'Untitled Project'}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </div>
                      {project.smallDescription && (
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          {project.smallDescription}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="lg:col-span-2">
            {selectedProject ? (
              <ProviderApproval 
                project={selectedProject.project}
                providers={selectedProject.providers}
                onProviderApproved={fetchProjects}
              />
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-400">
                Select a project to view details and providers.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;