"use client";

import { ReactNode, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPropertyById } from "@/lib/MockData";
import { Property, Amenity } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Map,
  MapPin,
  Heart,
  Share,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Calendar,
  CheckCircle,
  Wifi,
  Coffee,
  Utensils,
  ShowerHead,
  ParkingCircle,
  Tv,
  Home,
  Phone,
  AirVent,
  Refrigerator,
  Bed,
  Bath,
  DoorClosed,
  Sparkles,
  User,
  Building,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { useToast } from "@/hooks/useToast";

// Map amenity IDs to their corresponding icons
const amenityIcons: Record<Amenity, ReactNode> = {
  WIFI: <Wifi className="h-5 w-5" />,
  AC: <AirVent className="h-5 w-5" />,
  FURNISHED: <Home className="h-5 w-5" />,
  GEYSER: <ShowerHead className="h-5 w-5" />,
  TV: <Tv className="h-5 w-5" />,
  FRIDGE: <Refrigerator className="h-5 w-5" />,
  WASHING_MACHINE: <Sparkles className="h-5 w-5" />,
  POWER_BACKUP: <CheckCircle className="h-5 w-5" />,
  PARKING: <ParkingCircle className="h-5 w-5" />,
  SECURITY: <User className="h-5 w-5" />,
  CCTV: <CheckCircle className="h-5 w-5" />,
  LIFT: <Building className="h-5 w-5" />,
  FOOD: <Utensils className="h-5 w-5" />,
  CLEANING: <Sparkles className="h-5 w-5" />,
  ATTACHED_BATHROOM: <Bath className="h-5 w-5" />,
  GYM: <CheckCircle className="h-5 w-5" />,
  KITCHEN: <Utensils className="h-5 w-5" />,
  LAUNDRY: <Sparkles className="h-5 w-5" />,
  STUDY_TABLE: <CheckCircle className="h-5 w-5" />,
  SWIMMING_POOL: <CheckCircle className="h-5 w-5" />,
};

// Convert amenity ID to display text
const amenityLabels: Record<Amenity, string> = {
  WIFI: "WiFi",
  AC: "Air Conditioning",
  FURNISHED: "Furnished",
  GEYSER: "Hot Water",
  TV: "Television",
  FRIDGE: "Refrigerator",
  WASHING_MACHINE: "Washing Machine",
  POWER_BACKUP: "Power Backup",
  PARKING: "Parking",
  SECURITY: "Security",
  CCTV: "CCTV Surveillance",
  LIFT: "Elevator Access",
  FOOD: "Food Included",
  CLEANING: "Cleaning Service",
  ATTACHED_BATHROOM: "Attached Bathroom",
  GYM: "Gym",
  KITCHEN: "Kitchen",
  LAUNDRY: "Laundry Service",
  STUDY_TABLE: "Study Table",
  SWIMMING_POOL: "Swimming Pool",
};

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Simulate API fetch delay
    setLoading(true);
    setTimeout(() => {
      if (id) {
        const foundProperty = getPropertyById(id);
        if (foundProperty) {
          setProperty(foundProperty);
        }
      }
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <>
        <div className="container py-8">
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="h-10 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
            </div>
            <div className="h-64 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the property you're looking for.
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </>
    );
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1,
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? "This property has been removed from your favorites"
        : "This property has been added to your favorites",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this property with others",
      });
    }
  };

  const handleContactOwner = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "The property owner will get back to you soon.",
    });
    setShowContactForm(false);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 border-b">
        <div className="container">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/${property.type === "FLAT" ? "flats" : property.type === "PG" ? "pgs" : "hostels"}`}
              className="hover:text-primary"
            >
              {property.type === "FLAT"
                ? "Flats"
                : property.type === "PG"
                  ? "PGs"
                  : "Hostels"}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium truncate">
              {property.title}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Property Images */}
        <div className="relative mb-8 bg-gray-100 rounded-lg overflow-hidden">
          <div className="h-96">
            <img
              src={property.images[currentImageIndex]?.url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-xs"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-xs"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <Badge
                className={
                  property.type === "FLAT"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : property.type === "PG"
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : "bg-green-100 text-green-800 border-green-200"
                }
              >
                {property.type === "FLAT"
                  ? "Flat"
                  : property.type === "PG"
                    ? "PG"
                    : "Hostel"}
              </Badge>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full ${isFavorite
                      ? "bg-red-50 text-red-500"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                  aria-label="Share property"
                >
                  <Share className="h-5 w-5" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {property.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {property.location.address}, {property.location.city}
              </span>
            </div>

            {property.ratings && (
              <div className="flex items-center gap-1 mb-4">
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                  <Star className="h-4 w-4 fill-green-800 mr-1" />
                  <span className="font-medium">
                    {property.ratings.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-600">
                  ({property.numReviews} reviews)
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 mb-6 py-4 border-y">
              {property.type === "FLAT" ? (
                <>
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{property.bedrooms}</p>
                        <p className="text-sm text-gray-500">Bedrooms</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{property.bathrooms}</p>
                        <p className="text-sm text-gray-500">Bathrooms</p>
                      </div>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{property.area} sq.ft</p>
                        <p className="text-sm text-gray-500">Area</p>
                      </div>
                    </div>
                  )}
                  {property.furnishingType && (
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">
                          {property.furnishingType.replace("_", " ")}
                        </p>
                        <p className="text-sm text-gray-500">Furnishing</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {property.gender && (
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">
                          {property.gender.charAt(0) +
                            property.gender.slice(1).toLowerCase()}
                        </p>
                        <p className="text-sm text-gray-500">Accommodation</p>
                      </div>
                    </div>
                  )}
                  {property.totalBeds && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{property.totalBeds}</p>
                        <p className="text-sm text-gray-500">Total Beds</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">
                    {format(property.availableFrom || "", "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-gray-500">Available From</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="description">
              <TabsList className="mb-6">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <p className="text-gray-700">{property.description}</p>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Location Details
                  </h3>
                  <p className="text-gray-700">
                    {property.location.address}, {property.location.city},{" "}
                    {property.location.state} - {property.location.pincode}
                  </p>
                </div>

                {property.type === "FLAT" && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Property Details
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>{property.bedrooms} Bedroom(s)</li>
                      <li>{property.bathrooms} Bathroom(s)</li>
                      <li>{property.area} sq.ft Area</li>
                      <li>
                        {property.furnishingType?.replace("_", " ")} Property
                      </li>
                    </ul>
                  </div>
                )}

                {(property.type === "PG" || property.type === "HOSTEL") && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Accommodation Details
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>
                        {property.gender === "MALE"
                          ? "Male Only"
                          : property.gender === "FEMALE"
                            ? "Female Only"
                            : "Co-ed"}{" "}
                        Accommodation
                      </li>
                      <li>Total {property.totalBeds} beds available</li>
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="amenities">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-3 rounded-lg border bg-gray-50"
                    >
                      <div className="text-primary">
                        {amenityIcons[amenity]}
                      </div>
                      <span>{amenityLabels[amenity]}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rules">
                {property.rules && property.rules.length > 0 ? (
                  <ul className="space-y-2">
                    {property.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No specific rules provided.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Pricing and Contact Card */}
          <div>
            <div className="bg-white border rounded-lg shadow-xs p-6 sticky top-24">
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary">
                  ₹{property.price.toLocaleString("en-IN")}
                </span>
                <span className="text-gray-600">/month</span>
              </div>

              {property.securityDeposit && (
                <div className="flex items-center text-gray-600 mb-4">
                  <span>Security Deposit: </span>
                  <span className="font-medium ml-1">
                    ₹{property.securityDeposit.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <Button
                className="w-full mb-3"
                onClick={() => setShowContactForm(!showContactForm)}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Owner
              </Button>

              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-5 w-5" />
                Request Callback
              </Button>

              {showContactForm && (
                <form
                  onSubmit={handleContactOwner}
                  className="mt-4 space-y-4 border-t pt-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Your Message
                    </label>
                    <textarea
                      className="border rounded-md w-full p-2"
                      rows={4}
                      placeholder="I'm interested in this property. Please contact me."
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              )}

              <div className="mt-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Safety Information</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600 mb-2">
                        All our properties are verified by our team to ensure
                        accuracy and quality. However, we recommend:
                      </p>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Verify property details in person</li>
                        <li>
                          Don't make payments without viewing/confirming
                          property
                        </li>
                        <li>
                          Report suspicious activity to our customer support
                          team
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetailPage;
