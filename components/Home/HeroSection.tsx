"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const HeroSection = () => {
  const router = useRouter();
  const [propertyType, setPropertyType] = useState<string>("all");
  const [location, setLocation] = useState<string>("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (propertyType && propertyType !== "all") {
      params.append("type", propertyType);
    }
    if (location) {
      params.append("location", location);
    }

    const searchUrl =
      propertyType === "FLAT"
        ? "/flats"
        : propertyType === "PG"
        ? "/pgs"
        : propertyType === "HOSTEL"
        ? "/hostels"
        : "/flats";

    router.push(`${searchUrl}?${params.toString()}`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt="Apartments"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 dark:from-black/80 dark:to-black/50" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Find Your Perfect Stay With StayLoft
          </h1>

          <p className="text-lg md:text-xl text-white mb-8">
            Discover the best flats, PGs, and hostels across India with our
            comprehensive rental platform designed for comfort and convenience.
          </p>

          {/* Search Form */}
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="FLAT">Flats & Apartments</SelectItem>
                  <SelectItem value="PG">PG Accommodations</SelectItem>
                  <SelectItem value="HOSTEL">Hostels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter city or locality"
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <Button className="whitespace-nowrap" size="lg" onClick={handleSearch}>
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-8 mt-12 text-foreground">
            <div>
              <p className="text-3xl font-bold">1500+</p>
              <p className="text-muted-foreground">Accommodations</p>
            </div>
            <div>
              <p className="text-3xl font-bold">15+</p>
              <p className="text-muted-foreground">Cities</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.8/5</p>
              <p className="text-muted-foreground">User Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
