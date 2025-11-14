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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentIdentifications } = useQuery<AnimalIdentification[]>({
    queryKey: ["/api/recent-identifications"],
  });

  const getLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location permission denied or error:', error);
          resolve(null);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    });
  };

  const identifyMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const location = await getLocation();
      if (location) {
        formData.append('latitude', location.latitude.toString());
        formData.append('longitude', location.longitude.toString());
      }
      
      const response = await fetch('/api/identify-animal', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to identify animal');
      }

      return response.json();
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
