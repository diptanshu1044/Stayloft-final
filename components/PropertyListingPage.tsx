"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyGrid from "@/components/Properties/PropertyGrid";
import { Property, PropertyType } from "@/types";
import { getPropertiesByType } from "@/lib/MockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyListingPageProps {
  propertyType: PropertyType;
}

const PropertyListingPage = ({ propertyType }: PropertyListingPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("location") || "",
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "all",
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("recommended");

  const typeToTitle = {
    FLAT: "Flats & Apartments",
    PG: "PG Accommodations",
    HOSTEL: "Hostels",
  };

  const cities = [
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
  ];

  const amenities = [
    { id: "WIFI", label: "WiFi" },
    { id: "AC", label: "Air Conditioning" },
    { id: "FURNISHED", label: "Furnished" },
    { id: "TV", label: "TV" },
    { id: "FRIDGE", label: "Refrigerator" },
    { id: "WASHING_MACHINE", label: "Washing Machine" },
    { id: "PARKING", label: "Parking" },
    { id: "SECURITY", label: "Security" },
    { id: "FOOD", label: "Food Included" },
    { id: "CLEANING", label: "Cleaning Service" },
    { id: "GYM", label: "Gym" },
  ];

  useEffect(() => {
    // Fetch properties
    setLoading(true);

    // Simulate API fetch delay
    setTimeout(() => {
      const fetchedProperties = getPropertiesByType(propertyType);
      setProperties(fetchedProperties);
      setFilteredProperties(fetchedProperties);

      // Set initial price range based on fetched properties
      if (fetchedProperties.length > 0) {
        const minPrice = Math.min(...fetchedProperties.map((p) => p.price));
        const maxPrice = Math.max(...fetchedProperties.map((p) => p.price));
        setPriceRange([minPrice, maxPrice]);
      }

      setLoading(false);
    }, 800);
  }, [propertyType]);

  // Apply filters
  useEffect(() => {
    let result = [...properties];

    // Filter by price range
    result = result.filter(
      (property) =>
        property.price >= priceRange[0] && property.price <= priceRange[1],
    );

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(term) ||
          property.description.toLowerCase().includes(term) ||
          property.location.city.toLowerCase().includes(term) ||
          property.location.address?.toLowerCase().includes(term),
      );
    }

    // Filter by city
    if (selectedCity && selectedCity !== "all") {
      result = result.filter(
        (property) =>
          property.location.city.toLowerCase() === selectedCity.toLowerCase(),
      );
    }

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      result = result.filter((property) =>
        selectedAmenities.every((amenity) =>
          property.amenities.includes(amenity as any),
        ),
      );
    }

    // Apply sorting
    if (sortOption === "price_low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      result.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
    }

    setFilteredProperties(result);
  }, [
    properties,
    priceRange,
    searchTerm,
    selectedCity,
    selectedAmenities,
    sortOption,
  ]);

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setSelectedAmenities((prev) =>
      checked ? [...prev, amenityId] : prev.filter((id) => id !== amenityId),
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchTerm) params.set("location", searchTerm);
    if (selectedCity !== "all") params.set("city", selectedCity);

    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCity("all");
    setSelectedAmenities([]);
    setSortOption("recommended");
    if (properties.length > 0) {
      const minPrice = Math.min(...properties.map((p) => p.price));
      const maxPrice = Math.max(...properties.map((p) => p.price));
      setPriceRange([minPrice, maxPrice]);
    }
    router.push(window.location.pathname);
  };

  const toggleMobileFilter = () => {
    setIsFilterMobileOpen(!isFilterMobileOpen);
  };

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {typeToTitle[propertyType]}
            </h1>
            <p className="text-gray-600">
              Find the perfect{" "}
              {propertyType === "FLAT"
                ? "flat"
                : propertyType === "PG"
                  ? "PG"
                  : "hostel"}{" "}
              accommodation tailored to your needs
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-xs p-4 mb-8">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by location, property name..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="w-full md:w-48">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city.toLowerCase()}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-48">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price_low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Search</Button>
                <Button
                  type="button"
                  variant="outline"
                  className="md:hidden"
                  onClick={toggleMobileFilter}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar - Desktop */}
            <div
              className={`lg:w-1/4 ${isFilterMobileOpen ? "block" : "hidden"} lg:block`}
            >
              <div className="bg-white rounded-lg shadow-xs p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm h-8 px-2"
                      onClick={handleClearFilters}
                    >
                      Clear All
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={toggleMobileFilter}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <Accordion
                  type="multiple"
                  defaultValue={["price", "amenities"]}
                >
                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={50000}
                          step={500}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex items-center justify-between">
                          <span>₹{priceRange[0].toLocaleString()}</span>
                          <span>₹{priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="amenities">
                    <AccordionTrigger>Amenities</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {amenities.map((amenity) => (
                          <div
                            key={amenity.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`amenity-${amenity.id}`}
                              checked={selectedAmenities.includes(amenity.id)}
                              onCheckedChange={(checked) =>
                                handleAmenityChange(
                                  amenity.id,
                                  checked as boolean,
                                )
                              }
                            />
                            <Label htmlFor={`amenity-${amenity.id}`}>
                              {amenity.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Property Listings */}
            <div className="lg:w-3/4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  {filteredProperties.length}{" "}
                  {filteredProperties.length === 1 ? "property" : "properties"}{" "}
                  found
                </p>
                {(selectedAmenities.length > 0 ||
                  selectedCity !== "all" ||
                  searchTerm) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>

              <PropertyGrid properties={filteredProperties} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyListingPage;
