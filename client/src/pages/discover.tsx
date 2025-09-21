import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Binoculars, Map, Search } from "lucide-react";

export default function Discover() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Discover Wildlife
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the amazing world of wildlife and learn about conservation efforts in Karnataka and across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow" data-testid="card-ai-identification">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Search className="w-6 h-6 text-primary mr-2" />
                <CardTitle>AI Animal Identification</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload a photo and instantly identify animals using advanced AI technology. Learn about their conservation status and habitat.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" data-testid="card-conservation-centers">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Map className="w-6 h-6 text-primary mr-2" />
                <CardTitle>Conservation Centers</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find nearby wildlife conservation centers, rehabilitation facilities, and rescue organizations in your area.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" data-testid="card-species-database">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Binoculars className="w-6 h-6 text-primary mr-2" />
                <CardTitle>Species Database</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Browse our comprehensive database of Karnataka's wildlife including tigers, elephants, leopards, and many more species.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8">
          <div className="text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">🌍 Wildlife Protection – Why It Matters</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Wildlife protection means caring for animals, plants, and their natural habitats so they don't disappear forever. 
              Every species plays an important role in keeping our planet balanced.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 text-destructive mr-2" />
                🐾 Threats to Wildlife
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Habitat Loss</h4>
                <p className="text-sm text-muted-foreground">Cutting forests, draining wetlands, and building cities destroy homes of animals.</p>
              </div>
              <div>
                <h4 className="font-semibold">Poaching & Hunting</h4>
                <p className="text-sm text-muted-foreground">Illegal hunting for fur, horns, tusks, or meat.</p>
              </div>
              <div>
                <h4 className="font-semibold">Pollution</h4>
                <p className="text-sm text-muted-foreground">Plastics, chemicals, and oil spills harm animals and water sources.</p>
              </div>
              <div>
                <h4 className="font-semibold">Climate Change</h4>
                <p className="text-sm text-muted-foreground">Rising temperatures affect food sources and breeding cycles.</p>
              </div>
              <div>
                <h4 className="font-semibold">Human–Wildlife Conflict</h4>
                <p className="text-sm text-muted-foreground">When people and animals compete for land and resources.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                ✅ Ways to Protect Wildlife
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Protect Habitats</h4>
                <p className="text-sm text-muted-foreground">Create and maintain sanctuaries, parks, and reserves.</p>
              </div>
              <div>
                <h4 className="font-semibold">Ban Poaching & Trade</h4>
                <p className="text-sm text-muted-foreground">Enforce strict laws against illegal hunting.</p>
              </div>
              <div>
                <h4 className="font-semibold">Eco-friendly Lifestyle</h4>
                <p className="text-sm text-muted-foreground">Reduce plastic use, recycle, and save energy.</p>
              </div>
              <div>
                <h4 className="font-semibold">Awareness & Education</h4>
                <p className="text-sm text-muted-foreground">Teach people about the importance of wildlife.</p>
              </div>
              <div>
                <h4 className="font-semibold">Support Conservation Programs</h4>
                <p className="text-sm text-muted-foreground">Donate or volunteer for NGOs and local groups.</p>
              </div>
              <div>
                <h4 className="font-semibold">Plant Native Trees</h4>
                <p className="text-sm text-muted-foreground">Trees provide shelter and food for animals.</p>
              </div>
              <div>
                <h4 className="font-semibold">Use Technology</h4>
                <p className="text-sm text-muted-foreground">GPS tracking, AI, and databases help monitor animal populations.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}