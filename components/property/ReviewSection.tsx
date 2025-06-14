"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Star, StarHalf, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createReview, getPropertyReviews, getPropertyRating } from "@/actions/review.action";
import { format } from "date-fns";
import { toast } from "sonner";
import { Role } from "@prisma/client";

interface ReviewSectionProps {
    propertyId: string;
}

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
        name: string;
        image: string | null;
        role: Role;
    };
    isTenantReview: boolean;
}

export default function ReviewSection({ propertyId }: ReviewSectionProps) {
    const { user, isSignedIn } = useUser();
    const [tenantReviews, setTenantReviews] = useState<Review[]>([]);
    const [generalReviews, setGeneralReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [tenantAverageRating, setTenantAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [totalTenantReviews, setTotalTenantReviews] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [comment, setComment] = useState("");
    const [optimisticReview, setOptimisticReview] = useState<Review | null>(null);

    useEffect(() => {
        fetchReviews();
        fetchRating();
    }, [propertyId]);

    const fetchReviews = async () => {
        const result = await getPropertyReviews(propertyId);
        if (result.success) {
            setTenantReviews((result.tenantReviews || []) as unknown as Review[]);
            setGeneralReviews((result.generalReviews || []) as unknown as Review[]);
            setOptimisticReview(null); // Clear optimistic review after real data arrives
        }
    };

    const fetchRating = async () => {
        const result = await getPropertyRating(propertyId);
        if (result.success) {
            setAverageRating(result.averageRating || 0);
            setTenantAverageRating(result.tenantAverageRating || 0);
            setTotalReviews(result.totalReviews || 0);
            setTotalTenantReviews(result.totalTenantReviews || 0);
        }
    };

    const handleSubmitReview = async () => {
        if (!isSignedIn || !user) {
            toast.error("Please sign in to submit a review");
            return;
        }

        if (userRating === 0) {
            toast.error("Please select a rating");
            return;
        }

        // Create optimistic review
        const tempReview: Review = {
            id: 'temp-' + Date.now(),
            rating: userRating,
            comment: comment.trim() || null,
            createdAt: new Date(),
            user: {
                name: user.fullName || '',
                image: user.imageUrl || null,
                role: 'TENANT' as Role,
            },
            isTenantReview: false, // Will be determined by server
        };

        setOptimisticReview(tempReview);
        setShowReviewForm(false);

        setIsSubmitting(true);
        try {
            const result = await createReview(propertyId, {
                rating: userRating,
                comment: comment.trim() || undefined,
            });

            if (result.success) {
                toast.success("Review submitted successfully");
                setUserRating(0);
                setComment("");
                // Fetch updated reviews and ratings
                await Promise.all([
                    fetchReviews(),
                    fetchRating()
                ]);
            } else {
                toast.error(result.error || "Failed to submit review");
                setOptimisticReview(null); // Remove optimistic review on error
            }
        } catch (error) {
            toast.error("An error occurred while submitting your review");
            setOptimisticReview(null); // Remove optimistic review on error
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <StarHalf key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            );
        }

        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(
                <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
            );
        }

        return stars;
    };

    const ReviewList = ({ reviews, isTenantSection = false }: { reviews: Review[], isTenantSection?: boolean }) => (
        <div className="space-y-4">
            {/* Show optimistic review at the top if it exists and matches the section type */}
            {optimisticReview && !isTenantSection && (
                <div key={optimisticReview.id} className="border rounded-lg p-4 bg-blue-50 animate-pulse">
                    <div className="flex items-center gap-3 mb-2">
                        {optimisticReview.user.image ? (
                            <Image
                                src={optimisticReview.user.image}
                                alt={optimisticReview.user.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-500 font-medium">
                                    {optimisticReview.user.name.charAt(0)}
                                </span>
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">{optimisticReview.user.name}</p>
                                <span className="text-sm text-blue-600">(Submitting...)</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                Just now
                            </p>
                        </div>
                    </div>
                    <div className="flex mb-2">{renderStars(optimisticReview.rating)}</div>
                    {optimisticReview.comment && (
                        <p className="text-gray-700">{optimisticReview.comment}</p>
                    )}
                </div>
            )}

            {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        {review.user.image ? (
                            <Image
                                src={review.user.image}
                                alt={review.user.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-500 font-medium">
                                    {review.user.name.charAt(0)}
                                </span>
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">{review.user.name}</p>
                                {review.isTenantReview && (
                                    <div className="flex items-center" title="Verified Tenant">
                                        <Shield className="h-4 w-4 text-primary" />
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">
                                {format(new Date(review.createdAt), "MMM d, yyyy")}
                            </p>
                        </div>
                    </div>
                    <div className="flex mb-2">{renderStars(review.rating)}</div>
                    {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                    )}
                </div>
            ))}
            {reviews.length === 0 && !optimisticReview && (
                <p className="text-center text-gray-500 py-4">
                    {isTenantSection
                        ? "No tenant reviews yet."
                        : "No reviews yet. Be the first to review this property!"
                    }
                </p>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(averageRating)}</div>
                        <span className="text-lg font-medium">
                            {averageRating.toFixed(1)} ({totalReviews} {optimisticReview ? "+ 1 pending" : ""} reviews)
                        </span>
                    </div>
                    {totalTenantReviews > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Shield className="h-4 w-4" />
                            <span>
                                {tenantAverageRating.toFixed(1)} from {totalTenantReviews} verified {totalTenantReviews === 1 ? 'tenant' : 'tenants'}
                            </span>
                        </div>
                    )}
                </div>
                <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                    <DialogTrigger asChild>
                        <Button disabled={isSubmitting}>Write a Review</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setUserRating(rating)}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`h-8 w-8 ${rating <= userRating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
                                <Textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience..."
                                    rows={4}
                                />
                            </div>
                            <Button
                                onClick={handleSubmitReview}
                                disabled={isSubmitting || userRating === 0}
                                className="w-full"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {tenantReviews.length > 0 && (
                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Verified Tenant Reviews
                    </h3>
                    <ReviewList reviews={tenantReviews} isTenantSection={true} />
                </div>
            )}

            <div className={tenantReviews.length > 0 ? "border-t pt-6" : ""}>
                <h3 className="text-lg font-semibold mb-4">
                    {tenantReviews.length > 0 ? "Other Reviews" : "All Reviews"}
                </h3>
                <ReviewList reviews={generalReviews} />
            </div>
        </div>
    );
} 