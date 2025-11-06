import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, MapPin, Phone, Clock, Heart, Map as MapIcon } from "lucide-react";
import { wildlifeCentersData } from "@shared/schema";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { motionConfig } from "@/lib/motionConfig";

export default function Centers() {
  const centersGrid = useScrollAnimation();
  const helpSection = useScrollAnimation();
  const emergencySection = useScrollAnimation();
  
  // Map the shared data to the format expected by this component
  const wildlifeCenters = wildlifeCentersData.map((center, index) => ({
    id: index + 1,
    name: center.name,
    location: center.address,
    type: center.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    specialization: center.services,
    contact: center.phone,
    hours: center.hours,
    description: center.description
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Shield className="w-8 h-8 text-primary mr-3" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Wildlife Centers
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Discover wildlife conservation centers, national parks, and rescue facilities across Karnataka and India.
          </p>
          <Link href="/map">
            <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-view-map">
              <MapIcon className="w-5 h-5 mr-2" />
              View Interactive Map
            </Button>
          </Link>
        </motion.section>

        <motion.div
          ref={centersGrid.ref}
          initial="hidden"
          animate={centersGrid.isVisible ? "visible" : "hidden"}
          variants={motionConfig.variants.staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
        >
          {wildlifeCenters.map((center) => (
            <motion.div
              key={center.id}
              variants={motionConfig.variants.fadeInUp}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full" data-testid={`card-center-${center.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{center.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {center.location}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{center.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{center.description}</p>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center">
                    <Heart className="w-4 h-4 mr-1 text-red-500" />
                    Specialization
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {center.specialization.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{center.contact}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{center.hours}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          ref={helpSection.ref}
          initial="hidden"
          animate={helpSection.isVisible ? "visible" : "hidden"}
          variants={motionConfig.variants.scaleIn}
          className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8"
        >
          <div className="text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">🙌 How You Can Help</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-left">
              <div>
                <h4 className="font-semibold mb-2">🚨 Emergency Reporting</h4>
                <p className="text-muted-foreground">Report injured or stranded animals to nearby wildlife centers.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🛍️ Ethical Choices</h4>
                <p className="text-muted-foreground">Avoid buying products made from animal parts (ivory, fur, exotic pets).</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🌱 Volunteer Work</h4>
                <p className="text-muted-foreground">Volunteer for clean-up drives or tree planting.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📱 Spread Awareness</h4>
                <p className="text-muted-foreground">Spread awareness on social media.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={emergencySection.ref}
          initial="hidden"
          animate={emergencySection.isVisible ? "visible" : "hidden"}
          variants={motionConfig.variants.fadeInUp}
          className="mt-12 text-center"
        >
          <Card className="inline-block p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary mr-2" />
              <h3 className="text-2xl font-bold">Emergency Wildlife Helpline</h3>
            </div>
            <p className="text-3xl font-bold text-primary mb-2">1800-345-3342</p>
            <p className="text-muted-foreground">24/7 Wildlife Emergency Response</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}