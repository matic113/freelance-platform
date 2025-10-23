import React, { useState } from 'react';
import { useAdminReviews, useAdminReviewStats, useDeleteAdminReview } from '@/hooks/useAdminReviews';
import { Review } from '@/services/adminReview.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Trash2, ChevronLeft, ChevronRight, Star, Search } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const getRatingBadgeClass = (rating: number) => {
  if (rating >= 4.5) return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
  if (rating >= 3.5) return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
  if (rating >= 2.5) return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
  return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
};

export const ReviewsTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, refetch } = useAdminReviews({ page, size: pageSize });
  const { data: stats } = useAdminReviewStats();
  const deleteMutation = useDeleteAdminReview();

  const reviews = data?.content || [];
  const totalPages = data?.totalPages || 0;

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteMutation.mutateAsync(reviewId);
      toast.success('Review deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const filteredReviews = searchQuery 
    ? reviews.filter(r => 
        r.reviewerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.revieweeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : reviews;

  return (
    <Card className="w-full">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Reviews</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor and moderate platform reviews
          </p>
          {stats && (
            <div className="flex gap-4 mt-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Total:</span>{' '}
                <strong>{stats.totalReviews}</strong>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Avg Rating:</span>{' '}
                <strong className="text-blue-600">{stats.averageRating.toFixed(1)}</strong>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Low Rated:</span>{' '}
                <strong className="text-red-600">{stats.lowRatedReviews}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews by name or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Reviewer</TableHead>
                <TableHead>Reviewee</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 float-right" /></TableCell>
                  </TableRow>
                ))
              ) : filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No matching reviews found' : 'No reviews found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-muted/50">
                    <TableCell>
                      <p className="font-medium">{review.reviewerName}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{review.revieweeName}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRatingBadgeClass(review.rating)}>
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        {review.rating.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                        {review.comment || 'No comment'}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(review.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleDelete(review.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
