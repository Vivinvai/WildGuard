import { useState } from "react";
import { Header } from "@/components/header";
import { AnimalSlideshow } from "@/components/animal-slideshow";
import { QuickActions } from "@/components/quick-actions";
import { Button } from "@/components/ui/button";
import { Shield, Camera } from "lucide-react";
import { Link } from "wouter";
import type { AnimalIdentification } from "@shared/schema";

export default function Home() {
  const [currentIdentification, setCurrentIdentification] = useState<AnimalIdentification | null>(null);

  const handleIdentificationResult = (result: AnimalIdentification) => {
    setCurrentIdentification(result);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* WildGuard Brand Section */}
      <section className="bg-gradient-to-br from-green-50/50 via-white to-orange-50/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Combined Logo */}
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg flex items-center justify-center">
                <img 
                  src="/attached_assets/icons8-guard-48_1758461926293.png" 
                  alt="Guard Shield" 
                  className="w-9 h-9 opacity-90"
                  data-testid="logo-shield"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <img 
                  src="/attached_assets/icons8-wildlife-64_1758461915368.png" 
                  alt="Wildlife" 
                  className="w-4 h-4"
                  data-testid="logo-wildlife"
                />
              </div>
            </div>
          </div>
          
          {/* Brand Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-green-700 via-green-600 to-orange-600 bg-clip-text text-transparent">
              Wild
            </span>
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
              Guard
            </span>
          </h1>
          
          {/* Mission Statement */}
          <p className="text-lg text-gray-700 font-medium mb-4 max-w-3xl mx-auto">
            Protecting Karnataka's wildlife through <span className="text-green-600 font-semibold">AI-powered identification</span>, 
            <span className="text-orange-600 font-semibold"> conservation education</span>, and 
            <span className="text-green-600 font-semibold"> community action</span>
          </p>
        </div>
      </section>
      
      {/* Animal Slideshow - Blended seamlessly */}
      <AnimalSlideshow />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* Platform Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* How WildGuard Works */}
          <div className="bg-gradient-to-br from-green-50/70 to-emerald-50/70 p-8 rounded-2xl border border-green-100/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-green-600" />
              How WildGuard Works
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200/50">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold text-green-800">Instant Animal Identification</h3>
                  <p className="text-sm text-gray-600">Upload a photo and our AI instantly identifies the species using advanced machine learning</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200/50">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold text-green-800">Conservation Insights</h3>
                  <p className="text-sm text-gray-600">Learn about conservation status, habitat needs, and current threats facing each species</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200/50">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold text-green-800">Connect & Act</h3>
                  <p className="text-sm text-gray-600">Find nearby wildlife centers and conservation organizations to support protection efforts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Wildlife Conservation Matters */}
          <div className="bg-gradient-to-br from-orange-50/70 to-amber-50/70 p-8 rounded-2xl border border-orange-100/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-orange-800 mb-6">Why Wildlife Conservation Matters</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200/50" data-testid="card-conservation-biodiversity">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-orange-800">Biodiversity Crisis</h3>
                  <p className="text-sm text-gray-600">We're losing species 1000x faster than natural rates. Every species plays a crucial role in ecosystem balance.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200/50" data-testid="card-conservation-ecosystem">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-orange-800">Ecosystem Services</h3>
                  <p className="text-sm text-gray-600">Wildlife provides pollination, pest control, water purification, and climate regulation worth trillions globally.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200/50" data-testid="card-conservation-future">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-orange-800">Future Generations</h3>
                  <p className="text-sm text-gray-600">Protecting wildlife today ensures our children inherit a world rich in natural beauty and biodiversity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Karnataka Wildlife Showcase */}
        <div className="bg-gradient-to-br from-slate-50/70 to-gray-50/70 p-8 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Karnataka: A Wildlife Paradise</h2>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-4xl mx-auto">
            Karnataka is home to over 400 bird species, 2000+ flowering plants, and iconic wildlife including tigers, elephants, and the endangered Great Indian Bustard. Our state's 25 wildlife sanctuaries and 5 national parks protect these treasures.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50">
              <h3 className="font-bold text-gray-800 mb-3">🐅 Big Cats</h3>
              <p className="text-sm text-gray-600 mb-4">Karnataka hosts the largest tiger population in India with over 500 tigers across Bandipur, Nagarhole, and BR Hills.</p>
              <div className="text-xs text-green-600 font-semibold">Conservation Status: Protected</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50">
              <h3 className="font-bold text-gray-800 mb-3">🐘 Gentle Giants</h3>
              <p className="text-sm text-gray-600 mb-4">Home to the largest Asian elephant population, our corridors help these ecosystem engineers migrate safely.</p>
              <div className="text-xs text-orange-600 font-semibold">Conservation Status: Endangered</div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50">
              <h3 className="font-bold text-gray-800 mb-3">🦅 Rare Birds</h3>
              <p className="text-sm text-gray-600 mb-4">The Great Indian Bustard and other critically endangered species find refuge in our grasslands and scrublands.</p>
              <div className="text-xs text-red-600 font-semibold">Conservation Status: Critically Endangered</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-sm p-8 rounded-2xl text-white text-center border border-primary/20">
          <h2 className="text-2xl font-bold mb-4">Join the Conservation Movement</h2>
          <p className="text-lg mb-6 opacity-90">Every identification, every photo, every action matters. Help us protect Karnataka's incredible wildlife for future generations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/identify">
              <Button size="lg" variant="secondary" className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm" data-testid="button-cta-identify">
                <Camera className="w-5 h-5 mr-2" />
                Start Identifying Animals
              </Button>
            </Link>
            <Link href="/learn">
              <Button size="lg" variant="outline" className="border-white/70 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm" data-testid="button-cta-learn">
                Learn More About Conservation
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <QuickActions />
    </div>
  );
}
