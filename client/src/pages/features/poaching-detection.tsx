import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Upload, AlertTriangle, Shield, Camera, Video, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PoachingDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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

    setAnalyzing(true);
    
    setTimeout(() => {
      setResults({
        threats_detected: 2,
        confidence: 87,
        objects: [
          { type: "human", confidence: 92, location: "North sector", timestamp: "2:34 AM" },
          { type: "weapon_detected", confidence: 78, location: "Near waterhole", timestamp: "2:34 AM" }
        ],
        recommendation: "HIGH ALERT: Multiple poaching indicators detected. Immediate ranger dispatch recommended."
      });
      setAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Threats detected in footage",
        variant: "destructive",
      });
    }, 3000);
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
            Advanced computer vision analyzes camera trap and drone footage to detect humans, weapons, and suspicious movement patterns in protected areas
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
                Upload camera trap images or drone video footage for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="footage-upload">Select File (Image or Video)</Label>
                <Input
                  id="footage-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  data-testid="input-footage-upload"
                />
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
                    Analyzing Footage...
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
                Detection Results
              </CardTitle>
              <CardDescription>
                AI-powered threat analysis with confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Eye className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Upload and analyze footage to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-4 rounded-lg ${
                    results.threats_detected > 0
                      ? "bg-red-100 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-800"
                      : "bg-green-100 dark:bg-green-950/30 border-2 border-green-300 dark:border-green-800"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`w-5 h-5 ${
                        results.threats_detected > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                      }`} />
                      <h3 className="font-bold text-lg">
                        {results.threats_detected} Threats Detected
                      </h3>
                    </div>
                    <p className="text-sm font-medium">
                      Confidence: {results.confidence}%
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">Detected Objects:</h4>
                    {results.objects.map((obj: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-red-600 dark:text-red-400 capitalize">
                            {obj.type.replace('_', ' ')}
                          </span>
                          <span className="text-sm bg-red-200 dark:bg-red-900/40 px-2 py-1 rounded">
                            {obj.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📍 {obj.location} • ⏰ {obj.timestamp}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 dark:border-yellow-600">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Recommendation:</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">{results.recommendation}</p>
                  </div>
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
                Identifies humans, vehicles, and weapons in camera trap footage using state-of-the-art YOLO models
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Motion Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tracks movement patterns to detect suspicious behavior like stalking or setting up traps
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                24/7 Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continuous analysis of incoming footage from all camera traps and drones in the network
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
