"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PropertyGrid from "@/components/Properties/PropertyGrid";
import { Property } from "@/types";
import { PropertyType } from "@prisma/client";
import { getPropertiesByTypeWithPagination } from "@/actions/property.action";
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
  const [loading, setLoading] = useState(true);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    { id: "TV", label: "TV" },
    { id: "PARKING", label: "Parking" },
    { id: "SECURITY", label: "Security" },
    { id: "MESS", label: "Mess" },
    { id: "LAUNDRY", label: "Laundry" },
  ];

  const fetchProperties = async (page: number) => {
    setLoading(true);
    try {
      const filters = {
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        city: selectedCity !== "all" ? selectedCity : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      };

      const result = await getPropertiesByTypeWithPagination(
        propertyType,
        page,
        10,
        filters
      );

      if (result) {
        setProperties(result.properties || []);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.currentPage || 1);
      } else {
        setProperties([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadProperties = async () => {
      if (mounted) {
        await fetchProperties(currentPage);
      }
    };

    loadProperties();

    return () => {
      mounted = false;
    };
  }, [propertyType, currentPage, priceRange, selectedCity, selectedAmenities]);

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setSelectedAmenities((prev) =>
      checked ? [...prev, amenityId] : prev.filter((id) => id !== amenityId),
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProperties(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCity("all");
    setSelectedAmenities([]);
    setSortOption("recommended");
    setPriceRange([0, 50000]);
    setCurrentPage(1);
    fetchProperties(1);
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
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit">Search</Button>
            </form>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={toggleMobileFilter}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div
              className={`${isFilterMobileOpen ? "block" : "hidden"
                } md:block w-full md:w-64 bg-white rounded-lg shadow-xs p-4`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear all
                </Button>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={50000}
                        step={1000}
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="amenities">
                  <AccordionTrigger>Amenities</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {amenities.map((amenity) => (
                        <div
                          key={amenity.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={amenity.id}
                            checked={selectedAmenities.includes(amenity.id)}
                            onCheckedChange={(checked) =>
                              handleAmenityChange(amenity.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={amenity.id}>{amenity.label}</Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Property Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : properties.length === 0 ? (
                <div className="text-center py-8">
                  No properties found matching your criteria
                </div>
              ) : (
                <>
                  <PropertyGrid properties={properties} />

                  {/* Pagination */}
                  <div className="flex justify-center mt-8 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        );
                      }}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyListingPage;
