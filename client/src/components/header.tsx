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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Shield, Camera, MessageCircle, Menu, Search, Leaf, PawPrint,
  TreePine, Users, HeartHandshake, LogIn, Sparkles, Eye,
  TrendingUp, Heart, Satellite, MapPin, Activity, Volume2,
  Footprints, ImagePlus
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="bg-card border-b border-border shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/home" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative w-12 h-12">
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
              <p className="text-xs text-muted-foreground">AI Wildlife Protection</p>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-1 text-sm">
            <Link 
              href="/home" 
              className={`px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${
                location === "/home" 
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-700 dark:hover:text-green-300"
              }`}
              data-testid="link-home"
            >
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-1 ${
                    location === "/identify" || location === "/flora"
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 shadow-sm" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-700 dark:hover:text-green-300"
                  }`}
                  data-testid="dropdown-identify"
                >
                  <Search className="w-4 h-4" />
                  Identify
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
                <DropdownMenuItem asChild className="focus:bg-green-50 dark:focus:bg-green-950/50 cursor-pointer">
                  <Link href="/identify" className="flex items-center space-x-3 px-3 py-2">
                    <PawPrint className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium">Identify Fauna</div>
                      <div className="text-xs text-gray-500">Animals & Wildlife</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-orange-50 dark:focus:bg-orange-950/50 cursor-pointer">
                  <Link href="/flora" className="flex items-center space-x-3 px-3 py-2">
                    <Leaf className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <div>
                      <div className="font-medium">Identify Flora</div>
                      <div className="text-xs text-gray-500">Plants & Trees</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              href="/centers" 
              className={`px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${
                location === "/centers" 
                  ? "bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-700 dark:text-blue-300 shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-300"
              }`}
              data-testid="link-centers"
            >
              Centers
            </Link>
            
            <Link 
              href="/gardens" 
              className={`px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${
                location === "/gardens" 
                  ? "bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 text-orange-700 dark:text-orange-300 shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-700 dark:hover:text-orange-300"
              }`}
              data-testid="link-gardens"
            >
              Gardens
            </Link>
            
            <Link 
              href="/deforestation" 
              className={`px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${
                location === "/deforestation" 
                  ? "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 text-red-700 dark:text-red-300 shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-700 dark:hover:text-red-300"
              }`}
              data-testid="link-insights"
            >
              Insights
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm flex items-center gap-1 ${
                    location.startsWith("/features")
                      ? "bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 text-purple-700 dark:text-purple-300 shadow-sm" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-700 dark:hover:text-purple-300"
                  }`}
                  data-testid="dropdown-features"
                >
                  <Sparkles className="w-4 h-4" />
                  Features
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl max-h-[500px] overflow-y-auto">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">AI CONSERVATION TOOLS</div>
                <DropdownMenuItem asChild className="focus:bg-purple-50 dark:focus:bg-purple-950/50 cursor-pointer">
                  <Link href="/features/poaching-detection" className="flex items-center space-x-3 px-3 py-2">
                    <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="font-medium">Poaching Detection</div>
                      <div className="text-xs text-gray-500">Camera trap analysis</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-blue-50 dark:focus:bg-blue-950/50 cursor-pointer">
                  <Link href="/features/population-prediction" className="flex items-center space-x-3 px-3 py-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-medium">Population Trends</div>
                      <div className="text-xs text-gray-500">Species forecasts</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-green-50 dark:focus:bg-green-950/50 cursor-pointer">
                  <Link href="/features/health-assessment" className="flex items-center space-x-3 px-3 py-2">
                    <Heart className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium">Health Assessment</div>
                      <div className="text-xs text-gray-500">Injury & disease detection</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer">
                  <Link href="/features/satellite-monitoring" className="flex items-center space-x-3 px-3 py-2">
                    <Satellite className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <div>
                      <div className="font-medium">Satellite Monitoring</div>
                      <div className="text-xs text-gray-500">Vegetation health</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-orange-50 dark:focus:bg-orange-950/50 cursor-pointer">
                  <Link href="/features/sightings-heatmap" className="flex items-center space-x-3 px-3 py-2">
                    <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <div>
                      <div className="font-medium">Sightings Heatmap</div>
                      <div className="text-xs text-gray-500">Biodiversity hotspots</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-teal-50 dark:focus:bg-teal-950/50 cursor-pointer">
                  <Link href="/features/habitat-monitoring" className="flex items-center space-x-3 px-3 py-2">
                    <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <div>
                      <div className="font-medium">Habitat Health</div>
                      <div className="text-xs text-gray-500">NASA fire monitoring</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-purple-50 dark:focus:bg-purple-950/50 cursor-pointer">
                  <Link href="/features/sound-detection" className="flex items-center space-x-3 px-3 py-2">
                    <Volume2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="font-medium">Sound Detection</div>
                      <div className="text-xs text-gray-500">Bioacoustic analysis</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-amber-50 dark:focus:bg-amber-950/50 cursor-pointer">
                  <Link href="/features/footprint-recognition" className="flex items-center space-x-3 px-3 py-2">
                    <Footprints className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="font-medium">Footprint Recognition</div>
                      <div className="text-xs text-gray-500">Track identification</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-blue-50 dark:focus:bg-blue-950/50 cursor-pointer">
                  <Link href="/features/partial-image-enhancement" className="flex items-center space-x-3 px-3 py-2">
                    <ImagePlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-medium">Image Enhancement</div>
                      <div className="text-xs text-gray-500">Blurry image analysis</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${
                    location === "/discover" || location === "/report-sighting"
                      ? "bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 text-indigo-700 dark:text-indigo-300 shadow-sm" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-700 dark:hover:text-indigo-300"
                  }`}
                  data-testid="dropdown-actions"
                >
                  Actions
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
                <DropdownMenuItem asChild className="focus:bg-blue-50 dark:focus:bg-blue-950/50 cursor-pointer">
                  <Link href="/discover" className="flex items-center space-x-3 px-3 py-2">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>NGOs & Volunteer</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-green-50 dark:focus:bg-green-950/50 cursor-pointer">
                  <Link href="/report-sighting" className="flex items-center space-x-3 px-3 py-2">
                    <Camera className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>Report Sighting</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              href="/learn" 
              className={`px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${
                location === "/learn" 
                  ? "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-700 dark:text-amber-300 shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-700 dark:hover:text-amber-300"
              }`}
              data-testid="link-learn"
            >
              Learn
            </Link>
          </nav>
          
          <div className="hidden lg:flex items-center space-x-2">
            <Link href="/chat">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 border-blue-300 dark:border-blue-700 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/50 dark:hover:to-cyan-900/50 text-blue-700 dark:text-blue-300 font-semibold shadow-sm hover:shadow-md transition-all"
                data-testid="button-chat-header"
              >
                <MessageCircle className="w-4 h-4" />
                <span>AI Chat</span>
              </Button>
            </Link>
            <Link href="/admin-login">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/40 dark:to-gray-950/40 border-slate-300 dark:border-slate-700 hover:from-slate-100 hover:to-gray-100 dark:hover:from-slate-900/50 dark:hover:to-gray-900/50 text-slate-700 dark:text-slate-300 font-semibold shadow-sm hover:shadow-md transition-all"
                data-testid="button-admin-login"
              >
                <LogIn className="w-4 h-4" />
                <span>Admin</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-muted-foreground hover:text-foreground" data-testid="button-mobile-menu">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card dark:bg-gray-950 border-border dark:border-gray-800 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-foreground dark:text-white">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-3 mt-6">
                  <Link 
                    href="/home" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                      location === "/home" 
                        ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    🏠 Home
                  </Link>
                  
                  <div className="border-t border-border dark:border-gray-800 pt-3 mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 px-3 mb-2 font-semibold">EXPLORE</p>
                    <Link 
                      href="/identify" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-lg transition-colors font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <PawPrint className="w-4 h-4" />
                      Identify Fauna
                    </Link>
                    <Link 
                      href="/flora" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-lg transition-colors font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Leaf className="w-4 h-4" />
                      Identify Flora
                    </Link>
                  </div>

                  <Link 
                    href="/centers" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-lg transition-colors font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    🏛️ Wildlife Centers
                  </Link>
                  <Link 
                    href="/gardens" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-lg transition-colors font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    🌺 Botanical Gardens
                  </Link>
                  <Link 
                    href="/deforestation" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-lg transition-colors font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    🌲 Insights
                  </Link>

                  <div className="border-t border-border dark:border-gray-800 pt-3 mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 px-3 mb-2 font-semibold">AI FEATURES</p>
                    <Link 
                      href="/features/poaching-detection" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-lg transition-colors font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Eye className="w-4 h-4" />
                      Poaching Detection
                    </Link>
                    <Link 
                      href="/features/population-prediction" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-lg transition-colors font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Population Trends
                    </Link>
                    <Link 
                      href="/features/health-assessment" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-lg transition-colors font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Heart className="w-4 h-4" />
                      Health Assessment
                    </Link>
                    <Link 
                      href="/features/satellite-monitoring" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-lg transition-colors font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Satellite className="w-4 h-4" />
                      Satellite Monitoring
                    </Link>
                    <Link 
                      href="/features/sightings-heatmap" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-lg transition-colors font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <MapPin className="w-4 h-4" />
                      Sightings Heatmap
                    </Link>
                  </div>

                  <div className="border-t border-border dark:border-gray-800 pt-3 mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 px-3 mb-2 font-semibold">ACTIONS</p>
                    <Link 
                      href="/discover" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-lg transition-colors font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Users className="w-4 h-4" />
                      NGOs & Volunteer
                    </Link>
                    <Link 
                      href="/report-sighting" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-lg transition-colors font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Camera className="w-4 h-4" />
                      Report Sighting
                    </Link>
                  </div>

                  <Link 
                    href="/learn" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-lg transition-colors font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    📚 Learn
                  </Link>
                  
                  <div className="border-t border-border dark:border-gray-800 pt-3 mt-2">
                    <Link 
                      href="/chat" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-lg transition-colors font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <MessageCircle className="w-4 h-4" />
                      AI Chat
                    </Link>
                    <Link 
                      href="/admin-login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-lg transition-colors font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <LogIn className="w-4 h-4" />
                      Admin Login
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
