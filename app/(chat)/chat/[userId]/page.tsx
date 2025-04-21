"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  ThumbsUp,
  ThumbsDown,
  Home,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Property } from "@/types";
import { mockFlats, mockPGs, mockHostels } from "@/lib/MockData";

const MOCK_CONVERSATIONS = [
  { id: "support", name: "Support Team", avatar: "S", unread: 2 },
  { id: "john", name: "John Smith", avatar: "J", unread: 0 },
  { id: "priya", name: "Priya Patel", avatar: "P", unread: 1 },
];

const MOCK_BOOKING_REQUESTS = [
  {
    id: "req1",
    propertyId: "flat1",
    propertyName: "3BHK Premium Apartment",
    tenantName: "Rahul Sharma",
    date: "2023-05-15",
    status: "PENDING",
  },
  {
    id: "req2",
    propertyId: "pg1",
    propertyName: "Female PG in Koramangala",
    tenantName: "Priya Patel",
    date: "2023-05-12",
    status: "CONFIRMED",
  },
  {
    id: "req3",
    propertyId: "hostel1",
    propertyName: "Deluxe Hostel Room",
    tenantName: "Aditya Verma",
    date: "2023-05-10",
    status: "CANCELLED",
  },
];

const MOCK_MESSAGES = {
  support: [
    {
      id: 1,
      sender: "support",
      text: "Welcome to our support channel! How can we help you today?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "I have a question about my property listing.",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      sender: "support",
      text: "Sure, I'd be happy to help. What's your question about the listing?",
      timestamp: "10:33 AM",
    },
  ],
  john: [
    {
      id: 1,
      sender: "john",
      text: "Hello, I'm interested in your apartment listing.",
      timestamp: "Yesterday",
    },
    {
      id: 2,
      sender: "user",
      text: "Hi John, thanks for your interest. Which property are you looking at?",
      timestamp: "Yesterday",
    },
    {
      id: 3,
      sender: "john",
      text: "The 3BHK in Indiranagar. Is it still available?",
      timestamp: "Yesterday",
    },
    {
      id: 4,
      sender: "john",
      type: "booking-request",
      propertyId: "flat1",
      timestamp: "10:15 AM",
      requestId: "req1",
    },
  ],
  priya: [
    {
      id: 1,
      sender: "priya",
      text: "Hi, I saw your PG listing and I'm interested.",
      timestamp: "Monday",
    },
    {
      id: 2,
      sender: "user",
      text: "Hello Priya! Yes, the PG is available. When would you like to view it?",
      timestamp: "Monday",
    },
  ],
};

const ChatPage = () => {
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("userId") || "support";

  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState(userIdParam);
  const [messages, setMessages] = useState(
    MOCK_MESSAGES[userIdParam as keyof typeof MOCK_MESSAGES] || [],
  );
  const [newMessage, setNewMessage] = useState("");
  const [bookingRequests, setBookingRequests] = useState(MOCK_BOOKING_REQUESTS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const allProperties = [...mockFlats, ...mockPGs, ...mockHostels];

  const currentBookingRequest = bookingRequests.find((req) =>
    messages.some(
      (msg) => msg.type === "booking-request" && msg.requestId === req.id,
    ),
  );

  const currentProperty = currentBookingRequest
    ? allProperties.find((p) => p.id === currentBookingRequest.propertyId)
    : null;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const newMessages =
      MOCK_MESSAGES[activeConversation as keyof typeof MOCK_MESSAGES] || [];
    setMessages(newMessages);

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation ? { ...conv, unread: 0 } : conv,
      ),
    );
  }, [activeConversation]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "user",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    }
  };

  const handleUpdateBookingStatus = (requestId: string, newStatus: string) => {
    setBookingRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req,
      ),
    );
  };

  return (
    <>
      <div className="container py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex h-[75vh]">
            {/* Conversations List */}
            <div className="w-1/4 border-r overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="font-bold text-lg">Messages</h2>
              </div>
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center p-4 gap-3 cursor-pointer hover:bg-gray-50 border-b ${activeConversation === conversation.id ? "bg-gray-50" : ""}`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {conversation.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{conversation.name}</p>
                      {conversation.unread > 0 && (
                        <Badge variant="destructive" className="rounded-full">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      Click to view conversation
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {conversations.find((c) => c.id === activeConversation)
                      ?.avatar || "?"}
                  </div>
                  <h2 className="font-bold">
                    {conversations.find((c) => c.id === activeConversation)
                      ?.name || "Chat"}
                  </h2>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto bg-gray-50"
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "booking-request" ? (
                        <Card className="p-4 w-full max-w-md bg-blue-50 border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Booking Request</h3>
                            <Badge variant="outline">
                              {bookingRequests.find(
                                (req) => req.id === message.requestId,
                              )?.status || "PENDING"}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3">
                            I would like to book this property.
                          </p>
                          {currentProperty && (
                            <div className="flex items-center gap-3 p-2 bg-white rounded-md mb-3">
                              <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                                <Home className="h-6 w-6 text-gray-500" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {currentProperty.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {currentProperty.location.city}
                                </p>
                              </div>
                            </div>
                          )}
                          {bookingRequests.find(
                            (req) => req.id === message.requestId,
                          )?.status === "PENDING" && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-xs"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    message.requestId,
                                    "CONFIRMED",
                                  )
                                }
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" /> Accept
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50 text-xs"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    message.requestId,
                                    "CANCELLED",
                                  )
                                }
                              >
                                <ThumbsDown className="h-4 w-4 mr-1" /> Decline
                              </Button>
                            </div>
                          )}
                        </Card>
                      ) : (
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${message.sender === "user" ? "bg-primary text-white rounded-br-none" : "bg-white shadow-sm rounded-bl-none"}`}
                        >
                          <p>{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${message.sender === "user" ? "text-primary-foreground/70" : "text-gray-500"}`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="rounded-full"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="w-1/4 border-l">
              <div className="p-4 border-b">
                <h2 className="font-bold text-lg">Details</h2>
              </div>
              {currentProperty ? (
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Property</h3>
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="font-medium">{currentProperty.title}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      {currentProperty.location.city}
                    </p>
                    <p className="text-sm">
                      ₹{currentProperty.price.toLocaleString()}/month
                    </p>
                  </div>

                  <h3 className="font-semibold mb-2">Booking Request</h3>
                  <div className="space-y-2">
                    {currentBookingRequest && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Status</span>
                          <Badge>{currentBookingRequest.status}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Requested by
                          </span>
                          <span className="text-sm">
                            {currentBookingRequest.tenantName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Date</span>
                          <span className="text-sm">
                            {new Date(
                              currentBookingRequest.date,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <Separator className="my-3" />
                        {currentBookingRequest.status === "PENDING" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="w-full text-xs"
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  currentBookingRequest.id,
                                  "CONFIRMED",
                                )
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  currentBookingRequest.id,
                                  "CANCELLED",
                                )
                              }
                            >
                              Decline
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No booking details available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
