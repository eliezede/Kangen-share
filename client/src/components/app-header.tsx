import { Home, Users, Calendar, MessageCircle, Bell, Droplet, Menu, Settings, Shield, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export function AppHeader() {
  const { user } = useAuth();
  const [location] = useLocation();

  const { data: notifications } = useQuery<any[]>({
    queryKey: ['/api/notifications'],
  });

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const navItems = [
    { title: "Home", url: "/", icon: Home, testId: "nav-home" },
    { title: "Requests", url: "/requests", icon: Droplet, testId: "nav-requests" },
    { title: "Providers", url: "/providers", icon: Users, testId: "nav-providers" },
    { title: "Messages", url: "/messages", icon: MessageCircle, testId: "nav-messages" },
    { title: "Availability", url: "/availability", icon: Calendar, testId: "nav-availability" },
  ];

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const isActive = (url: string) => {
    if (url === "/") return location === "/";
    return location.startsWith(url);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" data-testid="link-logo">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate px-2 py-1 rounded-md">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Droplet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold hidden sm:inline">Kangen Share</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.url} href={item.url}>
              <Button
                variant={isActive(item.url) ? "default" : "ghost"}
                size="sm"
                data-testid={item.testId}
                className="gap-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link href="/notifications">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                  data-testid="badge-notification-count"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 px-2"
                data-testid="button-user-menu"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                  <AvatarFallback>{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none" data-testid="text-user-name">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem data-testid="menu-profile">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin">
                  <DropdownMenuItem data-testid="menu-admin">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="menu-logout"
                onClick={() => window.location.href = "/api/logout"}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                    <Droplet className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Kangen Share
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => (
                  <Link key={item.url} href={item.url}>
                    <Button
                      variant={isActive(item.url) ? "default" : "ghost"}
                      className="w-full justify-start gap-2 min-h-12"
                      data-testid={`mobile-${item.testId}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-base">{item.title}</span>
                    </Button>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
