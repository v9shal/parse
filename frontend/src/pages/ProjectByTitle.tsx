import axios from 'axios';
import  { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Project {
  _id: string;
  title: string;
  smallDescription: string;
  description: string;
  deadline: Date;
  status: string;
  skillsRequired: string;
}

const ProjectByTitle = () => {
  const [searchParams] = useSearchParams();
  const projectTitle = searchParams.get('title');
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProjectByTitle = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:7000/pro/getProjectByTitle/${projectTitle}`,
        {
          headers: {
            'Content-Type': 'application/json',
            
          },
          withCredentials: true,
        }
      );
      setProject(response.data.project);
    } catch (error: any) {
      console.log('Error while fetching project by title');
      setError('Error while fetching project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectByTitle();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen antialiased bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Project Details
        </h1>
        {project ? (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {project.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Description:</strong> {project.description}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Small Description:</strong> {project.smallDescription}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Deadline:</strong>{' '}
              {new Date(project.deadline).toLocaleDateString()}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Status:</strong> {project.status}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Skills Required:</strong> {project.skillsRequired}
            </p>
          </div>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
            No project found with the title: {projectTitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectByTitle;
