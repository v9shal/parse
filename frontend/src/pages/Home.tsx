import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DisplayProject from '../components/displayProject';

const Home = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  // Function to handle navigation for adding a project
  const handleAddProject = () => {
    navigate('/addProject');
  };

  // Function to handle search by title
  const handleSearchByTitle = (title: string) => {
    navigate(`/project/?title=${title}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <section className="mb-8">
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Task Management
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Manage your projects and tasks efficiently.
          </p>
        </section>

        {/* Search and Add Project Section */}
        <section className="flex justify-between items-center mb-6">
          <div className="flex w-full max-w-2xl space-x-4">
            <input
              className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
              type="text"
              placeholder="Search By Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition duration-300"
              onClick={() => handleSearchByTitle(title)}
            >
              Search
            </button>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500 transition duration-300"
            onClick={handleAddProject}
          >
            Add Project
          </button>
        </section>

        {/* Projects Section */}
        <section className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Current Projects
            </h3>
          </div>
          <DisplayProject />
        </section>
      </div>
    </div>
  );
};

export default Home;
