import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Fuel, Calculator, TrendingUp, Car, ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-fuel.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calculator,
      title: "Smart Fuel Calculator",
      description: "Calculate fuel costs and distances with precision for any trip",
    },
    {
      icon: Car,
      title: "Multi-Car Management",
      description: "Track expenses for all your vehicles from a single dashboard",
    },
    {
      icon: TrendingUp,
      title: "Monthly Analytics",
      description: "Get detailed insights into your monthly fuel spending patterns",
    },
  ];

  const benefits = [
    "Real-time fuel cost calculations",
    "Comprehensive car model database",
    "Detailed expense tracking",
    "Monthly spending reports",
    "Distance optimization",
    "Easy-to-use interface",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Fuel className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FuelTrack</span>
            </div>
            <Button onClick={() => navigate("/auth")} variant="default">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                Smart Fuel Management
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Track Your Fuel Expenses{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Effortlessly
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Calculate fuel costs, track expenses, and optimize your driving with our intelligent
                fuel management platform. Save money and stay organized.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="text-lg px-8"
                >
                  Start Tracking Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Demo
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-primary">10+</p>
                  <p className="text-sm text-muted-foreground">Car Models</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">100%</p>
                  <p className="text-sm text-muted-foreground">Free to Use</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-success">Easy</p>
                  <p className="text-sm text-muted-foreground">Setup</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="Car dashboard with fuel gauge"
                className="relative rounded-3xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage and optimize your fuel expenses
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Choose FuelTrack?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of drivers who are saving money and staying organized with our
                comprehensive fuel tracking solution.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Monthly Savings</p>
                      <p className="text-3xl font-bold text-success">$127</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-success/50" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Time Saved Per Month</p>
                      <p className="text-3xl font-bold text-primary">5 hrs</p>
                    </div>
                    <Calculator className="h-12 w-12 text-primary/50" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-3xl font-bold text-accent">2.5K+</p>
                    </div>
                    <Car className="h-12 w-12 text-accent/50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10">
            <CardContent className="py-16 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Saving?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join FuelTrack today and take control of your fuel expenses. It's completely free to get started!
              </p>
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-12">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Fuel className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">FuelTrack</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FuelTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
