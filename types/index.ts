import { PropertyType, TenantType, Features, RoomType } from "@prisma/client";

export enum BathroomType {
  ATTACHED = "ATTACHED",
  COMMON = "COMMON"
}

export enum FurnishingType {
  FULLY_FURNISHED = "FULLY_FURNISHED",
  SEMI_FURNISHED = "SEMI_FURNISHED",
  UNFURNISHED = "UNFURNISHED"
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  COED = "COED"
}

export interface RoomAvailability {
  roomType: string;
  totalBeds: number;
  availableBeds: number;
  isActive: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: "FLAT" | "PG" | "HOSTEL";
  location: {
    city: string;
    area: string;
  };
  totalRooms: number;
  occupancyTypes: string[];
  prices: Record<string, number>;
  bathroomType: "attached" | "common";
  bhkType?: string;
  gender: "boys" | "girls" | "coed";
  securityDeposit: number;
  depositType: "amount" | "percentage";
  hasBalcony: boolean;
  hasAC: boolean;
  foodIncluded: boolean;
  foodPrice?: number;
  isActive: boolean;
  amenities: string[];
  images: {
    url: string;
    isThumbnail: boolean;
  }[];
  roomAvailability: RoomAvailability[];
}

export interface Room {
  id: string;
  name: string;
  roomNumber?: string;
  type: RoomType;
  price: number;
  capacity: number;
  availableBeds: number;
  isActive: boolean;
  propertyId: string;
  property?: Property;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyFormData {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  location: PropertyLocation;
  price: number;
  images: { url: string; isThumbnail: boolean }[];
  amenities: Features[];
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
  gender?: TenantType;
  totalBeds?: number;

  // Room management
  rooms?: {
    id: string;
    type: RoomType;
    capacity: number;
    availableBeds?: number;
    isActive?: boolean;
  }[];

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

export type UserRole = "NONE" | "TENANT" | "OWNER" | "ADMIN";

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

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  propertyId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
