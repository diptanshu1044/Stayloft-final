import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Property } from "@/types";
import { Heart, Star, MapPin, Bed, Bath, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  // Format price with commas (e.g., 12,000)
  const formattedPrice = property.price.toLocaleString("en-IN");
  
  // Choose which features to display based on property type
  const renderFeatures = () => {
    if (property.type === "FLAT") {
      return (
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} {property.bedrooms > 1 ? "Beds" : "Bed"}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} {property.bathrooms > 1 ? "Baths" : "Bath"}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.area} sq.ft</span>
            </div>
          )}
        </div>
      );
    } else {
      // For PG and Hostel
      return (
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          {property.gender && (
            <Badge variant="outline" className={
              property.gender === "MALE" 
                ? "bg-blue-50 text-blue-600 border-blue-200" 
                : property.gender === "FEMALE"
                ? "bg-pink-50 text-pink-600 border-pink-200"
                : "bg-purple-50 text-purple-600 border-purple-200"
            }>
              {property.gender.charAt(0) + property.gender.slice(1).toLowerCase()}
            </Badge>
          )}
          {property.totalBeds && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.totalBeds} Beds Total</span>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <Link href={`/property/${property.id}`}>
          <img 
            src={property.images[0]?.url} 
            alt={property.title}
            className="h-48 w-full object-cover"
          />
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
          <span>{property.location.city}</span>
        </div>
        
        <Link href={`/property/${property.id}`} className="hover:text-primary">
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{property.title}</h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>
        
        {renderFeatures()}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t">
        <div>
          <span className="text-lg font-bold text-primary">₹{formattedPrice}</span>
          <span className="text-gray-500 text-sm">/month</span>
        </div>
        
        {property.ratings && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{property.ratings.toFixed(1)}</span>
            {property.numReviews && (
              <span className="text-gray-500">({property.numReviews})</span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
