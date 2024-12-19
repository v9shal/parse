import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, CheckCircle, Info, Users, CircleDashed, CircleSlash2 } from 'lucide-react';
import ToWork from '../components/toWork';

interface Project {
  _id: string;
  title: string;
  smallDescription: string;
  description: string;
  deadline: Date;
  status: string;
  skillsRequired: string;
}

const ProjectById = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjectById = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:7000/pro/getProject/${projectId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setProject(response.data.project);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectById();
    }
  }, [projectId]);

  const renderStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'notstarted':
        return <CircleSlash2 className="mr-3 text-red-500 dark:text-red-400" size={24} />;
      case 'in-progress':
        return <CircleDashed className="mr-3 text-yellow-500 dark:text-yellow-400" size={24} />;
      case 'completed':
        return <CheckCircle className="mr-3 text-green-500 dark:text-green-400" size={24} />;
      default:
        return <CircleSlash2 className="mr-3 text-red-500 dark:text-red-400" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-900 dark:to-slate-800 flex justify-center items-center">
        <div className="flex items-center space-x-4 p-6 bg-white dark:bg-slate-700 rounded-xl shadow-lg">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-xl text-gray-700 dark:text-gray-300">Loading project details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-700 shadow-2xl rounded-2xl p-10 max-w-md w-full text-center transform transition-all hover:scale-105">
          <Info className="mx-auto mb-6 text-red-500 dark:text-red-400" size={64} />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Project Details */}
          <div className="lg:w-3/4 space-y-8">
            <div className="bg-white dark:bg-slate-700 shadow-2xl rounded-2xl overflow-hidden transition-all hover:shadow-3xl">
              {project ? (
                <div className="p-8 space-y-8">
                  {/* Project Header */}
                  <div className="border-b border-gray-200 dark:border-slate-600 pb-6">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-3">
                      {project.title}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-slate-300 italic">
                      {project.smallDescription}
                    </p>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 dark:bg-slate-800 p-6 rounded-xl border border-blue-100 dark:border-slate-700 hover:shadow-md transition-all">
                      <div className="flex items-center mb-4">
                        {renderStatusIcon(project.status)}
                        <h3 className="text-lg font-bold text-blue-800 dark:text-white">Status</h3>
                      </div>
                      <p className="text-blue-700 dark:text-slate-300 capitalize font-semibold">
                        {project.status}
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-slate-800 p-6 rounded-xl border border-green-100 dark:border-slate-700 hover:shadow-md transition-all">
                      <div className="flex items-center mb-4">
                        <Clock className="mr-3 text-green-500 dark:text-green-400" size={24} />
                        <h3 className="text-lg font-bold text-green-800 dark:text-white">Deadline</h3>
                      </div>
                      <p className="text-green-700 dark:text-slate-300 font-semibold">
                        {new Date(project.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-slate-600">
                      Project Description
                    </h2>
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-100 dark:border-slate-700">
                      {project.description}
                    </p>
                  </div>

                  {/* Skills Required */}
                  <div>
                    <div className="flex items-center mb-4 border-b pb-2 border-gray-200 dark:border-slate-600">
                      <Users className="mr-3 text-purple-500 dark:text-purple-400" size={24} />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Skills Required
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.skillsRequired.split(',').map((skill, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 text-gray-500 dark:text-slate-400">
                  Project not found.
                </div>
              )}
            </div>
          </div>

          {/* Right Side - ToWork Component */}
          <div className="lg:w-1/4 bg-white dark:bg-slate-700 rounded-2xl shadow-xl p-6 sticky top-12">
            <ToWork />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectById;