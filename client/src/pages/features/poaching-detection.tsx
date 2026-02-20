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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 p-4 rounded-full ring-2 ring-purple-300 dark:ring-purple-600 shadow-lg">
              <Eye className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              AI Poaching Detection
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Advanced AI vision analyzes camera trap and drone footage to detect humans, weapons, traps, and suspicious activities in protected areas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-xl hover:shadow-2xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Upload Footage
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
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

          <Card className="border-2 border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-xl hover:shadow-2xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                AI Detection Results
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                YOLOv11 object detection + Gemini AI vision analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                  <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Eye className="w-12 h-12 text-purple-600 dark:text-purple-400 animate-pulse" />
                  </div>
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Upload and analyze footage to see AI-powered results</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Advanced threat detection with YOLOv11 + Gemini AI</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className={`p-6 rounded-xl border-2 shadow-lg transform transition-all hover:scale-[1.02] ${
                    results.threatLevel === "none"
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300 dark:border-green-700 ring-2 ring-green-200 dark:ring-green-900/50"
                      : "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-300 dark:border-red-700 ring-2 ring-red-200 dark:ring-red-900/50"
                  }`}>
                    <div className="flex items-center gap-4 mb-3">
                      {results.threatLevel === "none" ? (
                        <div className="bg-green-500 dark:bg-green-600 p-3 rounded-full shadow-lg">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      ) : (
                        <div className="bg-red-500 dark:bg-red-600 p-3 rounded-full shadow-lg animate-pulse">
                          <AlertTriangle className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl text-slate-800 dark:text-slate-100 capitalize mb-2">
                          {results.threatLevel} Threat Level
                        </h3>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                            Analysis Confidence: {results.confidence}%
                          </p>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                results.threatLevel === "none" 
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                                  : "bg-gradient-to-r from-red-500 to-orange-500"
                              }`}
                              style={{ width: `${results.confidence}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full ${getThreatColor(results.threatLevel)} animate-pulse shadow-lg`}></div>
                    </div>
                  </div>

                  {results.suspiciousObjects && results.suspiciousObjects.length > 0 && (
                    <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 p-2.5 rounded-lg shadow-md">
                          <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                          Suspicious Objects Detected
                        </h4>
                        <span className="ml-auto bg-purple-500 dark:bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          {results.suspiciousObjects.length}
                        </span>
                      </div>
                      {results.suspiciousObjects.map((obj: string, idx: number) => (
                        <div key={idx} className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-md hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all transform hover:-translate-y-0.5">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 rounded-full shadow-md animate-pulse"></div>
                            <span className="font-semibold text-slate-800 dark:text-slate-100 capitalize text-base flex-1">
                              {obj}
                            </span>
                            <div className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold px-2 py-1 rounded-md">
                              DETECTED
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {results.detectedActivities && results.detectedActivities.length > 0 && (
                    <div className="p-5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-300 dark:border-red-700 rounded-xl shadow-lg">
                      <h4 className="font-bold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2 text-lg">
                        <div className="bg-red-500 dark:bg-red-600 p-2 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        Suspicious Activities Detected:
                      </h4>
                      <ul className="space-y-2">
                        {results.detectedActivities.map((activity: string, idx: number) => (
                          <li key={idx} className="text-sm text-red-700 dark:text-red-300 font-medium flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full"></div>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-300 dark:border-blue-700 rounded-xl shadow-lg">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2 text-lg">
                      <div className="bg-blue-500 dark:bg-blue-600 p-2 rounded-lg">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      Evidence Analysis:
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap leading-relaxed">{results.evidenceDescription}</p>
                  </div>

                  {results.detections && (
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        Detection Summary
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 rounded-xl text-center border-2 border-red-300 dark:border-red-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{animationDelay: '100ms'}}>
                        <div className="text-3xl font-bold text-red-700 dark:text-red-300 mb-1">{results.detections.weapons}</div>
                        <div className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase tracking-wide">Weapons</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 rounded-xl text-center border-2 border-orange-300 dark:border-orange-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{animationDelay: '200ms'}}>
                        <div className="text-3xl font-bold text-orange-700 dark:text-orange-300 mb-1">{results.detections.humans}</div>
                        <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wide">Humans</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30 rounded-xl text-center border-2 border-yellow-300 dark:border-yellow-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{animationDelay: '300ms'}}>
                        <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mb-1">{results.detections.vehicles}</div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold uppercase tracking-wide">Vehicles</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-xl text-center border-2 border-green-300 dark:border-green-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{animationDelay: '400ms'}}>
                        <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-1">{results.detections.animals}</div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">Animals</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-xl text-center border-2 border-purple-300 dark:border-purple-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{animationDelay: '500ms'}}>
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">{results.detections.total}</div>
                        <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">Total</div>
                      </div>
                    </div>
                    </div>
                  )}

                  {results.recommendations && results.recommendations.length > 0 && (
                    <div className="p-5 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl shadow-lg">
                      <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2 text-lg">
                        <div className="bg-yellow-500 dark:bg-yellow-600 p-2 rounded-lg">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        Recommendations:
                      </h4>
                      <ul className="space-y-2">
                        {results.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-300 font-medium flex items-start gap-2">
                            <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {results.location && (
                    <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 shadow-md">
                      <p className="font-medium">📍 Location: {results.location.latitude}°N, {results.location.longitude}°E</p>
                      <p className="font-medium">⏰ Analyzed: {new Date(results.timestamp).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Camera className="w-5 h-5 text-purple-600" />
                Weapon & Object Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                YOLOv11 model detects guns, knives, crossbows, vehicles, and humans near wildlife with 72-class precision
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Behavior Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Analyzes suspicious patterns like stalking behavior, trap placement, and illegal hunting activities
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-900/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Shield className="w-5 h-5 text-green-600" />
                Real-Time Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Instant threat notifications with GPS coordinates for rapid ranger response and intervention
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
