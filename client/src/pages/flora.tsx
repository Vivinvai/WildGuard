import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Leaf, Upload, Loader2, TreePine } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { FloraIdentification } from "@shared/schema";

export default function Flora() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<FloraIdentification | null>(null);

  const identifyMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiRequest<FloraIdentification>("/api/identify-flora", {
        method: "POST",
        body: formData,
      });
      return response;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        identifyMutation.mutate(file);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  const getConservationColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('critically') || lowerStatus.includes('extinct')) return 'text-red-600 dark:text-red-400';
    if (lowerStatus.includes('endangered')) return 'text-orange-600 dark:text-orange-400';
    if (lowerStatus.includes('vulnerable') || lowerStatus.includes('threatened')) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-950/30 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground dark:text-white mb-2">Flora Identification</h1>
          <p className="text-lg text-muted-foreground dark:text-gray-400">
            Upload a photo to identify plant species using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-white">Upload Plant Photo</h2>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                    : 'border-border dark:border-gray-700 bg-muted/30 dark:bg-gray-800/30 hover:bg-muted/50 dark:hover:bg-gray-800/50'
                }`}
                data-testid="dropzone-flora"
              >
                <input {...getInputProps()} data-testid="input-flora-upload" />
                
                {!selectedImage && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-primary/10 dark:bg-green-900/20 p-4 rounded-full">
                        <Upload className="w-8 h-8 text-primary dark:text-green-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground dark:text-white">
                        {isDragActive ? 'Drop your photo here' : 'Drag & drop or click to upload'}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-gray-500 mt-1">
                        Supports: JPG, PNG, WEBP (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedImage && (
                  <div className="space-y-4">
                    <img 
                      src={selectedImage} 
                      alt="Selected plant" 
                      className="max-h-96 mx-auto rounded-lg shadow-md"
                      data-testid="img-flora-preview"
                    />
                    {identifyMutation.isPending && (
                      <div className="flex items-center justify-center space-x-2 text-primary dark:text-green-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing plant species...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-2 text-sm text-muted-foreground dark:text-gray-400">
                  <TreePine className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                  <p>For best results, capture clear photos of leaves, flowers, bark, or fruits</p>
                </div>
                <div className="flex items-start space-x-2 text-sm text-muted-foreground dark:text-gray-400">
                  <TreePine className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                  <p>Include distinctive features like leaf patterns, flower colors, or growth habits</p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            {result && (
              <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800 fade-in" data-testid="card-flora-result">
                <h2 className="text-xl font-semibold mb-4 text-foreground dark:text-white">Identification Result</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary dark:text-green-400" data-testid="text-flora-species">
                      {result.speciesName}
                    </h3>
                    <p className="text-sm italic text-muted-foreground dark:text-gray-400" data-testid="text-flora-scientific">
                      {result.scientificName}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground dark:text-white mb-2">Conservation Status</h4>
                    <p className={`font-medium ${getConservationColor(result.conservationStatus)}`} data-testid="text-flora-status">
                      {result.conservationStatus}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground dark:text-white mb-2">Habitat</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-300" data-testid="text-flora-habitat">
                      {result.habitat}
                    </p>
                  </div>

                  {result.uses && result.uses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground dark:text-white mb-2">Traditional & Ecological Uses</h4>
                      <ul className="space-y-1">
                        {result.uses.map((use, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground dark:text-gray-300">
                            <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                            <span>{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.threats && result.threats.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground dark:text-white mb-2">Threats</h4>
                      <ul className="space-y-1">
                        {result.threats.map((threat, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground dark:text-gray-300">
                            <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                            <span>{threat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border dark:border-gray-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Confidence</span>
                      <span className="font-medium text-foreground dark:text-white" data-testid="text-flora-confidence">
                        {(result.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {!result && !identifyMutation.isPending && (
              <Card className="p-6 bg-muted/30 dark:bg-gray-900/50 border-border dark:border-gray-800 text-center">
                <TreePine className="w-16 h-16 mx-auto mb-4 text-muted-foreground dark:text-gray-600" />
                <p className="text-muted-foreground dark:text-gray-400">
                  Upload a plant photo to see identification results
                </p>
              </Card>
            )}

            {identifyMutation.isError && (
              <Card className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900" data-testid="card-flora-error">
                <p className="text-red-800 dark:text-red-400">
                  Failed to identify plant. Please try again with a clearer photo.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
