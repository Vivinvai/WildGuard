import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { EnhancedSlideshow } from "@/components/enhanced-slideshow";
import { QuickActions } from "@/components/quick-actions";
import { Button } from "@/components/ui/button";
import { Shield, Camera, Sparkles, Leaf } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-32">
      <Header />
      
      {/* WildGuard Brand Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-800 dark:via-emerald-900/50 dark:to-slate-800 py-12 border-b-4 border-gradient-to-r from-red-500 via-orange-500 to-green-500"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Combined Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-2xl flex items-center justify-center ring-4 ring-red-400/40 dark:ring-red-600/50">
                <img 
                  src="/attached_assets/icons8-guard-48_1758461926293.png" 
                  alt="Guard Shield" 
                  className="w-14 h-14 opacity-90"
                  data-testid="logo-shield"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg border-3 border-white dark:border-slate-800">
                <img 
                  src="/attached_assets/icons8-wildlife-64_1758461915368.png" 
                  alt="Wildlife" 
                  className="w-6 h-6"
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
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight"
          >
            <span className="bg-gradient-to-r from-green-700 via-green-600 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
              Wild
            </span>
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
              Guard
            </span>
          </motion.h1>
          
          {/* Mission Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium mb-4 max-w-4xl mx-auto leading-relaxed"
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
            whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.3 } }}
            className="bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border-2 border-emerald-300 dark:border-emerald-600 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-red-400 dark:hover:border-red-500 hover:ring-4 hover:ring-red-200/50 dark:hover:ring-red-900/30 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-6 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-green-600 dark:text-green-400" />
              How WildGuard Works
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start space-x-3 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700">
                <div className="w-8 h-8 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Instant Animal Identification</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Upload a photo and our AI instantly identifies the species using advanced machine learning</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700">
                <div className="w-8 h-8 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Conservation Insights</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Learn about conservation status, habitat needs, and current threats facing each species</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700">
                <div className="w-8 h-8 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
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
            whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.3 } }}
            className="bg-gradient-to-br from-white to-orange-50/30 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border-2 border-orange-300 dark:border-orange-600 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-red-500 dark:hover:border-red-400 hover:ring-4 hover:ring-orange-200/50 dark:hover:ring-red-900/30 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-300 mb-6">Why Wildlife Conservation Matters</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start space-x-3 bg-orange-50 dark:bg-orange-900/40 rounded-xl p-4 border border-orange-200 dark:border-orange-700" data-testid="card-conservation-biodiversity">
                <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Biodiversity Crisis</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">We're losing species 1000x faster than natural rates. Every species plays a crucial role in ecosystem balance.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-orange-50 dark:bg-orange-900/40 rounded-xl p-4 border border-orange-200 dark:border-orange-700" data-testid="card-conservation-ecosystem">
                <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Ecosystem Services</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Wildlife provides pollination, pest control, water purification, and climate regulation worth trillions globally.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-orange-50 dark:bg-orange-900/40 rounded-xl p-4 border border-orange-200 dark:border-orange-700" data-testid="card-conservation-future">
                <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full mt-2"></div>
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
          className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-600 backdrop-blur-sm shadow-xl"
        >
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">Karnataka: A Wildlife Paradise</h2>
          <p className="text-lg text-slate-600 dark:text-slate-200 text-center mb-8 max-w-4xl mx-auto">
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
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-700 dark:to-slate-800 backdrop-blur-sm p-6 rounded-xl shadow-md border-2 border-emerald-300 dark:border-slate-600 hover:shadow-xl hover:border-red-400 dark:hover:border-red-500 hover:ring-4 hover:ring-red-200/50 dark:hover:ring-red-900/30 transition-all duration-300"
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">🐅 Big Cats</h3>
              <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">Karnataka hosts the largest tiger population in India with over 500 tigers across Bandipur, Nagarhole, and BR Hills.</p>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Conservation Status: Protected</div>
            </motion.div>
            
            <motion.div
              variants={motionConfig.variants.scaleIn}
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-700 dark:to-slate-800 backdrop-blur-sm p-6 rounded-xl shadow-md border-2 border-orange-300 dark:border-slate-600 hover:shadow-xl hover:border-orange-500 dark:hover:border-orange-400 hover:ring-4 hover:ring-orange-200/50 dark:hover:ring-orange-900/30 transition-all duration-300"
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">🐘 Gentle Giants</h3>
              <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">Home to the largest Asian elephant population, our corridors help these ecosystem engineers migrate safely.</p>
              <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">Conservation Status: Endangered</div>
            </motion.div>
            
            <motion.div
              variants={motionConfig.variants.scaleIn}
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-white to-red-50/50 dark:from-slate-700 dark:to-slate-800 backdrop-blur-sm p-6 rounded-xl shadow-md border-2 border-red-300 dark:border-slate-600 hover:shadow-xl hover:border-red-500 dark:hover:border-red-400 hover:ring-4 hover:ring-red-200/50 dark:hover:ring-red-900/30 transition-all duration-300"
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">🦅 Rare Birds</h3>
              <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">The Great Indian Bustard and other critically endangered species find refuge in our grasslands and scrublands.</p>
              <div className="text-xs text-red-600 dark:text-red-400 font-semibold">Conservation Status: Critically Endangered</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Karnataka Flora Showcase */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={motionConfig.variants.fadeInUp}
          className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border-2 border-emerald-200 dark:border-emerald-600 backdrop-blur-sm shadow-xl"
        >
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">Karnataka: Botanical Treasure Trove</h2>
          <p className="text-lg text-slate-600 dark:text-slate-200 text-center mb-8 max-w-4xl mx-auto">
            From the lush Western Ghats to coastal mangroves, Karnataka hosts over 4,000 plant species including 400 endemic species. Our rich flora includes medicinal plants, ancient trees, and vibrant flowering species vital to our ecosystem.
          </p>
          
          <motion.div
            variants={motionConfig.variants.staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <motion.div
              variants={motionConfig.variants.scaleIn}
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-white to-green-50/50 dark:from-slate-700 dark:to-slate-800 backdrop-blur-sm p-6 rounded-xl shadow-md border-2 border-green-300 dark:border-emerald-600 hover:shadow-xl hover:border-green-500 dark:hover:border-green-400 hover:ring-4 hover:ring-green-200/50 dark:hover:ring-green-900/30 transition-all duration-300"
              data-testid="card-flora-ancient-trees"
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">🌳 Ancient Trees</h3>
              <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">Sacred fig, banyan, and teak trees centuries old form the backbone of our forests, providing habitat for countless species.</p>
              <div className="text-xs text-green-600 dark:text-green-400 font-semibold">Age: 200-500 years</div>
            </motion.div>
            
            <motion.div
              variants={motionConfig.variants.scaleIn}
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-700 dark:to-slate-800 backdrop-blur-sm p-6 rounded-xl shadow-md border-2 border-orange-300 dark:border-emerald-600 hover:shadow-xl hover:border-red-400 dark:hover:border-red-500 hover:ring-4 hover:ring-orange-200/50 dark:hover:ring-red-900/30 transition-all duration-300"
              data-testid="card-flora-endemic"
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">🌺 Endemic Flora</h3>
              <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">Western Ghats harbors unique species found nowhere else - orchids, rhododendrons, and carnivorous plants thrive here.</p>
              <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">Status: Unique to Region</div>
            </motion.div>
            
            <motion.div
              variants={motionConfig.variants.scaleIn}
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-white to-teal-50/50 dark:from-slate-700 dark:to-slate-800 backdrop-blur-sm p-6 rounded-xl shadow-md border-2 border-teal-300 dark:border-emerald-600 hover:shadow-xl hover:border-teal-500 dark:hover:border-teal-400 hover:ring-4 hover:ring-teal-200/50 dark:hover:ring-teal-900/30 transition-all duration-300"
              data-testid="card-flora-medicinal"
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">🌿 Medicinal Plants</h3>
              <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">Over 500 medicinal plant species including ashwagandha, tulsi, and neem are vital for traditional Ayurvedic medicine.</p>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Uses: Traditional Medicine</div>
            </motion.div>

            <motion.div
              variants={motionConfig.variants.scaleIn}
              whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
              className="bg-gradient-to-br from-white to-pink-50/50 dark:from-slate-700 dark:to-slate-800 backdrop-blur-sm p-6 rounded-xl shadow-md border-2 border-pink-300 dark:border-emerald-600 hover:shadow-xl hover:border-pink-500 dark:hover:border-pink-400 hover:ring-4 hover:ring-pink-200/50 dark:hover:ring-pink-900/30 transition-all duration-300"
              data-testid="card-flora-flowering"
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">🌸 Flowering Species</h3>
              <p className="text-sm text-slate-600 dark:text-slate-200 mb-4">Karnataka's state flower, the lotus, along with jasmine, hibiscus, and countless orchids paint our landscapes with color.</p>
              <div className="text-xs text-pink-600 dark:text-pink-400 font-semibold">Diversity: 2,000+ Species</div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/flora">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg"
                data-testid="button-identify-flora"
              >
                <Leaf className="w-5 h-5 mr-2" />
                Identify Flora with AI
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          ref={cta.ref}
          initial="hidden"
          animate={cta.isVisible ? "visible" : "hidden"}
          variants={motionConfig.variants.fadeInUp}
          className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-900 dark:via-green-900 dark:to-teal-900 backdrop-blur-sm p-8 rounded-2xl text-white text-center border-4 border-orange-400 dark:border-red-500 shadow-2xl ring-4 ring-orange-200/50 dark:ring-red-900/30"
        >
          <h2 className="text-2xl font-bold mb-4">Join the Conservation Movement</h2>
          <p className="text-lg mb-6 opacity-90">Every identification, every photo, every action matters. Help us protect Karnataka's incredible wildlife for future generations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/identify">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all" data-testid="button-cta-identify">
                <Camera className="w-5 h-5 mr-2" />
                Start Identifying Animals
              </Button>
            </Link>
            <Link href="/learn">
              <Button size="lg" variant="outline" className="border-white/70 bg-white/20 text-white hover:bg-white/30 dark:border-slate-400/70 dark:bg-slate-700/50 dark:hover:bg-slate-700/70 backdrop-blur-sm" data-testid="button-cta-learn">
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
