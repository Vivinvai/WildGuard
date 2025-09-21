import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AnimalIdentification } from "@shared/schema";

interface AnimalInfoProps {
  identification: AnimalIdentification;
}

export function AnimalInfo({ identification }: AnimalInfoProps) {
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

  return (
    <Card className="fade-in shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm" data-testid="animal-info-card">
      <CardContent className="p-6">
        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-4 rounded-xl mb-6">
          <h2 className="text-xl font-bold text-center mb-4 text-foreground">🌿 Species Identified</h2>
        </div>
        
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative">
            <img
              src={identification.imageUrl}
              alt={identification.speciesName}
              className="w-24 h-24 rounded-xl object-cover shadow-lg ring-2 ring-primary/20"
              data-testid="img-identified-animal"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" data-testid="text-species-name">
              {identification.speciesName}
            </h3>
            <p className="text-muted-foreground text-sm italic" data-testid="text-scientific-name">
              {identification.scientificName}
            </p>
            <div className="flex items-center mt-2">
              <span
                className={`px-4 py-2 text-xs font-bold rounded-full shadow-md ${getConservationStatusColor(identification.conservationStatus)}`}
                data-testid="badge-conservation-status"
              >
                {identification.conservationStatus}
              </span>
              {identification.population && identification.population !== 'Unknown' && (
                <span className="ml-2 text-xs text-muted-foreground" data-testid="text-population">
                  Population: {identification.population}
                </span>
              )}
            </div>
            <div className="mt-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-foreground">
                  AI Confidence:
                </span>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${Math.round(identification.confidence * 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-primary">
                  {Math.round(identification.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Habitat & Distribution</h4>
            <p className="text-sm text-muted-foreground" data-testid="text-habitat">
              {identification.habitat}
            </p>
          </div>
          
          {identification.threats && identification.threats.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Conservation Threats</h4>
              <div className="flex flex-wrap gap-2">
                {identification.threats.map((threat, index) => (
                  <span
                    key={index}
                    className="bg-muted px-2 py-1 text-xs rounded"
                    data-testid={`badge-threat-${index}`}
                  >
                    {threat}
                  </span>
                ))}
              </div>
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
