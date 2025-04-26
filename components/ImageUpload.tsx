"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/utils/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    onChange: (urls: string[]) => void;
    value: string[];
    maxFiles?: number;
}

const ImageUpload = ({ onChange, value, maxFiles = 5 }: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setIsUploading(true);
        // Handle the files here
        setIsUploading(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".gif"],
        },
        maxFiles,
        disabled: isUploading || value.length >= maxFiles,
    });

    const removeImage = (index: number) => {
        const newUrls = [...value];
        newUrls.splice(index, 1);
        onChange(newUrls);
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300"
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            Drag & drop images here, or click to select files
                        </p>
                        <p className="text-xs text-gray-500">
                            Max {maxFiles} images, up to 4MB each
                        </p>
                    </div>
                )}
            </div>

            <UploadButton<OurFileRouter, "propertyImage">
                endpoint="propertyImage"
                onClientUploadComplete={(res) => {
                    if (res) {
                        const urls = res.map((file) => file.url);
                        onChange([...value, ...urls]);
                    }
                    setIsUploading(false);
                }}
                onUploadError={(error: Error) => {
                    console.error("Error uploading:", error);
                    setIsUploading(false);
                }}
                onUploadBegin={() => {
                    setIsUploading(true);
                }}
            />

            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {value.map((url, index) => (
                        <div key={url} className="relative group">
                            <div className="aspect-square relative overflow-hidden rounded-lg">
                                <Image
                                    src={url}
                                    alt={`Property image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4 text-gray-600" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload; 