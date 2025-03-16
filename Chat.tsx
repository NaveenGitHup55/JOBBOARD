import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, FileText, User, WifiOff } from 'lucide-react';
import ChatDocumentUpload from './ChatDocumentUpload';
import { formatDistanceToNow } from 'date-fns';
import { useChatWebSocket, ChatMessage as WebSocketMessage } from '@/hooks/use-chat-websocket';

// Message types for the chat
type MessageType = 'text' | 'document';

interface DocumentData {
  fileUrl: string;
  fileName: string;
  fileType: string;
  resumeData?: {
    skills: string[];
    experience: string[];
  }
}

interface Message {
  id: string;
  type: MessageType;
  content: string;
  documentData?: DocumentData;
  sender: {
    id: number;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
}

interface ChatProps {
  recipientId?: number;
  companyData?: {
    id: number;
    name: string;
    avatar: string;
  };
}

export default function Chat({ 
  recipientId = 999, // Default to company chat
  companyData
}: ChatProps) {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Company data - in a real app, this would come from the API based on recipientId
  const company = companyData || {
    id: 999,
    name: 'LinkedIn',
    avatar: 'https://cdn-icons-png.flaticon.com/512/174/174857.png'
  };
  
  // Use our WebSocket hook for real-time messaging
  const { messages, sendMessage: sendWebSocketMessage, isConnected, isConnecting } = useChatWebSocket(recipientId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a text message
  const handleSendMessage = () => {
    if (!inputValue.trim() || !user) return;
    
    // Use the WebSocket to send the message
    const success = sendWebSocketMessage(inputValue);
    
    if (success) {
      setInputValue('');
    }
    
    // If WebSocket is not connected, we would show an error message here
    // This is handled inside the hook with toast notifications
  };

  // Handle document upload
  const handleDocumentUploaded = (documentData: DocumentData) => {
    if (!user) return;
    
    // Use the WebSocket to send the document message
    sendWebSocketMessage('Shared a document', documentData);
  };

  // Render a document message
  const renderDocumentMessage = (message: Message) => {
    if (!message.documentData) return null;
    
    const { fileName, fileUrl, fileType } = message.documentData;
    
    return (
      <div className="flex flex-col">
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-3 bg-white dark:bg-slate-900 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <FileText className="h-8 w-8 text-blue-600 mr-3" />
          <div className="flex-1 overflow-hidden">
            <p className="font-medium text-sm truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground">{fileType}</p>
          </div>
        </a>
        
        {message.documentData.resumeData && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Skills identified:</p>
            <div className="flex flex-wrap gap-1">
              {message.documentData.resumeData.skills.slice(0, 5).map((skill, i) => (
                <Badge key={i} variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                  {skill}
                </Badge>
              ))}
              {message.documentData.resumeData.skills.length > 5 && (
                <Badge variant="outline">+{message.documentData.resumeData.skills.length - 5} more</Badge>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-[600px] flex flex-col shadow-lg border-0">
      <div className="p-4 border-b flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/30">
        <Avatar className="h-10 w-10 border-2 border-white">
          <img src={company.avatar} alt={company.name} />
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg">{company.name}</h3>
          <p className="text-sm text-muted-foreground">Typically responds in a few hours</p>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-1">Start a conversation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with recruiters, send your resume, and explore job opportunities.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = user && message.sender.id === user.id;
              
              return (
                <div 
                  key={message.id} 
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {message.sender.avatar ? (
                        <img src={message.sender.avatar} alt={message.sender.name} />
                      ) : (
                        <div className="bg-primary text-primary-foreground flex items-center justify-center h-full w-full text-sm">
                          {message.sender.name.substring(0, 1)}
                        </div>
                      )}
                    </Avatar>
                    
                    <div className={`${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div 
                        className={`px-4 py-2.5 rounded-2xl ${
                          isCurrentUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        {message.type === 'text' ? (
                          <p className="text-sm">{message.content}</p>
                        ) : (
                          renderDocumentMessage(message)
                        )}
                      </div>
                      
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <ChatDocumentUpload onDocumentUploaded={handleDocumentUploaded} />
        
        <Separator className="my-3" />
        
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || !isConnected}
          >
            {isConnecting ? (
              <WifiOff className="h-4 w-4 animate-pulse" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}