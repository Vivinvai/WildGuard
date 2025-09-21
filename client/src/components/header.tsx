import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <img 
                src="/favicon.png" 
                alt="WildGuard"
                className="w-8 h-8 filter brightness-0 invert"
                data-testid="img-logo"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">WildGuard</h1>
              <p className="text-xs text-muted-foreground">AI Wildlife Protection Platform</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Discover
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Centers
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Learn
            </a>
            <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
              <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-primary transition-colors font-medium" data-testid="button-about">
                  About
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center mb-4">About WildGuard</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-center">
                    An AI-powered wildlife protection platform that helps identify animals through advanced photo analysis and connects users with nearby wildlife conservation centers.
                  </p>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-3 text-center">Created by</h3>
                    <div className="space-y-2">
                      <div className="text-center">
                        <p className="font-medium text-primary">Vivin Vaibhav L K</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-primary">Saniya S</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-primary">Umesh L</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-primary">Srinidhi R Y</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Supporting wildlife conservation through technology and education.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
