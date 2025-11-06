import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Loader2, Camera, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PartialImageResult {
  speciesIdentified: string;
  alternativeSpecies: string[];
  primaryConfidence: number;
  alternativeConfidences: { species: string; confidence: number }[];
  imageQuality: string;
  visibilityPercentage: number;
  conservationStatus: string;
  detectionDetails: string;
}

export default function PartialImageEnhancement() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<PartialImageResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      toast({ title: "No image", description: "Please select an image", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/features/partial-image-enhancement', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Failed");

      const data = await response.json();
      setResults(data);
      toast({ title: "Analysis Complete", description: `Primary identification: ${data.speciesIdentified}` });
    } catch (error) {
      toast({ title: "Processing Failed", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const getQualityColor = (quality: string) => {
    if (quality === "excellent" || quality === "good") return "text-green-600";
    if (quality === "fair") return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Partial Image Enhancement
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI-powered species identification from blurry, partial, or low-quality camera trap images
          </p>
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardTitle>Upload Camera Trap Image</CardTitle>
            <CardDescription className="text-blue-50">
              Works with blurry, partially visible, night vision, or motion-blurred wildlife images
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-8">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded" />
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => { setImagePreview(null); setImageFile(null); }}>
                      <Camera className="w-4 h-4 mr-2" /> Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="partial-image-upload" />
                    <label htmlFor="partial-image-upload" className="cursor-pointer">
                      <Button variant="outline" asChild><span>Select Image</span></Button>
                    </label>
                  </div>
                )}
              </div>

              <Button onClick={handleAnalyze} disabled={!imageFile || isProcessing} className="w-full" size="lg">
                {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : <>Enhance & Identify</>}
              </Button>

              {results && (
                <div className="space-y-4 mt-6 pt-6 border-t">
                  <div className="p-5 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg">
                    <h3 className="text-2xl font-bold mb-2">{results.speciesIdentified}</h3>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="text-sm"><strong>Confidence:</strong> {(results.primaryConfidence * 100).toFixed(1)}%</div>
                      <div className="text-sm"><strong>Quality:</strong> <span className={getQualityColor(results.imageQuality) + " capitalize"}>{results.imageQuality}</span></div>
                      <div className="text-sm flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <strong>Visible:</strong> {results.visibilityPercentage}%
                      </div>
                    </div>
                  </div>

                  {results.alternativeSpecies.length > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Alternative Identifications</h4>
                      <div className="space-y-2">
                        {results.alternativeConfidences.map((alt, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span>{alt.species}</span>
                            <span className="font-semibold">{(alt.confidence * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Detection Analysis</h4>
                    <p className="text-sm whitespace-pre-wrap">{results.detectionDetails}</p>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                    <p className="text-sm"><strong>Conservation Status:</strong> <span className="font-semibold text-green-700 dark:text-green-400">{results.conservationStatus}</span></p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">Supports:</h3>
          <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
            <li>• Blurry or out-of-focus images</li>
            <li>• Partially visible animals (only showing part of body)</li>
            <li>• Night vision / infrared camera trap photos</li>
            <li>• Motion-blurred images</li>
            <li>• Images with vegetation obstruction</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
