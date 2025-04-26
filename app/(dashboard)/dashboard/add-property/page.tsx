"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import BasicPropertyDetails from "@/components/Properties/BasicPropertyDetails";
import PropertyLocation from "@/components/Properties/PropertyLocation";
import PropertyImageUpload from "@/components/Properties/PropertyImageUpload";
import PropertyAvailability from "@/components/Properties/PropertyAvailability";
import RoomDetails from "@/components/Properties/RoomDetails";
import RoomManagement from "@/components/Properties/RoomManagement";
import {
  Property,
  RoomAvailability,
  BathroomType,
  FurnishingType,
  Gender
} from "@/types";
import {
  createProperty,
  getProperty,
  updateProperty,
} from "@/actions/property.action";
import {
  PropertyType,
  TenantType,
  Features,
  RoomType,
} from "@prisma/client";

// Form schema
const formSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  type: z.enum(["FLAT", "PG", "HOSTEL"] as const),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(2, "Location is required"),
  TenantType: z.enum(["BOYS", "GIRLS", "COED"] as const),
  features: z.array(z.enum(["AC", "TV", "WIFI", "MESS", "LAUNDRY", "PARKING", "SECURITY", "IN_TIME"] as const)),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  securityDeposit: z.number().min(0),
  isActive: z.boolean().default(true),
  foodIncluded: z.boolean().default(false),
  foodPrice: z.number().nullable().optional(),
  bathroomType: z.enum(["ATTACHED", "COMMON"] as const),
  bhkType: z.string().optional(),
  furnishingType: z.enum(["FULLY_FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"] as const),
  gender: z.enum(["BOYS", "GIRLS", "COED"] as const).optional(),
  images: z.array(z.string()).default([]),
  rooms: z.array(z.object({
    type: z.enum(["SINGLE", "DOUBLE", "TRIPLE", "BHK1", "BHK2", "BHK3", "CUSTOM"] as const),
    name: z.string(),
    roomNumber: z.string().optional(),
    price: z.number(),
    capacity: z.number(),
    availableBeds: z.number(),
    isActive: z.boolean(),
    roomType: z.enum(["SINGLE", "DOUBLE", "TRIPLE", "BHK1", "BHK2", "BHK3", "CUSTOM"] as const),
    totalBeds: z.number()
  }))
});

type FormSchema = z.infer<typeof formSchema>;

// Default values for the form
const defaultValues: Partial<FormSchema> = {
  type: "PG",
  name: "",
  description: "",
  location: "",
  TenantType: "BOYS",
  features: [],
  securityDeposit: 0,
  isActive: true,
  foodIncluded: false,
  foodPrice: null,
  bathroomType: "ATTACHED",
  furnishingType: "UNFURNISHED",
  gender: undefined,
  bhkType: undefined,
  rooms: [],
  images: []
};

interface PropertyResponse {
  success: boolean;
  property: {
    id: string;
    name: string;
    type: PropertyType;
    description: string;
    location: string;
    TenantType: TenantType;
    features: Features[];
    latitude: number;
    longitude: number;
    securityDeposit: number;
    isActive: boolean;
    foodIncluded: boolean;
    foodPrice: number;
    bathroomType: BathroomType;
    bhkType: string;
    furnishingType: FurnishingType;
    gender: Gender;
    ownerId: string;
    images: string[];
    owner: { name: string; image: string | null };
    rooms: {
      id: string;
      type: RoomType;
      name: string;
      roomNumber: string | null;
      price: number;
      capacity: number;
      availableBeds: number;
      isActive: boolean;
    }[];
    Review: any[];
    createdAt: Date;
    updatedAt: Date;
  };
}

const AddEditPropertyPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [roomAvailability, setRoomAvailability] = useState<RoomAvailability[]>([]);
  const [property, setProperty] = useState<Property | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange"
  });

  const fetchProperty = useCallback(async () => {
    if (typeof params.id === 'string') {
      try {
        const response = await getProperty(params.id) as unknown as PropertyResponse;
        if (response.success && response.property) {
          const propertyData: Property = {
            id: response.property.id,
            name: response.property.name,
            type: response.property.type,
            description: response.property.description,
            location: response.property.location,
            TenantType: response.property.TenantType,
            features: response.property.features,
            latitude: response.property.latitude,
            longitude: response.property.longitude,
            securityDeposit: response.property.securityDeposit,
            isActive: response.property.isActive,
            foodIncluded: response.property.foodIncluded,
            foodPrice: response.property.foodPrice,
            bathroomType: response.property.bathroomType as BathroomType,
            bhkType: response.property.bhkType,
            furnishingType: response.property.furnishingType as FurnishingType,
            gender: response.property.gender as Gender,
            ownerId: response.property.ownerId,
            images: response.property.images || [],
            owner: response.property.owner || { name: '', image: null },
            rooms: response.property.rooms.map(room => ({
              id: room.id,
              type: room.type,
              name: room.name,
              roomNumber: room.roomNumber || null,
              price: room.price,
              capacity: room.capacity,
              availableBeds: room.availableBeds,
              isActive: room.isActive
            })),
            Review: response.property.Review || [],
            createdAt: response.property.createdAt,
            updatedAt: response.property.updatedAt
          };

          setProperty(propertyData);
          if (Array.isArray(propertyData.images)) {
            setImages(propertyData.images);
          } else {
            setImages([]);
          }

          form.reset({
            type: propertyData.type,
            name: propertyData.name,
            description: propertyData.description || "",
            location: propertyData.location,
            TenantType: propertyData.TenantType,
            features: propertyData.features,
            latitude: propertyData.latitude ?? null,
            longitude: propertyData.longitude ?? null,
            securityDeposit: propertyData.securityDeposit,
            isActive: propertyData.isActive,
            foodIncluded: propertyData.foodIncluded,
            foodPrice: propertyData.foodPrice,
            bathroomType: propertyData.bathroomType as BathroomType,
            furnishingType: propertyData.furnishingType as FurnishingType,
            gender: propertyData.gender as Gender,
            bhkType: propertyData.bhkType || undefined,
            rooms: propertyData.rooms.map(room => ({
              id: room.id,
              type: room.type,
              name: room.name,
              roomNumber: room.roomNumber || undefined,
              price: room.price,
              capacity: room.capacity,
              availableBeds: room.availableBeds,
              isActive: room.isActive,
              roomType: room.type,
              totalBeds: room.capacity
            })),
            images: propertyData.images || []
          });
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to fetch property details");
      }
    }
  }, [params.id, form]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const handleRoomUpdate = useCallback((updatedRooms: RoomAvailability[]) => {
    setRoomAvailability(updatedRooms);
    form.setValue("rooms", updatedRooms.map((room) => ({
      name: `${room.roomType} Room`,
      roomNumber: `${room.roomType}-${room.totalBeds}`,
      type: room.roomType,
      price: room.totalBeds * 1000, // Default price calculation
      capacity: room.totalBeds,
      availableBeds: room.availableBeds,
      isActive: room.isActive,
      roomType: room.roomType,
      totalBeds: room.totalBeds
    })));
  }, [form]);

  const onSubmit = useCallback(async (values: FormSchema) => {
    try {
      setLoading(true);

      const propertyData = {
        name: values.name,
        type: values.type,
        description: values.description,
        location: values.location,
        TenantType: values.TenantType,
        features: values.features,
        latitude: values.latitude ?? undefined,
        longitude: values.longitude ?? undefined,
        securityDeposit: values.securityDeposit,
        isActive: values.isActive,
        foodIncluded: values.foodIncluded,
        foodPrice: values.foodPrice ?? undefined,
        bathroomType: values.bathroomType,
        bhkType: values.bhkType,
        furnishingType: values.furnishingType,
        gender: values.gender,
        images: values.images,
        rooms: values.rooms.map((room) => ({
          name: room.name,
          roomNumber: room.roomNumber,
          type: room.type,
          price: room.price,
          capacity: room.capacity,
          availableBeds: room.availableBeds,
          isActive: room.isActive
        }))
      };

      if (isEditing && id) {
        const result = await updateProperty(id, propertyData);
        if (result.success) {
          toast.success("Property updated successfully");
          // Optimistic update
          if (result.property) {
            setProperty(result.property);
            router.refresh(); // Refresh the page data
          }
        } else {
          toast.error(result.error || "Failed to update property");
        }
      } else {
        const result = await createProperty(propertyData);
        if (result.success) {
          toast.success("Property created successfully");
          // Optimistic update
          if (result.property) {
            router.refresh(); // Refresh the page data
            router.push(`/property/${result.property.id}`); // Redirect to the new property page
          }
        } else {
          toast.error(result.error || "Failed to create property");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form");
    } finally {
      setLoading(false);
    }
  }, [isEditing, id, router, setProperty]);

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Property" : "Add New Property"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicPropertyDetails form={form} />
              <PropertyLocation form={form} />
              <PropertyImageUpload
                images={images}
                onChange={setImages}
                maxFiles={10}
              />
              <PropertyAvailability form={form} />
              <RoomDetails form={form} />
              <RoomManagement
                propertyType={form.watch("type")}
                roomAvailability={roomAvailability}
                onUpdate={handleRoomUpdate}
              />
              <CardFooter className="flex justify-end gap-4 px-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEditing ? "Update Property" : "Create Property"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditPropertyPage;
