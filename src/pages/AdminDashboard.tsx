import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Clock,
  Mail,
  Phone,
  MoreHorizontal
} from "lucide-react";

const AdminDashboard = () => {
  // Mock data - will be replaced with Supabase data
  const [users] = useState([
    { id: 1, name: "Sarah Johnson", email: "sarah@email.com", phone: "+1 234-567-8901", joinDate: "2024-01-15", status: "active" },
    { id: 2, name: "Emily Chen", email: "emily@email.com", phone: "+1 234-567-8902", joinDate: "2024-01-20", status: "active" },
    { id: 3, name: "Jessica Brown", email: "jessica@email.com", phone: "+1 234-567-8903", joinDate: "2024-02-01", status: "inactive" },
  ]);

  const [bookings] = useState([
    { id: 1, clientName: "Sarah Johnson", service: "Personal Consultation", date: "2024-02-15", time: "10:00 AM", status: "confirmed" },
    { id: 2, clientName: "Emily Chen", service: "Styling Session", date: "2024-02-16", time: "2:00 PM", status: "pending" },
    { id: 3, clientName: "Jessica Brown", service: "Wardrobe Makeover", date: "2024-02-17", time: "11:00 AM", status: "confirmed" },
  ]);

  const stats = [
    { title: "Total Users", value: users.length, icon: Users, change: "+12%" },
    { title: "Total Bookings", value: bookings.length, icon: Calendar, change: "+8%" },
    { title: "Revenue", value: "$4,200", icon: TrendingUp, change: "+15%" },
    { title: "Avg Session", value: "2.5h", icon: Clock, change: "+5%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-playfair text-2xl font-bold text-foreground">Grace Haven Admin</h1>
          <div className="flex gap-4 items-center">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-poppins">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-playfair">{stat.value}</div>
                <p className="text-xs text-muted-foreground font-poppins">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings" className="font-poppins">Bookings</TabsTrigger>
            <TabsTrigger value="users" className="font-poppins">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-playfair">Recent Bookings</CardTitle>
                <CardDescription className="font-poppins">
                  Manage and track all appointment bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.clientName}`} />
                          <AvatarFallback className="font-poppins">
                            {booking.clientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium font-poppins">{booking.clientName}</p>
                          <p className="text-sm text-muted-foreground font-poppins">{booking.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium font-poppins">{booking.date}</p>
                          <p className="text-sm text-muted-foreground font-poppins">{booking.time}</p>
                        </div>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-playfair">Registered Users</CardTitle>
                <CardDescription className="font-poppins">
                  View and manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                          <AvatarFallback className="font-poppins">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium font-poppins">{user.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span className="font-poppins">{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span className="font-poppins">{user.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium font-poppins">Joined</p>
                          <p className="text-sm text-muted-foreground font-poppins">{user.joinDate}</p>
                        </div>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;