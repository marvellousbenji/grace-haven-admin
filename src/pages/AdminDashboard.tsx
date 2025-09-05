import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { Package, Users, ShoppingCart, Calendar, Eye, ArrowLeft } from "lucide-react";
import { ProductUpload } from "@/components/ProductUpload";
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    setProducts(storage.getProducts());
    setBookings(storage.getBookings());
    
    // Load orders
    const savedOrders = JSON.parse(localStorage.getItem('grace_haven_orders') || '[]');
    setOrders(savedOrders);
  }, [user, navigate]);

  const handleProductAdded = (product: Product) => {
    setProducts(prev => [...prev, product]);
    setShowUploadDialog(false);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('grace_haven_orders', JSON.stringify(updatedOrders));
    
    toast({
      title: "Order updated",
      description: `Order status changed to ${newStatus}`,
    });
  };

  const updateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
    storage.saveBookings(updatedBookings);
    
    toast({
      title: "Booking updated",
      description: `Booking status changed to ${newStatus}`,
    });
  };

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
            <h1 className="text-2xl font-playfair font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Welcome, {user?.firstName}</span>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Customer Orders</h2>
            </div>
            
            {orders.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No orders yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{order.customerName}</h3>
                          <Badge variant={order.status === 'pending' ? 'destructive' : order.status === 'confirmed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        <p className="text-sm">Order Type: {order.orderType === 'custom' ? 'Custom Fitting' : 'Existing Product'}</p>
                        <p className="font-semibold">${order.totalAmount}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {order.status === 'pending' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                            Confirm
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'completed')}>
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Appointment Bookings</h2>
            </div>
            
            {bookings.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No bookings yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{booking.customerName}</h3>
                          <Badge variant={booking.status === 'pending' ? 'destructive' : booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                        <p className="text-sm">{booking.customerPhone}</p>
                        <p className="text-sm">
                          <strong>Date:</strong> {booking.appointmentDate} at {booking.appointmentTime}
                        </p>
                        {booking.notes && <p className="text-sm"><strong>Notes:</strong> {booking.notes}</p>}
                      </div>
                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <Button size="sm" onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                            Confirm
                          </Button>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button size="sm" onClick={() => updateBookingStatus(booking.id, 'completed')}>
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Product Catalog</h2>
              <Button onClick={() => setShowUploadDialog(true)}>
                <Package className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
            
            {products.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No products yet</p>
                <Button onClick={() => setShowUploadDialog(true)}>
                  Add Your First Product
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.images[0] || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>${product.price}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                      <p className="text-sm">{product.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload New Product</DialogTitle>
          </DialogHeader>
          <ProductUpload onProductAdded={handleProductAdded} />
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Customer Information</h4>
                  <p>{selectedOrder.customerName}</p>
                  <p>{selectedOrder.customerEmail}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Order Items</h4>
                  {selectedOrder.items.map((item, index) => {
                    const product = getProducts().find(p => p.id === item.productId);
                    return (
                      <div key={index} className="flex justify-between items-center py-2">
                        <div>
                          <p>{product?.name || 'Unknown Product'}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                            {item.size && ` | Size: ${item.size}`}
                            {item.color && ` | Color: ${item.color}`}
                          </p>
                        </div>
                        <p>${product?.price || 0}</p>
                      </div>
                    );
                  })}
                </div>
                
                {selectedOrder.orderType === 'custom' && selectedOrder.customMeasurements && (
                  <div>
                    <h4 className="font-semibold">Custom Measurements</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>Chest: {selectedOrder.customMeasurements.chest}"</p>
                      <p>Waist: {selectedOrder.customMeasurements.waist}"</p>
                      <p>Hips: {selectedOrder.customMeasurements.hips}"</p>
                      <p>Shoulders: {selectedOrder.customMeasurements.shoulders}"</p>
                      <p>Length: {selectedOrder.customMeasurements.length}"</p>
                      {selectedOrder.customMeasurements.notes && (
                        <p className="col-span-2">Notes: {selectedOrder.customMeasurements.notes}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total: ${selectedOrder.totalAmount}</span>
                    <Badge variant={selectedOrder.status === 'pending' ? 'destructive' : selectedOrder.status === 'confirmed' ? 'default' : 'secondary'}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;