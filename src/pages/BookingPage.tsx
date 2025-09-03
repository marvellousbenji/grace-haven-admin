import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User } from "lucide-react";

const BookingPage = () => {
  const [booking, setBooking] = useState({
    service: "",
    date: "",
    time: "",
    notes: ""
  });

  const services = [
    { value: "consultation", label: "Personal Consultation", duration: "1 hour", price: "$150" },
    { value: "styling", label: "Personal Styling Session", duration: "2 hours", price: "$300" },
    { value: "wardrobe", label: "Wardrobe Makeover", duration: "3 hours", price: "$450" },
    { value: "shopping", label: "Personal Shopping", duration: "4 hours", price: "$600" }
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add booking logic with Supabase
    console.log("Booking:", booking);
  };

  const selectedService = services.find(s => s.value === booking.service);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-playfair text-2xl font-bold text-foreground">Grace Haven</h1>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <a href="/">Home</a>
            </Button>
            <Button variant="outline">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-4xl font-bold text-foreground mb-4">
              Book Your Appointment
            </h2>
            <p className="font-poppins text-muted-foreground">
              Choose your preferred service and schedule your boutique experience
            </p>
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="font-playfair flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Appointment Details
              </CardTitle>
              <CardDescription className="font-poppins">
                Fill in your preferred appointment details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-poppins font-medium">Select Service</Label>
                  <Select value={booking.service} onValueChange={(value) => setBooking(prev => ({ ...prev, service: value }))}>
                    <SelectTrigger className="font-poppins">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          <div className="flex justify-between items-center w-full">
                            <span>{service.label}</span>
                            <span className="text-sm text-muted-foreground ml-4">
                              {service.duration} - {service.price}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedService && (
                    <div className="text-sm text-muted-foreground font-poppins mt-2 p-3 bg-muted/50 rounded-md">
                      <strong>{selectedService.label}</strong> - Duration: {selectedService.duration}, Price: {selectedService.price}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="font-poppins font-medium">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={booking.date}
                      onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                      className="font-poppins"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-poppins font-medium">Preferred Time</Label>
                    <Select value={booking.time} onValueChange={(value) => setBooking(prev => ({ ...prev, time: value }))}>
                      <SelectTrigger className="font-poppins">
                        <SelectValue placeholder="Choose time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="font-poppins font-medium">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requests or preferences..."
                    value={booking.notes}
                    onChange={(e) => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                    className="font-poppins"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full font-poppins font-medium" size="lg">
                  Confirm Booking
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground font-poppins">
              Need help? Contact us at{" "}
              <a href="mailto:bookings@gracehaven.com" className="text-primary hover:underline">
                bookings@gracehaven.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;