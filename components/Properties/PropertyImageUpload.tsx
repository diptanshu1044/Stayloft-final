"use client";

import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/utils/uploadthing";
import Image from "next/image";
import { toast } from "sonner";

interface PropertyImageUploadProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

const PropertyImageUpload = ({
  images,
  onChange,
  maxFiles = 10,
}: PropertyImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const removeImage = useCallback((index: number) => {
    const newUrls = [...images];
    newUrls.splice(index, 1);
    onChange(newUrls);
  }, [images, onChange]);

  const handleUploadComplete = useCallback((res: { url: string }[]) => {
    if (res) {
      const urls = res.map((file) => file.url);
      if (images.length + urls.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        return;
      }
      onChange([...images, ...urls]);
    }
    setIsUploading(false);
  }, [images, maxFiles, onChange]);

  const handleUploadError = useCallback((error: Error) => {
    console.error("Error uploading:", error);
    toast.error("Failed to upload image. Please try again.");
    setIsUploading(false);
  }, []);

  return (
    <div className="space-y-4">
      <Label>Property Images (Max {maxFiles})</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <div key={url} className="relative group">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Image
                src={url}
                alt={`Property image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                priority={index < 4}
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => removeImage(index)}
                disabled={isUploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {images.length < maxFiles && (
          <div className="border-2 border-dashed rounded-lg flex items-center justify-center p-4 aspect-square">
            <UploadButton<OurFileRouter, "propertyImage">
              endpoint="propertyImage"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              onUploadBegin={() => setIsUploading(true)}
              config={{
                mode: "auto",
                appendOnPaste: true,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyImageUpload;
