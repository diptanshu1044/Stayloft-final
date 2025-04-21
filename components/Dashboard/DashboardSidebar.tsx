"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, MessageSquare, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessages: number;
}

const DashboardSidebar = ({ activeTab, setActiveTab, unreadMessages }: DashboardSidebarProps) => {
  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-lg shadow-xs border p-4 mb-4">
        <div className="flex items-center gap-4 mb-4 pb-4 border-b">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-sm text-gray-600">Property Owner</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          <button 
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-left ${
              activeTab === "properties" ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("properties")}
          >
            <Building className="h-5 w-5" />
            <span>My Properties</span>
          </button>
          
          <Link 
            href="/chat/support"
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-left text-gray-700 hover:bg-gray-100`}
          >
            <div className="relative">
              <MessageSquare className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </div>
            <span>Messages</span>
          </Link>
          
          <button 
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-left ${
              activeTab === "settings" ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
        <h3 className="font-semibold text-primary mb-2">Need Help?</h3>
        <p className="text-sm text-gray-700 mb-4">
          Our support team is always ready to assist you with any questions.
        </p>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/dashboard/support">
            <HelpCircle className="mr-2 h-4 w-4" />
            Contact Support
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
