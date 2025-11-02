import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Droplet, Users, Star, TrendingUp, Clock } from "lucide-react";
import type { Request, User } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  const { data: requests, isLoading: requestsLoading } = useQuery<Request[]>({
    queryKey: ["/api/requests/recent"],
  });

  const { data: providers, isLoading: providersLoading } = useQuery<User[]>({
    queryKey: ["/api/providers/featured"],
  });

  const { data: stats } = useQuery<{
    totalRequests: number;
    activeProviders: number;
    completedRequests: number;
  }>({
    queryKey: ["/api/stats/dashboard"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "accepted": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "completed": return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "rejected": return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "cancelled": return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
      default: return "";
    }
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-welcome">
          Welcome back, {user?.firstName || "there"}!
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {user?.role === "provider" 
            ? "Manage your availability and respond to water requests from your community"
            : "Request water from trusted providers in your area"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Droplet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-requests">
              {stats?.totalRequests || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-providers">
              {stats?.activeProviders || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">In your area</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-completed-requests">
              {stats?.completedRequests || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get started</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row flex-wrap gap-3">
          <Button asChild data-testid="button-request-water" className="w-full sm:w-auto">
            <Link href="/requests/new">
              <Droplet className="w-4 h-4 mr-2" />
              Request Water
            </Link>
          </Button>
          <Button variant="secondary" asChild data-testid="button-find-providers" className="w-full sm:w-auto">
            <Link href="/providers">
              <Users className="w-4 h-4 mr-2" />
              Find Providers
            </Link>
          </Button>
          {user?.role === "provider" && (
            <Button variant="secondary" asChild data-testid="button-manage-availability" className="w-full sm:w-auto">
              <Link href="/availability">
                <Clock className="w-4 h-4 mr-2" />
                Manage Availability
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Latest water sharing activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/requests">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="space-y-4">
              {requests.slice(0, 5).map((request) => (
                <div 
                  key={request.id} 
                  className="flex items-start gap-4 p-4 rounded-md border hover-elevate"
                  data-testid={`request-card-${request.id}`}
                >
                  <Droplet className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium">{request.qtyLiters}L Water Request</p>
                      <Badge variant="outline" className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{request.locationText}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.windowStart).toLocaleDateString()} - {new Date(request.windowEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Droplet className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No requests yet</p>
              <Button variant="ghost" asChild className="mt-2">
                <Link href="/requests/new">Create your first request</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Providers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Featured Providers</CardTitle>
              <CardDescription>Top-rated providers in your community</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/providers">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {providersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Skeleton className="w-20 h-20 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : providers && providers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.slice(0, 6).map((provider) => (
                <Card key={provider.id} className="hover-elevate" data-testid={`provider-card-${provider.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="w-20 h-20 mb-4">
                        <AvatarImage src={provider.profileImageUrl || undefined} alt={provider.firstName || "Provider"} />
                        <AvatarFallback>{getInitials(provider.firstName, provider.lastName)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold mb-1">
                        {provider.firstName} {provider.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{provider.city || "Location not set"}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{provider.rating?.toFixed(1) || "New"}</span>
                        {provider.reviewCount > 0 && (
                          <span className="text-muted-foreground">({provider.reviewCount})</span>
                        )}
                      </div>
                      <Button variant="secondary" size="sm" className="mt-4 w-full" asChild>
                        <Link href={`/profile/${provider.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No providers available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
