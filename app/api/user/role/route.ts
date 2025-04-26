// app/api/user/role/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ role: "" });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    return NextResponse.json({ role: user?.role || "NONE" });
  } catch (err) {
    console.error("Error in /api/user/role:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
