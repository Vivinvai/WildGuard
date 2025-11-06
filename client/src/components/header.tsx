import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, Camera, MessageCircle, Menu, X, Search, Leaf, PawPrint } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          <nav className="hidden lg:flex items-center space-x-4 text-sm">
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
              href="/centers" 
              className={`transition-colors font-medium ${
                location === "/centers" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
              data-testid="link-centers"
            >
              Wildlife Centers
            </Link>
            <Link 
              href="/gardens" 
              className={`transition-colors font-medium ${
                location === "/gardens" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
              data-testid="link-gardens"
            >
              Botanical Gardens
            </Link>
            <Link 
              href="/deforestation" 
              className={`transition-colors font-medium ${
                location === "/deforestation" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
              data-testid="link-deforestation"
            >
              Habitat
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
              NGOs & Volunteer
            </Link>
          </nav>
          
          {/* Action buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400"
                  data-testid="button-identify-dropdown"
                >
                  <Search className="w-4 h-4" />
                  <span>Identify</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
                <DropdownMenuItem asChild>
                  <Link 
                    href="/identify" 
                    className="flex items-center space-x-2 cursor-pointer"
                    data-testid="dropdown-identify-fauna"
                  >
                    <PawPrint className="w-4 h-4" />
                    <span>Identify Fauna</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    href="/flora" 
                    className="flex items-center space-x-2 cursor-pointer"
                    data-testid="dropdown-identify-flora"
                  >
                    <Leaf className="w-4 h-4" />
                    <span>Identify Flora</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/chat">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                data-testid="button-chat-header"
              >
                <MessageCircle className="w-4 h-4" />
                <span>AI Chat</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          
          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-muted-foreground hover:text-foreground" data-testid="button-mobile-menu">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card dark:bg-gray-950 border-border dark:border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-foreground dark:text-white">Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link 
                    href="/" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors font-medium ${
                      location === "/" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    data-testid="link-mobile-home"
                  >
                    🏠 Home
                  </Link>
                  <Link 
                    href="/learn" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors font-medium ${
                      location === "/learn" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    data-testid="link-mobile-learn"
                  >
                    📚 Learn
                  </Link>
                  <Link 
                    href="/centers" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors font-medium ${
                      location === "/centers" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    data-testid="link-mobile-centers"
                  >
                    🏛️ Wildlife Centers
                  </Link>
                  <Link 
                    href="/gardens" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors font-medium ${
                      location === "/gardens" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    data-testid="link-mobile-gardens"
                  >
                    🌺 Botanical Gardens
                  </Link>
                  <Link 
                    href="/deforestation" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors font-medium ${
                      location === "/deforestation" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    data-testid="link-mobile-habitat"
                  >
                    🌲 Habitat
                  </Link>
                  <Link 
                    href="/discover" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors font-medium ${
                      location === "/discover" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    data-testid="link-mobile-discover"
                  >
                    🤝 NGOs & Volunteer
                  </Link>
                  
                  {/* Identify section */}
                  <div className="border-t border-border dark:border-gray-800 pt-4 mt-2">
                    <p className="text-xs text-muted-foreground px-3 mb-2 font-semibold">Identify Species</p>
                    <Link 
                      href="/identify" 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3 rounded-lg transition-colors font-medium ${
                        location === "/identify" 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      } flex items-center space-x-2`}
                      data-testid="link-mobile-identify"
                    >
                      <PawPrint className="w-4 h-4" />
                      <span>Identify Fauna</span>
                    </Link>
                    <Link 
                      href="/flora" 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3 rounded-lg transition-colors font-medium ${
                        location === "/flora" 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      } flex items-center space-x-2`}
                      data-testid="link-mobile-flora"
                    >
                      <Leaf className="w-4 h-4" />
                      <span>Identify Flora</span>
                    </Link>
                  </div>
                  
                  {/* AI Chat */}
                  <Link 
                    href="/chat" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors font-medium ${
                      location === "/chat" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } flex items-center space-x-2`}
                    data-testid="link-mobile-chat"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>AI Chat</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
