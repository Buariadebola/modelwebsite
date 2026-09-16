import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';
import { getSocket, disconnectSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import { dedupeMessages } from '../utils/messageHelpers';

export const MessagingContext = createContext(null);

export const MessagingProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const typingTimers = useRef({});

  const upsertMessage = (conversationId, incomingMessage) => {
    if (!incomingMessage || !conversationId) {
      return;
    }

    setMessagesByConversation((current) => {
      const existing = current[conversationId] || [];
      const merged = dedupeMessages([...existing, incomingMessage]);
      return {
        ...current,
        [conversationId]: merged,
      };
    });

    setConversations((current) => {
      const next = current.map((conversation) => {
        if (conversation._id !== conversationId) return conversation;

        return {
          ...conversation,
          lastMessage: {
            _id: incomingMessage._id,
            text: incomingMessage.text,
            createdAt: incomingMessage.createdAt,
            senderType: incomingMessage.senderType,
          },
          lastMessageAt: incomingMessage.createdAt || new Date().toISOString(),
        };
      });

      if (!current.some((conversation) => conversation._id === conversationId)) {
        return [
          {
            _id: conversationId,
            client: { name: 'Conversation' },
            lastMessage: {
              _id: incomingMessage._id,
              text: incomingMessage.text,
              createdAt: incomingMessage.createdAt,
              senderType: incomingMessage.senderType,
            },
            lastMessageAt: incomingMessage.createdAt || new Date().toISOString(),
          },
          ...current,
        ];
      }

      return next;
    });
  };

  const loadMessages = async (conversationId) => {
    if (!conversationId) return;

    setLoadingMessages(true);

    try {
      const response = await api.get(`/messages/${conversationId}`);
      const sortedMessages = dedupeMessages(response.data.data || []);

      setMessagesByConversation((current) => ({
        ...current,
        [conversationId]: sortedMessages,
      }));

      const unreadMessages = sortedMessages.filter((message) => {
        const isIncoming = message.senderType !== user?.type;
        return isIncoming && !message.read;
      });

      if (unreadMessages.length) {
        setUnreadCounts((current) => ({
          ...current,
          [conversationId]: unreadMessages.length,
        }));
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load messages.');
    } finally {
      setLoadingMessages(false);
    }
  };

  const markMessageAsRead = async (messageId) => {
    if (!messageId) return;

    try {
      const response = await api.patch(`/messages/${messageId}/read`);
      const updatedMessage = response.data.data;

      setMessagesByConversation((current) => {
        const nextState = { ...current };

        Object.keys(nextState).forEach((conversationId) => {
          nextState[conversationId] = (nextState[conversationId] || []).map((message) => {
            if (message._id === updatedMessage._id) {
              return { ...message, read: true };
            }

            return message;
          });
        });

        return nextState;
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update read status.');
    }
  };

  const markConversationAsRead = async (conversationId) => {
    if (!conversationId) return;

    const conversationMessages = messagesByConversation[conversationId] || [];
    const unreadMessages = conversationMessages.filter((message) => {
      const isIncoming = message.senderType !== user?.type;
      return isIncoming && !message.read;
    });

    if (!unreadMessages.length) return;

    try {
      await Promise.all(unreadMessages.map((message) => markMessageAsRead(message._id)));
      setUnreadCounts((current) => ({
        ...current,
        [conversationId]: 0,
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to mark messages as read.');
    }
  };

  const loadConversations = async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);

    try {
      const endpoint = user.type === 'model' ? '/conversations' : '/conversations/my';
      const response = await api.get(endpoint);
      const data = user.type === 'model' ? response.data.data || [] : [response.data.data].filter(Boolean);

      setConversations(data);

      if (!data.length) {
        setActiveConversationId(null);
        setLoading(false);
        return;
      }

      if (user.type === 'client') {
        const clientConversation = data[0];
        setActiveConversationId(clientConversation._id);
        await loadMessages(clientConversation._id);
        await markConversationAsRead(clientConversation._id);
        return;
      }

      if (!activeConversationId && data[0]) {
        setActiveConversationId(data[0]._id);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load conversations.');
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversation) => {
    if (!conversation) return;

    const nextConversationId = conversation._id;
    setActiveConversationId(nextConversationId);

    const socket = getSocket(token);
    if (socket) {
      socket.emit('join_conversation', { conversationId: nextConversationId });
    }

    await loadMessages(nextConversationId);
    await markConversationAsRead(nextConversationId);
  };

 const sendMessage = async (conversationId, text = '', file = null) => {
    const trimmedText = String(text || '').trim();

    if (!conversationId) {
      throw new Error('Conversation ID is required.');
    }

    if (!trimmedText && !file) {
      throw new Error('Message text or media is required.');
    }

    setSending(true);

    try {
      const formData = new FormData();

      formData.append('conversationId', conversationId);

      if (trimmedText) {
        formData.append('text', trimmedText);
      }

      if (file) {
        formData.append('media', file);
      }

      const response = await api.post('/messages', formData);

      const newMessage = response.data.data;

      upsertMessage(conversationId, newMessage);

      return newMessage;
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        'Unable to send message.';

      setError(message);

      throw new Error(message);
    } finally {
      setSending(false);
    }
  };

  const editMessage = async (messageId, text) => {
  const trimmedText = String(text || '').trim();

  if (!messageId) {
    throw new Error('Message ID is required.');
  }

  if (!trimmedText) {
    throw new Error('Message text is required.');
  }

  try {
    const response = await api.patch(
      `/messages/${messageId}`,
      { text: trimmedText }
    );

    const updatedMessage = response.data.data;

    setMessagesByConversation((current) => {
      const nextState = { ...current };

      Object.keys(nextState).forEach((conversationId) => {
        nextState[conversationId] = (
          nextState[conversationId] || []
        ).map((message) =>
          message._id === updatedMessage._id
            ? updatedMessage
            : message
        );
      });

      return nextState;
    });

    return updatedMessage;
  } catch (requestError) {
    const message =
      requestError.response?.data?.message ||
      'Unable to edit message.';

    setError(message);

    throw new Error(message);
  }
};

const deleteMessage = async (messageId) => {
  if (!messageId) {
    throw new Error('Message ID is required.');
  }

  try {
    const response = await api.delete(
      `/messages/${messageId}`
    );

    const deletedMessage = response.data.data;

    setMessagesByConversation((current) => {
      const nextState = { ...current };

      Object.keys(nextState).forEach((conversationId) => {
        nextState[conversationId] = (
          nextState[conversationId] || []
        ).map((message) =>
          message._id === deletedMessage._id
            ? {
                ...message,
                ...deletedMessage,
              }
            : message
        );
      });

      return nextState;
    });

    return deletedMessage;
  } catch (requestError) {
    const message =
      requestError.response?.data?.message ||
      'Unable to delete message.';

    setError(message);

    throw new Error(message);
  }
};

  const startTyping = (conversationId) => {
    const socket = getSocket(token);

    if (!socket || !conversationId) return;

    socket.emit('typing_start', { conversationId });

    if (typingTimers.current[conversationId]) {
      clearTimeout(typingTimers.current[conversationId]);
    }

    typingTimers.current[conversationId] = setTimeout(() => {
      stopTyping(conversationId);
    }, 1500);
  };

  const stopTyping = (conversationId) => {
    const socket = getSocket(token);

    if (!socket || !conversationId) return;

    socket.emit('typing_stop', { conversationId });

    if (typingTimers.current[conversationId]) {
      clearTimeout(typingTimers.current[conversationId]);
      delete typingTimers.current[conversationId];
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !token) {
      disconnectSocket();
      setSocketConnected(false);
      setActiveConversationId(null);
      setConversations([]);
      setMessagesByConversation({});
      setTypingUsers({});
      setOnlineUsers({});
      setUnreadCounts({});
      return;
    }

    const socket = getSocket(token);

    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);
    const handleReceiveMessage = (payload) => {
      if (!payload || !payload._id) return;

      const receivedConversationId = payload.conversation;
      const senderIsCurrentUser = String(payload.senderId) === String(user?.id);

      upsertMessage(receivedConversationId, payload);

      if (!senderIsCurrentUser && receivedConversationId !== activeConversationId) {
        setUnreadCounts((current) => ({
          ...current,
          [receivedConversationId]: (current[receivedConversationId] || 0) + 1,
        }));
      }

      if (!senderIsCurrentUser && receivedConversationId === activeConversationId) {
        markMessageAsRead(payload._id);
      }
    };
    const handleTypingStart = ({ conversationId, userId, userType }) => {
      if (!conversationId || !userId) return;
      setTypingUsers((current) => ({ ...current, [conversationId]: { userId, userType } }));
    };
    const handleTypingStop = ({ conversationId }) => {
      setTypingUsers((current) => {
        const next = { ...current };
        delete next[conversationId];
        return next;
      });
    };
    
    const handleMessageRead = ({ messageId, conversationId }) => {
      if (!messageId || !conversationId) return;

      setMessagesByConversation((current) => ({
        ...current,
        [conversationId]: (current[conversationId] || []).map((message) =>
          message._id === messageId ? { ...message, read: true } : message
        ),
      }));
    };

    const handleMessageEdited = ({ message }) => {
  if (!message?._id || !message?.conversation) return;

  const conversationId = String(message.conversation);

  setMessagesByConversation((current) => ({
    ...current,
    [conversationId]: (current[conversationId] || []).map(
      (existingMessage) =>
        existingMessage._id === message._id
          ? message
          : existingMessage
    ),
  }));
};

const handleMessageDeleted = ({
  messageId,
  conversationId,
}) => {
  if (!messageId || !conversationId) return;

  const conversationKey = String(conversationId);

  setMessagesByConversation((current) => ({
    ...current,
    [conversationKey]: (
      current[conversationKey] || []
    ).map((message) =>
      message._id === messageId
        ? {
            ...message,
            deleted: true,
            text: '',
            mediaUrl: '',
            mediaPublicId: '',
            mediaMimeType: '',
          }
        : message
    ),
  }));
};

    const handleUserOnline = ({ userId, userType, online }) => {
      if (!userId) return;
      setOnlineUsers((current) => ({
        ...current,
        [`${userType}:${userId}`]: online,
      }));
    };
    const handleUserOffline = ({ userId, userType, online }) => {
      if (!userId) return;
      setOnlineUsers((current) => ({
        ...current,
        [`${userType}:${userId}`]: online,
      }));
    };
    const handleSocketError = (eventData) => {
      setError(eventData?.message || 'A socket error occurred.');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);
    socket.on('message_read', handleMessageRead);
    socket.on('message_edited', handleMessageEdited);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);
    socket.on('error', handleSocketError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
      socket.off('message_read', handleMessageRead);
      socket.off('message_edited', handleMessageEdited);
      socket.off( 'message_deleted', handleMessageDeleted);
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
      socket.off('error', handleSocketError);
    };
  }, [isAuthenticated, token, user?.id, user?.type, activeConversationId]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadConversations();
    }
  }, [isAuthenticated, user?.id, user?.type]);

  useEffect(() => {
    if (isAuthenticated && activeConversationId && token) {
      const socket = getSocket(token);
      if (socket && socket.connected) {
        socket.emit('join_conversation', { conversationId: activeConversationId });
      }
    }
  }, [activeConversationId, isAuthenticated, token]);

  const value = useMemo(
    () => ({
      conversations,
      activeConversationId,
      messagesByConversation,
      typingUsers,
      onlineUsers,
      unreadCounts,
      loading,
      loadingMessages,
      sending,
      error,
      socketConnected,
      setError,
      loadConversations,
      loadMessages,
      selectConversation,
      sendMessage,
      editMessage,
      deleteMessage,
      markMessageAsRead,
      markConversationAsRead,
      startTyping,
      stopTyping,
    }),
    [conversations, activeConversationId, messagesByConversation, typingUsers, onlineUsers, unreadCounts, loading, loadingMessages, sending, error, socketConnected, token, user]
  );

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
};

export const useMessagingContext = () => {
  const context = useContext(MessagingContext);

  if (!context) {
    throw new Error('useMessagingContext must be used within MessagingProvider');
  }

  return context;
};
