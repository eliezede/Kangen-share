import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Shield, Users, Trash2, Ban, CheckCircle } from "lucide-react";
import type { User, Review } from "@shared/schema";

type ReviewWithUsers = Review & {
  reviewer: User;
  reviewee: User;
};

export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({
        title: "Unauthorized",
        description: "You don't have access to this page",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [user, authLoading, isAuthenticated, toast]);

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === "admin",
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<ReviewWithUsers[]>({
    queryKey: ["/api/admin/reviews"],
    enabled: user?.role === "admin",
  });

  const toggleUserMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/admin/users/${userId}/toggle`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User updated",
        description: "User status has been changed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      await apiRequest("DELETE", `/api/admin/reviews/${reviewId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({
        title: "Review deleted",
        description: "The review has been removed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (authLoading || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and moderate content</p>
        </div>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all users</CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} data-testid={`user-row-${u.id}`}>
                      <TableCell className="font-medium">
                        {u.firstName} {u.lastName}
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{u.city || "-"}</TableCell>
                      <TableCell>
                        {u.isActive ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserMutation.mutate({ 
                            userId: u.id, 
                            isActive: !u.isActive 
                          })}
                          disabled={toggleUserMutation.isPending || u.id === user?.id}
                          data-testid={`button-toggle-user-${u.id}`}
                        >
                          {u.isActive ? (
                            <><Ban className="w-4 h-4 mr-2" />Disable</>
                          ) : (
                            <><CheckCircle className="w-4 h-4 mr-2" />Enable</>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Moderation */}
      <Card>
        <CardHeader>
          <CardTitle>Review Moderation</CardTitle>
          <CardDescription>Manage and remove inappropriate reviews</CardDescription>
        </CardHeader>
        <CardContent>
          {reviewsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="p-4 border rounded-md flex items-start justify-between gap-4"
                  data-testid={`review-${review.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">
                        {review.reviewer.firstName} {review.reviewer.lastName}
                      </p>
                      <span className="text-muted-foreground">→</span>
                      <p className="text-muted-foreground">
                        {review.reviewee.firstName} {review.reviewee.lastName}
                      </p>
                      <Badge variant="outline">{review.rating} ★</Badge>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteReviewMutation.mutate(review.id)}
                    disabled={deleteReviewMutation.isPending}
                    data-testid={`button-delete-review-${review.id}`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews to moderate</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
