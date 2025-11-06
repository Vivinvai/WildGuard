import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Camera, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="bg-card border-b border-border shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative w-12 h-12">
              {/* Combined Logo */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg flex items-center justify-center">
                <img 
                  src="/attached_assets/icons8-guard-48_1758461926293.png" 
                  alt="Guard Shield" 
                  className="w-7 h-7 opacity-90"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                <img 
                  src="/attached_assets/icons8-wildlife-64_1758461915368.png" 
                  alt="Wildlife" 
                  className="w-4 h-4"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">WildGuard</h1>
              <p className="text-xs text-muted-foreground">AI Wildlife Protection Platform</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`transition-colors font-medium ${
                location === "/" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
              data-testid="link-home"
            >
              Home
            </Link>
            <Link 
              href="/discover" 
              className={`transition-colors font-medium ${
                location === "/discover" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
              data-testid="link-discover"
            >
              Discover
            </Link>
            <Link 
              href="/centers" 
              className={`transition-colors font-medium ${
                location === "/centers" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
              data-testid="link-centers"
            >
              Centers
            </Link>
            <Link 
              href="/learn" 
              className={`transition-colors font-medium ${
                location === "/learn" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
              data-testid="link-learn"
            >
              Learn
            </Link>
            <Link 
              href="/about" 
              className={`transition-colors font-medium ${
                location === "/about" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
              data-testid="link-about"
            >
              About
            </Link>
          </nav>
          
          {/* Action buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/identify">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400"
                data-testid="button-upload-header"
              >
                <Camera className="w-4 h-4" />
                <span>Identify</span>
              </Button>
            </Link>
            <Link href="/chat">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                data-testid="button-chat-header"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" data-testid="button-mobile-menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
