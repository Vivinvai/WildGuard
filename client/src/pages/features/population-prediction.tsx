import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, AlertCircle, BarChart3 } from "lucide-react";

export default function PopulationPrediction() {
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch available species data
  const { data: wildlifeData } = useQuery({
    queryKey: ["/api/features/wildlife-data"],
  });

  const species = wildlifeData ? Object.keys(wildlifeData as Record<string, any>).map((key: string) => ({
    id: key,
    name: (wildlifeData as Record<string, any>)[key].species
  })) : [
    { id: "tiger", name: "Bengal Tiger" },
    { id: "elephant", name: "Asian Elephant" },
    { id: "leopard", name: "Indian Leopard" }
  ];

  const handlePredict = async () => {
    if (!selectedSpecies) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/features/population-prediction?species=${selectedSpecies}&years=5`);
      if (!response.ok) throw new Error("Failed to fetch prediction");
      
      const data = await response.json();
      setPrediction(data);
      
      toast({
        title: "Prediction Generated",
        description: `Successfully generated ${data.species} population forecast`,
      });
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "Unable to generate population forecast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950/20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Population Trend Prediction
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            ML-powered forecasting of wildlife population sizes based on habitat data, climate, food availability, and historical trends
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-blue-200 dark:border-blue-900/40 shadow-xl">
            <CardHeader>
              <CardTitle>Select Species</CardTitle>
              <CardDescription>
                Choose a species to predict population trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Species</Label>
                <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                  <SelectTrigger data-testid="select-species">
                    <SelectValue placeholder="Select a species" />
                  </SelectTrigger>
                  <SelectContent>
                    {species.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handlePredict}
                disabled={!selectedSpecies || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6"
                data-testid="button-predict"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Prediction...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Generate Population Forecast
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-900/40 shadow-xl">
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
              <CardDescription>
                Population trends and influencing factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!prediction ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Select a species and generate forecast</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">{prediction.species}</h3>
                  </div>

                  {prediction.predictions && prediction.predictions.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Next Year ({prediction.predictions[0].year})</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                          {prediction.predictions[0].population.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Range: {prediction.predictions[0].confidenceInterval.low.toLocaleString()} - {prediction.predictions[0].confidenceInterval.high.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-green-100 dark:bg-green-950/30 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">5 Years ({prediction.predictions[4].year})</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                          {prediction.predictions[4].population.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Confidence: {(prediction.predictions[4].confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Trend Analysis</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{prediction.trendAnalysis}</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Conservation Impact</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{prediction.conservationImpact}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Recommendations
                    </h4>
                    {prediction.recommendations && prediction.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{idx + 1}.</span>
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
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
