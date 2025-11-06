import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Eye, Map as MapIcon, AlertCircle, Crosshair, Filter, Calendar } from "lucide-react";

interface SightingPoint {
  latitude: number;
  longitude: number;
  species: string;
  status: string;
  timestamp: string;
  locationName: string;
  habitatType: string;
}

interface Hotspot {
  latitude: number;
  longitude: number;
  sightingCount: number;
  speciesCount: number;
  priority: number;
}

interface SpeciesBreakdown {
  species: string;
  count: number;
}

interface HeatmapData {
  totalSightings: number;
  activeSightings: number;
  heatmapData: SightingPoint[];
  hotspots: Hotspot[];
  speciesBreakdown: SpeciesBreakdown[];
}

export default function SightingsHeatmap() {
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");

  // Fetch real sightings data
  const { data, isLoading } = useQuery<HeatmapData>({
    queryKey: ["/api/features/sightings-heatmap"],
  });

  // Sort species by count (descending)
  const sortedSpeciesBreakdown = useMemo(() => {
    if (!data?.speciesBreakdown) return [];
    return [...data.speciesBreakdown].sort((a, b) => b.count - a.count);
  }, [data?.speciesBreakdown]);

  // Filter data based on selected species
  const filteredData = useMemo(() => {
    if (!data?.heatmapData) return [];
    if (selectedSpecies === "all") return data.heatmapData;
    return data.heatmapData.filter((point) => point.species === selectedSpecies);
  }, [data?.heatmapData, selectedSpecies]);

  // Filter hotspots based on selected species
  const filteredHotspots = useMemo(() => {
    if (!data?.heatmapData || !data?.hotspots) return [];
    if (selectedSpecies === "all") return data.hotspots;
    
    // Calculate hotspots only for the selected species
    const speciesPoints = data.heatmapData.filter(p => p.species === selectedSpecies);
    const densityMap = new Map<string, number>();
    
    speciesPoints.forEach((point) => {
      const key = `${point.latitude.toFixed(2)},${point.longitude.toFixed(2)}`;
      densityMap.set(key, (densityMap.get(key) || 0) + 1);
    });

    return Array.from(densityMap.entries())
      .map(([coords, count]) => {
        const [lat, lon] = coords.split(',').map(Number);
        return {
          latitude: lat,
          longitude: lon,
          sightingCount: count,
          speciesCount: 1,
          priority: count,
        };
      })
      .sort((a, b) => b.sightingCount - a.sightingCount)
      .slice(0, 5);
  }, [data?.heatmapData, data?.hotspots, selectedSpecies]);

  // Get color based on sighting intensity
  const getMarkerColor = (count: number) => {
    if (count >= 50) return "bg-red-500";
    if (count >= 20) return "bg-orange-500";
    return "bg-yellow-500";
  };

  const getMarkerText = (count: number) => {
    if (count >= 50) return "High";
    if (count >= 20) return "Medium";
    return "Low";
  };

  const handleSpeciesChange = (value: string) => {
    setSelectedSpecies(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-950/20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-12 h-12 text-orange-600 dark:text-orange-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
              Wildlife Sightings Heatmap
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Real-time visualization of wildlife sightings across Karnataka to identify biodiversity hotspots and migration patterns
          </p>
        </div>

        {/* Statistics Cards */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-orange-200 dark:border-orange-900/40">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Sightings</p>
                  <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                    {data.totalSightings}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200 dark:border-orange-900/40">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active Locations</p>
                  <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                    {data.activeSightings}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200 dark:border-orange-900/40">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Species Tracked</p>
                  <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                    {sortedSpeciesBreakdown.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200 dark:border-orange-900/40">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {selectedSpecies === "all" ? "All" : "Filtered"}
                  </p>
                  <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                    {filteredData.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-orange-200 dark:border-orange-900/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Filter Options
                </CardTitle>
                <CardDescription>
                  Customize heatmap view by species
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Species Filter</label>
                  <Select value={selectedSpecies} onValueChange={handleSpeciesChange}>
                    <SelectTrigger data-testid="select-species-filter" className="w-full">
                      <SelectValue placeholder="All Species" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="all">
                        <div className="flex items-center justify-between w-full gap-3">
                          <span>All Species</span>
                          <Badge variant="secondary" className="ml-2">
                            {data?.heatmapData.length || 0}
                          </Badge>
                        </div>
                      </SelectItem>
                      {sortedSpeciesBreakdown.map((sp) => (
                        <SelectItem key={sp.species} value={sp.species}>
                          <div className="flex items-center justify-between w-full gap-3">
                            <span>{sp.species}</span>
                            <Badge variant="secondary" className="ml-2">
                              {sp.count}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedSpecies !== "all" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Showing {filteredData.length} sightings of {selectedSpecies}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold mb-3 text-sm text-gray-700 dark:text-gray-300">Intensity Legend</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm">High Activity (50+ sightings)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Medium Activity (20-49)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Low Activity (1-19)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Species Breakdown */}
            {sortedSpeciesBreakdown.length > 0 && (
              <Card className="border-2 border-orange-200 dark:border-orange-900/40 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Species Distribution</CardTitle>
                  <CardDescription>Top species by sighting count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sortedSpeciesBreakdown.slice(0, 10).map((sp, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSpeciesChange(sp.species)}
                        className={`w-full flex justify-between items-center p-3 rounded-lg transition-all ${
                          selectedSpecies === sp.species
                            ? "bg-orange-100 dark:bg-orange-900/40 border-2 border-orange-500"
                            : "bg-orange-50 dark:bg-orange-950/20 border border-transparent hover:border-orange-300 dark:hover:border-orange-700"
                        }`}
                        data-testid={`species-${idx}`}
                      >
                        <span className="text-sm font-medium">{sp.species}</span>
                        <Badge 
                          className={
                            selectedSpecies === sp.species
                              ? "bg-orange-600 text-white"
                              : "bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100"
                          }
                        >
                          {sp.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Heatmap Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-orange-200 dark:border-orange-900/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapIcon className="w-5 h-5" />
                  Biodiversity Hotspots Map
                  {selectedSpecies !== "all" && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedSpecies}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Sighting locations across Karnataka • Color indicates activity level
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-3"></div>
                      <p className="text-gray-500 dark:text-gray-400">Loading sighting data...</p>
                    </div>
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="aspect-video bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="w-16 h-16 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400 font-semibold">
                        {selectedSpecies === "all" ? "No Sightings Data Yet" : `No Sightings for ${selectedSpecies}`}
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        {selectedSpecies === "all" 
                          ? "Report animal sightings to populate the heatmap"
                          : "Try selecting a different species or view all species"
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredData.slice(0, 12).map((sighting, idx) => (
                      <Card key={idx} className="border-2 border-orange-100 dark:border-orange-900/30 hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Crosshair className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            <div className={`w-3 h-3 rounded-full ${getMarkerColor(1)}`}></div>
                          </div>
                          <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-1">
                            {sighting.species}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {sighting.locationName || 'Unknown Location'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                            {sighting.latitude.toFixed(3)}°N, {sighting.longitude.toFixed(3)}°E
                          </p>
                          {sighting.habitatType && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {sighting.habitatType}
                            </Badge>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-600 mt-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(sighting.timestamp).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Top Hotspots List */}
                {filteredHotspots.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      Top {selectedSpecies === "all" ? "Biodiversity" : selectedSpecies} Hotspots:
                    </h4>
                    {filteredHotspots.map((hotspot, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border border-orange-200 dark:border-orange-800" data-testid={`hotspot-${idx}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                              <span className="font-semibold text-gray-800 dark:text-gray-200">
                                Hotspot #{idx + 1}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Coordinates: {hotspot.latitude.toFixed(2)}°N, {hotspot.longitude.toFixed(2)}°E
                            </p>
                            {selectedSpecies === "all" && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {hotspot.speciesCount} species observed
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold text-xl">
                              <Eye className="w-5 h-5" />
                              {hotspot.sightingCount}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">sightings</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`w-3 h-3 rounded-full ${getMarkerColor(hotspot.sightingCount)}`}></div>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {getMarkerText(hotspot.sightingCount)} Activity
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Sightings */}
            {filteredData.length > 0 && (
              <Card className="border-2 border-orange-200 dark:border-orange-900/40 shadow-xl">
                <CardHeader>
                  <CardTitle>Recent Sightings</CardTitle>
                  <CardDescription>
                    Latest wildlife observations{selectedSpecies !== "all" ? ` of ${selectedSpecies}` : " from the field"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredData.slice(0, 8).map((sighting, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          <div>
                            <p className="font-medium text-sm">{sighting.species}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {sighting.locationName} • {sighting.habitatType || 'Unknown habitat'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {sighting.status && (
                            <Badge variant="outline" className="text-xs">
                              {sighting.status}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400 dark:text-gray-600">
                            {new Date(sighting.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
