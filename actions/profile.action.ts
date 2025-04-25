"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  language?: string;
  theme?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    newMessages: boolean;
    bookingUpdates: boolean;
    paymentReminders: boolean;
    promotions: boolean;
  };
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate required fields
    if (!formData.name || !formData.email) {
      return { success: false, error: "Name and email are required" };
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        address: formData.address || null,
        bio: formData.bio || null,
        language: formData.language || "English",
        theme: formData.theme || "system",
        notifications: formData.notifications ? JSON.stringify(formData.notifications) : null,
      },
    });

    // Revalidate the dashboard route to show updated data
    revalidatePath("/user-dashboard");
    revalidatePath("/user-dashboard/profile");

    return { 
      success: true, 
      message: "Profile updated successfully",
      user: {
        ...updatedUser,
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
        bio: updatedUser.bio || "",
        language: updatedUser.language || "English",
        theme: updatedUser.theme || "system",
        notifications: updatedUser.notifications ? JSON.parse(updatedUser.notifications as string) : null
      }
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { 
      success: false, 
      error: "Failed to update profile. Please try again." 
    };
  }
} 