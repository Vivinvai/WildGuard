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
    const statusLower = status.toLowerCase();
    if (statusLower.includes('critically endangered') || statusLower.includes('critical')) {
      return 'conservation-critical';
    }
    if (statusLower.includes('endangered')) {
      return 'conservation-endangered';
    }
    if (statusLower.includes('vulnerable')) {
      return 'conservation-vulnerable';
    }
    if (statusLower.includes('least concern')) {
      return 'conservation-stable';
    }
    return 'conservation-stable';
  };

  const getConservationStatusBadgeColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('critically endangered') || statusLower.includes('critical')) {
      return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700';
    }
    if (statusLower.includes('endangered')) {
      return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-700';
    }
    if (statusLower.includes('vulnerable')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700';
    }
    if (statusLower.includes('least concern')) {
      return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700';
    }
    return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/40 dark:text-gray-200 dark:border-gray-700';
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

      <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-600 shadow-xl">
        <CardContent className="p-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/50 dark:to-teal-900/50 p-4 rounded-lg mb-6 border border-emerald-200 dark:border-emerald-700">
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">🦌 Identify Wildlife</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Upload a photo to get instant AI-powered species identification and conservation status.
            </p>
          </div>
          
          {!isProcessing ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer min-h-[280px] flex flex-col items-center justify-center ${
                isDragActive 
                  ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 scale-[1.02]' 
                  : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-700/30'
              }`}
              data-testid="upload-area"
            >
              <input {...getInputProps()} data-testid="input-file-upload" />
              <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Drop your photo here</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-5 text-base">or click to browse your files</p>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white font-bold px-8 py-3 rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5" data-testid="button-choose-photo">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Choose Photo
              </Button>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 font-medium">Supports JPG, PNG up to 10MB</p>
            </div>
          ) : (
            <div className="text-center py-8" data-testid="processing-state">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-800 dark:text-slate-100 font-medium">🔍 Analyzing your photo with AI...</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">This may take a few moments</p>
            </div>
          )}

          {recentIdentifications && recentIdentifications.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">Recent Identifications</h3>
              <div className="space-y-2">
                {recentIdentifications.slice(0, 2).map((identification) => (
                  <div
                    key={identification.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                    data-testid={`recent-identification-${identification.id}`}
                    onClick={() => onIdentificationResult(identification)}
                  >
                    <img
                      src={identification.imageUrl}
                      alt={identification.speciesName}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-slate-800 dark:text-slate-100">{identification.speciesName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(identification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getConservationStatusBadgeColor(identification.conservationStatus)}`}>
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
