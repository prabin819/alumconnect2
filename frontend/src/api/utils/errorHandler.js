// Error formatting
export const formatErrorMessage = (error) => {
  if (error.response) {
    // Server responded with non-2xx status
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || `Error ${status}`,
      details: data,
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      status: 0,
      message: 'No response from server',
      details: error.request,
    };
  } else {
    // Error in setting up the request
    return {
      status: -1,
      message: error.message || 'Unknown error',
      details: error,
    };
  }
};
