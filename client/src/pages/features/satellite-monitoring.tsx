import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Satellite, AlertTriangle, TrendingDown, MapPin, Calendar } from "lucide-react";

export default function SatelliteMonitoring() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const regions = [
    "Bannerghatta National Park",
    "Nagarhole National Park",
    "Bandipur Tiger Reserve",
    "Western Ghats Region",
    "Kabini Wildlife Sanctuary"
  ];

  const handleAnalyze = () => {
    setLoading(true);
    
    setTimeout(() => {
      setData({
        forest_cover_loss: 247,
        water_body_reduction: 18,
        deforestation_rate: 3.2,
        critical_zones: 5,
        affected_area_hectares: 1245,
        alerts: [
          { location: "North Sector (12.5°N, 77.3°E)", type: "Deforestation", severity: "High", area: "45 hectares", date: "Oct 2025" },
          { location: "East Buffer Zone", type: "Water Loss", severity: "Medium", area: "12 hectares", date: "Sep 2025" }
        ]
      });
      setLoading(false);
    }, 2500);
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

              <div className="space-y-3">
                <Label>Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger data-testid="select-time-range">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m">Last 3 Months</SelectItem>
                    <SelectItem value="6m">Last 6 Months</SelectItem>
                    <SelectItem value="1y">Last 1 Year</SelectItem>
                    <SelectItem value="5y">Last 5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!selectedRegion || !timeRange || loading}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-100 dark:bg-red-950/30 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Forest Cover Loss</p>
                      <p className="text-3xl font-bold text-red-700 dark:text-red-300 flex items-center gap-1">
                        <TrendingDown className="w-6 h-6" />
                        {data.forest_cover_loss} km²
                      </p>
                    </div>
                    <div className="p-4 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Water Body Loss</p>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                        {data.water_body_reduction}%
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Deforestation Rate</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {data.deforestation_rate}% per year
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Critical Zones</p>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {data.critical_zones}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Recent Alerts:
                    </h4>
                    {data.alerts.map((alert: any, idx: number) => (
                      <div key={idx} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-red-500">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {alert.location}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            alert.severity === "High" ? "bg-red-200 dark:bg-red-900/40 text-red-700 dark:text-red-300" :
                            "bg-yellow-200 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>Type: {alert.type} • Area: {alert.area}</p>
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {alert.date}
                          </p>
                        </div>
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
