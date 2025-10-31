import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Star, MapPin, Calendar, UserPlus, UserCheck, MessageCircle, Edit } from "lucide-react";
import type { User, Review } from "@shared/schema";
import { Link } from "wouter";

type ReviewWithUser = Review & {
  reviewer: User;
};

export default function Profile() {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const profileUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: profileUser, isLoading: profileLoading } = useQuery<User>({
    queryKey: ["/api/users", profileUserId],
    enabled: !!profileUserId,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<ReviewWithUser[]>({
    queryKey: ["/api/reviews/user", profileUserId],
    enabled: !!profileUserId,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { role?: string; bio?: string; city?: string }) => {
      await apiRequest("PATCH", "/api/users/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", profileUserId] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({
      role: formData.get("role") as string || undefined,
      bio: formData.get("bio") as string || undefined,
      city: formData.get("city") as string || undefined,
    });
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  if (authLoading || profileLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profileUser.profileImageUrl || undefined} alt={profileUser.firstName || "User"} />
              <AvatarFallback className="text-3xl">
                {getInitials(profileUser.firstName, profileUser.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2" data-testid="text-profile-name">
                    {profileUser.firstName} {profileUser.lastName}
                  </h1>
                  <div className="flex flex-wrap gap-3 mb-2">
                    <Badge variant="secondary" className="capitalize">
                      {profileUser.role}
                    </Badge>
                    {profileUser.city && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{profileUser.city}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">
                      {profileUser.rating ? profileUser.rating.toFixed(1) : "New"}
                    </span>
                    {profileUser.reviewCount > 0 && (
                      <span className="text-sm text-muted-foreground">
                        ({profileUser.reviewCount} {profileUser.reviewCount === 1 ? "review" : "reviews"})
                      </span>
                    )}
                  </div>
                </div>
                {!isOwnProfile && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="default" size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                  </div>
                )}
              </div>

              {profileUser.bio && (
                <p className="text-muted-foreground">{profileUser.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue={isOwnProfile ? "edit" : "reviews"}>
        <TabsList>
          {isOwnProfile && <TabsTrigger value="edit">Edit Profile</TabsTrigger>}
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {isOwnProfile && (
          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" defaultValue={profileUser.role}>
                      <SelectTrigger id="role" data-testid="select-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="provider">Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      defaultValue={profileUser.city || ""}
                      placeholder="San Francisco, CA"
                      data-testid="input-city"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      defaultValue={profileUser.bio || ""}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      data-testid="input-bio"
                    />
                  </div>

                  <Button type="submit" disabled={updateMutation.isPending} data-testid="button-save-profile">
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-md space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-md" data-testid={`review-${review.id}`}>
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={review.reviewer.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {getInitials(review.reviewer.firstName, review.reviewer.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-medium">
                              {review.reviewer.firstName} {review.reviewer.lastName}
                            </p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
