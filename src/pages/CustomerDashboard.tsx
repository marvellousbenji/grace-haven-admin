import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Package, Heart, ShoppingCart, Calendar, ArrowLeft, User, MapPin, Phone, Mail } from "lucide-react";
import { Product, Booking } from "@/types/product";
import { storage } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: any[];
  orderType: 'existing' | 'custom';
  customMeasurements?: any;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/');
      return;
    }
    
    // Load user's orders
    const savedOrders = JSON.parse(localStorage.getItem('grace_haven_orders') || '[]');
    const userOrders = savedOrders.filter((order: Order) => order.userId === user.id);
    setOrders(userOrders);
    
    // Load user's bookings
    const allBookings = storage.getBookings();
    const userBookings = allBookings.filter(booking => booking.customerEmail === user.email);
    setBookings(userBookings);
    
    // Load liked products (placeholder for future implementation)
    setLikedProducts([]);
  }, [user, navigate]);

  const getProducts = () => storage.getProducts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Link>
            </Button>
            <h1 className="text-2xl font-playfair font-bold">My Account</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Welcome, {user?.firstName}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{user?.firstName} {user?.lastName}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
                <Badge variant="outline" className="mt-2">Customer</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liked Items</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{likedProducts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Order History</h2>
            </div>
            
            {orders.length === 0 ? (
              <Card className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Button asChild>
                  <Link to="/home">Start Shopping</Link>
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                          <Badge variant={
                            order.status === 'pending' ? 'destructive' : 
                            order.status === 'confirmed' ? 'default' : 
                            order.status === 'completed' ? 'secondary' : 'outline'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm">Order Type: {order.orderType === 'custom' ? 'Custom Fitting' : 'Ready-made'}</p>
                        <p className="font-semibold">${order.totalAmount}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Items:</h4>
                          {order.items.map((item, index) => {
                            const product = getProducts().find(p => p.id === item.productId);
                            return (
                              <div key={index} className="text-sm text-muted-foreground">
                                • {product?.name || 'Unknown Product'} (Qty: {item.quantity})
                                {item.size && ` - Size: ${item.size}`}
                                {item.color && ` - Color: ${item.color}`}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Appointments</h2>
              <Button asChild>
                <Link to="/booking">Book New Appointment</Link>
              </Button>
            </div>
            
            {bookings.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No appointments yet</p>
                <Button asChild>
                  <Link to="/booking">Book Your First Appointment</Link>
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">Appointment #{booking.id.slice(-8)}</h3>
                          <Badge variant={
                            booking.status === 'pending' ? 'destructive' : 
                            booking.status === 'confirmed' ? 'default' : 'secondary'
                          }>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm">
                          <strong>Date:</strong> {booking.appointmentDate} at {booking.appointmentTime}
                        </p>
                        <p className="text-sm">
                          <strong>Service:</strong> Personal Fitting Consultation
                        </p>
                        {booking.notes && (
                          <p className="text-sm">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Favorite Items</h2>
            </div>
            
            <Card className="p-8 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No favorite items yet</p>
              <p className="text-sm text-muted-foreground">
                Heart items while browsing to save them here
              </p>
              <Button className="mt-4" asChild>
                <Link to="/home">Browse Products</Link>
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;