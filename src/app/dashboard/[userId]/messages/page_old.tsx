"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, UserIcon, Users } from "lucide-react";
import {
  getAllUsers,
  getMessages,
  getUser,
  sendMessageAction,
} from "@/actions";

// Define the User type
type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  imageUrl?: string;
};

// Define the Message type
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
  // Mock current user - in a real app, this would come from authentication
  // const currentUser: User = {
  //   id: "user1",
  //   name: "John Doe",
  //   email: "john@example.com",
  //   role: "student",
  // };

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // State for the selected user to chat with

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // State for the message input
  const [messageInput, setMessageInput] = useState("");

  // State for messages
  const [messages, setMessages] = useState<Message[]>([]);

  // State for contacts/users
  const [contacts, setContacts] = useState<User[]>([]);

  // State for chat partners (users you've messaged with)
  const [chatPartners, setChatPartners] = useState<User[]>([]);

  //   get current user
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(userId);
      if (user) setCurrentUser(user);
    };
    fetchUser();
  }, [userId]);

  // Fetch contacts (in a real app, this would come from an API)

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers();
      if (response) {
        setContacts(response);
        // Set the first user as the selected user (for testing)
        if (response.length > 0) {
          setSelectedUser(response[0]);
        }
      }
    };
    fetchUsers();
  }, []);
  // useEffect(() => {
  //   // Mock data

  //   const fetchUsers = async () => {
  //     const response = await getAllUsers();
  //     if (response) return;

  //     setContacts(response);
  //   };

  //   fetchUsers();
  //   // const mockContacts: User[] = [
  //   //   {
  //   //     id: "user2",
  //   //     name: "Jane Smith",
  //   //     email: "jane@example.com",
  //   //     role: "supervisor",
  //   //   },
  //   //   {
  //   //     id: "user3",
  //   //     name: "Bob Johnson",
  //   //     email: "bob@example.com",
  //   //     role: "supervisor",
  //   //   },
  //   //   {
  //   //     id: "user4",
  //   //     name: "Alice Williams",
  //   //     email: "alice@example.com",
  //   //     role: "supervisor",
  //   //   },
  //   // ];

  //   // setContacts(mockContacts);

  //   // Mock chat partners
  //   setChatPartners([mockContacts[0], mockContacts[1]]);
  // }, []);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser && currentUser) {
      const fetchMessages = async () => {
        const res = await getMessages(selectedUser.id);
        if (res.status === 200 && res.data) {
          setMessages(res.data);
        }
      };
      fetchMessages();
    }
  }, [selectedUser, currentUser]);

  // Send a message
  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedUser || !currentUser) return;

    // Create a new message
    const newMessage: Message = {
      id: `msg${Date.now()}`, // Temporary ID for frontend rendering
      content: messageInput,
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      createdAt: new Date().toISOString(),
      sender: currentUser,
      receiver: selectedUser,
    };

    // Optimistically update the UI
    setMessages([...messages, newMessage]);
    setMessageInput("");

    // Send the message to the server
    const response = await sendMessageAction(
      currentUser.id,
      selectedUser.id,
      messageInput
    );
    if (response.status !== 200) {
      console.error("Failed to send message");
      // Rollback the optimistic update if the request fails
      setMessages(messages);
    }
  };

  // Format date for display
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chats" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="chats">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="contacts">
                <Users className="mr-2 h-4 w-4" />
                Contacts
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 border-r pr-4">
                <TabsContent value="chats" className="mt-0">
                  <ScrollArea className="h-[500px]">
                    {chatPartners.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer rounded-md hover:bg-gray-100 ${
                          selectedUser?.id === user.id ? "bg-gray-100" : ""
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <Avatar>
                          <AvatarImage src={user.imageUrl} />
                          <AvatarFallback>
                            {user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="contacts" className="mt-0">
                  <ScrollArea className="h-[500px]">
                    {contacts.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer rounded-md hover:bg-gray-100 ${
                          selectedUser?.id === user.id ? "bg-gray-100" : ""
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <Avatar>
                          <AvatarImage src={user.imageUrl} />
                          <AvatarFallback>
                            {user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
              </div>

              <div className="md:col-span-2">
                {selectedUser ? (
                  <div className="flex flex-col h-[500px]">
                    <div className="flex items-center gap-3 p-3 border-b">
                      <Avatar>
                        <AvatarImage src={selectedUser.imageUrl} />
                        <AvatarFallback>
                          {selectedUser.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedUser.fullName}</p>
                        <p className="text-sm text-gray-500">
                          {selectedUser.role}
                        </p>
                      </div>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex mb-4 ${
                            message.senderId === currentUser?.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.senderId !== currentUser?.id && (
                            <Avatar className="mr-2">
                              <AvatarImage src={message.sender.imageUrl} />
                              <AvatarFallback>
                                {message.sender.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.senderId === currentUser?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-gray-100"
                            }`}
                          >
                            <p>{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === currentUser?.id
                                  ? "text-primary-foreground/70"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatMessageDate(message.createdAt)}
                            </p>
                          </div>

                          {message.senderId === currentUser?.id && (
                            <Avatar className="ml-2">
                              <AvatarImage src={currentUser?.imageUrl} />
                              <AvatarFallback>
                                {currentUser?.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </ScrollArea>

                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              sendMessage();
                            }
                          }}
                        />
                        <Button onClick={sendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[500px] text-center">
                    <UserIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      No conversation selected
                    </h3>
                    <p className="text-gray-500">
                      Choose a contact to start messaging
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
