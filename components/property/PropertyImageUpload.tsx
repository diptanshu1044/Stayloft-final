"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import Image from "next/image";

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
            <h3 className="text-lg font-semibold">Property Images</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <Card key={index} className="relative group">
                        <div className="aspect-square relative">
                            <Image
                                src={image.url}
                                alt={`Property image ${index + 1}`}
                                fill
                                className="object-cover rounded-t-lg"
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onRemoveImage(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-2">
                            <Button
                                variant={image.isThumbnail ? "default" : "outline"}
                                className="w-full"
                                onClick={() => onSetThumbnail(index)}
                            >
                                {image.isThumbnail ? "Thumbnail" : "Set as Thumbnail"}
                            </Button>
                        </div>
                    </Card>
                ))}

                {images.length < 10 && (
                    <Card className="aspect-square relative">
                        <label
                            htmlFor="image-upload"
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        >
                            <div className="text-center">
                                <div className="text-4xl mb-2">+</div>
                                <div className="text-sm">Add Image</div>
                            </div>
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={onImageUpload}
                        />
                    </Card>
                )}
            </div>
        </div>
    );
};

export default PropertyImageUpload; 