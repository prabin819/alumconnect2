// src/services/jobService.js
import { useApiGet, useApiPost, useApiPut, useApiDelete } from '../hooks/useApiMethods';
import { useAutoFetch } from '../hooks/useAutoFetch';

/**
 * Hook for fetching all jobs
 */
export const useJobs = (options = {}) => {
  const { initialData = null, enabled = true, dependencies = [] } = options;

  return useAutoFetch('/api/v1/jobs', {
    initialData,
    enabled,
    dependencies,
  });
};

/**
 * Hook for fetching a single job by ID
 */
export const useJob = (jobId, options = {}) => {
  const { initialData = null, enabled = true, dependencies = [] } = options;

  return useAutoFetch(jobId ? `/api/v1/jobs/${jobId}` : null, {
    initialData,
    enabled: enabled && !!jobId,
    dependencies: [jobId, ...dependencies],
  });
};

/**
 * Hook for fetching jobs by user ID
 */
export const useUserJobs = (userId, options = {}) => {
  const { initialData = null, enabled = true, dependencies = [] } = options;

  return useAutoFetch(userId ? `/api/v1/jobs/user/${userId}` : null, {
    initialData,
    enabled: enabled && !!userId,
    dependencies: [userId, ...dependencies],
  });
};

/**
 * Hook for creating a new job
 */
export const useCreateJob = () => {
  const { post, isLoading, error, data, isSuccess, reset } = useApiPost();

  const createJob = async (jobData) => {
    try {
      return await post('/api/v1/jobs', jobData, { withCredentials: true });
    } catch (err) {
      console.error('Job creation failed:', err);
      throw err;
    }
  };

  return { createJob, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for updating a job
 */
export const useUpdateJob = () => {
  const { put, isLoading, error, data, isSuccess, reset } = useApiPut();

  const updateJob = async (jobId, jobData) => {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    try {
      return await put(`/api/v1/jobs/${jobId}`, jobData, { withCredentials: true });
    } catch (err) {
      console.error('Job update failed:', err);
      throw err;
    }
  };

  return { updateJob, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for deleting a job
 */
export const useDeleteJob = () => {
  const { del, isLoading, error, isSuccess } = useApiDelete();

  const deleteJob = async (jobId) => {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    try {
      return await del(`/api/v1/jobs/${jobId}`, { withCredentials: true });
    } catch (err) {
      console.error('Job deletion failed:', err);
      throw err;
    }
  };

  return { deleteJob, isLoading, error, isSuccess };
};

/**
 * Hook for applying to a job
 */
export const useApplyForJob = () => {
  const { post, isLoading, error, data, isSuccess, reset } = useApiPost();

  const applyForJob = async (jobId, applicationData) => {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Handle FormData for multipart/form-data (for resume and cover letter)
    const isFormData = applicationData instanceof FormData;

    // If not already FormData, convert to FormData
    const formData = isFormData ? applicationData : new FormData();

    if (!isFormData) {
      // Handle resume and cover letter files
      if (applicationData.resume instanceof File) {
        formData.append('resume', applicationData.resume);
      }

      if (applicationData.coverLetter instanceof File) {
        formData.append('coverLetter', applicationData.coverLetter);
      }

      // Add other application data
      Object.keys(applicationData).forEach((key) => {
        if (key !== 'resume' && key !== 'coverLetter') {
          if (typeof applicationData[key] === 'object') {
            formData.append(key, JSON.stringify(applicationData[key]));
          } else if (applicationData[key] !== null && applicationData[key] !== undefined) {
            formData.append(key, applicationData[key]);
          }
        }
      });
    }

    try {
      return await post(`/api/v1/jobs/${jobId}/apply`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      console.error('Job application failed:', err);
      throw err;
    }
  };

  return { applyForJob, isLoading, error, data, isSuccess, reset };
};
