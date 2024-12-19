import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
  _id: string;
  title: string;
  smallDescription: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalProjects: number;
}

const DisplayProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 9,
    totalProjects: 0
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:7000/pro/getAllProject",
        {
          page,
          limit: 9,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      setProjects(response.data.projects);
      setPagination(response.data.pagination);
      setError('');
    } catch (err:any) {
      setError(err.response?.data?.message || 'An error occurred while fetching projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handlePageChange = (newPage: number) => {
    fetchProjects(newPage);
  };

  if (loading) {
    return <div className="text-center py-4">Loading projects...</div>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition duration-300"
            onClick={() => handleProjectClick(project._id)}
          >
            <div className="p-4">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {project.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                {project.smallDescription.length > 150 
                  ? `${project.smallDescription.substring(0, 150)}...` 
                  : project.smallDescription}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-slate-700 dark:text-slate-300">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DisplayProject;