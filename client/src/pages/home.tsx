import { useState } from "react";
import { Header } from "@/components/header";
import { PhotoUpload } from "@/components/photo-upload";
import { AnimalInfo } from "@/components/animal-info";
import { WildlifeMap } from "@/components/wildlife-map";
import { QuickActions } from "@/components/quick-actions";
import type { AnimalIdentification } from "@shared/schema";

export default function Home() {
  const [currentIdentification, setCurrentIdentification] = useState<AnimalIdentification | null>(null);

  const handleIdentificationResult = (result: AnimalIdentification) => {
    setCurrentIdentification(result);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <PhotoUpload onIdentificationResult={handleIdentificationResult} />
            
            {/* Animal Info Card - shown after identification */}
            {currentIdentification && (
              <AnimalInfo identification={currentIdentification} />
            )}
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2">
            <WildlifeMap />
          </div>
        </div>
      </main>

      <QuickActions />
    </div>
  );
}
