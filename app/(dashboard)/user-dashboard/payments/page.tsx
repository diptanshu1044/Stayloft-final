"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Clock, CreditCard, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Payment, Booking } from "@/types";
import { mockFlats, mockPGs } from "@/lib/MockData";

const PaymentsTab = () => {
  // Mock payments data - in a real app, this would come from API calls
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
          status: "PENDING",
          dueDate: new Date(2025, 5, 5),
          createdAt: new Date(2025, 4, 15),
          updatedAt: new Date(2025, 4, 15)
        }
      ]
    },
    {
      id: "2",
      propertyId: mockPGs[0].id,
      property: mockPGs[0],
      tenantId: "user1",
      startDate: new Date(2025, 6, 1),
      status: "CONFIRMED",
      createdAt: new Date(2025, 5, 20),
      updatedAt: new Date(2025, 5, 22),
      payments: [
        {
          id: "p2",
          bookingId: "2",
          amount: 8000,
          status: "PENDING",
          dueDate: new Date(2025, 6, 10),
          createdAt: new Date(2025, 5, 20),
          updatedAt: new Date(2025, 5, 20)
        },
        {
          id: "p3",
          bookingId: "2",
          amount: 8000,
          status: "PENDING",
          dueDate: new Date(2025, 7, 10),
          createdAt: new Date(2025, 5, 20),
          updatedAt: new Date(2025, 5, 20)
        }
      ]
    }
  ];
  
  // Extract all pending payments
  const pendingPayments: (Payment & { property?: any })[] = mockBookings.flatMap(booking => 
    booking.payments
      .filter(payment => payment.status === "PENDING")
      .map(payment => ({ ...payment, property: booking.property }))
  );
  
  // Sort payments by due date (closest first)
  pendingPayments.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  const makePayment = (paymentId: string) => {
    // In a real app, you would process the payment
    console.log(`Processing payment: ${paymentId}`);
  };
  
  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const getPaymentStatusBadge = (payment: Payment) => {
    const daysRemaining = getDaysRemaining(payment.dueDate);
    
    if (daysRemaining < 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Overdue by {Math.abs(daysRemaining)} days
        </Badge>
      );
    } else if (daysRemaining < 3) {
      return (
        <Badge variant="outline" className="border-orange-500 text-orange-600 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Due in {daysRemaining} days
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-600 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Due in {daysRemaining} days
        </Badge>
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xs">
      <h2 className="text-2xl font-bold mb-6">Pending Payments</h2>
      
      {pendingPayments.length > 0 ? (
        <div className="space-y-4">
          {pendingPayments.map((payment) => {
            const daysRemaining = getDaysRemaining(payment.dueDate);
            const urgencyProgress = daysRemaining < 0 ? 100 : daysRemaining < 3 ? 75 : daysRemaining < 7 ? 50 : 25;
            
            return (
              <div 
                key={payment.id} 
                className="border rounded-lg p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{payment.property?.title}</h3>
                    <p className="text-sm text-gray-500">
                      {payment.property?.location.area}, {payment.property?.location.city}
                    </p>
                  </div>
                  {getPaymentStatusBadge(payment)}
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Payment due date</span>
                    <span className="font-medium">{format(payment.dueDate, 'MMM dd, yyyy')}</span>
                  </div>
                  <Progress value={urgencyProgress} className={`h-1.5 ${
                    daysRemaining < 0 ? 'bg-red-100' : daysRemaining < 3 ? 'bg-orange-100' : 'bg-blue-100'
                  }`} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Amount Due</p>
                    <p className="text-lg font-bold text-primary">₹{payment.amount.toLocaleString()}</p>
                  </div>
                  
                  <Button onClick={() => makePayment(payment.id)}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-green-50 rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <p className="text-gray-700 font-medium mb-2">No pending payments</p>
          <p className="text-sm text-gray-500">
            You don't have any pending payments at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentsTab;
