import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Comprehensive Interfaces for Type Safety
interface Provider {
  username: string;
  _id?: string;
}

interface ProjectDetails {
  _id: string;
  title: string;
  description: string;
  smallDescription?: string;
  status: string;
  deadline?: string;
  skillsRequired?: string[];
  createdBy?: string;
}

interface ProjectApplication {
  _id: string;
  project_id: ProjectDetails;
  username: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: string;
}

interface DetailedProjectInfo {
  project: ProjectDetails;
  providers: Provider[];
}

const ProfileProvider: React.FC = () => {
  // Redux State Management
  const { username, token } = useSelector((state: any) => state.auth);

  // State Management with Explicit Types
  const [projectApplied, setProjectApplied] = useState<ProjectApplication[]>([]);
  const [hoveredProject, setHoveredProject] = useState<DetailedProjectInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Projects Function with Comprehensive Error Handling
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:7000/api/getProjects/${username}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Validate and set projects
      if (response.data && Array.isArray(response.data.projects)) {
        setProjectApplied(response.data.projects);
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

  // Fetch Project Providers
  const fetchProjectProviders = async (projectId: string): Promise<Provider[]> => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/project/${projectId}/providers`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.providers || [];
    } catch (err) {
      console.error('Project Providers Fetch Error:', err);
      return [];
    }
  };

  // Handle Project Hover with Detailed Fetching
  const handleProjectHover = async (project: ProjectApplication) => {
    try {
      const providers = await fetchProjectProviders(project.project_id._id);
      setHoveredProject({
        project: project.project_id,
        providers
      });
    } catch (err) {
      console.error('Hover Project Details Error:', err);
    }
  };

  // Lifecycle Hook for Initial Data Fetch
  useEffect(() => {
    if (username && token) {
      fetchProjects();
    }
  }, [username, token]);

  // Utility Functions
  const getStatusColor = (status: string) => {
    const statusColors = {
      'accepted': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  // Memoized Skills Parser
  const parseSkills = useMemo(() => {
    return (skills?: string | string[]): string[] => {
      if (!skills) return [];
      return Array.isArray(skills) 
        ? skills 
        : skills.split(',').map(skill => skill.trim());
    };
  }, []);

  // Render Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-xl text-slate-600 dark:text-slate-300">Loading Projects...</div>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Provider Profile
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Welcome, {username} - Manage your project applications
          </p>
        </section>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Project List */}
          <section className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Your Project Applications
            </h2>

            {projectApplied.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400">
                No projects applied yet
              </div>
            ) : (
              <div className="space-y-4">
                {projectApplied.map((application) => (
                  <div 
                    key={application._id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => handleProjectHover(application)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {application.project_id?.title || 'Untitled Project'}
                      </h3>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(application.status)}`}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Project Details Sidebar */}
          {hoveredProject && (
            <section className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Project Details
              </h3>
              
              <div className="space-y-4">
                {/* Detailed Project Information Rendering */}
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200">Title</h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    {hoveredProject.project.title}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200">Description</h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    {hoveredProject.project.description}
                  </p>
                </div>

                {/* Additional Project Details Rendering */}
                {hoveredProject.project.deadline && (
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Deadline</h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      {new Date(hoveredProject.project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {hoveredProject.project.skillsRequired && (
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">
                      Skills Required
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {parseSkills(hoveredProject.project.skillsRequired).map((skill) => (
                        <span 
                          key={skill}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Providers Section */}
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200">
                    Providers Working on Project
                  </h4>
                  {hoveredProject.providers.length > 0 ? (
                    <ul className="space-y-2 mt-2">
                      {hoveredProject.providers.map((provider) => (
                        <li 
                          key={provider.username}
                          className="bg-slate-100 dark:bg-slate-700 p-2 rounded-md"
                        >
                          {provider.username}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">
                      No providers currently working on this project.
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileProvider;