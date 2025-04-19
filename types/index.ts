export interface Property {
  id: string;
  title: string;
  description: string;
  type: "FLAT" | "PG" | "HOSTEL";
  location: PropertyLocation;
  price: number;
  images: { url: string }[];
  amenities: Amenity[];
  isActive: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Property-specific fields
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  furnishingType?: "FULLY_FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";
  
  // PG/Hostel-specific fields
  gender?: "MALE" | "FEMALE" | "UNISEX";
  totalBeds?: number;
  
  // Common optional fields
  ratings?: number;
  numReviews?: number;
  rules?: string[];
  securityDeposit?: number;
  availableFrom?: Date;
}

export interface PropertyLocation {
  street?: string;
  city: string;
  state?: string;
  country?: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  area?: string;
  address?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export type PropertyType = "FLAT" | "PG" | "HOSTEL";

export type Amenity = 
  | "WIFI" 
  | "AC" 
  | "PARKING" 
  | "LAUNDRY" 
  | "TV" 
  | "FRIDGE"
  | "KITCHEN" 
  | "SECURITY" 
  | "GYM" 
  | "SWIMMING_POOL" 
  | "POWER_BACKUP" 
  | "STUDY_TABLE" 
  | "LIFT" 
  | "CCTV" 
  | "FOOD" 
  | "CLEANING"
  | "ATTACHED_BATHROOM"
  | "GEYSER"
  | "FURNISHED"
  | "WASHING_MACHINE";

export type UserRole = "TENANT" | "OWNER" | "ADMIN";

export type ThemeType = "light" | "dark" | "system";

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  savedProperties?: string[];
  recentSearches?: RecentSearch[];
  theme: ThemeType;
  notifications: NotificationPreference;
  verificationStatus: VerificationStatus;
  verificationDocuments?: VerificationDocument[];
  address?: string;
  language?: string;
  profileCompleted?: boolean;
  profileCompletionPercentage?: number;
}

export interface RecentSearch {
  id: string;
  query: string;
  filters?: Record<string, any>;
  timestamp: Date;
}

export interface Booking {
  id: string;
  propertyId: string;
  property?: Property;
  tenantId: string;
  tenant?: User;
  startDate: Date;
  endDate?: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: Date;
  updatedAt: Date;
  payments: Payment[];
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED";
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  participants: string[];
  propertyId?: string;
  lastMessage?: Message;
  updatedAt: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: string[];
}

export interface NotificationPreference {
  email: boolean;
  push: boolean;
  sms: boolean;
  newMessages: boolean;
  bookingUpdates: boolean;
  paymentReminders: boolean;
  promotions: boolean;
}

export interface VerificationDocument {
  id: string;
  userId: string;
  type: "ID_CARD" | "PASSPORT" | "DRIVERS_LICENSE" | "ADDRESS_PROOF" | "AADHAAR" | "PAN";
  fileUrl: string;
  status: VerificationStatus;
  uploadedAt: Date;
  verifiedAt?: Date;
}

export type Language = "English" | "Hindi" | "Tamil" | "Telugu" | "Kannada" | "Malayalam" | "Bengali" | "Marathi" | "Gujarati";
