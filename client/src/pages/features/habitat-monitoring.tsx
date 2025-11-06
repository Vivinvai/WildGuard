import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Satellite, Flame, TrendingDown, Leaf, AlertTriangle, CheckCircle2, MapPin } from "lucide-react";

interface HabitatData {
  location: string;
  latitude: number;
  longitude: number;
  protectedArea: string;
  ndviValue: number;
  forestCoverPercentage: number;
  changeDetected: boolean;
  changePercentage: number | null;
  fireSeverity: string;
  fireCount: number;
  vegetationHealth: string;
  alerts: string[];
  recommendations: string[];
}

export default function HabitatMonitoring() {
  const [showAll, setShowAll] = useState(true);

  const { data: habitats, isLoading } = useQuery<HabitatData[]>({
    queryKey: ['/api/features/habitat-monitoring?all=true'],
  });

  const getHealthColor = (health: string) => {
    if (health === "excellent") return "text-green-600";
    if (health === "good") return "text-green-500";
    if (health === "moderate") return "text-yellow-600";
    if (health === "poor") return "text-orange-600";
    return "text-red-600";
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      none: "bg-gray-100 text-gray-800",
      low: "bg-yellow-100 text-yellow-800",
      moderate: "bg-orange-100 text-orange-800",
      high: "bg-red-100 text-red-800",
      extreme: "bg-red-600 text-white",
    };
    return colors[severity as keyof typeof colors] || colors.none;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Satellite className="w-12 h-12 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Live Habitat Health Monitor
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real-time forest cover monitoring using NASA FIRMS satellite data and vegetation health analysis
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading habitat data...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {habitats?.map((habitat, idx) => (
              <Card key={idx} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {habitat.protectedArea}
                  </CardTitle>
                  <CardDescription className="text-green-50">
                    {habitat.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold">Vegetation Health</span>
                      </div>
                      <p className={`text-2xl font-bold ${getHealthColor(habitat.vegetationHealth)} capitalize`}>
                        {habitat.vegetationHealth}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        NDVI: {habitat.ndviValue.toFixed(3)} • Cover: {habitat.forestCoverPercentage.toFixed(1)}%
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-semibold">Fire Activity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityBadge(habitat.fireSeverity)}>
                          {habitat.fireSeverity.toUpperCase()}
                        </Badge>
                        <span className="text-xl font-bold">{habitat.fireCount} fires</span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold">Forest Change</span>
                      </div>
                      {habitat.changeDetected ? (
                        <p className="text-red-600 font-bold">
                          {habitat.changePercentage?.toFixed(1)}% decrease detected
                        </p>
                      ) : (
                        <p className="text-green-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Stable
                        </p>
                      )}
                    </div>
                  </div>

                  {habitat.alerts.length > 0 && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded">
                      <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Active Alerts
                      </h4>
                      <ul className="space-y-1">
                        {habitat.alerts.map((alert, i) => (
                          <li key={i} className="text-sm text-red-700 dark:text-red-400">• {alert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {habitat.recommendations.length > 0 && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 rounded">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                        Conservation Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {habitat.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-green-700 dark:text-green-400">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Data source: NASA FIRMS (Fire Information for Resource Management System)</p>
          <p>Updates: Real-time fire detection • 7-day rolling window • VIIRS satellite data</p>
        </div>
      </div>
    </div>
  );
}
