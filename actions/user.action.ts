"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const syncUser = async () => {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!(userId && user)) return null;

    const existingUser = await prisma?.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma?.user.create({
      data: {
        clerkId: userId,
        name: user && user.fullName ? user.fullName : "",
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (e) {
    console.log(e);
  }
  return {};
};

export async function getUserRole() {
  try {
    const { userId } = await auth();
    if (!userId) return { role: "" };

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    return { role: user?.role || "NONE" };
  } catch (err) {
    console.log(err);
    return { role: "" };
  }
}

export async function updateUserRole(newRole: "TENANT" | "OWNER") {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.user.update({
      where: { clerkId: userId },
      data: { role: newRole },
    });

    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
}
