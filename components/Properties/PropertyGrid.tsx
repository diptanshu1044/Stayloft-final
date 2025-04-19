import { Property } from "@/types";
import PropertyCard from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
}

const PropertyGrid = ({ properties, loading = false }: PropertyGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-80" />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-600">No properties found</h3>
        <p className="text-gray-500 mt-2">
          Try adjusting your search filters to find more options.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;
