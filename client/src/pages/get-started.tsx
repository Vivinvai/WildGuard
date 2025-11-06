import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Leaf, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GetStarted() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-orange-50 dark:from-gray-950 dark:via-emerald-950 dark:to-gray-900 overflow-hidden relative">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute top-20 left-10 animate-float">
          <Leaf className="w-32 h-32 text-green-600 dark:text-green-400" />
        </div>
        <div className="absolute bottom-20 right-20 animate-float-delayed">
          <Shield className="w-40 h-40 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-slow">
          <Sparkles className="w-24 h-24 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Logo and brand */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-orange-500 dark:from-green-600 dark:to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Shield className="w-16 h-16 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center shadow-xl">
                <Leaf className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="text-green-600 dark:text-green-400">Wild</span>
            <span className="text-orange-600 dark:text-orange-400">Guard</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl sm:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 mb-8 font-medium"
          >
            AI-Powered Wildlife & Flora Conservation Platform
          </motion.p>

          {/* Mission statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Protecting Karnataka's incredible biodiversity through{" "}
            <span className="text-green-600 dark:text-green-400 font-semibold">AI-powered identification</span>,{" "}
            <span className="text-orange-600 dark:text-orange-400 font-semibold">habitat monitoring</span>, and{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">community action</span>
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Identify Wildlife</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Instant AI species recognition</p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-orange-800">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Leaf className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Discover Flora</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Plant identification & gardens</p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-emerald-200 dark:border-emerald-800">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Track Habitat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-time deforestation alerts</p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2, type: "spring", stiffness: 200 }}
          >
            <Button
              onClick={() => setLocation("/home")}
              size="lg"
              className="text-lg px-10 py-7 bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700 dark:from-green-500 dark:to-orange-500 dark:hover:from-green-600 dark:hover:to-orange-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
              data-testid="button-get-started"
            >
              Let's Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-8 text-sm text-gray-500 dark:text-gray-500"
          >
            Join thousands protecting Karnataka's natural heritage
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}
