import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Search, Star, MapPin, UserPlus, UserCheck } from "lucide-react";
import { Link } from "wouter";
import type { User } from "@shared/schema";

type ProviderWithFollow = User & {
  isFollowing?: boolean;
};

export default function Providers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: providers, isLoading } = useQuery<ProviderWithFollow[]>({
    queryKey: ["/api/providers"],
  });

  const followMutation = useMutation({
    mutationFn: async (providerId: string) => {
      await apiRequest("POST", "/api/follows", { followeeId: providerId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers"] });
      toast({
        title: "Following",
        description: "You are now following this provider",
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
    mutationFn: async (providerId: string) => {
      await apiRequest("DELETE", `/api/follows/${providerId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers"] });
      toast({
        title: "Unfollowed",
        description: "You have unfollowed this provider",
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

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const filteredProviders = providers?.filter((provider) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${provider.firstName || ""} ${provider.lastName || ""}`.toLowerCase();
    const city = (provider.city || "").toLowerCase();
    return fullName.includes(query) || city.includes(query);
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Find Providers</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Browse and connect with trusted water providers in your community
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-providers"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProviders && filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProviders.map((provider) => (
            <Card 
              key={provider.id} 
              className="hover-elevate overflow-hidden"
              data-testid={`provider-card-${provider.id}`}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={provider.profileImageUrl || undefined} alt={provider.firstName || "Provider"} />
                    <AvatarFallback className="text-lg">
                      {getInitials(provider.firstName, provider.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="font-semibold text-lg mb-1">
                    {provider.firstName} {provider.lastName}
                  </h3>

                  {provider.city && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{provider.city}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {provider.rating ? provider.rating.toFixed(1) : "New"}
                    </span>
                    {provider.reviewCount > 0 && (
                      <span className="text-sm text-muted-foreground">
                        ({provider.reviewCount} {provider.reviewCount === 1 ? "review" : "reviews"})
                      </span>
                    )}
                  </div>

                  {provider.bio && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {provider.bio}
                    </p>
                  )}

                  <div className="flex gap-2 w-full mt-auto">
                    <Button variant="outline" className="flex-1 min-h-11" asChild>
                      <Link href={`/profile/${provider.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    {provider.id !== user?.id && (
                      provider.isFollowing ? (
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => unfollowMutation.mutate(provider.id)}
                          disabled={unfollowMutation.isPending}
                          data-testid={`button-unfollow-${provider.id}`}
                          className="min-h-11 min-w-11"
                        >
                          <UserCheck className="w-5 h-5" />
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="icon"
                          onClick={() => followMutation.mutate(provider.id)}
                          disabled={followMutation.isPending}
                          data-testid={`button-follow-${provider.id}`}
                          className="min-h-11 min-w-11"
                        >
                          <UserPlus className="w-5 h-5" />
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "No providers found matching your search" : "No providers available yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
