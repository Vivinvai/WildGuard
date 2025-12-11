import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { AnimalIdentification } from "@shared/schema";

interface PhotoUploadProps {
  onIdentificationResult: (result: AnimalIdentification) => void;
}

export function PhotoUpload({ onIdentificationResult }: PhotoUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'checking' | 'enabled' | 'disabled' | 'denied'>('checking');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentIdentifications } = useQuery<AnimalIdentification[]>({
    queryKey: ["/api/recent-identifications"],
  });

  // Check location permission on mount
  useState(() => {
    if (navigator.geolocation) {
      navigator.permissions?.query({ name: 'geolocation' as PermissionName })
        .then(result => {
          if (result.state === 'granted') {
            setLocationStatus('enabled');
          } else if (result.state === 'denied') {
            setLocationStatus('denied');
          } else {
            setLocationStatus('disabled');
          }
          result.onchange = () => {
            setLocationStatus(result.state === 'granted' ? 'enabled' : result.state === 'denied' ? 'denied' : 'disabled');
          };
        })
        .catch(() => {
          // Fallback: try to get location to check if it works
          navigator.geolocation.getCurrentPosition(
            () => setLocationStatus('enabled'),
            () => setLocationStatus('denied'),
            { timeout: 1000 }
          );
        });
    } else {
      setLocationStatus('denied');
    }
  });

  const getLocationName = async (latitude: number, longitude: number): Promise<string | null> => {
    try {
      // Use backend endpoint for reverse geocoding
      const response = await fetch(
        `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.locationName || null;
    } catch (error) {
      console.log('Reverse geocoding failed:', error);
      return null;
    }
  };

  const getLocation = (): Promise<{ latitude: number; longitude: number; locationName?: string } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        setLocationStatus('denied');
        toast({
          title: "⚠️ Location Not Available",
          description: "Your browser doesn't support location services. Identification will continue without GPS tracking.",
          variant: "default",
        });
        resolve(null);
        return;
      }

      console.log('🔍 Requesting GPS location...');
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          console.log(`✅ GPS location captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setLocationStatus('enabled');
          
          const locationName = await getLocationName(latitude, longitude);
          
          toast({
            title: "📍 Location Captured",
            description: `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}${locationName ? ` • ${locationName}` : ''}`,
            variant: "default",
          });
          
          resolve({
            latitude,
            longitude,
            locationName: locationName || undefined
          });
        },
        (error) => {
          console.log('❌ Location permission denied or error:', error.message);
          setLocationStatus('denied');
          
          toast({
            title: "⚠️ Location Access Denied",
            description: "Please enable location permissions in your browser settings to track animal sightings with GPS coordinates.",
            variant: "destructive",
          });
          
          resolve(null);
        },
        { 
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 0
        }
      );
    });
  };

  const identifyMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      console.log('📸 Starting animal identification...');
      const location = await getLocation();
      
      if (location) {
        console.log(`✅ Including GPS data: ${location.latitude}, ${location.longitude}`);
        formData.append('latitude', location.latitude.toString());
        formData.append('longitude', location.longitude.toString());
        if (location.locationName) {
          formData.append('locationName', location.locationName);
          console.log(`📍 Location name: ${location.locationName}`);
        }
      } else {
        console.log('⚠️ No GPS data available - continuing without location');
      }
      
      const response = await fetch('/api/identify-animal', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to identify animal');
      }

      const result = await response.json();
      console.log('✅ Identification complete:', result.speciesName);
      return result;
    },
    onSuccess: (result: AnimalIdentification) => {
      onIdentificationResult(result);
      queryClient.invalidateQueries({ queryKey: ['/api/recent-identifications'] });
      toast({
        title: "Animal Identified!",
        description: `Successfully identified as ${result.speciesName}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Identification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setIsProcessing(true);
      identifyMutation.mutate(file);
    }
  }, [identifyMutation, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
  });

  const getConservationStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critically endangered':
        return 'conservation-critical';
      case 'endangered':
        return 'conservation-endangered';
      case 'vulnerable':
        return 'conservation-vulnerable';
      default:
        return 'conservation-stable';
    }
  };

  return (
    <div className="space-y-6">
      {/* GPS Status Banner */}
      {locationStatus !== 'checking' && (
        <div className={`p-4 rounded-lg border ${
          locationStatus === 'enabled' 
            ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
            : 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800'
        }`}>
          <div className="flex items-center gap-3">
            {locationStatus === 'enabled' ? (
              <>
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200">📍 GPS Tracking Enabled</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Your animal sightings will be tracked with precise location data</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">⚠️ GPS Tracking Disabled</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    {locationStatus === 'denied' 
                      ? 'Location permissions denied. Please enable them in your browser settings.'
                      : 'Click "Allow" when prompted to enable GPS tracking for accurate wildlife monitoring.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-4 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-2 text-foreground">🦌 Identify Wildlife</h2>
            <p className="text-muted-foreground">
              Upload a photo to get instant AI-powered species identification and conservation status.
            </p>
          </div>
          
          {!isProcessing ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer ${
                isDragActive ? 'drag-over' : 'border-border'
              }`}
              data-testid="upload-area"
            >
              <input {...getInputProps()} data-testid="input-file-upload" />
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Drop your photo here</h3>
              <p className="text-muted-foreground mb-4">or click to browse your files</p>
              <Button className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105" data-testid="button-choose-photo">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Choose Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG up to 10MB</p>
            </div>
          ) : (
            <div className="text-center py-8" data-testid="processing-state">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-background rounded-full"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-primary to-secondary rounded-full animate-spin"></div>
              </div>
              <p className="text-foreground font-medium">🔍 Analyzing your photo with AI...</p>
              <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
            </div>
          )}

          {recentIdentifications && recentIdentifications.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Identifications</h3>
              <div className="space-y-2">
                {recentIdentifications.slice(0, 2).map((identification) => (
                  <div
                    key={identification.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    data-testid={`recent-identification-${identification.id}`}
                    onClick={() => onIdentificationResult(identification)}
                  >
                    <img
                      src={identification.imageUrl}
                      alt={identification.speciesName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{identification.speciesName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(identification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-medium ${getConservationStatusColor(identification.conservationStatus)}`}>
                      {identification.conservationStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
