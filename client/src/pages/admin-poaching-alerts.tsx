import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, MapPin, Clock, CheckCircle, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DetectedObject {
  class: string;
  confidence: number;
  category: 'weapon' | 'vehicle' | 'human' | 'animal';
}

interface PoachingAlert {
  id: string;
  imageUrl: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  threatLevel: string; // 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
  detectedObjects: DetectedObject[];
  weaponsCount: number;
  humansCount: number;
  vehiclesCount: number;
  animalsCount: number;
  alertMessage: string;
  reviewed: boolean;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reportNotes: string | null;
  actionTaken: string | null;
  createdAt: string;
}

export default function AdminPoachingAlerts() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'investigating' | 'resolved'>('pending');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch poaching alerts
  const { data: alerts, isLoading, error } = useQuery<PoachingAlert[]>({
    queryKey: ['/api/admin/poaching-alerts', selectedStatus],
    queryFn: async () => {
      const response = await fetch(`/api/admin/poaching-alerts?status=${selectedStatus}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      return response.json();
    },
    refetchInterval: 8000,
    refetchOnWindowFocus: true,
  });

  // Update alert status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ alertId, status }: { alertId: string; status: 'investigating' | 'resolved' }) => {
      const response = await fetch(`/api/admin/poaching-alerts/${alertId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/poaching-alerts'] });
      toast({
        title: "Status Updated",
        description: "Alert status has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update alert status",
        variant: "destructive",
      });
    }
  });

  const getThreatLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (reviewed: boolean) => {
    return reviewed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusLabel = (reviewed: boolean) => {
    return reviewed ? 'Reviewed' : 'Pending';
  };

  const pendingCount = alerts?.filter(a => !a.reviewed).length || 0;
  const reviewedCount = alerts?.filter(a => a.reviewed).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <BackButton />
        
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/15 via-amber-400/10 to-emerald-400/10" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative px-6 py-6 lg:px-10 lg:py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                Live Threat Monitoring
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Poaching Command Center</h1>
              <p className="text-sm md:text-base text-slate-200/80 max-w-2xl">
                Monitor, triage, and resolve wildlife poaching threats in real-time with AI detections, confidence scores, and rapid response workflows.
              </p>
              <div className="flex flex-wrap gap-3 text-xs md:text-sm text-slate-200/80">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">⚡ Auto-refresh 8s</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">🎯 AI detections tagged</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">🛰️ Geo-linked evidence</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 min-w-[260px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg">
                <div className="text-xs text-slate-300/80">Pending</div>
                <div className="text-2xl font-bold text-amber-200">{pendingCount}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg">
                <div className="text-xs text-slate-300/80">Reviewed</div>
                <div className="text-2xl font-bold text-emerald-200">{reviewedCount}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-lg">
                <div className="text-xs text-slate-300/80">Total</div>
                <div className="text-2xl font-bold text-cyan-200">{alerts?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for filtering */}
        <Tabs value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 text-white border border-white/10">
            <TabsTrigger value="pending" className="data-[state=active]:bg-amber-400/20 data-[state=active]:text-white">
              Pending ({alerts?.filter(a => !a.reviewed).length || 0})
            </TabsTrigger>
            <TabsTrigger value="investigating" className="data-[state=active]:bg-emerald-400/20 data-[state=active]:text-white">
              Reviewed ({alerts?.filter(a => a.reviewed).length || 0})
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-cyan-400/20 data-[state=active]:text-white">
              All ({alerts?.length || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading alerts...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-800">Error loading alerts: {error.message}</p>
            </CardContent>
          </Card>
        )}

        {/* No Alerts */}
        {!isLoading && !error && alerts?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No {selectedStatus !== 'all' ? selectedStatus : ''} alerts</h3>
              <p className="text-muted-foreground">
                {selectedStatus === 'pending' 
                  ? 'All clear! No pending threats detected.' 
                  : `No ${selectedStatus} alerts at this time.`}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {alerts?.map((alert) => (
            <Card
              key={alert.id}
              className={`relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-[0_25px_80px_-35px_rgba(0,0,0,0.7)] transition-all duration-200 hover:-translate-y-1 ${
                alert.threatLevel === 'critical'
                  ? 'ring-2 ring-red-400/60'
                  : alert.threatLevel === 'high'
                  ? 'ring-2 ring-amber-300/60'
                  : 'ring-1 ring-white/10'
              }`}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />
                <div className="absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
              </div>

              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.threatLevel === 'critical' ? 'text-red-300' :
                      alert.threatLevel === 'high' ? 'text-amber-200' :
                      'text-yellow-200'
                    }`} />
                    Alert #{alert.id}
                  </CardTitle>
                  <div className="flex flex-col items-end gap-2 text-xs">
                    <Badge className={`${getThreatLevelColor(alert.threatLevel)} border-white/20 bg-white/10 text-white`}> {alert.threatLevel}</Badge>
                    <Badge className={`${getStatusColor(alert.reviewed)} border-white/20 bg-white/10 text-white`}>{getStatusLabel(alert.reviewed)}</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 relative z-10">
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl border border-white/10">
                  <img 
                    src={alert.imageUrl} 
                    alt="Poaching evidence" 
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Detection Summary */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
                    <div className="text-amber-200 font-semibold">🔫 {alert.weaponsCount}</div>
                    <div className="text-[11px] text-slate-200/80">Weapons</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
                    <div className="text-orange-200 font-semibold">👤 {alert.humansCount}</div>
                    <div className="text-[11px] text-slate-200/80">Humans</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
                    <div className="text-yellow-200 font-semibold">🚗 {alert.vehiclesCount}</div>
                    <div className="text-[11px] text-slate-200/80">Vehicles</div>
                  </div>
                </div>

                {/* Detected Objects */}
                {alert.detectedObjects.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-white/90">Detections</h4>
                    <div className="flex flex-wrap gap-2">
                      {alert.detectedObjects.map((obj, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-white/20 bg-white/5 text-white">
                          {obj.class} ({Math.round(obj.confidence * 100)}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alert Message */}
                {alert.alertMessage && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <h4 className="font-semibold text-sm mb-1 text-white/90">Alert</h4>
                    <p className="text-sm text-slate-100/80 leading-relaxed">{alert.alertMessage}</p>
                  </div>
                )}

                {/* Report Notes (if reviewed) */}
                {alert.reportNotes && (
                  <div className="rounded-xl border border-blue-300/30 bg-blue-500/10 p-3">
                    <h4 className="font-semibold text-sm mb-1 text-blue-50">Notes</h4>
                    <p className="text-sm text-blue-50/80 leading-relaxed">{alert.reportNotes}</p>
                  </div>
                )}

                {/* Location */}
                {alert.latitude && alert.longitude && (
                  <div className="flex items-center gap-2 text-sm text-slate-200/80">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                    </span>
                    {alert.locationName && <span className="font-medium text-white">({alert.locationName})</span>}
                    <a 
                      href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-cyan-200 hover:underline"
                    >
                      View Map
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                  {!alert.reviewed && (
                    <Button 
                      variant="default" 
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-400 text-black"
                      onClick={() => updateStatusMutation.mutate({ alertId: alert.id, status: 'investigating' })}
                      disabled={updateStatusMutation.isPending}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Mark as Reviewed
                    </Button>
                  )}
                  {alert.reviewed && !alert.actionTaken && (
                    <Button 
                      variant="default" 
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-400 text-black"
                      onClick={() => updateStatusMutation.mutate({ alertId: alert.id, status: 'resolved' })}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Add Action Taken
                    </Button>
                  )}
                  {alert.reviewedBy && (
                    <span className="text-xs text-slate-200/70 ml-auto self-center">
                      Reviewed by admin
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
