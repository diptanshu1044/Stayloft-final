"use client";

import { useState } from "react";
import { mockFlats, mockPGs, mockHostels } from "@/lib/MockData";
import PropertyGrid from "@/components/Properties/PropertyGrid";
import { Property } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SavedPropertiesTab = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock saved properties data - in a real app, this would come from API calls
  const savedProperties: Property[] = [
    ...mockFlats.slice(0, 2),
    ...mockPGs.slice(0, 2),
    ...mockHostels.slice(0, 1)
  ];
  
  const filteredProperties = savedProperties.filter(property => {
    if (activeTab === "all") return true;
    return property.type.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Saved Properties</h2>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="flat">Flats</TabsTrigger>
            <TabsTrigger value="pg">PGs</TabsTrigger>
            <TabsTrigger value="hostel">Hostels</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredProperties.length > 0 ? (
        <PropertyGrid properties={filteredProperties} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't saved any properties yet.</p>
          <p className="text-sm text-gray-400">
            Browse our listings and click the heart icon to save properties for later.
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedPropertiesTab;
