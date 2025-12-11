import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Shield, AlertTriangle, FileCheck, TrendingUp, LogOut, MapPin, Calendar, User, Eye, Award, Download, Camera, ImageIcon, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AdminUser, AnimalSighting } from "@shared/schema";

interface AnimalIdentification {
  id: string;
  userId: string | null;
  username: string | null;
  speciesName: string;
  scientificName: string;
  conservationStatus: string;
  confidence: number;
  imageUrl: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  createdAt: string;
}

interface IdentificationStats {
  total: number;
  today: number;
  topSpecies: { speciesName: string; count: number }[];
  endangeredSightings: number;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: admin, isLoading: adminLoading } = useQuery<AdminUser>({
    queryKey: ['/api/admin/me'],
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  const { data: identifications = [], isLoading: identificationsLoading } = useQuery<AnimalIdentification[]>({
    queryKey: ['/api/admin/identifications'],
    refetchInterval: 8000,
    refetchOnWindowFocus: true,
  });

  const { data: identificationStats, isLoading: statsLoading } = useQuery<IdentificationStats>({
    queryKey: ['/api/admin/identification-stats'],
    refetchInterval: 8000,
    refetchOnWindowFocus: true,
  });

  const { data: emergencySightings = [], isLoading: emergencyLoading } = useQuery<AnimalSighting[]>({
    queryKey: ['/api/admin/emergency-sightings'],
    refetchInterval: 6000,
    refetchOnWindowFocus: true,
  });

  const { data: allSightings = [], isLoading: sightingsLoading } = useQuery<AnimalSighting[]>({
    queryKey: ['/api/admin/sightings'],
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout", {});
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!admin) {
    setLocation("/admin/login");
    return null;
  }

  const verifiedSightings = allSightings.filter(s => s.verifiedBy !== null);
  const pendingSightings = allSightings.filter(s => s.verifiedBy === null);
  const criticalEmergencies = emergencySightings.filter(s => s.emergencyStatus === 'critical').length;
  const urgentEmergencies = emergencySightings.filter(s => s.emergencyStatus === 'urgent').length;

  // Generate comprehensive report
  const generateReport = () => {
    const endangeredCount = identifications.filter(id => 
      id.conservationStatus.toLowerCase().includes('endangered') || 
      id.conservationStatus.toLowerCase().includes('critical')
    ).length;

    const locationsWithAnimals = identifications
      .filter(id => id.locationName)
      .reduce((acc, id) => {
        const loc = id.locationName!;
        if (!acc[loc]) acc[loc] = [];
        acc[loc].push(id.speciesName);
        return acc;
      }, {} as Record<string, string[]>);

    const reportContent = `
═══════════════════════════════════════════════════════
    WILD GUARD - WILDLIFE IDENTIFICATION REPORT
═══════════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}
Admin: ${admin.username} (${admin.department || 'Karnataka Wildlife Department'})

═══════════════════════════════════════════════════════
📊 SUMMARY STATISTICS
═══════════════════════════════════════════════════════

Total Identifications: ${identificationStats?.total || identifications.length}
Today's Identifications: ${identificationStats?.today || 0}
Endangered Species Sightings: ${endangeredCount}
Unique Species Identified: ${identificationStats?.topSpecies.length || 0}
Locations Covered: ${Object.keys(locationsWithAnimals).length}

═══════════════════════════════════════════════════════
🦁 TOP SPECIES IDENTIFIED
═══════════════════════════════════════════════════════

${identificationStats?.topSpecies.slice(0, 10).map((s, i) => 
  `${i + 1}. ${s.speciesName} - ${s.count} sightings`
).join('\n') || 'No data available'}

═══════════════════════════════════════════════════════
📍 LOCATIONS WITH SIGHTINGS
═══════════════════════════════════════════════════════

${Object.entries(locationsWithAnimals).map(([loc, species]) => 
  `📍 ${loc}\n   Animals: ${[...new Set(species)].join(', ')}\n`
).join('\n') || 'No location data available'}

═══════════════════════════════════════════════════════
⚠️ ENDANGERED SPECIES ALERTS
═══════════════════════════════════════════════════════

${identifications
  .filter(id => id.conservationStatus.toLowerCase().includes('endangered'))
  .map(id => `
🔴 ${id.speciesName} (${id.scientificName})
   Status: ${id.conservationStatus}
   Location: ${id.locationName || 'Unknown'}
   ${id.latitude && id.longitude ? `GPS: ${id.latitude.toFixed(4)}, ${id.longitude.toFixed(4)}` : ''}
   Date: ${new Date(id.createdAt).toLocaleString()}
   Uploaded by: ${id.username || 'Anonymous'}
`).join('\n') || 'No endangered species identified yet'}

═══════════════════════════════════════════════════════
📋 DETAILED IDENTIFICATIONS
═══════════════════════════════════════════════════════

${identifications.slice(0, 50).map((id, i) => `
${i + 1}. ${id.speciesName} (${id.scientificName})
   Conservation: ${id.conservationStatus}
   Confidence: ${(id.confidence * 100).toFixed(1)}%
   Location: ${id.locationName || 'Unknown'}
   ${id.latitude && id.longitude ? `GPS: ${id.latitude.toFixed(6)}, ${id.longitude.toFixed(6)}` : ''}
   Date: ${new Date(id.createdAt).toLocaleString()}
   User: ${id.username || 'Anonymous'}
`).join('\n')}

${identifications.length > 50 ? `\n... and ${identifications.length - 50} more identifications` : ''}

═══════════════════════════════════════════════════════
🌿 CONSERVATION RECOMMENDATIONS
═══════════════════════════════════════════════════════

Based on the sightings:
• ${endangeredCount} endangered species spotted - Increase monitoring
• ${Object.keys(locationsWithAnimals).length} active locations - Deploy resources
• Regular patrols recommended in high-sighting areas
• Wildlife corridor protection needed

═══════════════════════════════════════════════════════
Report End - Wild Guard Wildlife Conservation System
═══════════════════════════════════════════════════════
`;

    // Download as text file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WildGuard_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "Wildlife identification report has been downloaded",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-2xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/30">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Command</h1>
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-200 border border-emerald-400/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Sync
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Karnataka Wildlife Operations Center</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{admin.username}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{admin.role?.replace('_', ' ')}</div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 border border-gray-200/60 dark:border-gray-700 hover:border-red-400/70 hover:bg-red-50 dark:hover:bg-red-900/20"
                data-testid="button-admin-logout"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-rose-600/80 via-amber-500/80 to-red-600/80 text-white border border-white/10 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.55)] backdrop-blur-xl cursor-pointer transition-all duration-200 hover:-translate-y-1"
            onClick={() => setLocation("/admin/poaching-alerts")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Poaching Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">View →</div>
              <p className="text-xs text-red-100 mt-2">Monitor threats</p>
            </CardContent>
          </Card>

          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-green-600/80 via-emerald-500/80 to-teal-600/80 text-white border border-white/10 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.55)] backdrop-blur-xl cursor-pointer transition-all duration-200 hover:-translate-y-1"
            onClick={() => setLocation("/admin/animal-detections")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Animal Detections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">Track →</div>
              <p className="text-xs text-green-100 mt-2">View all identifications</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/80 via-orange-500/80 to-red-500/70 text-white border border-white/10 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{criticalEmergencies}</div>
              <p className="text-red-100 text-sm mt-1">Immediate attention</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-400/80 via-orange-500/80 to-rose-500/70 text-white border border-white/10 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Urgent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{urgentEmergencies}</div>
              <p className="text-orange-100 text-sm mt-1">Quick response</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-sky-500/80 via-blue-600/80 to-indigo-700/80 text-white border border-white/10 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{pendingSightings.length}</div>
              <p className="text-blue-100 text-sm mt-1">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/80 via-violet-600/80 to-fuchsia-600/80 text-white border border-white/10 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Camera className="h-5 w-5" />
                AI Identifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{statsLoading ? '...' : identificationStats?.total || 0}</div>
              <p className="text-purple-100 text-sm mt-1">Total analyzed</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/80 via-green-600/80 to-teal-600/80 text-white border border-white/10 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Verified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{verifiedSightings.length}</div>
              <p className="text-green-100 text-sm mt-1">Total verified sightings</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="identifications" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="identifications" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Camera className="h-4 w-4" />
              AI Identifications ({identifications.length})
            </TabsTrigger>
            <TabsTrigger value="report" className="gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              Generate Report
            </TabsTrigger>
            <TabsTrigger value="emergency" className="gap-2 data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <AlertTriangle className="h-4 w-4" />
              Emergency Sightings
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Eye className="h-4 w-4" />
              Pending Review ({pendingSightings.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <FileCheck className="h-4 w-4" />
              All Sightings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identifications" className="space-y-4">
            {identificationsLoading ? (
              <div className="text-center py-12">Loading animal identifications...</div>
            ) : identifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No animal identifications yet</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {identificationStats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Today's Identifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{identificationStats.today}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Endangered Sightings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-red-600">{identificationStats.endangeredSightings}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Top Species</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {identificationStats.topSpecies.slice(0, 3).map((species, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-700 dark:text-gray-300">{species.speciesName}</span>
                              <span className="font-semibold text-purple-600">{species.count}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                <div className="space-y-4">
                  {identifications.map((identification) => (
                    <Card key={identification.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="grid md:grid-cols-[200px_1fr] gap-4">
                        <div className="relative h-48 md:h-auto bg-gray-100 dark:bg-gray-800">
                          <img 
                            src={identification.imageUrl} 
                            alt={identification.speciesName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-purple-600">
                              {(identification.confidence * 100).toFixed(0)}% confidence
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {identification.speciesName}
                              </h3>
                              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                                {identification.scientificName}
                              </p>
                            </div>
                            <Badge 
                              variant={
                                identification.conservationStatus.includes('Endangered') ? 'destructive' :
                                identification.conservationStatus.includes('Vulnerable') ? 'default' :
                                'secondary'
                              }
                            >
                              {identification.conservationStatus}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <User className="h-4 w-4" />
                              <span>{identification.username || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(identification.createdAt).toLocaleDateString()}</span>
                            </div>
                            {identification.locationName && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 col-span-2">
                                <MapPin className="h-4 w-4" />
                                <span>{identification.locationName}</span>
                                {identification.latitude && identification.longitude && (
                                  <a 
                                    href={`https://www.google.com/maps?q=${identification.latitude},${identification.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                  >
                                    ({identification.latitude.toFixed(4)}, {identification.longitude.toFixed(4)})
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report" className="space-y-4">
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                  <FileText className="h-6 w-6" />
                  Wildlife Identification Report
                </CardTitle>
                <CardDescription className="text-green-700 dark:text-green-300">
                  Generate comprehensive report of all animal identifications
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Report Includes
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Summary statistics (total, today, endangered)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Top 10 species identified</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Location-wise distribution</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Endangered species alerts with GPS coordinates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Detailed identification list (up to 50 entries)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Conservation recommendations</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Current Data</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Identifications:</span>
                        <span className="font-bold">{identifications.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Endangered Sightings:</span>
                        <span className="font-bold text-red-600">
                          {identifications.filter(id => 
                            id.conservationStatus.toLowerCase().includes('endangered')
                          ).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Locations Covered:</span>
                        <span className="font-bold">
                          {new Set(identifications.filter(id => id.locationName).map(id => id.locationName)).size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Unique Species:</span>
                        <span className="font-bold">
                          {new Set(identifications.map(id => id.speciesName)).size}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={generateReport}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-6"
                  disabled={identifications.length === 0}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Complete Report
                </Button>
                
                {identifications.length === 0 && (
                  <p className="text-center text-gray-500 mt-4 text-sm">
                    No identifications yet. Upload animal photos to generate reports.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            {emergencyLoading ? (
              <div className="text-center py-12">Loading emergency sightings...</div>
            ) : emergencySightings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No emergency sightings at this time</p>
                </CardContent>
              </Card>
            ) : (
              emergencySightings.map((sighting) => (
                <SightingCard key={sighting.id} sighting={sighting} isEmergency />
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {sightingsLoading ? (
              <div className="text-center py-12">Loading pending sightings...</div>
            ) : pendingSightings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No pending sightings to review</p>
                </CardContent>
              </Card>
            ) : (
              pendingSightings.map((sighting) => (
                <SightingCard key={sighting.id} sighting={sighting} />
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {sightingsLoading ? (
              <div className="text-center py-12">Loading all sightings...</div>
            ) : allSightings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No sightings reported yet</p>
                </CardContent>
              </Card>
            ) : (
              allSightings.map((sighting) => (
                <SightingCard key={sighting.id} sighting={sighting} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SightingCard({ sighting, isEmergency = false }: { sighting: AnimalSighting; isEmergency?: boolean }) {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const emergencyColors = {
    critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    urgent: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    none: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  };

  const isVerified = sighting.verifiedBy !== null;

  const verifySightingMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", `/api/admin/sightings/${sighting.id}/verify`, {});
      return result.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sightings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/emergency-sightings'] });
      toast({
        title: "Sighting Verified",
        description: "The sighting has been verified successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify sighting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const issueCertificateMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/certificates/generate", {
        sightingId: sighting.id,
        recipientName: sighting.reporterName || "Anonymous Reporter",
        recipientEmail: sighting.reporterEmail || "reporter@wildguard.gov.in",
        contribution: `Reported ${sighting.animal || 'wildlife'} sighting and contributed to conservation efforts`,
        speciesHelped: sighting.animal || "Wildlife Conservation",
        location: sighting.location || "Karnataka, India",
      });
      return result.json() as Promise<{ certificateNumber: string }>;
    },
    onSuccess: (data: { certificateNumber: string }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sightings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/emergency-sightings'] });
      toast({
        title: "Certificate Issued!",
        description: `Certificate ${data.certificateNumber} has been generated successfully.`,
      });
      
      window.open(`/api/certificates/download/${data.certificateNumber}`, '_blank');
    },
    onError: (error: Error) => {
      toast({
        title: "Certificate Generation Failed",
        description: error.message || "Failed to generate certificate. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className={`${isEmergency ? 'border-2 border-red-500' : ''} hover:shadow-lg transition-shadow`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-xl">Animal Sighting</CardTitle>
              <Badge className={emergencyColors[sighting.emergencyStatus as keyof typeof emergencyColors]}>
                {sighting.emergencyStatus}
              </Badge>
              <Badge className={isVerified ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"}>
                {isVerified ? 'verified' : 'pending'}
              </Badge>
            </div>
            {sighting.description && (
              <CardDescription className="text-sm">{sighting.description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>
              {sighting.reporterName || 'Anonymous'}
              {sighting.reporterEmail && ` (${sighting.reporterEmail})`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{sighting.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{new Date(sighting.sightedAt).toLocaleString()}</span>
          </div>
          {sighting.animalStatus && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FileCheck className="h-4 w-4" />
              <span className="capitalize">{sighting.animalStatus}</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          {!isVerified && (
            <Button 
              size="sm" 
              variant="default" 
              className="bg-green-600 hover:bg-green-700" 
              onClick={() => verifySightingMutation.mutate()}
              disabled={verifySightingMutation.isPending}
              data-testid={`button-verify-${sighting.id}`}
            >
              {verifySightingMutation.isPending ? "Verifying..." : "Verify Report"}
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowDetails(!showDetails)}
            data-testid={`button-view-${sighting.id}`}
          >
            {showDetails ? "Hide Details" : "View Details"}
          </Button>
          {isVerified && sighting.certificateIssued !== 'yes' && (
            <Button 
              size="sm" 
              variant="default"
              className="bg-purple-600 hover:bg-purple-700 gap-2"
              onClick={() => issueCertificateMutation.mutate()}
              disabled={issueCertificateMutation.isPending}
              data-testid={`button-issue-certificate-${sighting.id}`}
            >
              <Award className="h-4 w-4" />
              {issueCertificateMutation.isPending ? "Issuing..." : "Issue Certificate"}
            </Button>
          )}
          {sighting.certificateIssued === 'yes' && (
            <Badge variant="secondary" className="ml-auto flex items-center gap-1">
              <Award className="h-3 w-3" />
              Certificate Issued
            </Badge>
          )}
        </div>
        {showDetails && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Full Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600 dark:text-gray-400">Animal:</div>
              <div className="font-medium">{sighting.animal || 'Not specified'}</div>
              
              <div className="text-gray-600 dark:text-gray-400">Status:</div>
              <div className="font-medium capitalize">{sighting.animalStatus || 'Unknown'}</div>
              
              <div className="text-gray-600 dark:text-gray-400">Emergency Level:</div>
              <div className="font-medium capitalize">{sighting.emergencyStatus}</div>
              
              <div className="text-gray-600 dark:text-gray-400">Reported At:</div>
              <div className="font-medium">{new Date(sighting.sightedAt).toLocaleString()}</div>
              
              {sighting.verifiedBy && (
                <>
                  <div className="text-gray-600 dark:text-gray-400">Verified By:</div>
                  <div className="font-medium">{sighting.verifiedBy}</div>
                </>
              )}
              
              {sighting.description && (
                <>
                  <div className="text-gray-600 dark:text-gray-400 col-span-2 mt-2">Description:</div>
                  <div className="font-medium col-span-2">{sighting.description}</div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
