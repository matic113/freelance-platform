import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReviewOpportunity } from '@/hooks/useReviewOpportunities';

interface ReviewPromptProps {
  opportunity: ReviewOpportunity;
  onDismiss?: () => void;
  className?: string;
}

export const ReviewPrompt: React.FC<ReviewPromptProps> = ({
  opportunity,
  onDismiss,
  className = ''
}) => {
  const daysAgo = opportunity.createdAt
    ? Math.floor((Date.now() - new Date(opportunity.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Card className={`border-l-4 border-l-warning bg-gradient-to-r from-warning/5 to-transparent ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <div>
              <CardTitle className="text-lg">Review Pending</CardTitle>
              <CardDescription className="text-sm">
                {daysAgo === 0
                  ? 'Just completed'
                  : daysAgo === 1
                    ? '1 day ago'
                    : `${daysAgo} days ago`}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-white">
            <Star className="w-3 h-3 mr-1" />
            Rate {opportunity.revieweeName}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You completed <strong>{opportunity.projectTitle}</strong> with {' '}
          <strong>{opportunity.revieweeName}</strong>. Share your feedback to help the community.
        </p>

        <div className="flex items-center space-x-2">
          <div className="flex-1 text-xs text-muted-foreground">
            Your honest review helps maintain a trustworthy platform
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link to={`/reviews/contract/${opportunity.contractId}`} className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Star className="w-4 h-4 mr-2" />
              Leave a Review
            </Button>
          </Link>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              Later
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ReviewPromptsListProps {
  opportunities: ReviewOpportunity[];
  onDismiss?: (id: string) => void;
  className?: string;
}

export const ReviewPromptsList: React.FC<ReviewPromptsListProps> = ({
  opportunities,
  onDismiss,
  className = ''
}) => {
  if (!opportunities || opportunities.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {opportunities.slice(0, 3).map((opportunity) => (
        <ReviewPrompt
          key={opportunity.id}
          opportunity={opportunity}
          onDismiss={() => onDismiss?.(opportunity.id)}
        />
      ))}
      {opportunities.length > 3 && (
        <Link to="/reviews/pending">
          <Button variant="outline" className="w-full">
            View all {opportunities.length} pending reviews
          </Button>
        </Link>
      )}
    </div>
  );
};
