import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, MapPin, AlertTriangle, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Header } from "@/components/header";
import "leaflet/dist/leaflet.css";

const sightingSchema = z.object({
  reporterName: z.string().min(1, "Your name is required"),
  reporterEmail: z.string().email("Valid email is required"),
  reporterPhone: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  habitatType: z.string().min(1, "Habitat type is required"),
  animalStatus: z.string().min(1, "Animal status is required"),
  emergencyStatus: z.string().min(1, "Emergency status is required"),
  description: z.string().optional(),
  manualLatitude: z.string().optional(),
  manualLongitude: z.string().optional(),
});

type SightingForm = z.infer<typeof sightingSchema>;

export default function ReportSighting() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const form = useForm<SightingForm>({
    resolver: zodResolver(sightingSchema),
    defaultValues: {
      reporterName: "",
      reporterEmail: "",
      reporterPhone: "",
      location: "",
      habitatType: "",
      animalStatus: "",
      emergencyStatus: "none",
      description: "",
    },
  });

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast({
            title: "Location Captured",
            description: `Lat: ${position.coords.latitude.toFixed(6)}, Long: ${position.coords.longitude.toFixed(6)}`,
          });
          setLocationLoading(false);
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter it manually.",
            variant: "destructive",
          });
          setLocationLoading(false);
        },
        {
          timeout: 10000, // 10 second timeout
          enableHighAccuracy: false
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setLocationLoading(false);
    }
  };

  // Initialize map when coordinates are captured
  useEffect(() => {
    if (!coordinates || !mapRef.current) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Dynamically import Leaflet
    import('leaflet').then(({ default: L }) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
        // Create map centered on user's location
        const map = L.map(mapRef.current).setView([coordinates.latitude, coordinates.longitude], 15);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add current location marker
        const locationIcon = L.divIcon({
          html: '<div class="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-full"></div></div>',
          className: 'custom-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([coordinates.latitude, coordinates.longitude], { icon: locationIcon })
          .addTo(map)
          .bindPopup('<b>Your Current Location</b><br/>Sighting will be reported here');

        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Map initialization error:', error);
        toast({
          title: "Map Error",
          description: "Unable to display map. Location has been captured.",
          variant: "destructive",
        });
      }
    }).catch((error) => {
      console.error('Failed to load map library:', error);
      toast({
        title: "Map Loading Error",
        description: "Map visualization unavailable. Your location has been captured successfully.",
        variant: "destructive",
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setCameraStream(stream);
      setShowCamera(true);
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (!cameraStream) return;
    
    const video = document.getElementById('camera-preview') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setPhotoFile(file);
        setPhotoPreview(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }
    }, 'image/jpeg');
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setShowCamera(false);
    }
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    if (cameraStream && showCamera) {
      const video = document.getElementById('camera-preview') as HTMLVideoElement;
      if (video) {
        video.srcObject = cameraStream;
      }
    }
  }, [cameraStream, showCamera]);

  const onSubmit = async (data: SightingForm) => {
    if (!photoFile) {
      toast({
        title: "Photo Required",
        description: "Please upload or capture a photo of the animal",
        variant: "destructive",
      });
      return;
    }

    // Use automatic coordinates if available, otherwise use manual entry
    let finalLatitude: number;
    let finalLongitude: number;

    if (coordinates) {
      finalLatitude = coordinates.latitude;
      finalLongitude = coordinates.longitude;
    } else if (data.manualLatitude && data.manualLongitude) {
      finalLatitude = parseFloat(data.manualLatitude);
      finalLongitude = parseFloat(data.manualLongitude);
      
      if (!isFinite(finalLatitude) || !isFinite(finalLongitude)) {
        toast({
          title: "Invalid Coordinates",
          description: "Please enter valid latitude and longitude values",
          variant: "destructive",
        });
        return;
      }
    } else {
      toast({
        title: "Location Required",
        description: "Please capture your location or enter coordinates manually",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', photoFile);
      formData.append('reporterName', data.reporterName);
      formData.append('reporterEmail', data.reporterEmail);
      if (data.reporterPhone) formData.append('reporterPhone', data.reporterPhone);
      formData.append('location', data.location);
      formData.append('latitude', finalLatitude.toString());
      formData.append('longitude', finalLongitude.toString());
      formData.append('habitatType', data.habitatType);
      formData.append('animalStatus', data.animalStatus);
      formData.append('emergencyStatus', data.emergencyStatus);
      if (data.description) formData.append('description', data.description);

      const response = await fetch('/api/report-sighting', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast({
        title: "Sighting Reported Successfully!",
        description: "Thank you for contributing to wildlife conservation. Our team will review your report.",
      });

      setLocation("/home");
    } catch (error: any) {
      toast({
        title: "Report Failed",
        description: error.message || "Unable to submit your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Report Animal Sighting
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Help us protect wildlife by reporting your sightings
          </p>
        </div>

        <Card className="shadow-xl border-2 border-green-100 dark:border-green-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-6 w-6 text-green-600" />
              Sighting Details
            </CardTitle>
            <CardDescription>
              Provide as much detail as possible to help wildlife officials assess the situation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Photo Evidence
                    </h3>
                    
                    {!photoPreview ? (
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            onClick={startCamera}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            data-testid="button-start-camera"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Use Camera
                          </Button>
                          <label className="flex-1">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              onClick={() => document.getElementById('photo-upload')?.click()}
                              data-testid="button-upload-photo"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Photo
                            </Button>
                            <input
                              id="photo-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              data-testid="input-photo-upload"
                            />
                          </label>
                        </div>

                        {showCamera && cameraStream && (
                          <div className="relative">
                            <video
                              id="camera-preview"
                              autoPlay
                              playsInline
                              className="w-full rounded-lg"
                            />
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                              <Button
                                type="button"
                                onClick={capturePhoto}
                                className="bg-green-600 hover:bg-green-700"
                                data-testid="button-capture-photo"
                              >
                                <Camera className="h-4 w-4 mr-2" />
                                Capture
                              </Button>
                              <Button
                                type="button"
                                onClick={stopCamera}
                                variant="destructive"
                                data-testid="button-cancel-camera"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <img src={photoPreview} alt="Preview" className="w-full rounded-lg" />
                        <Button
                          type="button"
                          onClick={() => {
                            setPhotoFile(null);
                            setPhotoPreview(null);
                          }}
                          variant="outline"
                          className="w-full"
                          data-testid="button-remove-photo"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove Photo
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location Information
                    </h3>
                    
                    <div className="space-y-4">
                      <Button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        data-testid="button-get-location"
                      >
                        {locationLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Getting Location...
                          </>
                        ) : coordinates ? (
                          <>
                            <MapPin className="h-4 w-4 mr-2" />
                            Location Captured ✓
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 mr-2" />
                            Capture Current Location
                          </>
                        )}
                      </Button>

                      {coordinates && (
                        <>
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-sm">
                            <p className="font-medium">Coordinates:</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              Lat: {coordinates.latitude.toFixed(6)}, Long: {coordinates.longitude.toFixed(6)}
                            </p>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="font-medium text-sm mb-2">Your Location on Map:</p>
                            <div 
                              ref={mapRef} 
                              className="w-full h-64 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                              data-testid="map-current-location"
                            />
                          </div>
                        </>
                      )}

                      {!coordinates && (
                        <div className="space-y-4 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <p className="text-sm text-yellow-800 dark:text-yellow-400">
                            If geolocation is not available, you can enter coordinates manually:
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="manualLatitude"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Latitude</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      step="any"
                                      placeholder="e.g., 12.9716"
                                      data-testid="input-manual-latitude"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="manualLongitude"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Longitude</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      step="any"
                                      placeholder="e.g., 77.5946"
                                      data-testid="input-manual-longitude"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location Name / Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., Bannerghatta National Park, Bangalore"
                                data-testid="input-location-name"
                              />
                            </FormControl>
                            <FormDescription>
                              Provide a descriptive location name
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="habitatType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Habitat Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-habitat-type">
                                  <SelectValue placeholder="Select habitat type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="forest">Forest</SelectItem>
                                <SelectItem value="grassland">Grassland</SelectItem>
                                <SelectItem value="wetland">Wetland</SelectItem>
                                <SelectItem value="urban">Urban Area</SelectItem>
                                <SelectItem value="agricultural">Agricultural Land</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-6 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Animal Status
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="animalStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Animal Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-animal-status">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="healthy">Healthy</SelectItem>
                                <SelectItem value="injured">Injured</SelectItem>
                                <SelectItem value="sick">Sick</SelectItem>
                                <SelectItem value="in_danger">In Danger</SelectItem>
                                <SelectItem value="dead">Dead</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emergencyStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-emergency-status">
                                  <SelectValue placeholder="Select urgency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">None - Observation Only</SelectItem>
                                <SelectItem value="urgent">Urgent - Needs Attention</SelectItem>
                                <SelectItem value="critical">Critical - Immediate Help Required</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Additional Details</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe the animal's behavior, any notable features, or concerns..."
                              className="min-h-[100px]"
                              data-testid="textarea-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Your Contact Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="reporterName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Full name" data-testid="input-reporter-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reporterEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="your@email.com" data-testid="input-reporter-email" />
                          </FormControl>
                          <FormDescription>
                            We'll send you updates and may issue a certificate for helpful reports
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reporterPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" placeholder="+91 98765 43210" data-testid="input-reporter-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 text-lg"
                  data-testid="button-submit-report"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    "Submit Sighting Report"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
