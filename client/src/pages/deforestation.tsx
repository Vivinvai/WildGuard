import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, TrendingDown, Clock, Shield } from "lucide-react";
import type { DeforestationAlert, AnimalSighting } from "@shared/schema";

export default function Deforestation() {
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  const { data: alerts } = useQuery<DeforestationAlert[]>({
    queryKey: ["/api/deforestation-alerts"],
  });

  const { data: sightings } = useQuery<AnimalSighting[]>({
    queryKey: ["/api/animal-sightings"],
  });

  // Mock data for demonstration (in production this would come from satellite data APIs)
  const mockAlerts: DeforestationAlert[] = [
    {
      id: "1",
      location: "Bandipur National Park Buffer Zone",
      latitude: 11.7401,
      longitude: 76.5026,
      areaLost: 12.5,
      severity: "high",
      protectedArea: "Bandipur National Park",
      affectedSpecies: ["Bengal Tiger", "Asian Elephant", "Sloth Bear"],
      imageUrl: null,
      detectedAt: new Date("2024-01-15")
    },
    {
      id: "2",
      location: "Western Ghats Forest Corridor",
      latitude: 13.1544,
      longitude: 75.5044,
      areaLost: 8.3,
      severity: "critical",
      protectedArea: "Kudremukh National Park",
      affectedSpecies: ["Lion-tailed Macaque", "Malabar Giant Squirrel"],
      imageUrl: null,
      detectedAt: new Date("2024-01-20")
    },
    {
      id: "3",
      location: "Nagarhole Wildlife Corridor",
      latitude: 12.0015,
      longitude: 76.0711,
      areaLost: 5.7,
      severity: "medium",
      protectedArea: "Nagarhole National Park",
      affectedSpecies: ["Indian Leopard", "Wild Dog"],
      imageUrl: null,
      detectedAt: new Date("2024-01-25")
    }
  ];

  const displayAlerts = alerts || mockAlerts;
  const filteredAlerts = selectedSeverity 
    ? displayAlerts.filter(a => a.severity === selectedSeverity)
    : displayAlerts;

  const getSeverityColor = (severity: string) => {
    switch(severity.toLowerCase()) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch(severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-800';
      case 'high': return 'bg-orange-100 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-800';
      default: return 'bg-blue-100 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-100 dark:bg-orange-950/30 p-4 rounded-full">
              <TrendingDown className="w-12 h-12 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center text-foreground dark:text-white mb-2">
            Habitat Loss Tracking
          </h1>
          <p className="text-center text-lg text-muted-foreground dark:text-gray-400">
            Real-time monitoring of deforestation and habitat degradation in Karnataka
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Total Alerts</p>
                <p className="text-3xl font-bold text-foreground dark:text-white">{displayAlerts.length}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-orange-500 dark:text-orange-400" />
            </div>
          </Card>
          
          <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Area Lost</p>
                <p className="text-3xl font-bold text-foreground dark:text-white">
                  {displayAlerts.reduce((sum, a) => sum + a.areaLost, 0).toFixed(1)} ha
                </p>
              </div>
              <TrendingDown className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
          </Card>
          
          <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Protected Areas</p>
                <p className="text-3xl font-bold text-foreground dark:text-white">
                  {new Set(displayAlerts.map(a => a.protectedArea).filter(Boolean)).size}
                </p>
              </div>
              <Shield className="w-10 h-10 text-green-500 dark:text-green-400" />
            </div>
          </Card>
          
          <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Animal Sightings</p>
                <p className="text-3xl font-bold text-foreground dark:text-white">
                  {sightings?.length || 0}
                </p>
              </div>
              <MapPin className="w-10 h-10 text-blue-500 dark:text-blue-400" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedSeverity === null ? "default" : "outline"}
            onClick={() => setSelectedSeverity(null)}
            className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            data-testid="button-filter-all"
          >
            All Alerts
          </Button>
          <Button
            variant={selectedSeverity === 'critical' ? "default" : "outline"}
            onClick={() => setSelectedSeverity('critical')}
            className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            data-testid="button-filter-critical"
          >
            Critical
          </Button>
          <Button
            variant={selectedSeverity === 'high' ? "default" : "outline"}
            onClick={() => setSelectedSeverity('high')}
            className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            data-testid="button-filter-high"
          >
            High
          </Button>
          <Button
            variant={selectedSeverity === 'medium' ? "default" : "outline"}
            onClick={() => setSelectedSeverity('medium')}
            className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            data-testid="button-filter-medium"
          >
            Medium
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlerts.map((alert) => (
            <Card 
              key={alert.id}
              className={`p-6 border ${getSeverityBg(alert.severity)}`}
              data-testid={`card-alert-${alert.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-foreground dark:text-white" data-testid="text-alert-location">
                      {alert.location}
                    </h3>
                    <p className={`text-sm font-medium uppercase ${getSeverityColor(alert.severity)}`}>
                      {alert.severity} Severity
                    </p>
                  </div>
                  <AlertTriangle className={`w-6 h-6 ${getSeverityColor(alert.severity)}`} />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground dark:text-gray-300">
                    <TrendingDown className="w-4 h-4 flex-shrink-0" />
                    <span><strong>Area Lost:</strong> {alert.areaLost} hectares</span>
                  </div>
                  
                  {alert.protectedArea && (
                    <div className="flex items-center space-x-2 text-muted-foreground dark:text-gray-300">
                      <Shield className="w-4 h-4 flex-shrink-0" />
                      <span><strong>Protected Area:</strong> {alert.protectedArea}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-muted-foreground dark:text-gray-300">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span><strong>Detected:</strong> {new Date(alert.detectedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {alert.affectedSpecies && alert.affectedSpecies.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-foreground dark:text-white mb-2">Affected Species</h4>
                    <div className="flex flex-wrap gap-2">
                      {alert.affectedSpecies.map((species, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-background dark:bg-gray-800 text-foreground dark:text-white rounded-full text-xs font-medium"
                        >
                          {species}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
