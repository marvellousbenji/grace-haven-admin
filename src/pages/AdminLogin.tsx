import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add admin authentication logic with Supabase
    console.log("Admin login:", credentials);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground font-poppins">
            Grace Haven Administration Panel
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-playfair text-center">Administrator Login</CardTitle>
            <CardDescription className="text-center font-poppins">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-poppins font-medium">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gracehaven.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="font-poppins"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-poppins font-medium">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="font-poppins"
                  required
                />
              </div>
              <Button type="submit" className="w-full font-poppins font-medium">
                <Shield className="w-4 h-4 mr-2" />
                Access Dashboard
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground font-poppins">
                This area is restricted to authorized administrators only
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;