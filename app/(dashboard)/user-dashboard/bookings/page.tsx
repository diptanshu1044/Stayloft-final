"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, MapPin, Home, CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking } from "@/types";
import { mockFlats, mockPGs, mockHostels } from "@/lib/MockData";

const BookingsTab = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock bookings data - in a real app, this would come from API calls
  const mockBookings: Booking[] = [
    {
      id: "1",
      propertyId: mockFlats[0].id,
      property: mockFlats[0],
      tenantId: "user1",
      startDate: new Date(2025, 5, 1),
      status: "CONFIRMED",
      createdAt: new Date(2025, 4, 15),
      updatedAt: new Date(2025, 4, 16),
      payments: [
        {
          id: "p1",
          bookingId: "1",
          amount: 15000,
          status: "PAID",
          dueDate: new Date(2025, 4, 25),
          paidDate: new Date(2025, 4, 24),
          createdAt: new Date(2025, 4, 15),
          updatedAt: new Date(2025, 4, 24)
        }
      ]
    },
    {
      id: "2",
      propertyId: mockPGs[0].id,
      property: mockPGs[0],
      tenantId: "user1",
      startDate: new Date(2025, 6, 1),
      status: "PENDING",
      createdAt: new Date(2025, 5, 20),
      updatedAt: new Date(2025, 5, 20),
      payments: [
        {
          id: "p2",
          bookingId: "2",
          amount: 8000,
          status: "PENDING",
          dueDate: new Date(2025, 5, 25),
          createdAt: new Date(2025, 5, 20),
          updatedAt: new Date(2025, 5, 20)
        }
      ]
    },
    {
      id: "3",
      propertyId: mockHostels[0].id,
      property: mockHostels[0],
      tenantId: "user1",
      startDate: new Date(2025, 4, 1),
      endDate: new Date(2025, 5, 1),
      status: "COMPLETED",
      createdAt: new Date(2025, 3, 15),
      updatedAt: new Date(2025, 5, 2),
      payments: [
        {
          id: "p3",
          bookingId: "3",
          amount: 6000,
          status: "PAID",
          dueDate: new Date(2025, 3, 25),
          paidDate: new Date(2025, 3, 23),
          createdAt: new Date(2025, 3, 15),
          updatedAt: new Date(2025, 3, 23)
        }
      ]
    }
  ];
  
  const filteredBookings = mockBookings.filter(booking => {
    if (activeTab === "all") return true;
    return booking.status.toLowerCase() === activeTab.toLowerCase();
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Confirmed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="border-red-500 text-red-600 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Booking History</h2>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="border rounded-lg overflow-hidden flex flex-col md:flex-row"
            >
              <div className="w-full md:w-1/4 h-40 md:h-auto relative">
                <img 
                  src={booking.property?.images[0].url} 
                  alt={booking.property?.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4 w-full md:w-3/4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{booking.property?.title}</h3>
                  {getStatusBadge(booking.status)}
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{booking.property?.location.area}, {booking.property?.location.city}</span>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-gray-700">
                      Check-in: {format(booking.startDate, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  
                  {booking.endDate && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-gray-700">
                        Check-out: {format(booking.endDate, 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <Home className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-gray-700">
                      {booking.property?.type}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-between items-center">
                  <div className="text-primary font-medium">
                    ₹{booking.property?.price}/month
                  </div>
                  
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    
                    {booking.status === "PENDING" && (
                      <Button variant="destructive" size="sm">
                        Cancel
                      </Button>
                    )}
                    
                    {booking.status === "CONFIRMED" && (
                      <Button variant="default" size="sm">
                        Chat with Owner
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You don't have any bookings yet.</p>
          <p className="text-sm text-gray-400">
            Book a property to see your booking history here.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
