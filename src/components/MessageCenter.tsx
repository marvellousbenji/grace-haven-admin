import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, ArrowLeft, Phone, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { messaging } from "@/lib/messaging";
import { Message, Conversation } from "@/types/message";
import { useToast } from "@/hooks/use-toast";

interface MessageCenterProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialTailorId?: string;
  initialTailorName?: string;
}

export function MessageCenter({ isOpen, onOpenChange, initialTailorId, initialTailorName }: MessageCenterProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [view, setView] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadConversations();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen && initialTailorId && initialTailorName && user && user.role === 'user') {
      // Create or find conversation with the tailor
      const conversation = messaging.createConversation(
        user.id,
        `${user.firstName} ${user.lastName}`,
        initialTailorId,
        initialTailorName
      );
      setSelectedConversation(conversation);
      setView('chat');
      loadMessages(conversation.id);
    }
  }, [isOpen, initialTailorId, initialTailorName, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = () => {
    if (!user) return;
    const convs = messaging.getConversations(user.id, user.role);
    setConversations(convs);
  };

  const loadMessages = (conversationId: string) => {
    const msgs = messaging.getMessages(conversationId);
    setMessages(msgs);
    if (user) {
      messaging.markAsRead(conversationId, user.id);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setView('chat');
    loadMessages(conversation.id);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    messaging.sendMessage(
      selectedConversation.id,
      user.id,
      `${user.firstName} ${user.lastName}`,
      user.role,
      newMessage.trim()
    );

    setNewMessage("");
    loadMessages(selectedConversation.id);
    loadConversations();

    toast({
      title: "Message sent",
      description: "Your message has been delivered",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            {view === 'chat' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView('list')}
                className="md:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <DialogTitle>
                {view === 'chat' && selectedConversation
                  ? user?.role === 'admin' 
                    ? selectedConversation.customerName 
                    : selectedConversation.tailorName
                  : 'Messages'
                }
              </DialogTitle>
            </div>
            {view === 'chat' && selectedConversation && (
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className={`${view === 'list' ? 'w-full' : 'w-full md:w-1/3'} ${view === 'chat' ? 'hidden md:block' : ''} border-r bg-muted/20`}>
            <div className="p-4">
              <h3 className="font-semibold mb-4">Conversations</h3>
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No conversations yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user?.role === 'admin' ? 'Wait for customers to message you' : 'Contact a tailor to start messaging'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <Card
                      key={conversation.id}
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedConversation?.id === conversation.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {user?.role === 'admin' 
                                ? conversation.customerName.charAt(0)
                                : conversation.tailorName.charAt(0)
                              }
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">
                                {user?.role === 'admin' 
                                  ? conversation.customerName 
                                  : conversation.tailorName
                                }
                              </p>
                              <div className="flex items-center gap-2">
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {conversation.lastMessageTime && formatTime(conversation.lastMessageTime)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage || 'No messages yet'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat View */}
          {view === 'chat' && selectedConversation && (
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Start your conversation</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}