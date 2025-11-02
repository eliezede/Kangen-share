import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Send, MessageCircle } from "lucide-react";
import type { Message, MessageThread, User } from "@shared/schema";

type ThreadWithUsers = MessageThread & {
  userA: User;
  userB: User;
  messages?: Message[];
};

type MessageWithSender = Message & {
  sender: User;
};

export default function Messages() {
  const { threadId: urlThreadId } = useParams<{ threadId?: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(urlThreadId || null);
  const [messageInput, setMessageInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Update selectedThreadId when URL changes
  useEffect(() => {
    if (urlThreadId) {
      setSelectedThreadId(urlThreadId);
    }
  }, [urlThreadId]);

  const { data: threads, isLoading: threadsLoading } = useQuery<ThreadWithUsers[]>({
    queryKey: ["/api/messages/threads"],
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<MessageWithSender[]>({
    queryKey: ["/api/messages/thread", selectedThreadId],
    enabled: !!selectedThreadId,
  });

  const { sendMessage: sendWsMessage } = useWebSocket("/ws", {
    onMessage: (data) => {
      if (data.type === "new_message") {
        queryClient.invalidateQueries({ queryKey: ["/api/messages/thread", data.threadId] });
        queryClient.invalidateQueries({ queryKey: ["/api/messages/threads"] });
      }
    },
    onConnect: () => {
      console.log("WebSocket connected for messaging");
    },
    onDisconnect: () => {
      console.log("WebSocket disconnected for messaging");
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (data: { threadId: string; recipientId: string; body: string }) => {
      const result = await apiRequest("POST", "/api/messages", data);
      sendWsMessage({
        type: "new_message",
        threadId: data.threadId,
        recipientId: data.recipientId,
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/thread", selectedThreadId] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/threads"] });
      setMessageInput("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedThreadId) return;

    const thread = threads?.find((t) => t.id === selectedThreadId);
    if (!thread) return;

    const recipientId = thread.userAId === user?.id ? thread.userBId : thread.userAId;

    sendMutation.mutate({
      threadId: selectedThreadId,
      recipientId,
      body: messageInput.trim(),
    });
  };

  const getOtherUser = (thread: ThreadWithUsers) => {
    return thread.userAId === user?.id ? thread.userB : thread.userA;
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getUnreadCount = (thread: ThreadWithUsers) => {
    return thread.userAId === user?.id ? thread.unreadForA : thread.unreadForB;
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const selectedThread = threads?.find((t) => t.id === selectedThreadId);
  const otherUser = selectedThread ? getOtherUser(selectedThread) : null;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Messages</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Chat with providers and requesters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-[calc(100%-4rem)] md:h-[calc(100%-6rem)]">
        {/* Thread List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <ScrollArea className="h-full">
              {threadsLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : threads && threads.length > 0 ? (
                <div className="divide-y">
                  {threads.map((thread) => {
                    const otherUser = getOtherUser(thread);
                    const unreadCount = getUnreadCount(thread);
                    const isActive = selectedThreadId === thread.id;

                    return (
                      <button
                        key={thread.id}
                        onClick={() => setSelectedThreadId(thread.id)}
                        className={`w-full p-4 flex items-start gap-3 hover-elevate text-left transition-colors ${
                          isActive ? "bg-accent" : ""
                        }`}
                        data-testid={`thread-${thread.id}`}
                      >
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarImage src={otherUser.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {getInitials(otherUser.firstName, otherUser.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className={`font-medium truncate ${unreadCount > 0 ? "font-semibold" : ""}`}>
                              {otherUser.firstName} {otherUser.lastName}
                            </p>
                            {unreadCount > 0 && (
                              <Badge variant="default" className="ml-auto">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                          {thread.lastMessageAt && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(thread.lastMessageAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message View */}
        <Card className="lg:col-span-2">
          {selectedThreadId && otherUser ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={otherUser.profileImageUrl || undefined} />
                  <AvatarFallback>
                    {getInitials(otherUser.firstName, otherUser.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {otherUser.firstName} {otherUser.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{otherUser.city || "Location not set"}</p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                {messagesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                        <Skeleton className="h-16 w-2/3 rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.senderId === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                          data-testid={`message-${message.id}`}
                        >
                          <div className={`flex gap-2 max-w-[70%] ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                            {!isOwnMessage && (
                              <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarImage src={message.sender.profileImageUrl || undefined} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(message.sender.firstName, message.sender.lastName)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div
                                className={`rounded-lg p-3 ${
                                  isOwnMessage
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <p className="text-sm">{message.body}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sendMutation.isPending}
                    data-testid="input-message"
                  />
                  <Button 
                    type="submit" 
                    disabled={!messageInput.trim() || sendMutation.isPending}
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
