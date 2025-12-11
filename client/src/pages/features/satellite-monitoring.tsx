import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Satellite, AlertTriangle, TrendingDown, MapPin, Calendar } from "lucide-react";

export default function SatelliteMonitoring() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();

  const regions = [
    "Bandipur National Park",
    "Nagarhole National Park",
    "BRT Tiger Reserve",
    "Bhadra Wildlife Sanctuary",
    "Kali Tiger Reserve"
  ];

  const handleAnalyze = async () => {
    if (!selectedRegion) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/features/satellite-monitoring?location=${encodeURIComponent(selectedRegion)}`);
      if (!response.ok) throw new Error("Failed to fetch satellite data");
      
      const result = await response.json();
      setData(result);
      
      toast({
        title: "Analysis Complete",
        description: `Satellite data analyzed for ${result.location.name}`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch satellite data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-950/20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Satellite className="w-12 h-12 text-red-600 dark:text-red-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
              Satellite Habitat Monitoring
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Real-time satellite data analysis using Google Earth Engine and Sentinel to detect deforestation and water loss in protected areas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-red-200 dark:border-red-900/40 shadow-xl">
            <CardHeader>
              <CardTitle>Select Region</CardTitle>
              <CardDescription>
                Choose a protected area to monitor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Protected Area</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger data-testid="select-region">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!selectedRegion || loading}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-6"
                data-testid="button-analyze-satellite"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Satellite Data...
                  </>
                ) : (
                  <>
                    <Satellite className="w-5 h-5 mr-2" />
                    Analyze Habitat Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 dark:border-red-900/40 shadow-xl">
            <CardHeader>
              <CardTitle>Monitoring Results</CardTitle>
              <CardDescription>
                Habitat loss analysis and critical alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!data ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Satellite className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Select region and time range to analyze</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{data.location.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {data.location.area} • Last Updated: {new Date(data.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-100 dark:bg-green-950/30 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Current NDVI</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                        {data.ndvi.current.toFixed(3)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Change: {data.ndvi.change > 0 ? '+' : ''}{(data.ndvi.change * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      data.vegetation.health === 'excellent' || data.vegetation.health === 'good' 
                        ? 'bg-green-100 dark:bg-green-950/30' 
                        : 'bg-orange-100 dark:bg-orange-950/30'
                    }`}>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Vegetation Health</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                        {data.vegetation.health}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Coverage: {data.vegetation.coveragePercent}%
                      </p>
                    </div>
                  </div>

                  {data.deforestation.detected && (
                    <div className="p-4 bg-red-100 dark:bg-red-950/30 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-800 dark:text-red-300">
                            Deforestation Detected - {data.deforestation.severity} Severity
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                            {data.deforestation.changeDetected}
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                            Affected Area: {data.deforestation.areaAffected} hectares
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data.fires && data.fires.detected && (
                    <div className="p-4 bg-orange-100 dark:bg-orange-950/30 rounded-lg border-l-4 border-orange-500">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-orange-800 dark:text-orange-300">
                            🔥 Active Fires Detected (NASA FIRMS)
                          </p>
                          <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                            {data.fires.count} fire location(s) in the area
                          </p>
                          {data.fires.recentFires && data.fires.recentFires.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {data.fires.recentFires.slice(0, 3).map((fire: any, idx: number) => (
                                <div key={idx} className="text-xs bg-orange-200 dark:bg-orange-900/30 p-2 rounded">
                                  📍 {fire.latitude.toFixed(4)}, {fire.longitude.toFixed(4)} • 
                                  Confidence: {fire.confidence} • 
                                  Brightness: {fire.brightness.toFixed(0)}K • 
                                  {fire.date}
                                </div>
                              ))}
                              {data.fires.recentFires.length > 3 && (
                                <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">
                                  +{data.fires.recentFires.length - 3} more fires detected
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
                    <p className="font-semibold mb-2">Forest Density: {data.vegetation.forestDensity}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Trend: <span className="font-semibold capitalize">{data.ndvi.trend}</span> over last 6 months
                    </p>
                  </div>

                  {data.alerts && data.alerts.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        Alerts:
                      </h4>
                      {data.alerts.map((alert: string, idx: number) => (
                        <div key={idx} className="p-3 bg-yellow-100 dark:bg-yellow-950/30 rounded-lg">
                          <p className="text-sm text-yellow-800 dark:text-yellow-300">{alert}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.recommendations && data.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300">Recommendations:</h4>
                      {data.recommendations.map((rec: string, idx: number) => (
                        <div key={idx} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{idx + 1}.</span>
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
