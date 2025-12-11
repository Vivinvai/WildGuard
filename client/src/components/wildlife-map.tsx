import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { WildlifeCenter } from "@shared/schema";
import type { UserLocation } from "@/lib/types";

// Import Leaflet CSS and JS
import "leaflet/dist/leaflet.css";

export function WildlifeMap() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Default to Karnataka, India if geolocation fails
          setUserLocation({
            latitude: 12.9716,
            longitude: 77.5946,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Default to Karnataka, India if geolocation not supported
      setUserLocation({
        latitude: 12.9716,
        longitude: 77.5946,
      });
    }
  }, []);

  const { data: wildlifeCenters, isLoading } = useQuery<WildlifeCenter[]>({
    queryKey: userLocation 
      ? [`/api/wildlife-centers/nearby?lat=${userLocation.latitude}&lng=${userLocation.longitude}&radius=50`]
      : ["/api/wildlife-centers"],
    enabled: !!userLocation,
  });

  // Initialize map
  useEffect(() => {
    if (!userLocation || !mapRef.current) return;

    // Clean up existing map instance before creating a new one
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Ensure the container is ready and not already initialized
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
        // Create map
        const map = L.map(mapRef.current).setView([userLocation.latitude, userLocation.longitude], 12);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add user location marker
        const userIcon = L.divIcon({
          html: `
            <div style="position: relative;">
              <div style="
                width: 18px;
                height: 18px;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 0 15px rgba(59, 130, 246, 0.6), 0 0 5px rgba(37, 99, 235, 0.8);
              "></div>
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 30px;
                height: 30px;
                background: rgba(59, 130, 246, 0.2);
                border: 2px solid rgba(59, 130, 246, 0.3);
                border-radius: 50%;
                animation: ripple 2s infinite;
              "></div>
              <style>
                @keyframes ripple {
                  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                }
              </style>
            </div>
          `,
          className: 'custom-div-icon',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; min-width: 120px;">
              <strong style="color: #3b82f6;">📍 Your Location</strong><br/>
              <span style="font-size: 11px; color: #666;">
                ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}
              </span>
            </div>
          `);

        mapInstanceRef.current = map;
        markersRef.current = [];
      } catch (error) {
        console.warn('Map initialization error:', error);
      }
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation]);

  // Add wildlife center markers
  useEffect(() => {
    if (!mapInstanceRef.current || !wildlifeCenters) return;

    // Import Leaflet dynamically
    import('leaflet').then((L) => {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Add center markers
      wildlifeCenters.forEach((center) => {
        const iconColor = center.type === 'rescue' ? 'bg-primary' 
                        : center.type === 'sanctuary' ? 'bg-accent'
                        : 'bg-secondary';
        
        const iconSymbol = center.type === 'rescue' ? 'fa-paw'
                          : center.type === 'sanctuary' ? 'fa-leaf'
                          : 'fa-hospital';

        const centerIcon = L.divIcon({
          html: `<div class="w-8 h-8 ${iconColor} rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                   <i class="fas ${iconSymbol} text-white text-xs"></i>
                 </div>`,
          className: 'custom-div-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([center.latitude, center.longitude], { icon: centerIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div class="p-0 min-w-[200px]">
              <h3 class="font-semibold text-lg mb-2">${center.name}</h3>
              <p class="text-sm text-gray-600 mb-2">${center.description}</p>
              <div class="text-sm space-y-1">
                <div><i class="fas fa-clock text-gray-500 mr-2"></i>${center.hours}</div>
                <div><i class="fas fa-phone text-gray-500 mr-2"></i>${center.phone}</div>
                <div class="flex items-center">
                  <i class="fas fa-star text-yellow-500 mr-1"></i>
                  <span>${center.rating}</span>
                </div>
              </div>
            </div>
          `);

        marker.on('click', () => {
          setSelectedCenter(center.id);
        });

        markersRef.current.push(marker);
      });
    });
  }, [wildlifeCenters]);

  const handleCenterClick = (centerId: string) => {
    setSelectedCenter(centerId);
    const center = wildlifeCenters?.find(c => c.id === centerId);
    if (center && mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.latitude, center.longitude], 15);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rescue':
        return 'fa-paw';
      case 'sanctuary':
        return 'fa-leaf';
      case 'hospital':
        return 'fa-hospital';
      default:
        return 'fa-map-marker-alt';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rescue':
        return 'bg-primary';
      case 'sanctuary':
        return 'bg-accent';
      case 'hospital':
        return 'bg-secondary';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2 text-foreground">🗺️ Wildlife Centers Near You</h2>
        <p className="text-muted-foreground">
          Find conservation centers and rescue facilities in your area
        </p>
      </div>

      {/* Map Container - Fixed Scrolling Issues */}
      <Card className="overflow-hidden shadow-lg bg-card/95 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="relative h-64 md:h-72 max-h-72" data-testid="map-container">
            <div 
              ref={mapRef} 
              className="w-full h-full rounded-t-lg touch-pan-y" 
              style={{ 
                touchAction: 'pan-x pan-y',
                zIndex: 1,
                position: 'relative'
              }}
            />
            
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-t-lg">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                  <p className="text-foreground font-medium">Loading wildlife centers...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Center List - Simplified */}
      {wildlifeCenters && wildlifeCenters.length > 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Available Centers</h3>
            <div className="grid gap-4 md:grid-cols-2">
            {wildlifeCenters?.map((center) => (
              <div
                key={center.id}
                className={`flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                  selectedCenter === center.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleCenterClick(center.id)}
                data-testid={`wildlife-center-${center.id}`}
              >
                <div className={`w-12 h-12 ${getTypeColor(center.type)} rounded-lg flex items-center justify-center`}>
                  <i className={`fas ${getTypeIcon(center.type)} text-white`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold" data-testid={`text-center-name-${center.id}`}>
                    {center.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {center.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      {center.address}
                    </span>
                    <span>
                      <i className="fas fa-clock mr-1"></i>
                      {center.hours}
                    </span>
                    <span>
                      <i className="fas fa-phone mr-1"></i>
                      {center.phone}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 space-x-2">
                    {center.services.map((service, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-2 py-1 text-xs rounded"
                        data-testid={`badge-service-${index}`}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-accent mb-1">
                    <i className="fas fa-star text-xs"></i>
                    <span className="text-sm ml-1" data-testid={`text-rating-${center.id}`}>
                      {center.rating}
                    </span>
                  </div>
                  <Button
                    variant="link"
                    className="text-primary hover:underline text-sm p-0"
                    data-testid={`button-contact-${center.id}`}
                  >
                    Contact
                  </Button>
                </div>
              </div>
            ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
