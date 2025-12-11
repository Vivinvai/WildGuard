import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Navigation, AlertTriangle, Shield } from "lucide-react";
import { useNearestCenter } from "@/hooks/use-nearest-center";
import type { AnimalIdentification } from "@shared/schema";

interface AnimalInfoProps {
  identification: AnimalIdentification;
}

export function AnimalInfo({ identification }: AnimalInfoProps) {
  const [showRescueCenter, setShowRescueCenter] = useState(false);
  const { nearestRescueCenter, isLoading, error, getUserLocation } = useNearestCenter();

  const isEndangered = identification.conservationStatus.toLowerCase().includes('endangered') || 
                      identification.conservationStatus.toLowerCase().includes('critical');
  
  // Only show rescue center for endangered animals
  const shouldShowRescueCenter = isEndangered;

  const getConservationStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critically endangered':
        return 'conservation-critical bg-red-50';
      case 'endangered':
        return 'conservation-endangered bg-orange-50';
      case 'vulnerable':
        return 'conservation-vulnerable bg-yellow-50';
      default:
        return 'conservation-stable bg-green-50';
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Identified: ${identification.speciesName}`,
        text: `I just identified a ${identification.speciesName} (${identification.scientificName}) using WildlifeSave!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const sectionBase = "rounded-xl border border-border/60 bg-white/80 dark:bg-slate-900/70 shadow-sm";
  const mutedText = "text-sm text-muted-foreground leading-relaxed";

  return (
    <Card className="fade-in shadow-lg border border-border/70 bg-white/90 dark:bg-slate-950/70 backdrop-blur" data-testid="animal-info-card">
      <CardContent className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
        <div className="flex items-start gap-4 pb-3 border-b border-border/50">
          <div className="relative shrink-0">
            <img
              src={identification.imageUrl}
              alt={identification.speciesName}
              className="w-24 h-24 rounded-xl object-cover shadow-lg ring-2 ring-primary/20"
              data-testid="img-identified-animal"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          </div>
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-2xl font-bold text-foreground truncate" data-testid="text-species-name">
                  {identification.speciesName}
                </h3>
                <p className="text-muted-foreground text-sm italic truncate" data-testid="text-scientific-name">
                  {identification.scientificName}
                </p>
              </div>
              <span
                className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow ${getConservationStatusColor(identification.conservationStatus)}`}
                data-testid="badge-conservation-status"
              >
                {identification.conservationStatus}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className={`${sectionBase} px-4 py-3 min-h-[96px]`} data-testid="text-confidence">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">AI Confidence</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${Math.min(Math.round(identification.confidence * 100), 99.9)}%` }}
                    ></div>
                  </div>
                  <span className="text-base font-semibold text-primary">
                    {Math.min(Math.round(identification.confidence * 100), 99.9)}%
                  </span>
                </div>
              </div>
              <div className={`${sectionBase} px-4 py-3 min-h-[96px]`}>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Threats</p>
                <p className="font-semibold text-foreground leading-normal mt-1">{identification.threats?.length || 0}</p>
              </div>
              <div className={`${sectionBase} px-4 py-3 min-h-[96px]`}>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Habitat</p>
                <p className="font-semibold text-foreground leading-normal mt-1 whitespace-normal break-words" title={identification.habitat || 'Not recorded'}>
                  {identification.habitat || 'Not recorded'}
                </p>
              </div>
              <div className={`${sectionBase} px-4 py-3 min-h-[96px]`}
                data-testid="text-population">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Population</p>
                <p className="font-semibold text-foreground leading-normal mt-1 whitespace-normal break-words" title={identification.population || 'Not recorded'}>
                  {identification.population && identification.population !== 'Unknown' ? identification.population : 'Not recorded'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location Section - Animal was seen here */}
        {identification.latitude != null && identification.longitude != null && (
          <div className={`${sectionBase} p-4`}> 
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-foreground">Animal was seen here</h4>
                <p className={mutedText} data-testid="text-location-coordinates">
                  📍 {identification.latitude.toFixed(6)}, {identification.longitude.toFixed(6)}
                </p>
                {identification.locationName && (
                  <p className="text-sm font-medium text-foreground" data-testid="text-location-name">
                    {identification.locationName}
                  </p>
                )}
                <a 
                  href={`https://www.google.com/maps?q=${identification.latitude},${identification.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  data-testid="link-view-on-map"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  View on Map
                </a>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {identification.description && (
            <div className={`${sectionBase} p-4`}>
              <h4 className="font-semibold text-foreground mb-2">About this Species</h4>
              <p className={mutedText} data-testid="text-description">
                {identification.description}
              </p>
            </div>
          )}
          
          {/* Conservation Status Section */}
          <div className={`${sectionBase} p-4`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-foreground">Conservation Status</h4>
                {identification.population && identification.population !== 'Unknown' && (
                  <p className="text-sm text-muted-foreground" data-testid="text-population-detail">
                    Population: {identification.population}
                  </p>
                )}
              </div>
              <span
                className={`px-4 py-2 text-sm font-bold rounded-full shadow ${getConservationStatusColor(identification.conservationStatus)}`}
              >
                {identification.conservationStatus}
              </span>
            </div>
          </div>
          
          {/* Habitat & Distribution Section */}
          {identification.habitat && (
            <div className={`${sectionBase} p-4`}>
              <h4 className="font-semibold text-foreground mb-2">🌍 Habitat & Distribution</h4>
              <p className={mutedText} data-testid="text-habitat">
                {identification.habitat}
              </p>
            </div>
          )}
          
          {identification.threats && identification.threats.length > 0 && (
            <div className={`${sectionBase} p-4`}>
              <h4 className="font-semibold text-foreground mb-3">⚠️ Conservation Threats</h4>
              <div className="flex flex-wrap gap-2">
                {identification.threats.map((threat, index) => (
                  <span
                    key={index}
                    className="bg-red-100 dark:bg-red-900/70 text-red-800 dark:text-red-200 px-3 py-1.5 text-xs font-medium rounded-full border border-red-200 dark:border-red-700"
                    data-testid={`badge-threat-${index}`}
                  >
                    {threat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Emergency/Rescue Center Section for ALL Animals */}
          {shouldShowRescueCenter && (
            <div className={`${sectionBase} p-4`}>
              <div className="flex items-center mb-3">
                {isEndangered ? (
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                ) : (
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                )}
                <h4 className={`font-semibold ${
                  isEndangered 
                    ? 'text-orange-800 dark:text-orange-200'
                    : 'text-green-800 dark:text-green-200'
                }`}>
                  {isEndangered ? 'Endangered Species Alert' : 'Wildlife Information & Assistance'}
                </h4>
              </div>
              <p className={`text-sm mb-3 ${
                isEndangered
                  ? 'text-orange-700 dark:text-orange-300'
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {isEndangered 
                  ? `⚠️ This species is ${identification.conservationStatus}. If you've encountered an injured or distressed animal, immediately contact the nearest rescue center.`
                  : `🦁 Conservation Status: ${identification.conservationStatus}. If you spot an injured or distressed ${identification.speciesName}, find help below.`
                }
              </p>
              
              {!showRescueCenter ? (
                <Button
                  onClick={async () => {
                    try {
                      await getUserLocation();
                      setShowRescueCenter(true);
                    } catch (err) {
                      console.error('Location error:', err);
                    }
                  }}
                  disabled={isLoading}
                  className={isEndangered ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}
                  data-testid="button-find-rescue-center"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {isLoading ? 'Getting location...' : 'Find Nearest Rescue Center'}
                </Button>
              ) : (
                <div className="space-y-3">
                  {error && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {nearestRescueCenter ? (
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-semibold text-gray-800 dark:text-gray-200">{nearestRescueCenter.center.name}</h5>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{nearestRescueCenter.center.address}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs" data-testid="text-distance-km">
                            {nearestRescueCenter.distance} km away
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{nearestRescueCenter.center.description}</p>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => window.open(`tel:${nearestRescueCenter.center.phone}`, '_self')}
                            data-testid="button-call"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call Now
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = `https://www.google.com/maps/dir/?api=1&destination=${nearestRescueCenter.center.latitude},${nearestRescueCenter.center.longitude}`;
                              window.open(url, '_blank');
                            }}
                            data-testid="button-directions"
                          >
                            <Navigation className="w-3 h-3 mr-1" />
                            Navigate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        No rescue centers found in your area. Contact local wildlife authorities or check our centers page for more options.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              data-testid="button-support-conservation"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Support Conservation
            </Button>
            <Button
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              onClick={handleShare}
              data-testid="button-share"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
