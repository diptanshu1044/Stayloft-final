"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, Trash2, Star } from "lucide-react";

interface PropertyImageUploadProps {
  images: { url: string; isThumbnail: boolean }[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetThumbnail: (index: number) => void;
}

const PropertyImageUpload = ({
  images,
  onImageUpload,
  onRemoveImage,
  onSetThumbnail,
}: PropertyImageUploadProps) => {
  return (
    <div className="space-y-4">
      <Label>Property Images (Max 10)</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.url}
              alt={`Property ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => onRemoveImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant={image.isThumbnail ? "default" : "secondary"}
                size="icon"
                type="button"
                onClick={() => onSetThumbnail(index)}
              >
                <Star className="h-4 w-4" />
              </Button>
            </div>
            {image.isThumbnail && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Thumbnail
              </div>
            )}
          </div>
        ))}
        {images.length < 10 && (
          <div className="border-2 border-dashed rounded-lg flex items-center justify-center p-4 h-32">
            <label className="cursor-pointer text-center">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={onImageUpload}
              />
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="text-sm text-gray-500">Add Images</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyImageUpload;
