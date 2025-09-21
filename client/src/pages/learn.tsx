import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, Award, Users } from "lucide-react";

export default function Learn() {
  const successStories = [
    {
      title: "Project Tiger Success",
      description: "Tiger population in India has risen due to Project Tiger and strict laws.",
      impact: "Population increased from 1,411 (2006) to 2,967 (2019)",
      status: "Ongoing Success"
    },
    {
      title: "Whale Conservation", 
      description: "Whales have been saved from near extinction after global bans on whaling.",
      impact: "Blue whale population recovering globally",
      status: "Global Achievement"
    },
    {
      title: "Sea Turtle Protection",
      description: "Sea Turtles protected through beach cleanups and egg hatcheries.",
      impact: "Nesting sites increased by 40% in the last decade",
      status: "Remarkable Progress"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Learn About Conservation
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover conservation success stories, learn protection methods, and understand how technology helps wildlife.
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8 mb-12">
          <div className="text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">🌍 Wildlife Protection – Why It Matters</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Wildlife protection means caring for animals, plants, and their natural habitats so they don't disappear forever. 
              Every species plays an important role in keeping our planet balanced.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
            <Award className="w-8 h-8 text-yellow-500 mr-3" />
            🌱 Conservation Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-success-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <Badge variant="secondary" className="w-fit">{story.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription>{story.description}</CardDescription>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                      📈 {story.impact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
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

        <div className="bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-950 dark:to-green-950 rounded-2xl p-8">
          <div className="text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-6">How Technology Helps Wildlife</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">🤖 AI Identification</h4>
                <p className="text-sm text-muted-foreground">Machine learning helps identify species from photos instantly.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">📡 GPS Tracking</h4>
                <p className="text-sm text-muted-foreground">Satellite collars monitor animal movements and migration patterns.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">📊 Data Analysis</h4>
                <p className="text-sm text-muted-foreground">Big data helps scientists understand population trends and threats.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}