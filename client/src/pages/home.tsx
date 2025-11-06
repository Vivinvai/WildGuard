import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { EnhancedSlideshow } from "@/components/enhanced-slideshow";
import { QuickActions } from "@/components/quick-actions";
import { Button } from "@/components/ui/button";
import { Shield, Camera, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { motionConfig } from "@/lib/motionConfig";
import type { AnimalIdentification } from "@shared/schema";

export default function Home() {
  const [currentIdentification, setCurrentIdentification] = useState<AnimalIdentification | null>(null);
  const platformInfo = useScrollAnimation();
  const showcase = useScrollAnimation();
  const cta = useScrollAnimation();

  const handleIdentificationResult = (result: AnimalIdentification) => {
    setCurrentIdentification(result);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <Header />
      
      {/* WildGuard Brand Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-green-50/50 via-white to-orange-50/50 dark:from-green-950/30 dark:via-gray-950 dark:to-orange-950/30 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Combined Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="flex justify-center mb-4"
          >
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
          </motion.div>
          
          {/* Brand Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-3"
          >
            <span className="bg-gradient-to-r from-green-700 via-green-600 to-orange-600 bg-clip-text text-transparent">
              Wild
            </span>
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
              Guard
            </span>
          </motion.h1>
          
          {/* Mission Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-4 max-w-3xl mx-auto"
          >
            Protecting Karnataka's wildlife through <span className="text-green-600 dark:text-green-400 font-semibold">AI-powered identification</span>, 
            <span className="text-orange-600 dark:text-orange-400 font-semibold"> conservation education</span>, and 
            <span className="text-green-600 dark:text-green-400 font-semibold"> community action</span>
          </motion.p>
        </div>
      </motion.section>
      
      {/* Enhanced Animal Slideshow */}
      <EnhancedSlideshow />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* Platform Information */}
        <motion.div
          ref={platformInfo.ref}
          initial="hidden"
          animate={platformInfo.isVisible ? "visible" : "hidden"}
          variants={motionConfig.variants.staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* How WildGuard Works */}
          <motion.div
            variants={motionConfig.variants.fadeInUp}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            className="bg-gradient-to-br from-green-50/70 to-emerald-50/70 dark:from-green-950/30 dark:to-emerald-950/30 p-8 rounded-2xl border border-green-100/50 dark:border-green-800/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-6 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-green-600 dark:text-green-400" />
              How WildGuard Works
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start space-x-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
                <div className="w-8 h-8 bg-green-200 dark:bg-green-900 rounded-full flex items-center justify-center text-green-800 dark:text-green-300 font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-400">Instant Animal Identification</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upload a photo and our AI instantly identifies the species using advanced machine learning</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
                <div className="w-8 h-8 bg-green-200 dark:bg-green-900 rounded-full flex items-center justify-center text-green-800 dark:text-green-300 font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-400">Conservation Insights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn about conservation status, habitat needs, and current threats facing each species</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
                <div className="w-8 h-8 bg-green-200 dark:bg-green-900 rounded-full flex items-center justify-center text-green-800 dark:text-green-300 font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-400">Connect & Act</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Find nearby wildlife centers and conservation organizations to support protection efforts</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Why Wildlife Conservation Matters */}
          <motion.div
            variants={motionConfig.variants.fadeInUp}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            className="bg-gradient-to-br from-orange-50/70 to-amber-50/70 dark:from-orange-950/30 dark:to-amber-950/30 p-8 rounded-2xl border border-orange-100/50 dark:border-orange-800/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-400 mb-6">Why Wildlife Conservation Matters</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start space-x-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50" data-testid="card-conservation-biodiversity">
                <div className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-400">Biodiversity Crisis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">We're losing species 1000x faster than natural rates. Every species plays a crucial role in ecosystem balance.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50" data-testid="card-conservation-ecosystem">
                <div className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-400">Ecosystem Services</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Wildlife provides pollination, pest control, water purification, and climate regulation worth trillions globally.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50" data-testid="card-conservation-future">
                <div className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-400">Future Generations</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Protecting wildlife today ensures our children inherit a world rich in natural beauty and biodiversity.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Karnataka Wildlife Showcase */}
        <motion.div
          ref={showcase.ref}
          initial="hidden"
          animate={showcase.isVisible ? "visible" : "hidden"}
          variants={motionConfig.variants.fadeInUp}
          className="bg-gradient-to-br from-slate-50/70 to-gray-50/70 dark:from-slate-950/30 dark:to-gray-950/30 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm shadow-lg"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">Karnataka: A Wildlife Paradise</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8 max-w-4xl mx-auto">
            Karnataka is home to over 400 bird species, 2000+ flowering plants, and iconic wildlife including tigers, elephants, and the endangered Great Indian Bustard. Our state's 25 wildlife sanctuaries and 5 national parks protect these treasures.
          </p>
          
          <motion.div
            variants={motionConfig.variants.staggerContainer}
            initial="hidden"
            animate={showcase.isVisible ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              variants={motionConfig.variants.scaleIn}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50 dark:border-gray-800/50 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">🐅 Big Cats</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Karnataka hosts the largest tiger population in India with over 500 tigers across Bandipur, Nagarhole, and BR Hills.</p>
              <div className="text-xs text-green-600 dark:text-green-400 font-semibold">Conservation Status: Protected</div>
            </motion.div>
            
            <motion.div
              variants={motionConfig.variants.scaleIn}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50 dark:border-gray-800/50 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">🐘 Gentle Giants</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Home to the largest Asian elephant population, our corridors help these ecosystem engineers migrate safely.</p>
              <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">Conservation Status: Endangered</div>
            </motion.div>
            
            <motion.div
              variants={motionConfig.variants.scaleIn}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100/50 dark:border-gray-800/50 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">🦅 Rare Birds</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">The Great Indian Bustard and other critically endangered species find refuge in our grasslands and scrublands.</p>
              <div className="text-xs text-red-600 dark:text-red-400 font-semibold">Conservation Status: Critically Endangered</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          ref={cta.ref}
          initial="hidden"
          animate={cta.isVisible ? "visible" : "hidden"}
          variants={motionConfig.variants.fadeInUp}
          className="bg-gradient-to-br from-green-900 via-black to-orange-900 dark:from-green-950 dark:via-gray-950 dark:to-orange-950 backdrop-blur-sm p-8 rounded-2xl text-white text-center border border-green-400/20 dark:border-green-600/30 shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-4">Join the Conservation Movement</h2>
          <p className="text-lg mb-6 opacity-90">Every identification, every photo, every action matters. Help us protect Karnataka's incredible wildlife for future generations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/identify">
              <Button size="lg" variant="secondary" className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 backdrop-blur-sm border border-green-400/20" data-testid="button-cta-identify">
                <Camera className="w-5 h-5 mr-2" />
                Start Identifying Animals
              </Button>
            </Link>
            <Link href="/learn">
              <Button size="lg" variant="outline" className="border-orange-400/70 bg-orange-600/20 text-white hover:bg-orange-600/30 dark:border-orange-500/70 dark:bg-orange-700/20 dark:hover:bg-orange-700/30 backdrop-blur-sm" data-testid="button-cta-learn">
                Learn More About Conservation
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <QuickActions />
    </div>
  );
}
