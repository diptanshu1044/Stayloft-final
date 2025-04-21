"use client";
import { X, ExternalLink, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecentSearch } from "@/types";
import { formatDistanceToNow } from "date-fns";

const RecentSearchesTab = () => {
  // Mock recent searches data - in a real app, this would come from API calls
  const recentSearches: RecentSearch[] = [
    {
      id: "1",
      query: "2BHK in Koramangala",
      filters: {
        propertyType: "FLAT",
        priceRange: [15000, 25000],
        amenities: ["WiFi", "Parking"]
      },
      timestamp: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: "2",
      query: "PG near Indiranagar",
      filters: {
        propertyType: "PG",
        gender: "MALE",
        amenities: ["Food", "WiFi"]
      },
      timestamp: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: "3",
      query: "Furnished apartments",
      filters: {
        furnishingType: "FULLY_FURNISHED",
        amenities: ["AC", "Power Backup"]
      },
      timestamp: new Date(Date.now() - 172800000) // 2 days ago
    }
  ];
  
  const clearSearch = (id: string) => {
    // In a real app, you would remove the search from the user's history
    console.log(`Clearing search with id: ${id}`);
  };
  
  const repeatSearch = (search: RecentSearch) => {
    // In a real app, you would navigate to the search results page with these filters
    console.log("Repeating search:", search);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xs">
      <h2 className="text-2xl font-bold mb-6">Recent Searches</h2>
      
      {recentSearches.length > 0 ? (
        <div className="space-y-4">
          {recentSearches.map((search) => (
            <div 
              key={search.id} 
              className="border rounded-lg p-4 hover:border-primary/30 transition-colors relative"
            >
              <div className="absolute top-2 right-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => clearSearch(search.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              </div>
              
              <h3 className="font-medium text-lg mb-2">{search.query}</h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {search.filters?.propertyType && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {search.filters.propertyType}
                  </span>
                )}
                
                {search.filters?.priceRange && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    ₹{search.filters.priceRange[0]} - ₹{search.filters.priceRange[1]}
                  </span>
                )}
                
                {search.filters?.amenities?.map((amenity: any) => (
                  <span key={amenity} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDistanceToNow(search.timestamp, { addSuffix: true })}
                </span>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary" 
                  onClick={() => repeatSearch(search)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Repeat Search
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You don't have any recent searches.</p>
          <p className="text-sm text-gray-400">
            Your search history will appear here when you start exploring properties.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentSearchesTab;
