// /pages/api/properties/nearby.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // adjust based on your setup

const EARTH_RADIUS_KM = 6371;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { lat, lng, radius = 10 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  const userLat = parseFloat(lat as string);
  const userLng = parseFloat(lng as string);
  const searchRadius = parseFloat(radius as string);

  try {
    const properties = await prisma.$queryRawUnsafe(`
      SELECT *, 
        (${EARTH_RADIUS_KM} * acos(
          cos(radians(${userLat})) * 
          cos(radians(latitude)) * 
          cos(radians(longitude) - radians(${userLng})) + 
          sin(radians(${userLat})) * 
          sin(radians(latitude))
        )) AS distance
      FROM "Property"
      HAVING distance <= ${searchRadius}
      ORDER BY distance ASC
    `);

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching nearby properties:", error);
    res.status(500).json({ error: "Failed to fetch nearby properties" });
  }
}
