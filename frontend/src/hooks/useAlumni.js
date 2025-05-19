// src/hooks/useAlumni.js
import { useCallback } from 'react';
import { useApiGet, useApiPost, useApiPut } from '../api';

export const useAlumni = () => {
  const {
    data: alumniProfile,
    isLoading: isProfileLoading,
    error: profileError,
    get: getProfile,
  } = useApiGet();

  const {
    data: alumniList,
    isLoading: isAlumniListLoading,
    error: alumniListError,
    get: fetchAlumniList,
  } = useApiGet([]);

  const {
    data: jobPostings,
    isLoading: isJobsLoading,
    error: jobsError,
    get: fetchJobs,
  } = useApiGet([]);

  const {
    isLoading: isUpdatingProfile,
    error: updateProfileError,
    put: updateProfile,
  } = useApiPut();

  const { isLoading: isCreatingJob, error: createJobError, post: createJob } = useApiPost();

  const getAlumniProfile = useCallback(
    (id) => {
      return getProfile(`/alumni/${id}`);
    },
    [getProfile]
  );

  const updateAlumniProfile = useCallback(
    (id, data) => {
      return updateProfile(`/alumni/${id}`, data);
    },
    [updateProfile]
  );

  const searchAlumni = useCallback(
    (params) => {
      return fetchAlumniList('/alumni/search', params);
    },
    [fetchAlumniList]
  );

  const getAlumniByIndustry = useCallback(
    (industry) => {
      return fetchAlumniList(`/alumni/industry/${industry}`);
    },
    [fetchAlumniList]
  );

  const createJobPosting = useCallback(
    (jobData) => {
      return createJob('/job-postings', jobData);
    },
    [createJob]
  );

  const getJobPostings = useCallback(
    (params) => {
      return fetchJobs('/job-postings', params);
    },
    [fetchJobs]
  );

  return {
    // Alumni profile
    alumniProfile,
    isProfileLoading,
    profileError,
    getAlumniProfile,
    isUpdatingProfile,
    updateProfileError,
    updateAlumniProfile,

    // Alumni search/list
    alumniList,
    isAlumniListLoading,
    alumniListError,
    searchAlumni,
    getAlumniByIndustry,

    // Job postings
    jobPostings,
    isJobsLoading,
    jobsError,
    createJobPosting,
    createJobError,
    isCreatingJob,
    getJobPostings,
  };
};
