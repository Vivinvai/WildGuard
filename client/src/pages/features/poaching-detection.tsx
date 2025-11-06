import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Upload, AlertTriangle, Shield, Camera, Video, Activity, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PoachingDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please upload a camera trap or drone footage first",
        variant: "destructive",
      });
      return;
    }

    // Validate image size (must be at least 10KB for valid analysis)
    if (file.size < 10000) {
      toast({
        title: "Image Too Small",
        description: "Please upload a clear, high-quality image (at least 10KB). Tiny images cannot be analyzed accurately.",
        variant: "destructive",
      });
      return;
    }

    // Validate image type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setResults(null); // Clear previous results
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("latitude", "12.9716");
      formData.append("longitude", "77.5946");

      const response = await fetch("/api/features/poaching-detection", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Analysis failed" }));
        throw new Error(errorData.error || errorData.details || "Analysis failed");
      }

      const data = await response.json();
      setResults(data);

      toast({
        title: "Analysis Complete",
        description: data.threatLevel === "none" ? "No threats detected" : `${data.threatLevel} threat level detected`,
        variant: data.threatLevel !== "none" && data.threatLevel !== "low" ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Poaching detection error:", error);
      const errorMessage = (error as Error).message || "Failed to analyze image";
      toast({
        title: "Analysis Failed",
        description: errorMessage.includes("image is not valid") 
          ? "The uploaded image could not be processed. Please try a different, clearer image."
          : errorMessage + ". Please try again with a different image.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-600 dark:bg-red-500";
      case "high": return "bg-red-500 dark:bg-red-400";
      case "medium": return "bg-orange-500 dark:bg-orange-400";
      case "low": return "bg-yellow-500 dark:bg-yellow-400";
      default: return "bg-green-500 dark:bg-green-400";
    }
  };

  const getThreatBorder = (level: string) => {
    switch (level) {
      case "critical": return "border-red-300 dark:border-red-800";
      case "high": return "border-red-300 dark:border-red-800";
      case "medium": return "border-orange-300 dark:border-orange-800";
      case "low": return "border-yellow-300 dark:border-yellow-800";
      default: return "border-green-300 dark:border-green-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950/20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              AI Poaching Detection
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Advanced AI vision analyzes camera trap and drone footage to detect humans, weapons, traps, and suspicious activities in protected areas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-purple-200 dark:border-purple-900/40 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Footage
              </CardTitle>
              <CardDescription>
                Upload camera trap images or drone video footage for real-time AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="footage-upload">Select Image File</Label>
                <Input
                  id="footage-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  data-testid="input-footage-upload"
                />
                {preview && (
                  <div className="mt-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full object-contain max-h-64" />
                  </div>
                )}
                {file && (
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!file || analyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-6"
                data-testid="button-analyze-footage"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Footage with AI...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Analyze for Threats
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-900/40 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                AI Detection Results
              </CardTitle>
              <CardDescription>
                Real-time threat analysis powered by Gemini AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Eye className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Upload and analyze footage to see AI-powered results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-5 rounded-lg border-2 ${getThreatBorder(results.threatLevel)} ${
                    results.threatLevel === "none"
                      ? "bg-green-100 dark:bg-green-950/30"
                      : "bg-red-100 dark:bg-red-950/30"
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      {results.threatLevel === "none" ? (
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                      ) : (
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 capitalize">
                          {results.threatLevel} Threat Level
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Analysis Confidence: {results.confidence}%
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${getThreatColor(results.threatLevel)} animate-pulse`}></div>
                    </div>
                  </div>

                  {results.suspiciousObjects && results.suspiciousObjects.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-purple-600" />
                        Suspicious Objects Detected:
                      </h4>
                      {results.suspiciousObjects.map((obj: string, idx: number) => (
                        <div key={idx} className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                            <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                              {obj}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {results.detectedActivities && results.detectedActivities.length > 0 && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 dark:border-red-600 rounded">
                      <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Suspicious Activities Detected:
                      </h4>
                      <ul className="space-y-1">
                        {results.detectedActivities.map((activity: string, idx: number) => (
                          <li key={idx} className="text-sm text-red-700 dark:text-red-400">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 dark:border-blue-600 rounded">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Evidence Analysis:</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 whitespace-pre-wrap">{results.evidenceDescription}</p>
                  </div>

                  {results.recommendations && results.recommendations.length > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 dark:border-yellow-600 rounded">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Recommendations:
                      </h4>
                      <ul className="space-y-1">
                        {results.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-400">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {results.location && (
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                      <p>📍 Location: {results.location.latitude}°N, {results.location.longitude}°E</p>
                      <p>⏰ Analyzed: {new Date(results.timestamp).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-600" />
                Object Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Identifies humans, vehicles, weapons, and traps in camera footage using Gemini AI vision models
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Behavior Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analyzes suspicious patterns like stalking behavior, trap placement, and illegal hunting activities
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Real-Time Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Instant threat notifications with GPS coordinates for rapid ranger response and intervention
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
