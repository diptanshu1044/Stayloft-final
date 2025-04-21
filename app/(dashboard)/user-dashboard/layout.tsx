'use client';

import { useState } from "react";
import UserDashboardSidebar from "@/components/Dashboard/UserDashboardSidebar";

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState("saved-properties");

  const unreadMessages = 3;

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-8" suppressHydrationWarning>
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            <UserDashboardSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              unreadMessages={unreadMessages} 
            />
            
            <div className="lg:w-3/4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboardLayout;
