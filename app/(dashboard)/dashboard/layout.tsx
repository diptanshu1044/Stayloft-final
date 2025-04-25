"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import PropertiesTab from "@/components/Dashboard/PropertiesTab";
import OwnerProfileTab from "./profile/page";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("properties");
  const [loading, setLoading] = useState(false);
  const unreadMessages = 3;

  useEffect(() => {
    const checkUserRole = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user/role");
        const data = await res.json();
        if (data.role !== "OWNER") {
          router.push("/user-dashboard/saved-properties");
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  useEffect(() => {
    // Set active tab based on current path
    const path = pathname.split("/").pop();
    if (path === "profile") {
      setActiveTab("settings");
    } else {
      setActiveTab(path || "properties");
    }
  }, [pathname]);

  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <DashboardSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            unreadMessages={unreadMessages}
          />

          {/* Main Content */}
          <div className="lg:w-3/4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 