import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Bell, Check, Droplet, Star, Users, MessageCircle } from "lucide-react";
import type { Notification } from "@shared/schema";

export default function Notifications() {
  const { toast } = useToast();

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await apiRequest("PATCH", `/api/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", "/api/notifications/mark-all-read", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "All notifications marked as read",
      });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "request_created":
      case "request_accepted":
      case "request_rejected":
      case "request_completed":
        return <Droplet className="w-5 h-5 text-primary" />;
      case "new_message":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "new_review":
        return <Star className="w-5 h-5 text-yellow-500" />;
      case "new_follower":
        return <Users className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getNotificationTitle = (notification: Notification) => {
    const payload = notification.payloadJson as any;
    switch (notification.type) {
      case "request_created":
        return "New Water Request";
      case "request_accepted":
        return "Request Accepted";
      case "request_rejected":
        return "Request Declined";
      case "request_completed":
        return "Request Completed";
      case "new_message":
        return "New Message";
      case "new_review":
        return "New Review";
      case "new_follower":
        return "New Follower";
      default:
        return "Notification";
    }
  };

  const getNotificationDescription = (notification: Notification) => {
    const payload = notification.payloadJson as any;
    return payload.message || "You have a new notification";
  };

  const unreadCount = notifications?.filter(n => !n.readAt).length || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            data-testid="button-mark-all-read"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`hover-elevate ${!notification.readAt ? "border-primary/50" : ""}`}
              data-testid={`notification-${notification.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-medium ${!notification.readAt ? "font-semibold" : ""}`}>
                            {getNotificationTitle(notification)}
                          </p>
                          {!notification.readAt && (
                            <Badge variant="default" className="px-1.5 py-0.5 text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getNotificationDescription(notification)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.readAt && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          disabled={markAsReadMutation.isPending}
                          data-testid={`button-mark-read-${notification.id}`}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
