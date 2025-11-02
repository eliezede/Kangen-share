import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Droplet, Plus, MapPin, Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import type { Request, User } from "@shared/schema";

type RequestWithUser = Request & {
  requester?: User;
  provider?: User;
};

export default function Requests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: requests, isLoading } = useQuery<RequestWithUser[]>({
    queryKey: ["/api/requests"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      qtyLiters: number;
      locationText: string;
      windowStart: string;
      windowEnd: string;
      notes?: string;
    }) => {
      await apiRequest("POST", "/api/requests", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Request created",
        description: "Your water request has been submitted successfully.",
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
    createMutation.mutate({
      qtyLiters: parseFloat(formData.get("qtyLiters") as string),
      locationText: formData.get("locationText") as string,
      windowStart: new Date(formData.get("windowStart") as string).toISOString(),
      windowEnd: new Date(formData.get("windowEnd") as string).toISOString(),
      notes: formData.get("notes") as string || undefined,
    });
  };

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

  const filteredRequests = requests?.filter((request) => {
    if (activeTab === "all") return true;
    return request.status === activeTab;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Water Requests</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your water sharing requests
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-request" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Request Water</DialogTitle>
                <DialogDescription>
                  Fill in the details for your water request
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="qtyLiters">Quantity (Liters)</Label>
                  <Input
                    id="qtyLiters"
                    name="qtyLiters"
                    type="number"
                    step="0.5"
                    min="0.5"
                    placeholder="5"
                    required
                    data-testid="input-qty-liters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationText">Pickup Location</Label>
                  <Input
                    id="locationText"
                    name="locationText"
                    placeholder="123 Main St, City, State"
                    required
                    data-testid="input-location"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="windowStart">Start Date/Time</Label>
                    <Input
                      id="windowStart"
                      name="windowStart"
                      type="datetime-local"
                      required
                      data-testid="input-window-start"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="windowEnd">End Date/Time</Label>
                    <Input
                      id="windowEnd"
                      name="windowEnd"
                      type="datetime-local"
                      required
                      data-testid="input-window-end"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any special instructions or preferences..."
                    rows={3}
                    data-testid="input-notes"
                  />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  data-testid="button-cancel-request"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-request" className="w-full sm:w-auto">
                  {createMutation.isPending ? "Creating..." : "Create Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted" data-testid="tab-accepted">Accepted</TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRequests && filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover-elevate" data-testid={`request-${request.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Droplet className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <CardTitle className="text-lg">
                              {request.qtyLiters}L Water Request
                            </CardTitle>
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                          <CardDescription className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{request.locationText}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(request.windowStart).toLocaleDateString()} - {new Date(request.windowEnd).toLocaleDateString()}
                              </span>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {request.notes && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-md">
                        <p className="text-sm text-muted-foreground">{request.notes}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {request.requester && request.requesterId !== user?.id && (
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={request.requester.profileImageUrl || undefined} />
                              <AvatarFallback>
                                {getInitials(request.requester.firstName, request.requester.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {request.requester.firstName} {request.requester.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">Requester</p>
                            </div>
                          </div>
                        )}
                        {request.provider && (
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={request.provider.profileImageUrl || undefined} />
                              <AvatarFallback>
                                {getInitials(request.provider.firstName, request.provider.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {request.provider.firstName} {request.provider.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">Provider</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/requests/${request.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Droplet className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all" ? "No requests yet" : `No ${activeTab} requests`}
                </p>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                  Create Request
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
