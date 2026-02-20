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
    setCurrentIdentification(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 space-y-10">
        <BackButton />
        
        {/* Hero Section */}
        <div className="text-center py-10 px-6 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-slate-800 dark:via-emerald-900/50 dark:to-slate-800 rounded-3xl border-2 border-emerald-200 dark:border-emerald-600 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent mb-5">
            🔍 Animal Identification
          </h1>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed">
            Upload a photo to instantly identify animals and learn about their conservation status using our advanced AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-12 items-start">
          {/* Photo Upload Section */}
          <div className="space-y-8">
            <PhotoUpload onIdentificationResult={handleIdentificationResult} />
          </div>

          {/* Animal Info Card - shown after identification */}
          <div className="space-y-8 lg:sticky lg:top-8">
            {currentIdentification ? (
              <AnimalInfo identification={currentIdentification} />
            ) : (
              <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-10 rounded-3xl border-2 border-slate-200 dark:border-slate-600 shadow-xl text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-600 flex items-center justify-center shadow-lg">
                    <span className="text-4xl">🐾</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Ready to Identify Wildlife</h3>
                  <p className="text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Upload an animal photo to see detailed information about the species, conservation status, and habitat.
                  </p>
                </div>
                
                <div className="space-y-4 text-left max-w-md mx-auto">
                  <div className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl border border-emerald-200 dark:border-emerald-700">
                    <div className="w-8 h-8 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">AI-powered species identification</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/40 rounded-xl border border-orange-200 dark:border-orange-700">
                    <div className="w-8 h-8 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Conservation status insights</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/40 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Habitat and threat information</span>
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