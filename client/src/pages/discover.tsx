import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shield, Users, Heart, PawPrint, Phone, Mail, MapPin, ExternalLink, Calendar, HandHeart, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Ngo } from "@shared/schema";

// Import animal images
import elephantImg from "@assets/stock_images/asian_elephant_wildl_d783d82b.jpg";
import tigerImg from "@assets/stock_images/bengal_tiger_wildlif_f41ab7a4.jpg";
import leopardImg from "@assets/stock_images/indian_leopard_wildl_95762e17.jpg";
import bearImg from "@assets/stock_images/sloth_bear_wildlife__cc92a9ff.jpg";
import deerImg from "@assets/stock_images/spotted_deer_chital__13c3d594.jpg";
import peafowlImg from "@assets/stock_images/indian_peafowl_peaco_ade86f32.jpg";

export default function Discover() {
  const [volunteerFormOpen, setVolunteerFormOpen] = useState(false);
  const [adoptionFormOpen, setAdoptionFormOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string>("");
  const { toast } = useToast();

  const { data: ngos } = useQuery<Ngo[]>({
    queryKey: ["/api/ngos"],
  });

  // Mock NGO data if API doesn't return data
  const mockNgos: Ngo[] = [
    {
      id: "1",
      name: "Wildlife Conservation Trust Karnataka",
      description: "Leading organization working on wildlife protection, habitat restoration, and community-based conservation across Karnataka's forests and protected areas.",
      focus: ["Tiger Conservation", "Elephant Protection", "Habitat Restoration"],
      address: "Bangalore, Karnataka",
      email: "contact@wctkarnata.org",
      phone: "+91 80 1234 5678",
      website: "www.wctkarnataka.org",
      latitude: 12.9716,
      longitude: 77.5946,
      volunteerOpportunities: ["Field Research", "Community Outreach"],
      established: "1995",
      rating: 4.8
    },
    {
      id: "2",
      name: "Karnataka Forest Department Conservation Wing",
      description: "Government body responsible for protecting Karnataka's 38,720 km² of forest area, managing wildlife sanctuaries, and anti-poaching operations.",
      focus: ["Forest Protection", "Wildlife Surveys", "Community Engagement"],
      address: "Bangalore, Karnataka",
      email: "info@karnatakaforest.gov.in",
      phone: "+91 80 2222 3333",
      website: "www.aranya.gov.in",
      latitude: 12.9716,
      longitude: 77.5946,
      volunteerOpportunities: ["Forest Patrols", "Wildlife Monitoring"],
      established: "1975",
      rating: 4.6
    },
    {
      id: "3",
      name: "Green Earth Volunteers",
      description: "Youth-led environmental organization conducting tree plantation drives, wildlife awareness programs, and eco-tourism initiatives across Karnataka.",
      focus: ["Reforestation", "Youth Education", "Eco-Tourism"],
      address: "Mysore, Karnataka",
      email: "hello@greenearthvolunteers.org",
      phone: "+91 821 4567 8901",
      website: "www.greenearthvolunteers.org",
      latitude: 12.2958,
      longitude: 76.6394,
      volunteerOpportunities: ["Tree Planting", "Educational Programs"],
      established: "2010",
      rating: 4.5
    },
    {
      id: "4",
      name: "Bandipur Wildlife Rescue Center",
      description: "Dedicated rescue and rehabilitation facility for injured wildlife, specializing in elephant care, leopard rescue, and bird sanctuary operations.",
      focus: ["Animal Rescue", "Wildlife Rehabilitation", "Veterinary Care"],
      address: "Bandipur, Karnataka",
      email: "rescue@bandipurwildlife.org",
      phone: "+91 8229 123456",
      website: "www.bandipurrescue.org",
      latitude: 11.7401,
      longitude: 76.5026,
      volunteerOpportunities: ["Animal Care", "Rescue Operations"],
      established: "2005",
      rating: 4.7
    }
  ];

  const displayNgos = (ngos && ngos.length > 0) ? ngos : mockNgos;

  // Animals available for adoption
  const adoptableAnimals = [
    { id: "elephant-1", name: "Raja (Asian Elephant)", age: "8 years", status: "Rescued from conflict zone", monthlySupport: "₹5,000", image: elephantImg },
    { id: "tiger-1", name: "Shakti (Bengal Tiger)", age: "4 years", status: "Orphaned cub under care", monthlySupport: "₹8,000", image: tigerImg },
    { id: "leopard-1", name: "Chitra (Leopard)", age: "3 years", status: "Recovering from injury", monthlySupport: "₹6,000", image: leopardImg },
    { id: "sloth-1", name: "Bhalu (Sloth Bear)", age: "5 years", status: "Rescued from poachers", monthlySupport: "₹4,500", image: bearImg },
    { id: "deer-1", name: "Mrigi (Spotted Deer)", age: "2 years", status: "Orphaned fawn", monthlySupport: "₹2,500", image: deerImg },
    { id: "peacock-1", name: "Mayura (Indian Peafowl)", age: "1 year", status: "Injured wing recovery", monthlySupport: "₹1,500", image: peafowlImg }
  ];

  const volunteerMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/volunteer-applications", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest! We'll contact you soon.",
      });
      setVolunteerFormOpen(false);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const adoptionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/animal-adoptions", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Adoption Request Received!",
        description: "We'll send you the adoption details and payment information soon.",
      });
      setAdoptionFormOpen(false);
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const handleVolunteerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    volunteerMutation.mutate({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      ngoId: formData.get("ngo"),
      availability: formData.get("availability"),
      skills: formData.get("skills"),
      message: formData.get("message")
    });
  };

  const handleAdoptionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    adoptionMutation.mutate({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      animalId: formData.get("animal"),
      adoptionType: formData.get("adoptionType"),
      message: formData.get("message")
    });
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 p-4 rounded-full shadow-lg">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground dark:text-white mb-2">
            NGOs & Volunteer
          </h1>
          <p className="text-xl text-muted-foreground dark:text-gray-400 max-w-3xl mx-auto">
            Join the conservation movement! Work with NGOs, volunteer for wildlife protection, and adopt animals to support their care.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Dialog open={volunteerFormOpen} onOpenChange={setVolunteerFormOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 border-blue-200 dark:border-blue-800" data-testid="card-volunteer-cta">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HandHeart className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    <div>
                      <CardTitle className="text-xl text-foreground dark:text-white">Apply to Volunteer</CardTitle>
                      <CardDescription className="text-blue-700 dark:text-blue-300">Join conservation efforts in your area</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="text-foreground dark:text-white">Volunteer Application</DialogTitle>
                <DialogDescription className="text-muted-foreground dark:text-gray-400">
                  Fill out this form to apply for volunteer opportunities with wildlife conservation organizations.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="volunteer-name" className="text-foreground dark:text-white">Full Name *</Label>
                  <Input id="volunteer-name" name="name" required className="bg-background dark:bg-gray-800 text-foreground dark:text-white" />
                </div>
                <div>
                  <Label htmlFor="volunteer-email" className="text-foreground dark:text-white">Email *</Label>
                  <Input id="volunteer-email" name="email" type="email" required className="bg-background dark:bg-gray-800 text-foreground dark:text-white" />
                </div>
                <div>
                  <Label htmlFor="volunteer-phone" className="text-foreground dark:text-white">Phone Number *</Label>
                  <Input id="volunteer-phone" name="phone" type="tel" required className="bg-background dark:bg-gray-800 text-foreground dark:text-white" />
                </div>
                <div>
                  <Label htmlFor="volunteer-ngo" className="text-foreground dark:text-white">Preferred Organization *</Label>
                  <Select name="ngo" required>
                    <SelectTrigger className="bg-background dark:bg-gray-800 text-foreground dark:text-white">
                      <SelectValue placeholder="Select an NGO" />
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-gray-900">
                      {displayNgos.map(ngo => (
                        <SelectItem key={ngo.id} value={ngo.id}>{ngo.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="volunteer-availability" className="text-foreground dark:text-white">Availability *</Label>
                  <Select name="availability" required>
                    <SelectTrigger className="bg-background dark:bg-gray-800 text-foreground dark:text-white">
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-gray-900">
                      <SelectItem value="weekends">Weekends Only</SelectItem>
                      <SelectItem value="weekdays">Weekdays Only</SelectItem>
                      <SelectItem value="fulltime">Full-time (40 hrs/week)</SelectItem>
                      <SelectItem value="parttime">Part-time (20 hrs/week)</SelectItem>
                      <SelectItem value="flexible">Flexible Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="volunteer-skills" className="text-foreground dark:text-white">Skills & Experience</Label>
                  <Textarea 
                    id="volunteer-skills" 
                    name="skills" 
                    placeholder="E.g., Photography, Social Media, Field Work, Veterinary Skills, Teaching, etc."
                    className="bg-background dark:bg-gray-800 text-foreground dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="volunteer-message" className="text-foreground dark:text-white">Why do you want to volunteer?</Label>
                  <Textarea 
                    id="volunteer-message" 
                    name="message" 
                    placeholder="Tell us about your passion for wildlife conservation..."
                    className="bg-background dark:bg-gray-800 text-foreground dark:text-white"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={volunteerMutation.isPending}>
                  {volunteerMutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={adoptionFormOpen} onOpenChange={setAdoptionFormOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 border-green-200 dark:border-green-800" data-testid="card-adoption-cta">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Heart className="w-10 h-10 text-green-600 dark:text-green-400" />
                    <div>
                      <CardTitle className="text-xl text-foreground dark:text-white">Adopt an Animal</CardTitle>
                      <CardDescription className="text-green-700 dark:text-green-300">Support wildlife through monthly sponsorship</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="text-foreground dark:text-white">Adopt an Animal</DialogTitle>
                <DialogDescription className="text-muted-foreground dark:text-gray-400">
                  Your monthly support helps provide food, medical care, and habitat for rescued wildlife.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdoptionSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="adoption-name" className="text-foreground dark:text-white">Full Name *</Label>
                  <Input id="adoption-name" name="name" required className="bg-background dark:bg-gray-800 text-foreground dark:text-white" />
                </div>
                <div>
                  <Label htmlFor="adoption-email" className="text-foreground dark:text-white">Email *</Label>
                  <Input id="adoption-email" name="email" type="email" required className="bg-background dark:bg-gray-800 text-foreground dark:text-white" />
                </div>
                <div>
                  <Label htmlFor="adoption-phone" className="text-foreground dark:text-white">Phone Number *</Label>
                  <Input id="adoption-phone" name="phone" type="tel" required className="bg-background dark:bg-gray-800 text-foreground dark:text-white" />
                </div>
                <div>
                  <Label htmlFor="adoption-animal" className="text-foreground dark:text-white">Select Animal to Adopt *</Label>
                  <Select name="animal" required onValueChange={setSelectedAnimal}>
                    <SelectTrigger className="bg-background dark:bg-gray-800 text-foreground dark:text-white">
                      <SelectValue placeholder="Choose an animal" />
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-gray-900">
                      {adoptableAnimals.map(animal => (
                        <SelectItem key={animal.id} value={animal.id}>
                          {animal.name} - {animal.monthlySupport}/month
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedAnimal && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-sm">
                      {adoptableAnimals.find(a => a.id === selectedAnimal)?.status}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="adoption-type" className="text-foreground dark:text-white">Adoption Type *</Label>
                  <Select name="adoptionType" required>
                    <SelectTrigger className="bg-background dark:bg-gray-800 text-foreground dark:text-white">
                      <SelectValue placeholder="Select adoption duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-gray-900">
                      <SelectItem value="monthly">Monthly Support</SelectItem>
                      <SelectItem value="yearly">Yearly Support (10% discount)</SelectItem>
                      <SelectItem value="lifetime">Lifetime Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="adoption-message" className="text-foreground dark:text-white">Message (Optional)</Label>
                  <Textarea 
                    id="adoption-message" 
                    name="message" 
                    placeholder="Any special message or questions..."
                    className="bg-background dark:bg-gray-800 text-foreground dark:text-white"
                  />
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    <strong>Benefits of Adoption:</strong> Monthly updates with photos, adoption certificate, 
                    visiting rights, and tax deduction eligibility.
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={adoptionMutation.isPending}>
                  {adoptionMutation.isPending ? "Processing..." : "Submit Adoption Request"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs for different content */}
        <Tabs defaultValue="ngos" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-card dark:bg-gray-900">
            <TabsTrigger value="ngos">NGOs Directory</TabsTrigger>
            <TabsTrigger value="animals">Animals for Adoption</TabsTrigger>
            <TabsTrigger value="how-to-help">How to Help</TabsTrigger>
          </TabsList>

          {/* NGOs Directory Tab */}
          <TabsContent value="ngos" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {displayNgos.map(ngo => (
                <Card key={ngo.id} className="hover:shadow-lg transition-shadow bg-card dark:bg-gray-900 border-border dark:border-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl text-foreground dark:text-white mb-2">{ngo.name}</CardTitle>
                        <CardDescription className="text-base text-muted-foreground dark:text-gray-400">
                          {ngo.description}
                        </CardDescription>
                      </div>
                      <Shield className="w-12 h-12 text-primary flex-shrink-0 ml-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground dark:text-gray-300">{ngo.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground dark:text-gray-300">Established: {ngo.established}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground dark:text-gray-300">{ngo.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground dark:text-gray-300">{ngo.phone}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground dark:text-white mb-2">Focus Areas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {ngo.focus?.map((area: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="default" size="sm" onClick={() => setVolunteerFormOpen(true)}>
                        <Users className="w-4 h-4 mr-2" />
                        Volunteer Here
                      </Button>
                      {ngo.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`https://${ngo.website}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Animals for Adoption Tab */}
          <TabsContent value="animals" className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-6 rounded-lg mb-6 border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">About Animal Adoption</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                When you adopt an animal, you're providing crucial financial support for their food, medical care, 
                and habitat maintenance. All animals in our program are rescues that cannot be released back to the wild. 
                Your monthly contribution ensures they live with dignity and proper care.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adoptableAnimals.map(animal => (
                <Card key={animal.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-card dark:bg-gray-900 border-border dark:border-gray-800 group" data-testid={`adoption-card-${animal.id}`}>
                  {/* Animal Image */}
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30">
                    <img 
                      src={animal.image} 
                      alt={animal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      data-testid={`adoption-image-${animal.id}`}
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <PawPrint className="w-6 h-6 text-primary" />
                      <CardTitle className="text-foreground dark:text-white">{animal.name.split('(')[0]}</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground dark:text-gray-400">
                      {animal.name.split('(')[1]?.replace(')', '')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground dark:text-gray-400">Age:</span>
                        <span className="font-medium text-foreground dark:text-white">{animal.age}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground dark:text-gray-400">Monthly Support:</span>
                        <span className="font-bold text-primary">{animal.monthlySupport}</span>
                      </div>
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                        <p className="text-sm text-amber-900 dark:text-amber-300">{animal.status}</p>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg" 
                        onClick={() => {
                          setSelectedAnimal(animal.id);
                          setAdoptionFormOpen(true);
                        }}
                        data-testid={`button-adopt-${animal.id}`}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Adopt {animal.name.split('(')[0]}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* How to Help Tab */}
          <TabsContent value="how-to-help" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card dark:bg-gray-900 border-border dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Volunteer Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">Field Work</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Participate in wildlife surveys, habitat monitoring, and conservation patrols in forests and sanctuaries.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">Animal Care</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Help feed animals, clean enclosures, and assist veterinarians at rescue centers.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">Education & Outreach</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Conduct awareness programs in schools and communities about wildlife protection.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">Documentation</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Photography, videography, and social media management to spread awareness.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card dark:bg-gray-900 border-border dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                    <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                    Other Ways to Contribute
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">Donations</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Financial contributions for medical equipment, food supplies, and habitat restoration projects.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">Sponsor a Program</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Fund specific initiatives like anti-poaching units, veterinary camps, or reforestation drives.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">Spread Awareness</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Share conservation messages on social media and educate others about wildlife protection.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground dark:text-white mb-1">Report Wildlife Crime</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Contact forest departments immediately if you witness poaching or illegal wildlife trade.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border-primary/20 dark:border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground dark:text-white">Raising Wildlife: What Volunteers Do</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground dark:text-gray-400">
                  Volunteers play a crucial role in caring for rescued, orphaned, and injured wildlife. Here's what the process involves:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-background dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-foreground dark:text-white mb-2 flex items-center gap-2">
                      <PawPrint className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      Rescue & Intake
                    </h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Animals are brought in from conflict zones, accidents, or abandonment. Initial health assessment, 
                      quarantine, and emergency medical treatment.
                    </p>
                  </div>
                  <div className="p-4 bg-background dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-foreground dark:text-white mb-2 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                      Daily Care
                    </h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Feeding according to species-specific diets, cleaning enclosures, monitoring behavior, 
                      and providing enrichment activities for mental stimulation.
                    </p>
                  </div>
                  <div className="p-4 bg-background dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-foreground dark:text-white mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Rehabilitation
                    </h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Teaching survival skills, building strength, and preparing animals for potential release 
                      back to their natural habitat when possible.
                    </p>
                  </div>
                  <div className="p-4 bg-background dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-foreground dark:text-white mb-2 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Long-term Care
                    </h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      For animals that cannot be released, providing lifetime sanctuary care with proper nutrition, 
                      medical attention, and quality of life.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
