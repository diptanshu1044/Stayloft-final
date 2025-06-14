"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

// Create a new review
export async function createReview(propertyId: string, data: { rating: number; comment?: string }) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: {
                id: true,
                role: true,
                booking: {
                    select: {
                        propertyId: true,
                    },
                },
            },
        });

        if (!user) throw new Error("User not found");

        // Check if user is a tenant who has booked this property
        const hasTenantBooking = user.booking && user.booking.propertyId === propertyId;
        const isTenantReview = user.role === "TENANT" && hasTenantBooking;

        // Check if user has already reviewed this property
        const existingReview = await prisma.review.findFirst({
            where: {
                propertyId,
                userId: user.id,
            },
        });

        if (existingReview) {
            // Update existing review
            const review = await prisma.review.update({
                where: { id: existingReview.id },
                data: {
                    rating: data.rating,
                    comment: data.comment,
                    isTenantReview,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                            role: true,
                        },
                    },
                },
            });

            revalidatePath(`/property/${propertyId}`);
            return { success: true, review };
        }

        // Create new review
        const review = await prisma.review.create({
            data: {
                rating: data.rating,
                comment: data.comment,
                propertyId,
                userId: user.id,
                isTenantReview,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        role: true,
                    },
                },
            },
        });

        revalidatePath(`/property/${propertyId}`);
        return { success: true, review };
    } catch (error) {
        console.error("Error creating review:", error);
        return { success: false, error: "Failed to create review" };
    }
}

// Get reviews for a property
export async function getPropertyReviews(propertyId: string) {
    try {
        const reviews = await prisma.review.findMany({
            where: { propertyId },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Separate tenant and general reviews
        const tenantReviews = reviews.filter(review => review.isTenantReview);
        const generalReviews = reviews.filter(review => !review.isTenantReview);

        return {
            success: true,
            tenantReviews,
            generalReviews,
            reviews
        };
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { success: false, error: "Failed to fetch reviews" };
    }
}

// Get average rating for a property
export async function getPropertyRating(propertyId: string) {
    try {
        const [allReviews, tenantReviews] = await Promise.all([
            prisma.review.findMany({
                where: { propertyId },
                select: { rating: true },
            }),
            prisma.review.findMany({
                where: {
                    propertyId,
                    isTenantReview: true
                },
                select: { rating: true },
            }),
        ]);

        const calculateAverage = (reviews: { rating: number }[]) => {
            if (reviews.length === 0) return 0;
            return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        };

        return {
            success: true,
            averageRating: calculateAverage(allReviews),
            tenantAverageRating: calculateAverage(tenantReviews),
            totalReviews: allReviews.length,
            totalTenantReviews: tenantReviews.length,
        };
    } catch (error) {
        console.error("Error calculating rating:", error);
        return { success: false, error: "Failed to calculate rating" };
    }
} 