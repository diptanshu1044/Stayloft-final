import { Amenity, Property, PropertyType } from "@/types";

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to get random items from an array
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// List of all possible amenities
const allAmenities: Amenity[] = [
  "WIFI", "AC", "FURNISHED", "GEYSER", "TV", "FRIDGE", 
  "WASHING_MACHINE", "POWER_BACKUP", "PARKING", "SECURITY", 
  "CCTV", "LIFT", "FOOD", "CLEANING", "ATTACHED_BATHROOM", "GYM"
];

// Common property images (placeholders)
const propertyImages = [
  { id: "img1", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", isMain: true },
  { id: "img2", url: "https://images.unsplash.com/photo-1560185007-5f0bb1866cab", isMain: false },
  { id: "img3", url: "https://images.unsplash.com/photo-1560185008-a33f5c5ef79c", isMain: false },
];

// Cities in India
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata"];

// Create mock listings for different property types
const createMockProperties = (
  type: PropertyType,
  count: number,
  priceRange: { min: number; max: number }
): Property[] => {
  const properties: Property[] = [];

  for (let i = 0; i < count; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const amenitiesCount = 4 + Math.floor(Math.random() * 8); // 4-12 amenities
    const amenities = getRandomItems(allAmenities, amenitiesCount);
    
    // Common property data
    const property: Property = {
      id: generateId(),
      title: `${type === "FLAT" ? "Beautiful Apartment" : type === "PG" ? "Comfortable PG" : "Modern Hostel"} in ${city}`,
      description: `A ${type === "FLAT" ? "spacious and modern apartment" : type === "PG" ? "well-maintained PG accommodation" : "convenient and affordable hostel"} located in a prime area of ${city}. Close to public transportation, markets, and entertainment.`,
      type,
      price: Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min,
      securityDeposit: Math.floor(Math.random() * 20000) + 5000,
      location: {
        address: `${Math.floor(Math.random() * 100) + 1}, ${["Park", "Main", "Lake", "Hill", "Green"][Math.floor(Math.random() * 5)]} Street, ${["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Electronic City"][Math.floor(Math.random() * 5)]}`,
        city,
        state: ["Karnataka", "Maharashtra", "Tamil Nadu", "Telangana", "Delhi"][Math.floor(Math.random() * 5)],
        pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
        latitude: 12.9716 + (Math.random() - 0.5) * 0.2,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.2,
      },
      amenities,
      images: propertyImages.map(img => ({ ...img, id: generateId() })),
      rules: [
        "No smoking",
        "No pets",
        "No parties or events",
        "Check-in time is flexible",
      ],
      availableFrom: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: generateId(),
      isActive: Math.random() > 0.2, // 80% are active
      ratings: 3 + Math.random() * 2, // Rating between 3-5
      numReviews: Math.floor(Math.random() * 50),
    };

    // Add property-type specific fields
    if (type === "FLAT") {
      property.bedrooms = Math.floor(Math.random() * 3) + 1; // 1-3 bedrooms
      property.bathrooms = Math.floor(Math.random() * 2) + 1; // 1-2 bathrooms
      property.area = String(Math.floor(Math.random() * 1000) + 500); // 500-1500 sq.ft
      property.furnishingType = ["FULLY_FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"][Math.floor(Math.random() * 3)] as any;
    } else {
      // PG and Hostel specific
      property.totalBeds = Math.floor(Math.random() * 100) + 10; // 10-110 beds
      property.gender = ["MALE", "FEMALE", "UNISEX"][Math.floor(Math.random() * 3)] as any;
    }

    properties.push(property);
  }

  return properties;
};

// Create mock data
export const mockFlats = createMockProperties("FLAT", 15, { min: 10000, max: 35000 });
export const mockPGs = createMockProperties("PG", 12, { min: 5000, max: 15000 });
export const mockHostels = createMockProperties("HOSTEL", 8, { min: 3000, max: 10000 });

// Combine all property types
export const allProperties = [...mockFlats, ...mockPGs, ...mockHostels];

// Get properties by type
export const getPropertiesByType = (type: PropertyType) => {
  return allProperties.filter(property => property.type === type);
};

// Get property by ID
export const getPropertyById = (id: string) => {
  return allProperties.find(property => property.id === id);
};
