"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyGrid from "@/components/Properties/PropertyGrid";
import { getPropertiesByType } from "@/lib/MockData";
import { Property, PropertyType } from "@/types";

const FeaturedProperties = () => {
  const [activeTab, setActiveTab] = useState<PropertyType>("FLAT");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    setLoading(true);
    setTimeout(() => {
      const filteredProperties = getPropertiesByType(activeTab).slice(0, 6);
      setProperties(filteredProperties);
      setLoading(false);
    }, 500);
  }, [activeTab]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our handpicked selection of top-rated accommodations across different categories
          </p>
        </div>

        <Tabs defaultValue="FLAT" onValueChange={(value) => setActiveTab(value as PropertyType)}>
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="FLAT">Flats</TabsTrigger>
              <TabsTrigger value="PG">PGs</TabsTrigger>
              <TabsTrigger value="HOSTEL">Hostels</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="FLAT">
            <PropertyGrid properties={properties} loading={loading} />
          </TabsContent>
          
          <TabsContent value="PG">
            <PropertyGrid properties={properties} loading={loading} />
          </TabsContent>
          
          <TabsContent value="HOSTEL">
            <PropertyGrid properties={properties} loading={loading} />
          </TabsContent>
        </Tabs>

        <div className="text-center mt-10">
          <Button asChild>
            <Link href={`/${activeTab.toLowerCase() + "s"}`}>
              View All {activeTab === "FLAT" ? "Flats" : activeTab === "PG" ? "PGs" : "Hostels"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
