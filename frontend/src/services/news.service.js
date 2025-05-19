// src/services/newsService.js
import { useApiGet, useApiPost, useApiPut, useApiDelete } from '../hooks/useApiMethods';
import { useAutoFetch } from '../hooks/useAutoFetch';

/**
 * Hook for fetching all news articles
 */
export const useNews = (options = {}) => {
  const { initialData = null, enabled = true, dependencies = [] } = options;

  return useAutoFetch('/api/v1/news', {
    initialData,
    enabled,
    dependencies,
  });
};

/**
 * Hook for fetching a single news article by ID
 */
export const useNewsArticle = (newsId, options = {}) => {
  const { initialData = null, enabled = true, dependencies = [] } = options;

  return useAutoFetch(newsId ? `/api/v1/news/${newsId}` : null, {
    initialData,
    enabled: enabled && !!newsId,
    dependencies: [newsId, ...dependencies],
  });
};

/**
 * Hook for fetching news articles by user ID
 */
export const useUserNews = (userId, options = {}) => {
  const { initialData = null, enabled = true, dependencies = [] } = options;

  return useAutoFetch(userId ? `/api/v1/news/user/${userId}` : null, {
    initialData,
    enabled: enabled && !!userId,
    dependencies: [userId, ...dependencies],
  });
};

/**
 * Hook for creating a new news article
 */
export const useCreateNews = () => {
  const { post, isLoading, error, data, isSuccess, reset } = useApiPost();

  const createNews = async (newsData) => {
    // Handle FormData for multipart/form-data (for news image)
    const isFormData = newsData instanceof FormData;

    // If not already FormData and has image, convert to FormData
    const formData = isFormData ? newsData : new FormData();

    if (!isFormData) {
      // Add all fields to FormData
      Object.keys(newsData).forEach((key) => {
        if (key === 'image' && newsData[key] instanceof File) {
          formData.append(key, newsData[key]);
        } else if (key !== 'image' || newsData[key] !== null) {
          // Only append if the value is not null
          if (typeof newsData[key] === 'object' && !(newsData[key] instanceof File)) {
            formData.append(key, JSON.stringify(newsData[key]));
          } else {
            formData.append(key, newsData[key]);
          }
        }
      });
    }

    try {
      return await post('/api/v1/news', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      console.error('News creation failed:', err);
      throw err;
    }
  };

  return { createNews, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for updating a news article
 */
export const useUpdateNews = () => {
  const { put, isLoading, error, data, isSuccess, reset } = useApiPut();

  const updateNews = async (newsId, newsData) => {
    if (!newsId) {
      throw new Error('News ID is required');
    }

    // Handle FormData for multipart/form-data (for news image)
    const isFormData = newsData instanceof FormData;

    // If not already FormData and has image, convert to FormData
    const formData = isFormData ? newsData : new FormData();

    if (!isFormData) {
      // Add all fields to FormData
      Object.keys(newsData).forEach((key) => {
        if (key === 'image' && newsData[key] instanceof File) {
          formData.append(key, newsData[key]);
        } else if (key !== 'image' || newsData[key] !== null) {
          // Only append if the value is not null
          if (typeof newsData[key] === 'object' && !(newsData[key] instanceof File)) {
            formData.append(key, JSON.stringify(newsData[key]));
          } else {
            formData.append(key, newsData[key]);
          }
        }
      });
    }

    try {
      return await put(`/api/v1/news/${newsId}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      console.error('News update failed:', err);
      throw err;
    }
  };

  return { updateNews, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for deleting a news article
 */
export const useDeleteNews = () => {
  const { del, isLoading, error, isSuccess } = useApiDelete();

  const deleteNews = async (newsId) => {
    if (!newsId) {
      throw new Error('News ID is required');
    }

    try {
      return await del(`/api/v1/news/${newsId}`, { withCredentials: true });
    } catch (err) {
      console.error('News deletion failed:', err);
      throw err;
    }
  };

  return { deleteNews, isLoading, error, isSuccess };
};

/**
 * Hook for toggling like on a news article
 */
export const useToggleLikeNews = () => {
  const { post, isLoading, error, data, isSuccess, reset } = useApiPost();

  const toggleLike = async (newsId) => {
    if (!newsId) {
      throw new Error('News ID is required');
    }

    try {
      return await post(`/api/v1/news/${newsId}/like`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Toggle like failed:', err);
      throw err;
    }
  };

  return { toggleLike, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for adding a comment to a news article
 */
export const useAddComment = () => {
  const { post, isLoading, error, data, isSuccess, reset } = useApiPost();

  const addComment = async (newsId, commentText) => {
    if (!newsId) {
      throw new Error('News ID is required');
    }

    if (!commentText) {
      throw new Error('Comment text is required');
    }

    try {
      return await post(
        `/api/v1/news/${newsId}/comment`,
        { text: commentText },
        { withCredentials: true }
      );
    } catch (err) {
      console.error('Comment addition failed:', err);
      throw err;
    }
  };

  return { addComment, isLoading, error, data, isSuccess, reset };
};

/**
 * Hook for deleting a comment from a news article
 */
export const useDeleteComment = () => {
  const { del, isLoading, error, isSuccess } = useApiDelete();

  const deleteComment = async (newsId, commentId) => {
    if (!newsId || !commentId) {
      throw new Error('News ID and Comment ID are both required');
    }

    try {
      return await del(`/api/v1/news/${newsId}/comment/${commentId}`, { withCredentials: true });
    } catch (err) {
      console.error('Comment deletion failed:', err);
      throw err;
    }
  };

  return { deleteComment, isLoading, error, isSuccess };
};
