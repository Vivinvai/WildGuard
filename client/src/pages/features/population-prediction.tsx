import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, AlertCircle, BarChart3 } from "lucide-react";

export default function PopulationPrediction() {
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const species = [
    "Bengal Tiger",
    "Asian Elephant",
    "Indian Leopard",
    "Gaur (Indian Bison)",
    "Sloth Bear"
  ];

  const handlePredict = () => {
    setLoading(true);
    
    setTimeout(() => {
      setPrediction({
        current_population: 127,
        predicted_2030: 156,
        growth_rate: 2.3,
        trend: "increasing",
        confidence: 84,
        factors: [
          { name: "Habitat availability", impact: "+15%", positive: true },
          { name: "Food resources", impact: "+8%", positive: true },
          { name: "Climate stability", impact: "-3%", positive: false },
          { name: "Human conflict", impact: "-5%", positive: false }
        ]
      });
      setLoading(false);
    }, 2000);
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
                      <SelectItem key={s} value={s}>{s}</SelectItem>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current (2025)</p>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {prediction.current_population}
                      </p>
                    </div>
                    <div className="p-4 bg-green-100 dark:bg-green-950/30 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Predicted (2030)</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                        {prediction.predicted_2030}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Growth Rate</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                        {prediction.trend === "increasing" ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                        +{prediction.growth_rate}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Confidence: {prediction.confidence}%
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Influencing Factors:</h4>
                    {prediction.factors.map((factor: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center">
                        <span className="text-sm font-medium">{factor.name}</span>
                        <span className={`text-sm font-bold ${
                          factor.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}>
                          {factor.impact}
                        </span>
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
