"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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
        name: user.fullName,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
        
      },
    });

    prisma.Property

    return dbUser;
  } catch (e) {
    console.log(e);
  }
  return {};
};
