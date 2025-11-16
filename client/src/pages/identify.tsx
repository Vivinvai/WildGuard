import { useState } from "react";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { PhotoUpload } from "@/components/photo-upload";
import { AnimalInfo } from "@/components/animal-info";
import { QuickActions } from "@/components/quick-actions";
import type { AnimalIdentification } from "@shared/schema";

export default function Identify() {
  const [currentIdentification, setCurrentIdentification] = useState<AnimalIdentification | null>(null);

  const handleIdentificationResult = (result: AnimalIdentification) => {
    console.log('🎯 handleIdentificationResult called in Identify page with:', result);
    setCurrentIdentification(result);
    console.log('✅ State updated, currentIdentification should now be:', result);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <BackButton />
        {/* Hero Section */}
        <div className="text-center py-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            🔍 Animal Identification
          </h1>
          <p className="text-lg text-green-600 max-w-2xl mx-auto">
            Upload a photo to instantly identify animals and learn about their conservation status using our advanced AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photo Upload Section */}
          <div className="space-y-6">
            <PhotoUpload onIdentificationResult={handleIdentificationResult} />
          </div>

          {/* Animal Info Card - shown after identification */}
          <div className="space-y-6">
            {currentIdentification ? (
              <AnimalInfo identification={currentIdentification} />
            ) : (
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-8 rounded-2xl border border-slate-200 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Ready to Identify</h3>
                <p className="text-gray-600 mb-6">Upload an animal photo to see detailed information about the species, conservation status, and habitat.</p>
                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>AI-powered species identification</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Conservation status insights</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Habitat and threat information</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <QuickActions />
    </div>
  );
}