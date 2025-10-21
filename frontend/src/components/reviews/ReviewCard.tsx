import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  Calendar
} from 'lucide-react';
import type { ReviewResponse } from '@/types/api';
import { cn } from '@/lib/utils';

type Review = ReviewResponse & { type: 'client_to_freelancer' | 'freelancer_to_client' };

interface ReviewCardProps {
  review: Review;
  reviewerName: string;
  reviewerAvatar?: string;
  isRTL?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  reviewerName,
  reviewerAvatar,
  isRTL = false
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          "h-4 w-4",
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        )}
      />
    ));
  };

  const getReviewTypeText = (type: string) => {
    return type === 'client_to_freelancer' 
      ? (isRTL ? 'تقييم العميل للمستقل' : 'Client to Freelancer')
      : (isRTL ? 'تقييم المستقل للعميل' : 'Freelancer to Client');
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.reviewerProfilePicture || reviewerAvatar} alt={reviewerName} />
            <AvatarFallback className="bg-[#0A2540] text-white">
              {reviewerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
           <div className="flex-1">
             <div className="flex items-center justify-between mb-1">
               <CardTitle className="text-base font-semibold text-[#0A2540]">
                 {reviewerName}
               </CardTitle>
               <Badge variant="outline" className="text-xs">
                 {getReviewTypeText(review.type)}
               </Badge>
             </div>
             
             <div className="flex items-center gap-2 mb-2">
               <div className="flex items-center gap-1">
                 {renderStars(review.rating)}
               </div>
               <span className="text-sm text-gray-600">
                 {review.rating}/5
               </span>
             </div>

             {review.projectName && (
               <div className="flex items-center gap-2 flex-wrap mb-2">
                 <span className="text-xs text-gray-600 font-medium">
                   {review.projectName}
                 </span>
                 {review.projectCategory && (
                   <Badge variant="secondary" className="text-xs">
                     {review.projectCategory}
                   </Badge>
                 )}
               </div>
             )}
             
             <div className="flex items-center gap-2 text-xs text-gray-500">
               <Calendar className="h-3 w-3" />
               <span>
                 {new Date(review.createdAt).toLocaleDateString()}
               </span>
             </div>
           </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {review.comment && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isRTL ? 'التعليق' : 'Comment'}
            </Label>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
              {review.comment}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ReviewFormProps {
  contractId: string;
  reviewerId: string;
  revieweeId: string;
  reviewType: 'client_to_freelancer' | 'freelancer_to_client';
  revieweeName: string;
  isRTL?: boolean;
  onSubmit?: (review: { contractId: string; rating: number; comment: string }) => void;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  contractId,
  reviewerId,
  revieweeId,
  reviewType,
  revieweeName,
  isRTL = false,
  onSubmit,
  onCancel
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const isCommentValid = comment.trim().length >= 10;
  const canSubmit = rating > 0 && isCommentValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSubmit?.({
        contractId,
        rating,
        comment: comment.trim()
      });
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        className="focus:outline-none"
        onClick={() => setRating(index + 1)}
        onMouseEnter={() => setHoveredRating(index + 1)}
        onMouseLeave={() => setHoveredRating(0)}
      >
        <Star
          className={cn(
            "h-8 w-8 transition-colors",
            (hoveredRating > index || rating > index)
              ? "text-yellow-400 fill-current"
              : "text-gray-300 hover:text-yellow-300"
          )}
        />
      </button>
    ));
  };

  const getRatingText = (rating: number) => {
    const ratingTexts = {
      1: isRTL ? 'سيء جداً' : 'Very Poor',
      2: isRTL ? 'سيء' : 'Poor',
      3: isRTL ? 'متوسط' : 'Average',
      4: isRTL ? 'جيد' : 'Good',
      5: isRTL ? 'ممتاز' : 'Excellent'
    };
    return ratingTexts[rating as keyof typeof ratingTexts] || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          {isRTL ? 'تقييم' : 'Review'}
        </CardTitle>
        <CardDescription>
          {isRTL 
            ? `قم بتقييم ${revieweeName}`
            : `Rate ${revieweeName}`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              {isRTL ? 'التقييم' : 'Rating'}
            </Label>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {renderStars()}
              </div>
              
              {rating > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    {rating}/5
                  </span>
                  <span className="ml-2">
                    {getRatingText(rating)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">
              {isRTL ? 'التعليق (حد أدنى 10 أحرف)' : 'Comment (min 10 characters)'}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isRTL 
                ? 'شارك تجربتك مع هذا المستقل/العميل...'
                : 'Share your experience with this freelancer/client...'
              }
              rows={4}
            />
            <div className={cn("text-xs", isCommentValid ? "text-gray-500" : "text-red-600")}> 
              {isRTL 
                ? `${comment.trim().length}/10 أحرف` 
                : `${comment.trim().length}/10 characters`}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="bg-[#0A2540] hover:bg-[#142b52] flex-1"
              disabled={!canSubmit}
            >
              <Star className="h-4 w-4 mr-2" />
              {isRTL ? 'إرسال التقييم' : 'Submit Review'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

interface ReviewsSummaryProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  isRTL?: boolean;
}

export const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({
  reviews,
  averageRating,
  totalReviews,
  isRTL = false
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          "h-5 w-5",
          index < Math.round(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        )}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          {isRTL ? 'التقييمات والمراجعات' : 'Reviews & Ratings'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-[#0A2540]">
            {averageRating.toFixed(1)}
          </div>
          
          <div className="flex items-center justify-center gap-1">
            {renderStars(averageRating)}
          </div>
          
          <div className="text-sm text-gray-600">
            {totalReviews} {isRTL ? 'تقييم' : 'reviews'}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            {isRTL ? 'توزيع التقييمات' : 'Rating Distribution'}
          </Label>
          
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm text-gray-600">{star}</span>
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
              </div>
              
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${totalReviews > 0 ? ((distribution[star] || 0) / totalReviews) * 100 : 0}%`
                  }}
                />
              </div>
              
              <span className="text-sm text-gray-600 w-8 text-right">
                {distribution[star] || 0}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
