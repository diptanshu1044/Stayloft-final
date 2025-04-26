"use client";

import { ReactNode, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProperty } from "@/actions/property.action";
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
  Clock,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { toast } from "sonner";
import { Features } from "@prisma/client";

// Map features to their corresponding icons
const featureIcons: Record<Features, ReactNode> = {
  WIFI: <Wifi className="h-5 w-5" />,
  AC: <AirVent className="h-5 w-5" />,
  TV: <Tv className="h-5 w-5" />,
  MESS: <Utensils className="h-5 w-5" />,
  LAUNDRY: <Sparkles className="h-5 w-5" />,
  PARKING: <ParkingCircle className="h-5 w-5" />,
  SECURITY: <User className="h-5 w-5" />,
  IN_TIME: <Clock className="h-5 w-5" />
};

// Convert feature enum to display text
const featureLabels: Record<Features, string> = {
  WIFI: "WiFi",
  AC: "Air Conditioning",
  TV: "Television",
  MESS: "Mess Facility",
  LAUNDRY: "Laundry Service",
  PARKING: "Parking",
  SECURITY: "Security",
  IN_TIME: "In-Time Rules"
};

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        const response = await getProperty(id as string);
        if (response.success && response.property) {
          // Transform the response to match Property type with non-null values
          const propertyData = {
            id: response.property.id,
            name: response.property.name,
            description: response.property.description || "",
            type: response.property.type,
            location: response.property.location,
            TenantType: response.property.TenantType,
            features: response.property.features || [],
            latitude: response.property.latitude || 0,
            longitude: response.property.longitude || 0,
            securityDeposit: response.property.securityDeposit,
            isActive: response.property.isActive,
            foodIncluded: response.property.foodIncluded,
            foodPrice: response.property.foodPrice || 0,
            bathroomType: response.property.bathroomType as "ATTACHED" | "COMMON",
            bhkType: response.property.bhkType || "",
            furnishingType: response.property.furnishingType as "FULLY_FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED",
            gender: response.property.gender as "BOYS" | "GIRLS" | "COED",
            ownerId: response.property.ownerId,
            // Extract URLs from image objects if they exist, otherwise use empty array
            images: ((response.property as any).images || []).map((img: any) =>
              typeof img === 'string' ? img : img.url
            ).filter(Boolean),
            owner: response.property.owner || { name: '', image: null },
            rooms: response.property.rooms.map(room => ({
              id: room.id,
              type: room.type,
              name: room.name || "",
              roomNumber: room.roomNumber || "",
              price: room.price,
              capacity: room.capacity,
              availableBeds: room.availableBeds,
              isActive: room.isActive
            })) || [],
            Review: response.property.Review || [],
            createdAt: response.property.createdAt || new Date(),
            updatedAt: response.property.updatedAt || new Date()
          };
          setProperty(propertyData);
        } else {
          toast.error("Failed to fetch property details");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("An error occurred while fetching property details");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-4">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/")}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite
        ? "Removed from favorites"
        : "Added to favorites"
    );
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property.name,
        text: property.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleContactOwner = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement contact owner functionality
    toast.success("Message sent successfully");
    setShowContactForm(false);
  };

  return (
    <div className="container py-8">
      {/* Image Gallery */}
      <div className="relative h-[500px] mb-8 rounded-lg overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <>
            <Image
              src={property.images[currentImageIndex]}
              alt={`Property image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}
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
            {property.name}
          </h1>

          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-6 py-4 border-y">
            {property.type === "FLAT" ? (
              <>
                {property.bhkType && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{property.bhkType}</p>
                      <p className="text-sm text-gray-500">Type</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{property.bathroomType}</p>
                    <p className="text-sm text-gray-500">Bathroom</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{property.furnishingType.replace("_", " ")}</p>
                    <p className="text-sm text-gray-500">Furnishing</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{property.TenantType}</p>
                    <p className="text-sm text-gray-500">Tenant Type</p>
                  </div>
                </div>
                {property.foodIncluded && (
                  <div className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Food Included</p>
                      <p className="text-sm text-gray-500">
                        {property.foodPrice ? `₹${property.foodPrice}/month` : "Free"}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <DoorClosed className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{property.bathroomType}</p>
                    <p className="text-sm text-gray-500">Bathroom Type</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <Tabs defaultValue="description">
            <TabsList className="mb-6">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <p className="text-gray-700">{property.description}</p>

              <div>
                <h3 className="font-semibold text-lg mb-2">Location Details</h3>
                <p className="text-gray-700">{property.location}</p>
              </div>

              {property.type === "FLAT" && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Property Details</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>{property.bhkType} Apartment</li>
                    <li>{property.bathroomType} Bathroom</li>
                    <li>{property.furnishingType.replace("_", " ")} Property</li>
                  </ul>
                </div>
              )}

              {(property.type === "PG" || property.type === "HOSTEL") && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Accommodation Details</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>{property.TenantType} Accommodation</li>
                    <li>
                      {property.foodIncluded
                        ? `Food Included (${property.foodPrice
                          ? `₹${property.foodPrice}/month`
                          : "Free"
                        })`
                        : "Food Not Included"}
                    </li>
                    <li>{property.bathroomType} Bathrooms</li>
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="features">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 p-3 rounded-lg border bg-gray-50"
                  >
                    <div className="text-primary">
                      {featureIcons[feature]}
                    </div>
                    <span>{featureLabels[feature]}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rooms">
              <div className="space-y-4">
                {property.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{room.name}</h4>
                      <Badge
                        variant={room.isActive ? "default" : "secondary"}
                      >
                        {room.isActive ? "Available" : "Occupied"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Room Type</p>
                        <p className="font-medium">{room.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Price</p>
                        <p className="font-medium">₹{room.price}/month</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Capacity</p>
                        <p className="font-medium">
                          {room.availableBeds} of {room.capacity} beds available
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="mb-4">
                <p className="text-2xl font-bold text-primary">
                  ₹{property.securityDeposit.toLocaleString()}
                </p>
                <p className="text-gray-600">Security Deposit</p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => setShowContactForm(true)}
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Owner
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Visit
                </Button>
              </div>

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
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">About the Owner</h3>
              <div className="flex items-center gap-4 mb-4">
                {property.owner?.image ? (
                  <Image
                    src={property.owner.image}
                    alt={property.owner.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{property.owner?.name}</p>
                  <p className="text-sm text-gray-500">Property Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
