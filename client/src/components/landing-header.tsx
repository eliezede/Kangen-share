import { Droplet, Menu, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export function LandingHeader() {
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { title: "How It Works", href: "#how-it-works" },
    { title: "Features", href: "#features" },
    { title: "Get Started", href: "#cta" },
  ];

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Droplet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">Kangen Share</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection(item.href)}
              className="text-sm font-medium"
              data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {item.title}
            </Button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              {/* Logged in - Show Avatar */}
              <Link href="/home">
                <Button
                  variant="ghost"
                  className="gap-2 px-2 min-h-11"
                  data-testid="button-user-profile"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={user.profileImageUrl || undefined}
                      alt={user.firstName || "User"}
                    />
                    <AvatarFallback>
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Not logged in - Show Login Button */}
              <Button
                variant="default"
                size="sm"
                className="min-h-11 hidden sm:flex"
                onClick={() => (window.location.href = "/api/login")}
                data-testid="button-login-desktop"
              >
                Login
              </Button>
              <Button
                variant="default"
                size="icon"
                className="sm:hidden min-h-11 min-w-11"
                onClick={() => (window.location.href = "/api/login")}
                data-testid="button-login-mobile"
              >
                <User className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Mobile Menu (Hamburger) */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11"
                data-testid="button-hamburger-menu"
              >
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
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="w-full justify-start min-h-12"
                    onClick={() => {
                      scrollToSection(item.href);
                    }}
                    data-testid={`mobile-nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className="text-base">{item.title}</span>
                  </Button>
                ))}
                {!isAuthenticated && (
                  <>
                    <div className="border-t my-2" />
                    <Button
                      variant="default"
                      className="w-full min-h-12"
                      onClick={() => (window.location.href = "/api/login")}
                      data-testid="mobile-button-login"
                    >
                      Login
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
