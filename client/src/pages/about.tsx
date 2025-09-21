import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Target, Heart, Globe, Zap } from "lucide-react";

export default function About() {
  const teamMembers = [
    { name: "Vivin Vaibhav L K", role: "Lead Developer" },
    { name: "Saniya S", role: "AI Specialist" },
    { name: "Umesh L", role: "Backend Developer" },
    { name: "Srinidhi R Y", role: "Frontend Developer" }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Identification",
      description: "Advanced machine learning models for instant animal recognition"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Conservation Network",
      description: "Connect with wildlife centers and conservation organizations"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Educational Resources",
      description: "Learn about wildlife protection and conservation success stories"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Emergency Response",
      description: "Quick access to wildlife rescue and emergency services"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About WildGuard
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            An AI-powered wildlife protection platform that helps identify animals through advanced photo analysis 
            and connects users with nearby wildlife conservation centers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 text-primary mr-2" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To protect and preserve wildlife through technology, education, and community engagement. 
                We believe that every species deserves protection and that technology can bridge the gap 
                between wildlife conservation efforts and public awareness.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 text-red-500 mr-2" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A world where humans and wildlife coexist harmoniously, where every citizen can contribute 
                to conservation efforts, and where technology empowers everyone to become a wildlife guardian.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
            <Zap className="w-8 h-8 text-yellow-500 mr-3" />
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-feature-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <div className="text-primary mr-3">{feature.icon}</div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
            <Users className="w-8 h-8 text-blue-500 mr-3" />
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow" data-testid={`card-team-${index}`}>
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="secondary">{member.role}</Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8">
          <div className="text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">🌍 Wildlife Protection – Why It Matters</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-8">
              Wildlife protection means caring for animals, plants, and their natural habitats so they don't disappear forever. 
              Every species plays an important role in keeping our planet balanced.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">🌿 Ecosystem Balance</h4>
                <p className="text-sm text-muted-foreground">Every species contributes to the delicate balance of nature.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">🧬 Genetic Diversity</h4>
                <p className="text-sm text-muted-foreground">Biodiversity is crucial for ecosystem resilience and adaptation.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-2">🌍 Climate Regulation</h4>
                <p className="text-sm text-muted-foreground">Wildlife helps regulate climate and maintain environmental stability.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Supporting wildlife conservation through technology and education.
          </p>
        </div>
      </div>
    </div>
  );
}