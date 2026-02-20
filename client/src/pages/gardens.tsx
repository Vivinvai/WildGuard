import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Leaf, Phone, Mail, Clock, Star, Globe, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { motionConfig } from "@/lib/motionConfig";
import type { BotanicalGarden } from "@shared/schema";

export default function Gardens() {
  const [selectedGarden, setSelectedGarden] = useState<BotanicalGarden | null>(null);
  const gardensGrid = useScrollAnimation();

  const { data: gardens, isLoading } = useQuery<BotanicalGarden[]>({
    queryKey: ["/api/botanical-gardens"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 p-4 rounded-full ring-2 ring-emerald-300 dark:ring-emerald-600 shadow-lg"
            >
              <Leaf className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">
            Botanical Gardens in Karnataka
          </h1>
          <p className="text-center text-lg text-slate-600 dark:text-slate-200">
            Explore botanical gardens preserving India's rich plant diversity
          </p>
        </motion.section>

        <motion.div
          ref={gardensGrid.ref}
          initial="hidden"
          animate={gardensGrid.isVisible ? "visible" : "hidden"}
          variants={motionConfig.variants.staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {isLoading && (
            <motion.div variants={motionConfig.variants.fadeInUp} className="col-span-full">
              <Card className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-600 text-center shadow-xl">
                <p className="text-slate-600 dark:text-slate-300">Loading gardens...</p>
              </Card>
            </motion.div>
          )}
          
          {!isLoading && gardens && gardens.length === 0 && (
            <motion.div variants={motionConfig.variants.fadeInUp} className="col-span-full">
              <Card className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-600 text-center shadow-xl">
                <p className="text-slate-600 dark:text-slate-300">No botanical gardens found</p>
              </Card>
            </motion.div>
          )}

          {gardens?.map((garden) => (
            <motion.div
              key={garden.id}
              variants={motionConfig.variants.fadeInUp}
              whileHover={{ scale: 1.02, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="p-6 cursor-pointer bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-600 shadow-xl hover:shadow-2xl hover:border-red-400 dark:hover:border-red-500 hover:ring-2 hover:ring-red-200 dark:hover:ring-red-900/50 transition-all duration-300 h-full"
                onClick={() => setSelectedGarden(garden)}
                data-testid={`card-garden-${garden.id}`}
              >
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2" data-testid="text-garden-name">
                    {garden.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {garden.description}
                  </p>
                </div>

                <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full w-fit ring-1 ring-amber-300 dark:ring-amber-700">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">{garden.rating}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{garden.phone}</span>
                  </div>
                  
                  {garden.email && (
                    <div className="flex items-start space-x-2 text-muted-foreground dark:text-gray-400">
                      <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{garden.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-2 text-muted-foreground dark:text-gray-400">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{garden.hours}</span>
                  </div>

                  {garden.website && (
                    <div className="flex items-start space-x-2 text-muted-foreground dark:text-gray-400">
                      <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <a 
                        href={garden.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary dark:text-green-400 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {garden.specializations && garden.specializations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-foreground dark:text-white mb-2">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {garden.specializations.map((spec, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-border dark:border-gray-800">
                  <div className="flex items-start space-x-2 text-xs text-muted-foreground dark:text-gray-500">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{garden.address}</span>
                  </div>
                </div>
              </div>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
