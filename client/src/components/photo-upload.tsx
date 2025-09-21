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

  const identifyMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
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
          <h2 className="text-2xl font-semibold mb-2">Identify Wildlife</h2>
          <p className="text-muted-foreground mb-6">
            Upload a photo to get instant AI-powered species identification and conservation status.
          </p>
          
          {!isProcessing ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer ${
                isDragActive ? 'drag-over' : 'border-border'
              }`}
              data-testid="upload-area"
            >
              <input {...getInputProps()} data-testid="input-file-upload" />
              <i className="fas fa-cloud-upload-alt text-4xl text-muted-foreground mb-4"></i>
              <h3 className="text-lg font-medium mb-2">Drop your photo here</h3>
              <p className="text-muted-foreground mb-4">or click to browse your files</p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-choose-photo">
                <i className="fas fa-camera mr-2"></i>Choose Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG up to 10MB</p>
            </div>
          ) : (
            <div className="text-center py-8" data-testid="processing-state">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Analyzing your photo with AI...</p>
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
