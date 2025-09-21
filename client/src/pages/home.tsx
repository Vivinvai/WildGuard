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
      
      {/* Animal Slideshow - Below WildGuard heading */}
      <AnimalSlideshow />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            🛡️ Protect Wildlife with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload a photo to instantly identify animals and learn about their conservation status. Connect with local wildlife centers to take action.
          </p>
        </div>

        {/* Platform Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* How WildGuard Works */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-green-600" />
              How WildGuard Works
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold text-green-800">Instant Animal Identification</h3>
                  <p className="text-sm">Upload a photo and our AI instantly identifies the species using advanced machine learning</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold text-green-800">Conservation Insights</h3>
                  <p className="text-sm">Learn about conservation status, habitat needs, and current threats facing each species</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold text-green-800">Connect & Act</h3>
                  <p className="text-sm">Find nearby wildlife centers and conservation organizations to support protection efforts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Wildlife Conservation Matters */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-100">
            <h2 className="text-2xl font-bold text-orange-800 mb-6">Why Wildlife Conservation Matters</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-orange-800">Biodiversity Crisis</h3>
                  <p className="text-sm">We're losing species 1000x faster than natural rates. Every species plays a crucial role in ecosystem balance.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-orange-800">Ecosystem Services</h3>
                  <p className="text-sm">Wildlife provides pollination, pest control, water purification, and climate regulation worth trillions globally.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-orange-800">Future Generations</h3>
                  <p className="text-sm">Protecting wildlife today ensures our children inherit a world rich in natural beauty and biodiversity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Karnataka Wildlife Showcase */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-8 rounded-2xl border border-slate-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Karnataka: A Wildlife Paradise</h2>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-4xl mx-auto">
            Karnataka is home to over 400 bird species, 2000+ flowering plants, and iconic wildlife including tigers, elephants, and the endangered Great Indian Bustard. Our state's 25 wildlife sanctuaries and 5 national parks protect these treasures.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">🐅 Big Cats</h3>
              <p className="text-sm text-gray-600 mb-4">Karnataka hosts the largest tiger population in India with over 500 tigers across Bandipur, Nagarhole, and BR Hills.</p>
              <div className="text-xs text-green-600 font-semibold">Conservation Status: Protected</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">🐘 Gentle Giants</h3>
              <p className="text-sm text-gray-600 mb-4">Home to the largest Asian elephant population, our corridors help these ecosystem engineers migrate safely.</p>
              <div className="text-xs text-orange-600 font-semibold">Conservation Status: Endangered</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">🦅 Rare Birds</h3>
              <p className="text-sm text-gray-600 mb-4">The Great Indian Bustard and other critically endangered species find refuge in our grasslands and scrublands.</p>
              <div className="text-xs text-red-600 font-semibold">Conservation Status: Critically Endangered</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-2xl text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Join the Conservation Movement</h2>
          <p className="text-lg mb-6 opacity-90">Every identification, every photo, every action matters. Help us protect Karnataka's incredible wildlife for future generations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/identify">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" data-testid="button-cta-identify">
                <Camera className="w-5 h-5 mr-2" />
                Start Identifying Animals
              </Button>
            </Link>
            <Link href="/learn">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" data-testid="button-cta-learn">
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
