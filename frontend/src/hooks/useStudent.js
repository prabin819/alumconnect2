// src/hooks/useStudent.js
import { useCallback } from 'react';
import { useApiGet, useApiPost, useApiPut } from '../api';

export const useStudent = () => {
  const {
    data: studentProfile,
    isLoading: isProfileLoading,
    error: profileError,
    get: getProfile,
  } = useApiGet();

  const {
    data: studentList,
    isLoading: isStudentListLoading,
    error: studentListError,
    get: fetchStudentList,
  } = useApiGet([]);

  const {
    data: mentorshipRequests,
    isLoading: isRequestsLoading,
    error: requestsError,
    get: fetchRequests,
  } = useApiGet([]);

  const {
    isLoading: isUpdatingProfile,
    error: updateProfileError,
    put: updateProfile,
  } = useApiPut();

  const {
    isLoading: isCreatingRequest,
    error: createRequestError,
    post: createRequest,
  } = useApiPost();

  const getStudentProfile = useCallback(
    (id) => {
      return getProfile(`/students/${id}`);
    },
    [getProfile]
  );

  const updateStudentProfile = useCallback(
    (id, data) => {
      return updateProfile(`/students/${id}`, data);
    },
    [updateProfile]
  );

  const searchStudents = useCallback(
    (params) => {
      return fetchStudentList('/students/search', params);
    },
    [fetchStudentList]
  );

  const getStudentsByDepartment = useCallback(
    (department) => {
      return fetchStudentList(`/students/department/${department}`);
    },
    [fetchStudentList]
  );

  const requestMentorship = useCallback(
    (mentorshipData) => {
      return createRequest('/mentorship-requests', mentorshipData);
    },
    [createRequest]
  );

  const getMentorshipRequests = useCallback(
    (params) => {
      return fetchRequests('/mentorship-requests', params);
    },
    [fetchRequests]
  );

  return {
    // Student profile
    studentProfile,
    isProfileLoading,
    profileError,
    getStudentProfile,
    isUpdatingProfile,
    updateProfileError,
    updateStudentProfile,

    // Student search/list
    studentList,
    isStudentListLoading,
    studentListError,
    searchStudents,
    getStudentsByDepartment,

    // Mentorship requests
    mentorshipRequests,
    isRequestsLoading,
    requestsError,
    requestMentorship,
    isCreatingRequest,
    createRequestError,
    getMentorshipRequests,
  };
};
