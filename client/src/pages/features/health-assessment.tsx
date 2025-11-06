import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Upload, AlertTriangle, CheckCircle2, Camera, Activity, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HealthAssessment() {
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
        title: "No Image Selected",
        description: "Please upload an animal image first",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("species", "Unknown");

      const response = await fetch("/api/features/health-assessment", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setResults(data);

      toast({
        title: "Assessment Complete",
        description: `Health status: ${data.overallHealthStatus}`,
        variant: data.overallHealthStatus === "emergency" || data.overallHealthStatus === "critical" ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Health assessment error:", error);
      toast({
        title: "Assessment Failed",
        description: "Failed to analyze animal health. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getHealthColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "emergency": return "text-red-700 dark:text-red-300";
      case "poor": return "text-red-600 dark:text-red-400";
      case "fair": return "text-yellow-600 dark:text-yellow-400";
      case "good": return "text-green-600 dark:text-green-400";
      case "healthy": return "text-green-700 dark:text-green-300";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getHealthBg = (status: string) => {
    switch (status.toLowerCase()) {
      case "emergency": return "bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-800";
      case "poor": return "bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-800";
      case "fair": return "bg-yellow-100 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-800";
      case "good": return "bg-green-100 dark:bg-green-950/30 border-green-300 dark:border-green-800";
      case "healthy": return "bg-green-100 dark:bg-green-950/30 border-green-300 dark:border-green-800";
      default: return "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
      case "high": return "bg-red-200 dark:bg-red-900/40 text-red-700 dark:text-red-300";
      case "medium":
      case "moderate": return "bg-yellow-200 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300";
      case "low": return "bg-blue-200 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
      default: return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-950/20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-12 h-12 text-green-600 dark:text-green-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Automatic Health Assessment
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            AI-powered veterinary analysis detects visible injuries, malnutrition, diseases, and health conditions using advanced computer vision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-green-200 dark:border-green-900/40 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Animal Image
              </CardTitle>
              <CardDescription>
                Upload a clear photo of the animal for AI health analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="animal-image">Select Image</Label>
                <Input
                  id="animal-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  data-testid="input-animal-image"
                />
                {preview && (
                  <div className="mt-4 border-2 border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full object-contain max-h-96" />
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
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6"
                data-testid="button-analyze-health"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Health with AI...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Assess Health Condition
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-900/40 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Health Assessment Results
              </CardTitle>
              <CardDescription>
                AI-powered veterinary analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Upload and analyze an animal image to see AI-powered health results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-5 rounded-lg border-2 ${getHealthBg(results.overallHealthStatus)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {results.overallHealthStatus === "healthy" || results.overallHealthStatus === "minor_issues" ? (
                          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                        ) : (
                          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        )}
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 block">Overall Health Status</span>
                          <span className={`text-2xl font-bold ${getHealthColor(results.overallHealthStatus)} capitalize`}>
                            {results.overallHealthStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{Math.round(results.confidence * 100)}%</p>
                      </div>
                    </div>
                  </div>

                  {results.animalIdentified && (
                    <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Species:</strong> {results.animalIdentified}
                      </p>
                    </div>
                  )}

                  {results.detectedConditions && results.detectedConditions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        Detected Conditions ({results.detectedConditions.length}):
                      </h4>
                      {results.detectedConditions.map((condition: string, idx: number) => (
                        <div key={idx} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {condition}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {results.visualSymptoms && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 dark:border-blue-600 rounded">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Visual Symptoms:
                      </h4>
                      <div className="space-y-2">
                        {results.visualSymptoms.injuries?.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Injuries:</p>
                            {results.visualSymptoms.injuries.map((injury: string, idx: number) => (
                              <p key={idx} className="text-sm text-blue-700 dark:text-blue-400 ml-4">• {injury}</p>
                            ))}
                          </div>
                        )}
                        {results.visualSymptoms.skinConditions?.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Skin Conditions:</p>
                            {results.visualSymptoms.skinConditions.map((condition: string, idx: number) => (
                              <p key={idx} className="text-sm text-blue-700 dark:text-blue-400 ml-4">• {condition}</p>
                            ))}
                          </div>
                        )}
                        {results.visualSymptoms.abnormalBehavior?.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Abnormal Behavior:</p>
                            {results.visualSymptoms.abnormalBehavior.map((behavior: string, idx: number) => (
                              <p key={idx} className="text-sm text-blue-700 dark:text-blue-400 ml-4">• {behavior}</p>
                            ))}
                          </div>
                        )}
                        {results.visualSymptoms.malnutrition && (
                          <p className="text-sm text-red-700 dark:text-red-400 font-semibold">⚠️ Signs of malnutrition detected</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border-l-4 border-purple-500 dark:border-purple-600 rounded">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Detailed Analysis:</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-400 whitespace-pre-wrap">{results.detailedAnalysis}</p>
                  </div>

                  {results.severity && (
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Severity Assessment:</strong> {results.severity}
                      </p>
                    </div>
                  )}

                  {results.treatmentRecommendations && results.treatmentRecommendations.length > 0 && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 dark:border-green-600 rounded">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Treatment Recommendations:
                      </h4>
                      <ul className="space-y-2">
                        {results.treatmentRecommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-green-700 dark:text-green-400 flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-500 font-bold">{idx + 1}.</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {results.veterinaryAlertRequired && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <p className="font-semibold text-red-800 dark:text-red-300">
                          Veterinary Intervention Required
                        </p>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-2">
                        This animal requires professional veterinary care. Please contact a wildlife vet immediately.
                      </p>
                    </div>
                  )}

                  {results.followUpRequired && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        📋 Follow-up monitoring recommended
                      </p>
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
                <Heart className="w-5 h-5 text-green-600" />
                Injury Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI identifies visible wounds, fractures, limping, and physical trauma using advanced computer vision analysis
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Disease Screening
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detects signs of malnutrition, skin conditions, parasites, and common wildlife diseases from visual symptoms
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-purple-600" />
                Treatment Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Provides veterinary recommendations, urgency assessment, and guidance for wildlife rehabilitation centers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
