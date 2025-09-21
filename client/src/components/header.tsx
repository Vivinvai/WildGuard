import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="bg-card border-b border-border shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
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
