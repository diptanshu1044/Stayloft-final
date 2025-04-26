"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { RoomAvailability, Property } from "@/types";
import { PropertyType, RoomType, Features, TenantType } from "@prisma/client";

// Get all properties for a user
export async function getUserProperties() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) throw new Error("User not found");

    const properties = await prisma.property.findMany({
      where: { ownerId: user.id },
      include: {
        rooms: true,
        Review: true,
      },
    });

    return { success: true, properties };
  } catch (err) {
    console.error("Error fetching user properties:", err);
    return { success: false, error: "Failed to fetch properties" };
  }
}

// Get a single property by ID
export async function getProperty(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        rooms: true,
        Review: true,
        owner: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    return { success: true, property };
  } catch (err) {
    console.error("Error fetching property:", err);
    return { success: false, error: "Failed to fetch property" };
  }
}

// Create a new property
export async function createProperty(propertyData: {
  name: string;
  type: PropertyType;
  description?: string;
  location: string;
  TenantType: TenantType;
  features: Features[];
  latitude?: number;
  longitude?: number;
  securityDeposit: number;
  isActive: boolean;
  foodIncluded: boolean;
  foodPrice?: number;
  bathroomType: string;
  bhkType?: string;
  furnishingType: string;
  gender?: string;
  images?: string[];
  rooms: {
    name: string;
    roomNumber?: string;
    type: RoomType;
    price: number;
    capacity: number;
    availableBeds: number;
    isActive: boolean;
  }[];
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) throw new Error("User not found");

    // Validate required fields
    if (!propertyData.name || !propertyData.type) {
      throw new Error("Missing required fields");
    }

    // Create the property with all its relations
    const property = await prisma.property.create({
      data: {
        name: propertyData.name,
        type: propertyData.type,
        description: propertyData.description || "",
        location: propertyData.location,
        TenantType: propertyData.TenantType,
        features: propertyData.features as Features[],
        latitude: propertyData.latitude || 0,
        longitude: propertyData.longitude || 0,
        securityDeposit: propertyData.securityDeposit,
        isActive: propertyData.isActive,
        foodIncluded: propertyData.foodIncluded,
        foodPrice: propertyData.foodPrice,
        bathroomType: propertyData.bathroomType,
        bhkType: propertyData.bhkType,
        furnishingType: propertyData.furnishingType,
        gender: propertyData.gender,
        ownerId: user.id,
        rooms: {
          create: propertyData.rooms.map((room) => ({
            name: room.name,
            roomNumber: room.roomNumber,
            type: room.type,
            price: room.price,
            capacity: room.capacity,
            availableBeds: room.availableBeds,
            isActive: room.isActive,
          })),
        },
      },
      include: {
        rooms: true,
        owner: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Revalidate all relevant paths
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/property");
    revalidatePath(`/property/${property.id}`);

    return { success: true, property };
  } catch (err) {
    console.error("Error creating property:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create property",
    };
  }
}

// Update room availability
export async function updateRoomAvailability(
  propertyId: string,
  roomAvailability: RoomAvailability[],
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify that the user owns this property
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true },
    });

    if (!existingProperty) {
      throw new Error("Property not found");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user || existingProperty.ownerId !== user.id) {
      throw new Error("You don't have permission to update this property");
    }

    // Update each room individually
    for (const room of roomAvailability) {
      await prisma.room.updateMany({
        where: {
          propertyId,
          type: room.roomType,
        },
        data: {
          capacity: room.totalBeds,
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Error updating room availability:", err);
    return { success: false, error: "Failed to update room availability" };
  }
}

// Update property
export async function updateProperty(
  propertyId: string,
  propertyData: {
    name: string;
    type: PropertyType;
    description?: string;
    location: string;
    TenantType: TenantType;
    features: Features[];
    latitude?: number;
    longitude?: number;
    securityDeposit: number;
    isActive: boolean;
    foodIncluded: boolean;
    foodPrice?: number;
    bathroomType: string;
    bhkType?: string;
    rooms: {
      id?: string;
      name: string;
      roomNumber?: string;
      type: RoomType;
      price: number;
      capacity: number;
      availableBeds: number;
      isActive: boolean;
    }[];
  },
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify that the user owns this property
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true },
    });

    if (!existingProperty) {
      throw new Error("Property not found");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user || existingProperty.ownerId !== user.id) {
      throw new Error("You don't have permission to update this property");
    }

    // Update the property
    const property = await prisma.property.update({
      where: { id: propertyId },
      data: {
        name: propertyData.name,
        type: propertyData.type,
        description: propertyData.description || "",
        location: propertyData.location,
        TenantType: propertyData.TenantType,
        features: propertyData.features as Features[],
        latitude: propertyData.latitude || 0,
        longitude: propertyData.longitude || 0,
        securityDeposit: propertyData.securityDeposit,
        isActive: propertyData.isActive,
        foodIncluded: propertyData.foodIncluded,
        foodPrice: propertyData.foodPrice,
        bathroomType: propertyData.bathroomType,
        bhkType: propertyData.bhkType,
        rooms: {
          deleteMany: {},
          create: propertyData.rooms.map((room) => ({
            name: room.name,
            roomNumber: room.roomNumber,
            type: room.type,
            price: room.price,
            capacity: room.capacity,
            availableBeds: room.availableBeds,
            isActive: room.isActive,
          })),
        },
      },
      include: {
        rooms: true,
        owner: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Revalidate all relevant paths
    revalidatePath("/dashboard");
    revalidatePath(`/property/${property.id}`);

    return { success: true, property };
  } catch (err) {
    console.error("Error updating property:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update property",
    };
  }
}

// Delete property
export async function deleteProperty(propertyId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Verify that the user owns this property
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true },
    });

    if (!existingProperty) {
      throw new Error("Property not found");
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user || existingProperty.ownerId !== user.id) {
      throw new Error("You don't have permission to delete this property");
    }

    // Delete the property and all related data
    await prisma.property.delete({
      where: { id: propertyId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Error deleting property:", err);
    return { success: false, error: "Failed to delete property" };
  }
}

export async function getPropertiesByTypeWithPagination(
  type: PropertyType,
  page: number = 1,
  limit: number = 10,
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    amenities?: string[];
  }
) {
  try {
    const skip = (page - 1) * limit;

    // Build the where clause
    let where: any = {
      type,
      isActive: true,
    };

    // Add price filter using rooms
    if (filters?.minPrice || filters?.maxPrice) {
      where.rooms = {
        some: {
          price: {
            ...(filters.minPrice && { gte: filters.minPrice }),
            ...(filters.maxPrice && { lte: filters.maxPrice }),
          },
        },
      };
    }

    // Add location filter
    if (filters?.city) {
      where.location = {
        contains: filters.city,
        mode: 'insensitive'
      };
    }

    // Add amenities filter
    if (filters?.amenities && filters.amenities.length > 0) {
      where.features = {
        hasEvery: filters.amenities
      };
    }

    // Execute queries in parallel
    const [dbProperties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          owner: {
            select: {
              name: true,
              image: true,
            },
          },
          rooms: true,
          Review: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.property.count({ where }),
    ]);

    // Transform database properties to match Property type
    const properties = dbProperties.map(prop => ({
      ...prop,
      images: [], // Initialize with empty array since we don't store images in DB yet
      owner: prop.owner || { name: '', image: null },
      rooms: prop.rooms || [],
      Review: prop.Review || []
    })) as Property[];

    // Return empty array if no properties found
    if (!properties.length) {
      return {
        properties: [],
        total: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    return {
      properties,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    // Return empty results instead of throwing
    return {
      properties: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

