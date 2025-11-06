import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Leaf, Phone, Mail, Clock, Star, Globe, MapPin } from "lucide-react";
import type { BotanicalGarden } from "@shared/schema";

export default function Gardens() {
  const [selectedGarden, setSelectedGarden] = useState<BotanicalGarden | null>(null);

  const { data: gardens, isLoading } = useQuery<BotanicalGarden[]>({
    queryKey: ["/api/botanical-gardens"],
  });

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-950/30 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center text-foreground dark:text-white mb-2">
            Botanical Gardens in Karnataka
          </h1>
          <p className="text-center text-lg text-muted-foreground dark:text-gray-400">
            Explore botanical gardens preserving India's rich plant diversity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading && (
            <Card className="p-6 bg-card dark:bg-gray-900 text-center col-span-full">
              <p className="text-muted-foreground dark:text-gray-400">Loading gardens...</p>
            </Card>
          )}
          
          {!isLoading && gardens && gardens.length === 0 && (
            <Card className="p-6 bg-card dark:bg-gray-900 text-center col-span-full">
              <p className="text-muted-foreground dark:text-gray-400">No botanical gardens found</p>
            </Card>
          )}

          {gardens?.map((garden) => (
            <Card 
              key={garden.id}
              className="p-6 cursor-pointer transition-all bg-card dark:bg-gray-900 border-border dark:border-gray-800 hover:shadow-lg dark:hover:border-green-600"
              onClick={() => setSelectedGarden(garden)}
              data-testid={`card-garden-${garden.id}`}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-xl text-foreground dark:text-white mb-2" data-testid="text-garden-name">
                    {garden.name}
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    {garden.description}
                  </p>
                </div>

                <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{garden.rating}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2 text-muted-foreground dark:text-gray-400">
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
          ))}
        </div>
      </main>
    </div>
  );
}
