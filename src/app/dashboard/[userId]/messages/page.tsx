"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Trash2,
  UserIcon,
  Users,
  Search,
  ArrowLeft,
  Send,
  Loader2,
} from "lucide-react";
import {
  deleteMessageAction,
  getAllUsers,
  getMessages,
  getUser,
  sendMessageAction,
} from "@/actions";
import { Loader } from "@/components/global/Loader";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  imageUrl?: string;
};

type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender: User;
  receiver: User;
};

export default function DirectMessaging({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);
  const [chatPartners, setChatPartners] = useState<User[]>([]);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  //   const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Check if we're in mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(userId);
      if (user) setCurrentUser(user);
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers();
      if (response) {
        setContacts(response);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchChatPartners = async () => {
      if (currentUser) {
        const res = await getMessages(currentUser.id);
        if (res.status === 200 && res.data) {
          const partners = res.data.reduce((acc: User[], message: Message) => {
            if (
              message.senderId !== currentUser.id &&
              !acc.some((u) => u.id === message.senderId)
            ) {
              acc.push(message.sender);
            }
            if (
              message.receiverId !== currentUser.id &&
              !acc.some((u) => u.id === message.receiverId)
            ) {
              acc.push(message.receiver);
            }
            return acc;
          }, []);
          setChatPartners(partners);
        }
      }
    };
    fetchChatPartners();
  }, [currentUser]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      const fetchMessages = async () => {
        // setIsLoadingMessages(true);
        try {
          const res = await getMessages(selectedUser.id);
          if (res.status === 200 && res.data) {
            setMessages(res.data);

            // On mobile, hide the chat list when a user is selected
            if (isMobileView) {
              setShowChatList(false);
            }

            // Scroll to bottom of messages
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
          toast("Error!", {
            description: "Failed to load messages",
          });
        } finally {
          //   setIsLoadingMessages(false);
        }
      };

      fetchMessages();

      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser, currentUser, isMobileView]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedUser || !currentUser) return;

    setIsSendingMessage(true);

    try {
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        content: messageInput,
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        createdAt: new Date().toISOString(),
        sender: currentUser,
        receiver: selectedUser,
      };

      // Optimistically update UI
      setMessages([...messages, newMessage]);
      setMessageInput("");

      // Send to server
      const response = await sendMessageAction(
        currentUser.id,
        selectedUser.id,
        messageInput
      );

      if (response.status !== 200) {
        console.error("Failed to send message");
        // Revert optimistic update
        setMessages(messages);
        toast("Error!", {
          description: "Failed to send message",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast("Error!", {
        description: "An error occurred while sending your message",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;

    setIsDeleting(true);

    try {
      // Optimistically update UI
      const updatedMessages = messages.filter(
        (msg) => msg.id !== messageToDelete
      );
      setMessages(updatedMessages);

      // Call API to delete message
      const response = await deleteMessageAction(messageToDelete);

      if (response.status !== 200) {
        // If deletion fails, revert the UI change
        toast("Error!", {
          description: "Failed to delete message. Try again",
        });

        // Refetch messages to restore the correct state
        if (selectedUser && currentUser) {
          const res = await getMessages(selectedUser.id);
          if (res.status === 200 && res.data) {
            setMessages(res.data);
          }
        }
      } else {
        toast("Success!", {
          description: "Message deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast("Error!", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsDeleting(false);
      setMessageToDelete(null);
    }
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Filter contacts and chat partners based on search query
  const filteredContacts = contacts.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChatPartners = chatPartners.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle back button in mobile view
  const handleBackToList = () => {
    setShowChatList(true);
  };

  if (!currentUser) {
    return <Loader size="lg" className="w-full h-full" />;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
        <div className="flex h-full">
          {/* Chat List - Hidden on mobile when a chat is selected */}
          {(!isMobileView || showChatList) && (
            <div className="w-full md:w-80 border-r flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Messages</h2>
              </div>

              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="chats" className="flex-1 flex flex-col">
                <div className="px-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chats">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chats
                    </TabsTrigger>
                    <TabsTrigger value="contacts">
                      <Users className="mr-2 h-4 w-4" />
                      Contacts
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent
                  value="chats"
                  className="flex-1 overflow-hidden mt-2"
                >
                  <ScrollArea className="h-[calc(100vh-16rem)]">
                    <div className="px-2">
                      {filteredChatPartners.length > 0 ? (
                        filteredChatPartners.map((user) => (
                          <div
                            key={user.id}
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                              selectedUser?.id === user.id && "bg-muted"
                            )}
                            onClick={() => setSelectedUser(user)}
                          >
                            <Avatar>
                              <AvatarImage src={user.imageUrl} />
                              <AvatarFallback>
                                {user.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {user.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.role}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No conversations found
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent
                  value="contacts"
                  className="flex-1 overflow-hidden mt-2"
                >
                  <ScrollArea className="h-[calc(100vh-16rem)]">
                    <div className="px-2">
                      {filteredContacts.length > 0 ? (
                        filteredContacts.map((user) => (
                          <div
                            key={user.id}
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                              selectedUser?.id === user.id && "bg-muted"
                            )}
                            onClick={() => setSelectedUser(user)}
                          >
                            <Avatar>
                              <AvatarImage src={user.imageUrl} />
                              <AvatarFallback>
                                {user.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {user.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.role}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No contacts found
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Chat Area */}
          {(!isMobileView || !showChatList) && (
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b flex items-center">
                    {isMobileView && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBackToList}
                        className="mr-2"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    )}
                    <Avatar>
                      <AvatarImage src={selectedUser.imageUrl} />
                      <AvatarFallback>
                        {selectedUser.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="font-medium">{selectedUser.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedUser.role}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    className="flex-1 overflow-y-auto p-4"
                    ref={messagesContainerRef}
                  >
                    {messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const isCurrentUser =
                            message.senderId === currentUser.id;

                          return (
                            <div
                              key={message.id}
                              className={`flex ${
                                isCurrentUser ? "justify-end" : "justify-start"
                              }`}
                            >
                              {!isCurrentUser && (
                                <div className="flex-shrink-0 mr-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={message.sender.imageUrl}
                                    />
                                    <AvatarFallback>
                                      {message.sender.fullName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              )}

                              <div className="flex flex-col max-w-[75%]">
                                <div
                                  className={cn(
                                    "px-3 py-2 rounded-lg text-sm",
                                    isCurrentUser
                                      ? "bg-primary text-primary-foreground ml-auto"
                                      : "bg-muted"
                                  )}
                                >
                                  <div className="whitespace-pre-wrap break-words">
                                    {message.content}
                                  </div>
                                </div>

                                <div
                                  className={cn(
                                    "text-[10px] mt-1 flex items-center",
                                    isCurrentUser
                                      ? "justify-end"
                                      : "justify-start"
                                  )}
                                >
                                  <span className="text-muted-foreground">
                                    {formatMessageDate(message.createdAt)}
                                  </span>

                                  {isCurrentUser && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 ml-1 opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
                                      onClick={() =>
                                        setMessageToDelete(message.id)
                                      }
                                    >
                                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {isCurrentUser && (
                                <div className="flex-shrink-0 ml-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={currentUser.imageUrl} />
                                    <AvatarFallback>
                                      {currentUser.fullName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation!</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-3 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        disabled={isSendingMessage}
                        className="flex-1"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!messageInput.trim() || isSendingMessage}
                        size="icon"
                      >
                        {isSendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="bg-muted rounded-full p-6 mb-4">
                    <UserIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    No conversation selected
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Choose a contact to start messaging
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Delete Message Confirmation Dialog */}
      <AlertDialog
        open={!!messageToDelete}
        onOpenChange={(open) => !open && setMessageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMessage}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader size="sm" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
