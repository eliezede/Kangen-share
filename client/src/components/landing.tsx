import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Droplet, Users, Calendar, Star, MessageCircle, Shield, Mail } from "lucide-react";
import { SiGoogle, SiGithub, SiX, SiApple } from "react-icons/si";
import heroImage from "@assets/generated_images/Community_water_sharing_hero_image_3fe39fc1.png";
import { LandingHeader } from "@/components/landing-header";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
            Share Kangen Water with Your Community
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            Connect with trusted providers, request water pickups, and build meaningful relationships through shared wellness
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              variant="default"
              className="text-base px-8 min-h-12"
              data-testid="button-get-started"
              onClick={() => window.location.href = "/api/login"}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base px-8 min-h-12 bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30"
              data-testid="button-browse-providers"
              onClick={() => window.location.href = "/api/login"}
            >
              Browse Providers
            </Button>
          </div>
          
          {/* Login Methods */}
          <div className="flex flex-col items-center gap-3 mt-[18px] mb-[18px]">
            <p className="text-sm text-white/70">Sign in with:</p>
            <div className="flex items-center gap-3" role="list" aria-label="Available login methods">
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
        </div>
      </div>
      {/* How It Works Section */}
      <div id="how-it-works" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to connect with your local Kangen water community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover-elevate">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Find a Provider</h3>
            <p className="text-muted-foreground">
              Browse verified providers in your area, check their ratings, and view their availability
            </p>
          </Card>

          <Card className="p-8 text-center hover-elevate">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Request Water</h3>
            <p className="text-muted-foreground">
              Choose your quantity, preferred time window, and add any special notes for your request
            </p>
          </Card>

          <Card className="p-8 text-center hover-elevate">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Droplet className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect & Share</h3>
            <p className="text-muted-foreground">
              Chat with your provider, coordinate pickup, and leave reviews to help the community grow
            </p>
          </Card>
        </div>
      </div>
      {/* Features Section */}
      <div id="features" className="bg-card/50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Community-First Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build trust and share water safely
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex gap-4 p-6 bg-background rounded-md border">
              <div className="flex-shrink-0">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Verified Reviews</h3>
                <p className="text-sm text-muted-foreground">
                  Rate and review after every completed request to maintain community trust
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-background rounded-md border">
              <div className="flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Real-Time Messaging</h3>
                <p className="text-sm text-muted-foreground">
                  Chat directly with providers and requesters to coordinate details
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-background rounded-md border">
              <div className="flex-shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Availability Calendar</h3>
                <p className="text-sm text-muted-foreground">
                  Providers can set recurring schedules and manage their availability
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-background rounded-md border">
              <div className="flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Follow Network</h3>
                <p className="text-sm text-muted-foreground">
                  Build your network by following trusted providers and community members
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-background rounded-md border">
              <div className="flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Safe & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Admin moderation ensures a safe and trustworthy community for everyone
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-background rounded-md border">
              <div className="flex-shrink-0">
                <Droplet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Track Requests</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your requests from pending to completed with real-time updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div id="cta" className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the Community?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Start sharing Kangen water with your neighbors today
        </p>
        <Button 
          size="lg" 
          className="text-base px-8 min-h-12"
          data-testid="button-join-now"
          onClick={() => window.location.href = "/api/login"}
        >
          Join Now
        </Button>
      </div>
    </div>
  );
}
