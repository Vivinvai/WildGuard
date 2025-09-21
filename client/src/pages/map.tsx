import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Phone, Search, ExternalLink } from "lucide-react";
import { wildlifeCentersData } from "@shared/schema";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Type for Leaflet objects
type LeafletMap = any;
type LeafletMarker = any;
type LeafletFeatureGroup = any;
type Leaflet = any;

interface WildlifeCenter {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  specialization: string[];
  contact: string;
  description: string;
  address: string;
}

export default function WildlifeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap>(null);
  const markersRef = useRef<Map<number, LeafletMarker>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<WildlifeCenter | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Map the shared data to the format expected by this component
  const wildlifeCenters: WildlifeCenter[] = wildlifeCentersData.map((center, index) => ({
    id: index + 1,
    name: center.name,
    latitude: center.latitude,
    longitude: center.longitude,
    type: center.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    specialization: center.services,
    contact: center.phone,
    description: center.description,
    address: center.address
  }));

  const filteredCenters = wildlifeCenters.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Initialize map once
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || mapInitialized) return;

    // Dynamically import Leaflet to handle SSR
    import('leaflet').then((L) => {
      if (mapInstanceRef.current) return; // Already initialized

      try {
        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current!).setView([12.9716, 77.5946], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        // Create all markers once
        wildlifeCenters.forEach(center => {
          const marker = L.marker([center.latitude, center.longitude])
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 5px 0; font-weight: bold;">${center.name}</h3>
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${center.type}</p>
                <p style="margin: 0 0 10px 0; font-size: 14px;">${center.description}</p>
                <p style="margin: 0; font-size: 12px;"><strong>Contact:</strong> ${center.contact}</p>
              </div>
            `)
            .on('click', () => {
              setSelectedCenter(center);
            });

          markersRef.current.set(center.id, marker);
        });

        setMapInitialized(true);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }).catch(console.error);

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.warn('Error removing map:', error);
        }
        mapInstanceRef.current = null;
        markersRef.current.clear();
        setMapInitialized(false);
      }
    };
  }, []);

  // Update marker visibility based on filter
  useEffect(() => {
    if (!mapInitialized || !mapInstanceRef.current) return;

    try {
      // Show/hide markers based on filtered centers
      markersRef.current.forEach((marker, centerId) => {
        const shouldShow = filteredCenters.some(center => center.id === centerId);
        
        if (shouldShow && !mapInstanceRef.current.hasLayer(marker)) {
          mapInstanceRef.current.addLayer(marker);
        } else if (!shouldShow && mapInstanceRef.current.hasLayer(marker)) {
          mapInstanceRef.current.removeLayer(marker);
        }
      });

      // Fit map to visible markers
      if (filteredCenters.length > 0) {
        import('leaflet').then((L) => {
          const visibleMarkers = filteredCenters
            .map(center => markersRef.current.get(center.id))
            .filter(marker => marker && mapInstanceRef.current.hasLayer(marker));
          
          if (visibleMarkers.length > 0) {
            const group = new (L as any).featureGroup(visibleMarkers);
            mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
          }
        });
      }
    } catch (error) {
      console.warn('Error updating markers:', error);
    }
  }, [filteredCenters, mapInitialized]);

  const handleFitBounds = () => {
    if (mapInstanceRef.current && filteredCenters.length > 0) {
      import('leaflet').then((L) => {
        try {
          const visibleMarkers = filteredCenters
            .map(center => markersRef.current.get(center.id))
            .filter(marker => marker && mapInstanceRef.current.hasLayer(marker));
          
          if (visibleMarkers.length > 0) {
            const group = new (L as any).featureGroup(visibleMarkers);
            mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
          }
        } catch (error) {
          console.warn('Error fitting bounds:', error);
        }
      });
    }
  };

  const handleCenterClick = (center: WildlifeCenter) => {
    setSelectedCenter(center);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.latitude, center.longitude], 10);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r border-border overflow-y-auto">
          <div className="p-4">
            <BackButton />
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-primary mr-2" />
              <h1 className="text-xl font-bold">Wildlife Centers Map</h1>
            </div>
            
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search centers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-centers"
              />
            </div>

            <div className="space-y-3">
              {filteredCenters.map((center) => (
                <Card 
                  key={center.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCenter?.id === center.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleCenterClick(center)}
                  data-testid={`card-center-${center.id}`}
                >
                  <CardHeader className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm">{center.name}</CardTitle>
                        <div className="flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{center.address}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{center.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {center.specialization.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Phone className="w-3 h-3 mr-1" />
                      <span>{center.contact}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCenters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No centers found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div 
            ref={mapRef} 
            className="w-full h-full"
            data-testid="map-container"
          />
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-[1000]">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFitBounds}
              className="bg-background"
              data-testid="button-fit-bounds"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Fit All
            </Button>
          </div>
        </div>
      </div>

      {/* Selected Center Details */}
      {selectedCenter && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 z-[1000]">
          <Card className="bg-background/95 backdrop-blur">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{selectedCenter.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCenter(null)}
                  data-testid="button-close-details"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{selectedCenter.description}</p>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-1" />
                <span>{selectedCenter.contact}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}