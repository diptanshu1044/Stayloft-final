"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { mockFlats, mockPGs, mockHostels } from "@/lib/MockData";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import PropertiesTab from "@/components/Dashboard/PropertiesTab";
import OwnerProfileTab from "./profile/page";

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
  const [activeTab, setActiveTab] = useState("properties");

  // Mock data - in a real app, this would come from API calls
  const properties = [...mockFlats, ...mockPGs, ...mockHostels].slice(0, 5);
  const unreadMessages = 3;

  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
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
              {activeTab === "properties" && (
                <PropertiesTab properties={properties} />
              )}
              {activeTab === "settings" && (
                <OwnerProfileTab />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
