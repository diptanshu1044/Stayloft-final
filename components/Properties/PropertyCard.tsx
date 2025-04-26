import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Property } from "@/types";
import { Heart, Star, MapPin, Bed, Bath, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useCallback, useMemo } from "react";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  // Get the lowest room price with null check
  const lowestPrice = useMemo(() =>
    property.rooms && property.rooms.length > 0
      ? Math.min(...property.rooms.map(room => room.price))
      : 0,
    [property.rooms]
  );

  const formattedPrice = useMemo(() =>
    lowestPrice.toLocaleString("en-IN"),
    [lowestPrice]
  );

  // Calculate average rating with null check
  const averageRating = useMemo(() =>
    property.Review && property.Review.length > 0
      ? property.Review.reduce((acc, review) => acc + review.rating, 0) / property.Review.length
      : 0,
    [property.Review]
  );

  // Choose which features to display based on property type
  const renderFeatures = useCallback(() => {
    if (property.type === "FLAT") {
      return (
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          {property.bhkType && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bhkType}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathroomType || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{property.furnishingType || 'Not specified'}</span>
          </div>
        </div>
      );
    } else {
      // For PG and Hostel
      return (
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <Badge variant="outline" className={
            property.gender === "MALE"
              ? "bg-blue-50 text-blue-600 border-blue-200"
              : property.gender === "FEMALE"
                ? "bg-pink-50 text-pink-600 border-pink-200"
                : "bg-purple-50 text-purple-600 border-purple-200"
          }>
            {(property.gender || "COED").charAt(0) + (property.gender || "COED").slice(1).toLowerCase()}
          </Badge>
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{(property.rooms || []).length} Rooms</span>
          </div>
        </div>
      );
    }
  }, [property]);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <Link href={`/property/${property.id}`}>
          <div className="h-48 w-full relative">
            {property.images && Array.isArray(property.images) && property.images.length > 0 && property.images[0] && typeof property.images[0] === 'string' ? (
              <Image
                src={property.images[0]}
                alt={property.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
        </Link>

        <button
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-xs hover:bg-gray-100"
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4 text-gray-500" />
        </button>

        <div className="absolute bottom-2 left-2">
          <Badge className="bg-primary">
            {property.type === "FLAT" ? "Apartment" : property.type}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <MapPin className="h-3.5 w-3.5" />
          <span>{property.location}</span>
        </div>

        <Link href={`/property/${property.id}`} className="hover:text-primary">
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{property.name}</h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.description || "No description available"}
        </p>

        {renderFeatures()}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t">
        <div>
          <span className="text-lg font-bold text-primary">₹{formattedPrice}</span>
          <span className="text-gray-500 text-sm">/month</span>
        </div>

        {property.Review && property.Review.length > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500">({property.Review.length})</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
