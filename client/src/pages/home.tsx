import { useState } from "react";
import { Header } from "@/components/header";
import { PhotoUpload } from "@/components/photo-upload";
import { AnimalInfo } from "@/components/animal-info";
import { WildlifeMap } from "@/components/wildlife-map";
import { QuickActions } from "@/components/quick-actions";
import { AIChat } from "@/components/ai-chat";
import type { AnimalIdentification } from "@shared/schema";

export default function Home() {
  const [currentIdentification, setCurrentIdentification] = useState<AnimalIdentification | null>(null);

  const handleIdentificationResult = (result: AnimalIdentification) => {
    setCurrentIdentification(result);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Photo Upload Section */}
          <div className="xl:col-span-4 space-y-6">
            <PhotoUpload onIdentificationResult={handleIdentificationResult} />
            
            {/* Animal Info Card - shown after identification */}
            {currentIdentification && (
              <AnimalInfo identification={currentIdentification} />
            )}
          </div>

          {/* Chat Section */}
          <div className="xl:col-span-4 space-y-6">
            <AIChat />
          </div>

          {/* Map Section */}
          <div className="xl:col-span-4">
            <WildlifeMap />
          </div>
        </div>
      </main>

      <QuickActions />
    </div>
  );
}
