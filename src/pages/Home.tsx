import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, Clock, Star, Users } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-playfair text-2xl font-bold text-foreground">Grace Haven</h1>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/booking">Book Now</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="font-playfair text-5xl md:text-6xl font-bold text-foreground mb-6">
            Elegant Boutique Experience
          </h2>
          <p className="font-poppins text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover luxury services tailored just for you. Book your exclusive appointment 
            and indulge in our premium boutique offerings.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild className="font-poppins">
              <Link to="/booking">Book Appointment</Link>
            </Button>
            <Button variant="outline" size="lg" className="font-poppins">
              Explore Services
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <h3 className="font-playfair text-3xl font-bold text-center mb-12">
            Why Choose Grace Haven
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-border">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-playfair">Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-poppins">
                  Experience the finest in boutique services with attention to every detail.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-playfair">Expert Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-poppins">
                  Our skilled professionals are dedicated to providing exceptional service.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-playfair">Easy Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-poppins">
                  Schedule your appointments effortlessly with our streamlined booking system.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-playfair">Flexible Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-poppins">
                  We work around your schedule with extended hours and weekend availability.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h3 className="font-playfair text-4xl font-bold text-foreground mb-6">
            Ready to Begin Your Journey?
          </h3>
          <p className="font-poppins text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join our exclusive community and experience boutique services like never before.
          </p>
          <Button size="lg" asChild className="font-poppins">
            <Link to="/signup">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <h4 className="font-playfair text-xl font-bold mb-2">Grace Haven</h4>
          <p className="font-poppins text-sm text-muted-foreground">
            © 2024 Grace Haven. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;