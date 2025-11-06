import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, MapPin, TrendingDown, Clock, Shield, Trees, Leaf, PawPrint, BarChart3, TrendingUp } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DeforestationAlert, AnimalSighting } from "@shared/schema";

export default function Deforestation() {
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: alerts } = useQuery<DeforestationAlert[]>({
    queryKey: ["/api/deforestation-alerts"],
  });

  const { data: sightings } = useQuery<AnimalSighting[]>({
    queryKey: ["/api/animal-sightings"],
  });

  // Enhanced mock data with more details
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
    },
    {
      id: "4",
      location: "Biligiri Rangaswamy Hills",
      latitude: 12.0833,
      longitude: 77.1167,
      areaLost: 6.2,
      severity: "high",
      protectedArea: "BR Hills Wildlife Sanctuary",
      affectedSpecies: ["Indian Gaur", "Sambar Deer"],
      imageUrl: null,
      detectedAt: new Date("2024-02-01")
    },
    {
      id: "5",
      location: "Bhadra Wildlife Sanctuary",
      latitude: 13.5333,
      longitude: 75.6167,
      areaLost: 4.8,
      severity: "medium",
      protectedArea: "Bhadra Tiger Reserve",
      affectedSpecies: ["Bengal Tiger", "Black Panther"],
      imageUrl: null,
      detectedAt: new Date("2024-02-10")
    }
  ];

  const displayAlerts = (alerts && alerts.length > 0) ? alerts : mockAlerts;
  const filteredAlerts = selectedSeverity 
    ? displayAlerts.filter(a => a.severity === selectedSeverity)
    : displayAlerts;

  // Chart data for deforestation trends
  const monthlyData = [
    { month: 'Oct', areaLost: 8.2, forestCover: 92.8 },
    { month: 'Nov', areaLost: 11.5, forestCover: 81.3 },
    { month: 'Dec', areaLost: 15.3, forestCover: 66.0 },
    { month: 'Jan', areaLost: 18.7, forestCover: 47.3 },
    { month: 'Feb', areaLost: 11.0, forestCover: 36.3 }
  ];

  const severityData = [
    { name: 'Critical', value: displayAlerts.filter(a => a.severity === 'critical').length, color: '#EF4444' },
    { name: 'High', value: displayAlerts.filter(a => a.severity === 'high').length, color: '#F97316' },
    { name: 'Medium', value: displayAlerts.filter(a => a.severity === 'medium').length, color: '#EAB308' }
  ];

  const impactData = displayAlerts.map(alert => ({
    location: alert.protectedArea?.split(' ')[0] || 'Unknown',
    area: alert.areaLost,
    species: alert.affectedSpecies?.length || 0
  }));

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
    <div className="min-h-screen bg-background dark:bg-gray-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 p-4 rounded-full shadow-lg">
              <TrendingDown className="w-12 h-12 text-white" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/40 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Total Alerts</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{displayAlerts.length}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Active incidents</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-600 dark:text-orange-400" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/40 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">Area Lost</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {displayAlerts.reduce((sum, a) => sum + a.areaLost, 0).toFixed(1)} ha
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">~{(displayAlerts.reduce((sum, a) => sum + a.areaLost, 0) * 2.47).toFixed(0)} acres</p>
              </div>
              <Trees className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">Protected Areas</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {new Set(displayAlerts.map(a => a.protectedArea).filter(Boolean)).size}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Affected regions</p>
              </div>
              <Shield className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Species at Risk</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {new Set(displayAlerts.flatMap(a => a.affectedSpecies || [])).size}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Unique species</p>
              </div>
              <PawPrint className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-card dark:bg-gray-900">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="impact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Impact
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
              <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Deforestation Trends Over Time
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                  <XAxis dataKey="month" className="text-xs" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="areaLost" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Area Lost (ha)"
                    dot={{ fill: '#EF4444', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forestCover" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Forest Cover (%)"
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
                <h3 className="text-xl font-bold text-foreground dark:text-white mb-4">Alert Severity Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
                <h3 className="text-xl font-bold text-foreground dark:text-white mb-4">Impact by Location</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                    <XAxis dataKey="location" className="text-xs" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="area" fill="#F97316" name="Area Lost (ha)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
              <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Comparative Analysis</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground dark:text-white flex items-center gap-2">
                    <Trees className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Before Deforestation
                  </h3>
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <ul className="space-y-2 text-sm text-foreground dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span><strong>Dense Forest Cover:</strong> 100% tree canopy providing shade and habitat</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span><strong>Rich Biodiversity:</strong> Home to tigers, elephants, leopards, and 200+ bird species</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span><strong>Carbon Sequestration:</strong> Absorbs ~2.5 tons CO₂ per hectare annually</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span><strong>Water Regulation:</strong> Prevents soil erosion and maintains water table</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span><strong>Flora Diversity:</strong> 500+ medicinal plants, ancient trees, endemic species</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground dark:text-white flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    After Deforestation
                  </h3>
                  <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border-2 border-red-200 dark:border-red-800">
                    <ul className="space-y-2 text-sm text-foreground dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">✗</span>
                        <span><strong>Habitat Loss:</strong> 37.5 ha cleared = loss of ~750 mature trees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">✗</span>
                        <span><strong>Species Displacement:</strong> 12+ species forced to migrate or face population decline</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">✗</span>
                        <span><strong>Climate Impact:</strong> Loss of 93.75 tons annual CO₂ absorption capacity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">✗</span>
                        <span><strong>Soil Degradation:</strong> Increased erosion, flooding risk, groundwater depletion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">✗</span>
                        <span><strong>Ecosystem Collapse:</strong> Food chain disruption, loss of medicinal plants</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
                <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4 flex items-center gap-2">
                  <PawPrint className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  Impact on Fauna
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <h4 className="font-semibold text-foreground dark:text-white mb-2">Affected Species</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(displayAlerts.flatMap(a => a.affectedSpecies || []))).map(species => (
                        <span key={species} className="px-3 py-1 bg-orange-200 dark:bg-orange-900/40 text-orange-900 dark:text-orange-300 rounded-full text-sm">
                          {species}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground dark:text-white mb-2">Critical Impacts:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
                        <li className="flex gap-2"><span className="text-red-500">•</span> Loss of natural corridors for elephant migration</li>
                        <li className="flex gap-2"><span className="text-red-500">•</span> Reduced prey availability for carnivores like tigers and leopards</li>
                        <li className="flex gap-2"><span className="text-red-500">•</span> Disruption of breeding grounds and nesting sites</li>
                        <li className="flex gap-2"><span className="text-red-500">•</span> Increased human-wildlife conflict as animals enter villages</li>
                        <li className="flex gap-2"><span className="text-red-500">•</span> Population fragmentation leading to inbreeding</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
                <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4 flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
                  Impact on Flora
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-semibold text-foreground dark:text-white mb-2">Lost Plant Species</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground dark:text-gray-400">
                      <div>• Teak (Tectona grandis)</div>
                      <div>• Sandalwood (Santalum album)</div>
                      <div>• Rosewood (Dalbergia latifolia)</div>
                      <div>• Bamboo species</div>
                      <div>• Medicinal herbs</div>
                      <div>• Endemic orchids</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground dark:text-white mb-2">Ecological Consequences:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
                        <li className="flex gap-2"><span className="text-red-500">•</span> Loss of medicinal plants used by local communities</li>
                        <li className="flex gap-2"><span className="text-red-500">•</span> Destruction of old-growth forests (100+ year trees)</li>
                        <li className="flex gap-2"><span className="text-red-500">•</span> Soil nutrient depletion and microorganism die-off</li>
                        <li className="flex gap-2"><span className="text-red-500">•</span> Reduced rainfall and altered local climate patterns</li>
                        <li className="flex gap-2"><span className="text-red-500">•</span> Loss of genetic diversity in endemic plant species</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Additional Impact Information */}
            <Card className="p-6 bg-card dark:bg-gray-900 border-border dark:border-gray-800">
              <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Long-Term Environmental Impact</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Climate Change</h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Deforested areas release stored carbon, contributing to global warming. Loss of trees reduces regional rainfall by 20-30%.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">Water Cycle</h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Without tree roots to anchor soil, monsoon rains cause severe erosion, flooding, and sedimentation in rivers.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Socioeconomic</h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Local communities lose forest products, traditional medicine sources, and face increased crop damage from displaced wildlife.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
              <Button
                variant={selectedSeverity === null ? "default" : "outline"}
                onClick={() => setSelectedSeverity(null)}
                className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                data-testid="button-filter-all"
              >
                All Alerts ({displayAlerts.length})
              </Button>
              <Button
                variant={selectedSeverity === 'critical' ? "default" : "outline"}
                onClick={() => setSelectedSeverity('critical')}
                className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                data-testid="button-filter-critical"
              >
                Critical ({displayAlerts.filter(a => a.severity === 'critical').length})
              </Button>
              <Button
                variant={selectedSeverity === 'high' ? "default" : "outline"}
                onClick={() => setSelectedSeverity('high')}
                className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                data-testid="button-filter-high"
              >
                High ({displayAlerts.filter(a => a.severity === 'high').length})
              </Button>
              <Button
                variant={selectedSeverity === 'medium' ? "default" : "outline"}
                onClick={() => setSelectedSeverity('medium')}
                className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                data-testid="button-filter-medium"
              >
                Medium ({displayAlerts.filter(a => a.severity === 'medium').length})
              </Button>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <Card className="p-12 text-center bg-card dark:bg-gray-900 border-border dark:border-gray-800">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground dark:text-gray-600" />
                  <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">No Alerts Found</h3>
                  <p className="text-muted-foreground dark:text-gray-400">
                    No deforestation alerts to display at this time.
                  </p>
                </Card>
              ) : (
                filteredAlerts.map((alert) => (
                  <Card key={alert.id} className={`p-6 border-2 ${getSeverityBg(alert.severity)}`}>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <AlertTriangle className={`w-6 h-6 ${getSeverityColor(alert.severity)} flex-shrink-0 mt-1`} />
                          <div>
                            <h3 className="text-xl font-bold text-foreground dark:text-white mb-1">
                              {alert.location}
                            </h3>
                            <p className="text-sm text-muted-foreground dark:text-gray-400 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Detected: {new Date(alert.detectedAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground dark:text-gray-300">
                              <strong>Protected Area:</strong> {alert.protectedArea}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-foreground dark:text-gray-300">
                              <strong>Area Lost:</strong> {alert.areaLost} hectares (~{(alert.areaLost * 2.47).toFixed(1)} acres)
                            </span>
                          </div>
                        </div>

                        {alert.affectedSpecies && alert.affectedSpecies.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-semibold text-foreground dark:text-white mb-2">
                              Affected Species:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {alert.affectedSpecies.map((species, idx) => (
                                <span 
                                  key={idx}
                                  className="px-3 py-1 bg-background dark:bg-gray-800 text-foreground dark:text-gray-300 rounded-full text-sm border border-border dark:border-gray-700"
                                >
                                  {species}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${getSeverityColor(alert.severity)} bg-background dark:bg-gray-800/50`}>
                          {alert.severity}
                        </span>
                        <p className="text-xs text-muted-foreground dark:text-gray-500">
                          {alert.latitude.toFixed(4)}°, {alert.longitude.toFixed(4)}°
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
