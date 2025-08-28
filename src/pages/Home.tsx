import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, MessageSquare, MapPin, Calendar, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/medical-hero.jpg";
import aiDoctorIcon from "@/assets/ai-doctor-icon.jpg";
import hospitalLocationIcon from "@/assets/hospital-location.jpg";

const Home = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "AI Health Assistant",
      description: "Get instant medical advice from our AI-powered chatbot for common health concerns.",
      image: aiDoctorIcon,
    },
    {
      icon: MapPin,
      title: "Smart Location Detection",
      description: "Automatically find and book appointments at the nearest hospitals.",
      image: hospitalLocationIcon,
    },
    {
      icon: Calendar,
      title: "Easy Appointment Booking",
      description: "Seamlessly book appointments when serious symptoms are detected.",
    },
    {
      icon: Heart,
      title: "24/7 Health Support",
      description: "Round-the-clock access to medical guidance and emergency support.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center text-white">
            <div className="flex justify-center mb-6">
              <Activity className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Your Personal
              <span className="block text-accent-light">Health Companion</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
              Get instant AI-powered medical advice and automatically book appointments 
              at nearby hospitals when serious symptoms are detected.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="hero" asChild>
                <Link to="/chat">Start AI Consultation</Link>
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Advanced Healthcare Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Combining AI technology with healthcare expertise to provide you with 
              the best possible medical guidance and support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-0 shadow-card hover:shadow-medical transition-shadow duration-300">
                <CardHeader className="text-center">
                  {feature.image ? (
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  )}
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who trust SWASTHA GUIDE for their healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/register">Get Started Today</Link>
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/chat">Try AI Doctor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;