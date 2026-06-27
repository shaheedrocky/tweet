import { useApp } from '../providers/AppProvider';

export const useChats = () => {
  const {
    conversations,
    messages,
    activeConversationId,
    isConversationsLoading,
    isMessagesLoading,
    setActiveConversationId,
    fetchConversations,
    fetchMessages,
    sendChatMessage,
  } = useApp();

  return {
    conversations,
    messages,
    activeConversationId,
    isConversationsLoading,
    isMessagesLoading,
    setActiveConversationId,
    fetchConversations,
    fetchMessages,
    sendChatMessage,
  };
};
