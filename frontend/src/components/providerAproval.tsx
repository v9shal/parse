import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { ProjectDetails, Provider } from '../types';

interface ProviderApprovalProps {
  project: ProjectDetails;
  providers: Provider[];
  onProviderApproved: () => void;
}

const api = axios.create({
  baseURL: 'http://localhost:7000',
  withCredentials: true,
});

const ProviderApproval: React.FC<ProviderApprovalProps> = ({
  project,
  providers,
  onProviderApproved,
}) => {
  const { token } = useSelector((state: any) => state.auth);

  const handleApproveProvider = async (status: string, username: string) => {
    try {
      await api.put(
        `/api/updateStatusProvide/${project._id}/${username}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onProviderApproved();
    } catch (error) {
      console.error('Error approving provider:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 transition-all duration-200 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        {project.title}
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
        {project.description}
      </p>

      {project.skillsRequired && project.skillsRequired.length > 0 && (
        <div className="mb-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-3">
            {project.skillsRequired}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          Providers 
          <span className="ml-3 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm">
            {providers.length}
          </span>
        </h3>

        {providers.length > 0 ? (
          <div className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider._id}
                className="flex justify-between items-center border border-slate-200 dark:border-slate-700 p-6 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
              >
                <div>
                  <span className="text-lg font-medium text-slate-900 dark:text-white">
                    {provider.username}
                  </span>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => provider._id && handleApproveProvider("rejected", provider.username)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 transition-colors duration-200"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => provider._id && handleApproveProvider("accepted", provider.username)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 transition-colors duration-200"
                  >
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Alert className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">
              No providers have applied to this project yet.
            </p>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ProviderApproval;