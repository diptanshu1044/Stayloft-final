import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ status: 401, error: "Unauthorized" });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return NextResponse.json({ status: 200, user });
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ status: 401, error: "Unauthorized" });

  try {
    const body = await request.json();
    const { name, email, phone, address, bio, language } = body;

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        name,
        email,
        phone,
        address,
        bio,
        language
      },
    });

    return NextResponse.json({ status: 200, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ status: 500, error: "Failed to update user" });
  }
}
