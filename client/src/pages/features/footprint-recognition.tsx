import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Footprints, Loader2, CheckCircle2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FootprintResult {
  speciesIdentified: string;
  scientificName: string;
  confidence: number;
  footprintSize: number;
  trackPattern: string;
  conservationStatus: string;
  additionalDetails: string;
  identificationFeatures: string[];
}

export default function FootprintRecognition() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FootprintResult | null>(null);
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
      toast({ title: "No image", description: "Please select a footprint image", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/features/footprint-recognition', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Failed");

      const data = await response.json();
      setResults(data);
      toast({ title: "Analysis Complete", description: `Identified: ${data.speciesIdentified}` });
    } catch (error) {
      toast({ title: "Analysis Failed", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Footprints className="w-12 h-12 text-amber-600 dark:text-amber-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              AI Footprint Recognition
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Identify animal species from footprint and track pattern analysis
          </p>
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
            <CardTitle>Upload Footprint Image</CardTitle>
            <CardDescription className="text-amber-50">
              Upload clear photos of animal footprints or tracks for AI-powered species identification
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-lg p-8">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded" />
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => { setImagePreview(null); setImageFile(null); }}>
                      <Camera className="w-4 h-4 mr-2" /> Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="footprint-upload" />
                    <label htmlFor="footprint-upload" className="cursor-pointer">
                      <Button variant="outline" asChild><span>Select Footprint Image</span></Button>
                    </label>
                  </div>
                )}
              </div>

              <Button onClick={handleAnalyze} disabled={!imageFile || isAnalyzing} className="w-full" size="lg">
                {isAnalyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <>Identify Species</>}
              </Button>

              {results && (
                <div className="space-y-4 mt-6 pt-6 border-t">
                  <div className="p-5 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg">
                    <h3 className="text-2xl font-bold">{results.speciesIdentified}</h3>
                    <p className="text-sm italic text-gray-600">{results.scientificName}</p>
                    <div className="mt-3 flex items-center gap-4 flex-wrap">
                      <div className="text-sm"><strong>Confidence:</strong> {(results.confidence * 100).toFixed(1)}%</div>
                      <div className="text-sm"><strong>Size:</strong> {results.footprintSize}mm</div>
                      <div className="text-sm"><strong>Pattern:</strong> <span className="capitalize">{results.trackPattern}</span></div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Identification Features</h4>
                    <ul className="space-y-1">
                      {results.identificationFeatures.map((feature, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Analysis Details</h4>
                    <p className="text-sm">{results.additionalDetails}</p>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                    <p className="text-sm"><strong>Conservation Status:</strong> <span className="font-semibold text-green-700 dark:text-green-400">{results.conservationStatus}</span></p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
