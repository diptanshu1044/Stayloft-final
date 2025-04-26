"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import BasicPropertyDetails from "@/components/property/BasicPropertyDetails";
import PropertyLocation from "@/components/property/PropertyLocation";
import PropertyImageUpload from "@/components/property/PropertyImageUpload";
import PropertyAvailability from "@/components/property/PropertyAvailability";
import RoomDetails from "@/components/property/RoomDetails";
import RoomManagement from "@/components/property/RoomManagement";
import { PropertyType, TenantType, Features } from "@prisma/client";

const formSchema = z.object({
    name: z.string().min(5, { message: "Name must be at least 5 characters" }),
    type: z.enum(["FLAT", "PG", "HOSTEL"]),
    description: z.string().min(20, { message: "Description must be at least 20 characters" }),
    location: z.string().min(2, { message: "Location is required" }),
    TenantType: z.enum(["FAMILY", "BACHELOR", "BOTH"]),
    rooms: z.array(z.object({
        type: z.string(),
        name: z.string(),
        isActive: z.boolean(),
        price: z.number(),
        capacity: z.number(),
        availableBeds: z.number(),
        roomNumber: z.string().optional()
    })).optional(),
    features: z.array(z.nativeEnum(Features)),
    bookings: z.array(z.any()).optional(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    securityDeposit: z.number().min(0),
    isActive: z.boolean().default(true),
    foodIncluded: z.boolean().default(false),
    foodPrice: z.number().nullable(),
    bathroomType: z.string(),
    bhkType: z.string().nullable(),
    furnishingType: z.string(),
    gender: z.string(),
    ownerId: z.string(),
    owner: z.object({
        name: z.string(),
        image: z.string().nullable()
    }).optional(),
    Review: z.array(z.object({
        id: z.string(),
        rating: z.number(),
        comment: z.string().nullable()
    })).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    images: z.array(z.object({
        url: z.string(),
        isThumbnail: z.boolean().default(false)
    })).default([])
});

const AddEditPropertyPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<{ url: string; isThumbnail: boolean }[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "FLAT",
            description: "",
            location: "",
            TenantType: "BOTH",
            rooms: [],
            features: [],
            bookings: [],
            latitude: null,
            longitude: null,
            securityDeposit: 0,
            isActive: true,
            foodIncluded: false,
            foodPrice: null,
            bathroomType: "ATTACHED",
            bhkType: null,
            furnishingType: "UNFURNISHED",
            gender: "COED",
            ownerId: "", // This should be set from the logged-in user
            images: []
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        const formData = {
            ...values,
            images,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        try {
            // TODO: Implement API call to save property
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
            toast.success("Property added successfully!");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to add property");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Add New Property
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <BasicPropertyDetails form={form} />
                                <PropertyLocation form={form} />
                                <RoomDetails form={form} />
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
                                        {loading ? (
                                            <span>Saving...</span>
                                        ) : (
                                            <span>Add Property</span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default AddEditPropertyPage; 