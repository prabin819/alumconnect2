// src/hooks/useMessages.js
import { useCallback, useState, useEffect } from 'react';
import { useApiGet, useApiPost } from '../api';

export const useMessages = (conversationId = null) => {
  const [activeConversation, setActiveConversation] = useState(conversationId);

  const {
    data: conversations,
    isLoading: isConversationsLoading,
    error: conversationsError,
    get: fetchConversations,
  } = useApiGet([]);

  const {
    data: messages,
    isLoading: isMessagesLoading,
    error: messagesError,
    get: fetchMessages,
  } = useApiGet([]);

  const { isLoading: isSendingMessage, error: sendMessageError, post: sendMessage } = useApiPost();

  const getConversations = useCallback(() => {
    return fetchConversations('/messages/conversations');
  }, [fetchConversations]);

  const getMessages = useCallback(
    (conversationId) => {
      if (!conversationId) return;
      return fetchMessages('/messages', { conversationId });
    },
    [fetchMessages]
  );

  const sendNewMessage = useCallback(
    (messageData) => {
      return sendMessage('/messages', messageData);
    },
    [sendMessage]
  );

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversation) {
      getMessages(activeConversation);
    }
  }, [activeConversation, getMessages]);

  return {
    // Conversations
    conversations,
    isConversationsLoading,
    conversationsError,
    getConversations,

    // Messages
    messages,
    isMessagesLoading,
    messagesError,
    getMessages,

    // Active conversation
    activeConversation,
    setActiveConversation,

    // Send message
    sendNewMessage,
    isSendingMessage,
    sendMessageError,
  };
};
