import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, Camera, TreePine, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GetStarted() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/home");
  };

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 dark:from-gray-950 dark:via-emerald-950/20 dark:to-gray-900 overflow-hidden relative">
        {/* Animated background patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-400/20 dark:from-green-600/10 dark:to-emerald-600/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 dark:from-orange-600/10 dark:to-amber-600/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 dark:from-cyan-600/5 dark:to-blue-600/5 rounded-full blur-3xl"
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2, 
                type: "spring", 
                stiffness: 200 
              }}
              className="flex justify-center mb-8"
            >
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="relative w-40 h-40"
                >
                  {/* Main shield icon */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 dark:from-green-600 dark:via-emerald-600 dark:to-green-700 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-3 transition-transform group-hover:rotate-6">
                    <img 
                      src="/attached_assets/icons8-guard-48_1758461926293.png" 
                      alt="Guard Shield" 
                      className="w-20 h-20 opacity-90 drop-shadow-lg"
                    />
                  </div>
                  {/* Wildlife badge overlay */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                    className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 dark:from-orange-600 dark:to-amber-700 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-900"
                  >
                    <img 
                      src="/attached_assets/icons8-wildlife-64_1758461915368.png" 
                      alt="Wildlife" 
                      className="w-9 h-9 drop-shadow-md"
                    />
                  </motion.div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-orange-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6"
            >
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold mb-2 tracking-tight">
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 dark:from-green-400 dark:via-emerald-400 dark:to-green-500 bg-clip-text text-transparent">
                  Wild
                </span>
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 dark:from-orange-400 dark:via-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
                  Guard
                </span>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 font-semibold">
                AI Wildlife Protection Platform
              </p>
            </motion.div>

            {/* Mission statement */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Protecting Karnataka's incredible biodiversity through{" "}
              <span className="text-green-600 dark:text-green-400 font-bold">AI-powered identification</span>,{" "}
              <span className="text-orange-600 dark:text-orange-400 font-bold">habitat monitoring</span>, and{" "}
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">community action</span>
            </motion.p>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto"
            >
              {/* Identify Wildlife */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-200 dark:border-green-800/50 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Identify Wildlife</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI species recognition</p>
              </motion.div>

              {/* Discover Flora */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-200 dark:border-orange-800/50 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <TreePine className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Discover Flora</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Plant identification</p>
              </motion.div>

              {/* Find Centers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-800/50 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Find Centers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Wildlife sanctuaries</p>
              </motion.div>

              {/* Take Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-red-200 dark:border-red-800/50 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Take Action</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Join conservation</p>
              </motion.div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.3, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="text-xl px-12 py-8 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 dark:from-green-500 dark:via-emerald-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:via-emerald-600 dark:hover:to-green-700 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                data-testid="button-get-started"
              >
                <span className="relative z-10 flex items-center font-bold">
                  Let's Get Started
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="flex flex-wrap justify-center gap-8 text-center"
            >
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Species Tracked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Identifications</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">15+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Protected Areas</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex items-start justify-center p-2"
          >
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full" 
            />
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
