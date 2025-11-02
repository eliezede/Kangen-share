import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Star, MapPin, Calendar, UserPlus, UserCheck, MessageCircle, Droplet } from "lucide-react";
import type { User, Review, MessageThread, Request } from "@shared/schema";
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

  const { data: isFollowing } = useQuery<{ isFollowing: boolean }>({
    queryKey: [`/api/follows/check/${profileUserId}`],
    enabled: !!profileUserId && !isOwnProfile,
  });

  const [, navigate] = useLocation();
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/users/me", data);
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
      firstName: formData.get("firstName") as string || undefined,
      lastName: formData.get("lastName") as string || undefined,
      email: formData.get("email") as string || undefined,
      phone: formData.get("phone") as string || undefined,
      address: formData.get("address") as string || undefined,
      bio: formData.get("bio") as string || undefined,
      city: formData.get("city") as string || undefined,
    });
  };

  const messageMutation = useMutation({
    mutationFn: async (otherUserId: string) => {
      const response = await apiRequest("POST", "/api/messages/thread", { otherUserId });
      return response.json() as Promise<MessageThread>;
    },
    onSuccess: (thread) => {
      navigate(`/messages/${thread.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/requests", data);
    },
    onSuccess: () => {
      setRequestDialogOpen(false);
      toast({
        title: "Request sent",
        description: "Your water request has been sent to the provider",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const followMutation = useMutation({
    mutationFn: async (followeeId: string) => {
      await apiRequest("POST", "/api/follows", { followeeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/follows/check/${profileUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", profileUserId] });
      toast({
        title: "Following",
        description: "You are now following this user",
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

  const unfollowMutation = useMutation({
    mutationFn: async (followeeId: string) => {
      await apiRequest("DELETE", `/api/follows/${followeeId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/follows/check/${profileUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", profileUserId] });
      toast({
        title: "Unfollowed",
        description: "You have unfollowed this user",
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

  const handleRequestSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createRequestMutation.mutate({
      providerId: profileUserId,
      qtyLiters: Number(formData.get("qtyLiters")),
      locationText: formData.get("locationText") as string,
      windowStart: new Date(formData.get("windowStart") as string).toISOString(),
      windowEnd: new Date(formData.get("windowEnd") as string).toISOString(),
      notes: formData.get("notes") as string || undefined,
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
                    {isFollowing?.isFollowing ? (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => unfollowMutation.mutate(profileUser.id)}
                        disabled={unfollowMutation.isPending}
                        data-testid="button-unfollow-user"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        {unfollowMutation.isPending ? "Unfollowing..." : "Following"}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => followMutation.mutate(profileUser.id)}
                        disabled={followMutation.isPending}
                        data-testid="button-follow-user"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {followMutation.isPending ? "Following..." : "Follow"}
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => messageMutation.mutate(profileUser.id)}
                      disabled={messageMutation.isPending}
                      data-testid="button-message-user"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {messageMutation.isPending ? "Loading..." : "Message"}
                    </Button>
                    <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm" data-testid="button-request-water">
                          <Droplet className="w-4 h-4 mr-2" />
                          Request Water
                        </Button>
                      </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Water from {profileUser.firstName}</DialogTitle>
                            <DialogDescription>Fill out the form below to request Kangen water</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleRequestSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="qtyLiters">Quantity (liters)</Label>
                              <Input
                                id="qtyLiters"
                                name="qtyLiters"
                                type="number"
                                min="1"
                                required
                                placeholder="5"
                                data-testid="input-request-quantity"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="locationText">Pickup Location</Label>
                              <Input
                                id="locationText"
                                name="locationText"
                                type="text"
                                required
                                placeholder="123 Main St, City"
                                data-testid="input-request-location"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="windowStart">Pickup Time Start</Label>
                              <Input
                                id="windowStart"
                                name="windowStart"
                                type="datetime-local"
                                required
                                data-testid="input-request-start"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="windowEnd">Pickup Time End</Label>
                              <Input
                                id="windowEnd"
                                name="windowEnd"
                                type="datetime-local"
                                required
                                data-testid="input-request-end"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="notes">Notes (optional)</Label>
                              <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Any special instructions or preferences..."
                                data-testid="input-request-notes"
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setRequestDialogOpen(false)}
                                data-testid="button-cancel-request"
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="submit" 
                                disabled={createRequestMutation.isPending}
                                data-testid="button-submit-request"
                              >
                                {createRequestMutation.isPending ? "Sending..." : "Send Request"}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        defaultValue={profileUser.firstName || ""}
                        placeholder="John"
                        data-testid="input-firstName"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        defaultValue={profileUser.lastName || ""}
                        placeholder="Doe"
                        data-testid="input-lastName"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={profileUser.email || ""}
                      placeholder="john.doe@example.com"
                      data-testid="input-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={profileUser.phone || ""}
                      placeholder="+1 (555) 123-4567"
                      data-testid="input-phone"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={profileUser.address || ""}
                      placeholder="123 Main St, Apt 4B"
                      data-testid="input-address"
                    />
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
