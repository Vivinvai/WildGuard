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
    <Card className="fade-in" data-testid="animal-info-card">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={identification.imageUrl}
            alt={identification.speciesName}
            className="w-20 h-20 rounded-lg object-cover"
            data-testid="img-identified-animal"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold" data-testid="text-species-name">
              {identification.speciesName}
            </h3>
            <p className="text-muted-foreground text-sm" data-testid="text-scientific-name">
              {identification.scientificName}
            </p>
            <div className="flex items-center mt-2">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${getConservationStatusColor(identification.conservationStatus)}`}
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
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">
                Confidence: {Math.round(identification.confidence * 100)}%
              </span>
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

          <div className="flex space-x-2">
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-support-conservation"
            >
              <i className="fas fa-heart mr-2"></i>Support Conservation
            </Button>
            <Button
              variant="secondary"
              onClick={handleShare}
              data-testid="button-share"
            >
              <i className="fas fa-share-alt"></i>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
