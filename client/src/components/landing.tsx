import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Droplet, Users, Calendar, Star, MessageCircle, Shield, Mail, ArrowRight } from "lucide-react";
import { SiGoogle, SiGithub, SiX, SiApple } from "react-icons/si";
import heroImage from "@assets/generated_images/Community_water_sharing_hero_image_3fe39fc1.png";
import { LandingHeader } from "@/components/landing-header";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = "/";
    } else {
      window.location.href = "/api/login";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      {/* Hero Section */}
      <div className="relative h-[85vh] sm:h-[70vh] md:h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 max-w-4xl leading-tight">
            Share Kangen Water with Your Community
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl px-2">
            Connect with trusted providers, request water pickups, and build meaningful relationships through shared wellness
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Button 
              size="lg" 
              variant="default"
              className="text-base px-8 min-h-12 w-full sm:w-auto"
              data-testid="button-get-started"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base px-8 min-h-12 w-full sm:w-auto bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30"
              data-testid="button-browse-providers"
              onClick={handleGetStarted}
            >
              Browse Providers
            </Button>
          </div>
          
          {/* Login Methods */}
          {!isAuthenticated && (
            <div className="flex flex-col items-center gap-3 mt-6 sm:mt-8">
              <p className="text-xs sm:text-sm text-white/70">Sign in with:</p>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center" role="list" aria-label="Available login methods">
                <button 
                  className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110 cursor-pointer" 
                  data-testid="icon-login-google"
                  aria-label="Sign in with Google"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <SiGoogle className="w-5 h-5 text-white" aria-hidden="true" />
                </button>
                <button 
                  className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110 cursor-pointer" 
                  data-testid="icon-login-github"
                  aria-label="Sign in with GitHub"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <SiGithub className="w-5 h-5 text-white" aria-hidden="true" />
                </button>
                <button 
                  className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110 cursor-pointer" 
                  data-testid="icon-login-x"
                  aria-label="Sign in with X (Twitter)"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <SiX className="w-5 h-5 text-white" aria-hidden="true" />
                </button>
                <button 
                  className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110 cursor-pointer" 
                  data-testid="icon-login-apple"
                  aria-label="Sign in with Apple"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <SiApple className="w-5 h-5 text-white" aria-hidden="true" />
                </button>
                <button 
                  className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110 cursor-pointer" 
                  data-testid="icon-login-email"
                  aria-label="Sign in with Email and Password"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <Mail className="w-5 h-5 text-white" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">How It Works</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Three simple steps to connect with your local Kangen water community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <Card className="p-6 sm:p-8 text-center hover-elevate">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Find a Provider</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Browse verified providers in your area, check their ratings, and view their availability
            </p>
            <Link href="/providers">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 min-h-11"
                data-testid="link-providers"
              >
                Browse Providers
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>

          <Card className="p-6 sm:p-8 text-center hover-elevate">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Request Water</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Choose your quantity, preferred time window, and add any special notes for your request
            </p>
            <Link href="/requests">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 min-h-11"
                data-testid="link-requests"
              >
                View Requests
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>

          <Card className="p-6 sm:p-8 text-center hover-elevate sm:col-span-2 md:col-span-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Droplet className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Connect & Share</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Chat with your provider, coordinate pickup, and leave reviews to help the community grow
            </p>
            <Link href="/messages">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 min-h-11"
                data-testid="link-messages"
              >
                Open Messages
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-card/50 py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Community-First Features</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Everything you need to build trust and share water safely
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link href="/providers">
              <div 
                className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-background rounded-md border hover-elevate cursor-pointer" 
                data-testid="feature-card-reviews"
              >
                <div className="flex-shrink-0">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Verified Reviews</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Rate and review after every completed request to maintain community trust
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/messages">
              <div 
                className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-background rounded-md border hover-elevate cursor-pointer" 
                data-testid="feature-card-messaging"
              >
                <div className="flex-shrink-0">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Real-Time Messaging</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Chat directly with providers and requesters to coordinate details
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/availability">
              <div 
                className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-background rounded-md border hover-elevate cursor-pointer" 
                data-testid="feature-card-availability"
              >
                <div className="flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Availability Calendar</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Providers can set recurring schedules and manage their availability
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/providers">
              <div 
                className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-background rounded-md border hover-elevate cursor-pointer" 
                data-testid="feature-card-follow"
              >
                <div className="flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Follow Network</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Build your network by following trusted providers and community members
                  </p>
                </div>
              </div>
            </Link>

            <div 
              className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-background rounded-md border hover-elevate"
              data-testid="feature-card-security"
            >
              <div className="flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Safe & Secure</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Admin moderation ensures a safe and trustworthy community for everyone
                </p>
              </div>
            </div>

            <Link href="/requests">
              <div 
                className="flex gap-3 sm:gap-4 p-4 sm:p-6 bg-background rounded-md border hover-elevate cursor-pointer" 
                data-testid="feature-card-requests"
              >
                <div className="flex-shrink-0">
                  <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Track Requests</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Monitor your requests from pending to completed with real-time updates
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="cta" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Join the Community?</h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
          Start sharing Kangen water with your neighbors today
        </p>
        <Button 
          size="lg" 
          className="text-base px-8 min-h-12 w-full sm:w-auto"
          data-testid="button-join-now"
          onClick={handleGetStarted}
        >
          {isAuthenticated ? "Go to Dashboard" : "Join Now"}
        </Button>
      </div>
    </div>
  );
}
