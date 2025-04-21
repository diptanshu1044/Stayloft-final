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
