import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Shield, AlertTriangle, FileCheck, TrendingUp, LogOut, MapPin, Calendar, User, Eye, Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AdminUser, AnimalSighting } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: admin, isLoading: adminLoading } = useQuery<AdminUser>({
    queryKey: ['/api/admin/me'],
  });

  const { data: emergencySightings = [], isLoading: emergencyLoading } = useQuery<AnimalSighting[]>({
    queryKey: ['/api/admin/emergency-sightings'],
  });

  const { data: allSightings = [], isLoading: sightingsLoading } = useQuery<AnimalSighting[]>({
    queryKey: ['/api/admin/sightings'],
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Karnataka Wildlife Department</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{admin.username}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{admin.role?.replace('_', ' ')}</div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{criticalEmergencies}</div>
              <p className="text-red-100 text-sm mt-1">Immediate attention required</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Urgent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{urgentEmergencies}</div>
              <p className="text-orange-100 text-sm mt-1">Requires quick response</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
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

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
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

        <Tabs defaultValue="emergency" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
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
  const emergencyColors = {
    critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    urgent: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    none: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  };

  const isVerified = sighting.verifiedBy !== null;

  const issueCertificateMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/certificates/generate", {
        sightingId: sighting.id,
        reporterName: sighting.reporterName || "Anonymous Reporter",
        reporterEmail: sighting.reporterEmail || "",
        location: sighting.location,
        species: "Wildlife",
        sightedAt: sighting.sightedAt,
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
            <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" data-testid={`button-verify-${sighting.id}`}>
              Verify Report
            </Button>
          )}
          <Button size="sm" variant="outline" data-testid={`button-view-${sighting.id}`}>
            View Details
          </Button>
          {isVerified && !sighting.certificateIssued && (
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
          {sighting.certificateIssued && (
            <Badge variant="secondary" className="ml-auto flex items-center gap-1">
              <Award className="h-3 w-3" />
              Certificate Issued
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
