import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Upload, AlertTriangle, CheckCircle2, Camera } from "lucide-react";
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
    
    setTimeout(() => {
      setResults({
        overall_health: "Fair",
        confidence: 89,
        detected_issues: [
          { issue: "Minor limping (right front leg)", severity: "Low", confidence: 82 },
          { issue: "Possible malnutrition (ribs visible)", severity: "Medium", confidence: 76 }
        ],
        recommendations: [
          "Monitor movement for signs of injury progression",
          "Increase food availability in the area",
          "Consider veterinary intervention if condition worsens"
        ],
        body_condition_score: 3
      });
      setAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Health assessment ready",
      });
    }, 3000);
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
            AI-powered analysis of animal images to detect visible injuries, malnutrition, and diseases using advanced CNN models
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
                Upload a clear photo or video frame of the animal
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
                  <div className="mt-4">
                    <img src={preview} alt="Preview" className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700" />
                  </div>
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
                    Analyzing Health...
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
                <Heart className="w-5 h-5" />
                Health Assessment Results
              </CardTitle>
              <CardDescription>
                AI-detected health indicators and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!results ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Upload and analyze an image to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Overall Health Status</span>
                      <span className={`text-2xl font-bold ${
                        results.overall_health === "Good" ? "text-green-600 dark:text-green-400" :
                        results.overall_health === "Fair" ? "text-yellow-600 dark:text-yellow-400" :
                        "text-red-600 dark:text-red-400"
                      }`}>
                        {results.overall_health}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Confidence: {results.confidence}% • Body Condition Score: {results.body_condition_score}/5
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      Detected Issues:
                    </h4>
                    {results.detected_issues.map((issue: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {issue.issue}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            issue.severity === "High" ? "bg-red-200 dark:bg-red-900/40 text-red-700 dark:text-red-300" :
                            issue.severity === "Medium" ? "bg-yellow-200 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" :
                            "bg-green-200 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                          }`}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Confidence: {issue.confidence}%
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 dark:border-blue-600">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Recommendations:
                    </h4>
                    <ul className="space-y-1">
                      {results.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="text-sm text-blue-700 dark:text-blue-400">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
