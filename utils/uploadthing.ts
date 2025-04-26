import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
    propertyImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");

            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            try {
                // You can add additional processing here if needed
                console.log("Upload complete for userId:", metadata.userId);
                return { success: true, url: file.url };
            } catch (error) {
                console.error("Error processing upload:", error);
                throw new Error("Failed to process upload");
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 