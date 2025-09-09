import { Message, Conversation } from '@/types/message';

const MESSAGES_KEY = 'grace_haven_messages';
const CONVERSATIONS_KEY = 'grace_haven_conversations';

export const messaging = {
  // Conversations
  getConversations: (userId: string, userRole: 'admin' | 'user'): Conversation[] => {
    const conversations = localStorage.getItem(CONVERSATIONS_KEY);
    const conversationsArray: Conversation[] = conversations ? JSON.parse(conversations) : [];
    
    return conversationsArray.filter(conv => 
      userRole === 'admin' ? conv.tailorId === userId : conv.customerId === userId
    );
  },

  createConversation: (customerId: string, customerName: string, tailorId: string, tailorName: string): Conversation => {
    const conversations = localStorage.getItem(CONVERSATIONS_KEY);
    const conversationsArray: Conversation[] = conversations ? JSON.parse(conversations) : [];
    
    // Check if conversation already exists
    const existing = conversationsArray.find(conv => 
      conv.customerId === customerId && conv.tailorId === tailorId
    );
    
    if (existing) return existing;
    
    const newConversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      customerName,
      tailorId,
      tailorName,
      unreadCount: 0,
      createdAt: new Date().toISOString()
    };
    
    conversationsArray.push(newConversation);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversationsArray));
    return newConversation;
  },

  updateConversation: (conversationId: string, updates: Partial<Conversation>) => {
    const conversations = localStorage.getItem(CONVERSATIONS_KEY);
    const conversationsArray: Conversation[] = conversations ? JSON.parse(conversations) : [];
    
    const index = conversationsArray.findIndex(conv => conv.id === conversationId);
    if (index !== -1) {
      conversationsArray[index] = { ...conversationsArray[index], ...updates };
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversationsArray));
    }
  },

  // Messages
  getMessages: (conversationId: string): Message[] => {
    const messages = localStorage.getItem(MESSAGES_KEY);
    const messagesArray: Message[] = messages ? JSON.parse(messages) : [];
    
    return messagesArray
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  sendMessage: (conversationId: string, senderId: string, senderName: string, senderRole: 'admin' | 'user', content: string): Message => {
    const messages = localStorage.getItem(MESSAGES_KEY);
    const messagesArray: Message[] = messages ? JSON.parse(messages) : [];
    
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId,
      senderName,
      senderRole,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    messagesArray.push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messagesArray));
    
    // Update conversation with last message
    messaging.updateConversation(conversationId, {
      lastMessage: content,
      lastMessageTime: newMessage.timestamp,
      unreadCount: messaging.getUnreadCount(conversationId, senderId)
    });
    
    return newMessage;
  },

  markAsRead: (conversationId: string, userId: string) => {
    const messages = localStorage.getItem(MESSAGES_KEY);
    const messagesArray: Message[] = messages ? JSON.parse(messages) : [];
    
    const updatedMessages = messagesArray.map(msg => {
      if (msg.conversationId === conversationId && msg.senderId !== userId) {
        return { ...msg, isRead: true };
      }
      return msg;
    });
    
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
    
    // Update conversation unread count
    messaging.updateConversation(conversationId, {
      unreadCount: 0
    });
  },

  getUnreadCount: (conversationId: string, userId: string): number => {
    const messages = messaging.getMessages(conversationId);
    return messages.filter(msg => !msg.isRead && msg.senderId !== userId).length;
  }
};