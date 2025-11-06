import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPin, TrendingUp, Eye, Map } from "lucide-react";

export default function SightingsHeatmap() {
  const [selectedSpecies, setSelectedSpecies] = useState("all");
  const [timeRange, setTimeRange] = useState("1m");

  const hotspots = [
    { location: "Bannerghatta NP - North", species: "Bengal Tiger", sightings: 47, coords: "12.8°N, 77.6°E" },
    { location: "Nagarhole - Core Area", species: "Asian Elephant", sightings: 89, coords: "12.0°N, 76.1°E" },
    { location: "Bandipur - Buffer Zone", species: "Indian Leopard", sightings: 34, coords: "11.7°N, 76.7°E" },
    { location: "Kabini Wildlife Sanctuary", species: "Gaur", sightings: 67, coords: "11.9°N, 76.0°E" }
  ];

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
            Visualize where each species is most frequently observed to identify biodiversity hotspots and migration patterns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Card className="border-2 border-orange-200 dark:border-orange-900/40 shadow-xl">
              <CardHeader>
                <CardTitle>Filter Options</CardTitle>
                <CardDescription>
                  Customize heatmap view
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Species Filter</label>
                  <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                    <SelectTrigger data-testid="select-species-filter">
                      <SelectValue placeholder="All Species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Species</SelectItem>
                      <SelectItem value="bengal-tiger">Bengal Tiger</SelectItem>
                      <SelectItem value="asian-elephant">Asian Elephant</SelectItem>
                      <SelectItem value="leopard">Indian Leopard</SelectItem>
                      <SelectItem value="gaur">Gaur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Time Range</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger data-testid="select-time-filter">
                      <SelectValue placeholder="Last Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1w">Last Week</SelectItem>
                      <SelectItem value="1m">Last Month</SelectItem>
                      <SelectItem value="3m">Last 3 Months</SelectItem>
                      <SelectItem value="1y">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold mb-3 text-sm text-gray-700 dark:text-gray-300">Legend</h4>
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
          </div>

          <div className="lg:col-span-2">
            <Card className="border-2 border-orange-200 dark:border-orange-900/40 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Biodiversity Hotspots
                </CardTitle>
                <CardDescription>
                  Areas with highest wildlife activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border-2 border-gray-200 dark:border-gray-700 mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">Interactive Heatmap</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Powered by Leaflet & LocationIQ</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    Top Hotspots:
                  </h4>
                  {hotspots.map((hotspot, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {hotspot.location}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Primary Species: {hotspot.species}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold">
                            <Eye className="w-4 h-4" />
                            {hotspot.sightings}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-500">sightings</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{hotspot.coords}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
