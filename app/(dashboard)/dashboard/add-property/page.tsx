"use client";

import { useEffect, useState } from "react";
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
import { mockFlats, mockPGs, mockHostels } from "@/lib/MockData";
import { toast } from "sonner";
import BasicPropertyDetails from "@/components/Properties/BasicPropertyDetails";
import PropertyLocation from "@/components/Properties/PropertyLocation";
import PropertyImageUpload from "@/components/Properties/PropertyImageUpload";
import PropertyAvailability from "@/components/Properties/PropertyAvailability";
import RoomDetails from "@/components/Properties/RoomDetails";
import RoomManagement from "@/components/Properties/RoomManagement";
import { Property, PropertyLocation as PropertyLocationType, PropertyType, Amenity, RoomAvailability } from "@/types";

// Update the amenities enum to match the type definition
const amenityEnum = z.enum([
  "WIFI",
  "AC",
  "PARKING",
  "LAUNDRY",
  "TV",
  "FRIDGE",
  "KITCHEN",
  "SECURITY",
  "GYM",
  "SWIMMING_POOL",
  "POWER_BACKUP",
  "STUDY_TABLE",
  "LIFT",
  "CCTV",
  "FOOD",
  "CLEANING",
  "ATTACHED_BATHROOM",
  "GEYSER",
  "FURNISHED",
  "WASHING_MACHINE",
]);

// Update gender enum to match the type definition
const genderEnum = z.enum(["MALE", "FEMALE", "UNISEX", "COED"]);

// Update furnishing type enum to match the type definition
const furnishingTypeEnum = z.enum(["FULLY_FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"]);

const formSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  type: z.enum(["FLAT", "PG", "HOSTEL"]) as z.ZodType<PropertyType>,
  location: z.object({
    street: z.string().optional(),
    city: z.string().min(2),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    area: z.string().optional(),
    address: z.string().optional(),
    pincode: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }) as z.ZodType<PropertyLocationType>,
  price: z.number().min(0),
  images: z
    .array(
      z.object({ url: z.string(), isThumbnail: z.boolean().default(false) }),
    )
    .default([]),
  amenities: z
    .array(amenityEnum)
    .default([]),
  isActive: z.boolean().default(true),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  area: z.string().optional(), // Changed from number to string to match Property type
  furnishingType: furnishingTypeEnum.optional(),
  gender: genderEnum.optional(),
  totalBeds: z.number().optional(),
  ratings: z.number().optional(),
  numReviews: z.number().optional(),
  rules: z.array(z.string()).optional(),
  securityDeposit: z.number().min(0).optional(),
  availableFrom: z.coerce.date().optional(),
  
  // Additional fields for form functionality (not in Property type)
  totalRooms: z.number().min(1),
  occupancyTypes: z.array(z.string()).min(1),
  prices: z.record(z.string(), z.number().min(0)),
  bathroomType: z.enum(["attached", "common"]),
  bhkType: z.string().optional(),
  depositType: z.enum(["amount", "percentage"]),
  hasBalcony: z.boolean().default(false),
  hasAC: z.boolean().default(false),
  foodIncluded: z.boolean().default(false),
  foodPrice: z.number().optional(),
  roomAvailability: z
    .array(
      z.object({
        roomType: z.string(),
        totalBeds: z.number().min(1),
        availableBeds: z.number().min(0),
        isActive: z.boolean(),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddEditPropertyPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<FormValues["images"]>([]);
  const [roomAvailability, setRoomAvailability] = useState<RoomAvailability[]>(
    [],
  );

  const allProperties: Property[] = [...mockFlats, ...mockPGs, ...mockHostels];
  const property = id ? allProperties.find((prop) => prop.id === id) : null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      type: property?.type || "FLAT",
      location: {
        city: property?.location.city || "",
        area: property?.location.area || "",
      },
      price: property?.price || 0,
      totalRooms: property?.totalBeds || 1, // Map totalBeds to totalRooms for PG/Hostel
      bedrooms: property?.bedrooms || 1, // For flats
      bathrooms: property?.bathrooms || 1, // For flats
      area: property?.area || "",
      furnishingType: property?.furnishingType || undefined,
      gender: property?.gender || "COED",
      totalBeds: property?.totalBeds || 0,
      occupancyTypes: property?.totalBeds ? ["Single"] : [], // Default occupancy type
      prices: {}, // Will be filled based on occupancy types
      bathroomType: "attached", // Default
      bhkType: property?.bedrooms ? `${property.bedrooms}` : "1", // For flats
      securityDeposit: property?.securityDeposit || 0,
      depositType: "amount", // Default
      hasBalcony: false, // Default
      hasAC: false, // Default
      foodIncluded: false, // Default
      foodPrice: 0, // Default
      isActive: property?.isActive ?? true,
      amenities: property?.amenities || [],
      images: property?.images || [],
      roomAvailability: [],
      availableFrom: property?.availableFrom || new Date(),
      ratings: property?.ratings || 0,
      numReviews: property?.numReviews || 0,
      rules: property?.rules || [],
    },
  });

  useEffect(() => {
    if (property) {
      setImages(property.images || []);
      // Convert property data to roomAvailability format if it's a PG/HOSTEL
      if (property.type === "PG" || property.type === "HOSTEL") {
        // Create a basic room availability entry based on property data
        setRoomAvailability([
          {
            roomType: "Single",
            totalBeds: property.totalBeds || 0,
            availableBeds: property.totalBeds || 0,
            isActive: true
          }
        ]);
      }
    }
  }, [property]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const occupancyTypes = value.occupancyTypes || [];
      const existingRoomMap = roomAvailability.reduce(
        (acc, room) => {
          acc[room.roomType] = room;
          return acc;
        },
        {} as Record<string, RoomAvailability>,
      );

      const newRoomAvailability = occupancyTypes.map(
        (type) =>
          existingRoomMap[type] || {
            roomType: type,
            totalBeds: 1,
            availableBeds: 1,
            isActive: true,
          },
      );

      setRoomAvailability(newRoomAvailability);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, roomAvailability]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setImages((prev) => [...prev, { url, isThumbnail: prev.length === 0 }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      if (prev[index].isThumbnail && newImages.length > 0) {
        newImages[0].isThumbnail = true;
      }
      return newImages;
    });
  };

  const setThumbnail = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isThumbnail: i === index,
      })),
    );
  };

  const handleRoomUpdate = (updatedRooms: RoomAvailability[]) => {
    setRoomAvailability(updatedRooms);
  };

  const onSubmit = (values: FormValues) => {
    setLoading(true);

    // Transform form data to match the Property type
    const propertyData: Partial<Property> = {
      title: values.title,
      description: values.description,
      type: values.type,
      location: values.location as PropertyLocationType,
      price: values.price,
      images: values.images,
      amenities: values.amenities as Amenity[],
      isActive: values.isActive,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      area: values.area,
      furnishingType: values.furnishingType,
      gender: values.gender,
      totalBeds: values.totalBeds,
      ratings: values.ratings,
      numReviews: values.numReviews,
      rules: values.rules,
      securityDeposit: values.securityDeposit,
      availableFrom: values.availableFrom,
      // These fields would be set by the backend
      id: property?.id || '',
      ownerId: property?.ownerId || 'current-user-id',
      createdAt: property?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    // In a real app, you would send this to an API
    console.log('Property data to submit:', propertyData);

    setTimeout(() => {
      setLoading(false);
      toast.success(
        isEditing
          ? "Property updated successfully!"
          : "Property added successfully!",
      );
      router.push("/dashboard");
    }, 1000);
  };

  if (isEditing && !property) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Property Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>Sorry, we couldn't find the property you're looking for.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isEditing ? "Edit Property" : "Add New Property"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BasicPropertyDetails form={form} />
              <PropertyLocation form={form} />
              <RoomDetails form={form} />
              {form.watch("occupancyTypes")?.length > 0 && (
                <RoomManagement
                  roomAvailability={roomAvailability}
                  onRoomUpdate={handleRoomUpdate}
                />
              )}
              <PropertyImageUpload
                images={images}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                onSetThumbnail={setThumbnail}
              />
              <PropertyAvailability form={form} />
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : isEditing
                      ? "Update Property"
                      : "Add Property"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditPropertyPage;
