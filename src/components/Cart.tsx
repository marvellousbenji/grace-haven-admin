import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Minus, Plus, Trash2, Package } from "lucide-react";
import { CartItem, Product } from "@/types/product";
import { storage } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CartProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Cart = ({ isOpen, onOpenChange }: CartProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>(storage.getCart());
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderType, setOrderType] = useState<'existing' | 'custom'>('existing');
  const [customMeasurements, setCustomMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    length: '',
    shoulders: '',
    notes: ''
  });

  const products = storage.getProducts();
  const getProduct = (productId: string) => products.find(p => p.id === productId);

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.productId === productId && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    );
    setCartItems(updatedCart);
    storage.saveCart(updatedCart);
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    const updatedCart = cartItems.filter(item => 
      !(item.productId === productId && item.size === size && item.color === color)
    );
    setCartItems(updatedCart);
    storage.saveCart(updatedCart);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const product = getProduct(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleCheckout = () => {
    if (!user) return;

    const order = {
      id: crypto.randomUUID(),
      userId: user.id,
      customerName: `${user.firstName} ${user.lastName}`,
      customerEmail: user.email,
      items: cartItems,
      orderType,
      customMeasurements: orderType === 'custom' ? customMeasurements : undefined,
      totalAmount: getTotalPrice(),
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    // Save order to localStorage (admin can view these)
    const orders = JSON.parse(localStorage.getItem('grace_haven_orders') || '[]');
    orders.push(order);
    localStorage.setItem('grace_haven_orders', JSON.stringify(orders));

    // Clear cart
    setCartItems([]);
    storage.clearCart();
    setShowCheckout(false);
    onOpenChange(false);

    toast({
      title: "Order placed successfully!",
      description: "We'll contact you soon with updates on your order.",
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart ({cartItems.length} items)
            </DialogTitle>
          </DialogHeader>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => {
                const product = getProduct(item.productId);
                if (!product) return null;

                return (
                  <Card key={index} className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={product.images[0] || '/placeholder.svg'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">${product.price}</p>
                        {item.size && <Badge variant="outline" className="mr-1">Size: {item.size}</Badge>}
                        {item.color && <Badge variant="outline">Color: {item.color}</Badge>}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size, item.color)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size, item.color)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 ml-2"
                            onClick={() => removeFromCart(item.productId, item.size, item.color)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total: ${getTotalPrice()}</span>
                  <Button onClick={() => setShowCheckout(true)}>
                    <Package className="h-4 w-4 mr-2" />
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Order Type</Label>
              <Select value={orderType} onValueChange={(value: 'existing' | 'custom') => setOrderType(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="existing">Order existing items as shown</SelectItem>
                  <SelectItem value="custom">Custom fitting with my measurements</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orderType === 'custom' && (
              <Card className="p-4">
                <CardHeader>
                  <CardTitle className="text-lg">Your Measurements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="chest">Chest (inches)</Label>
                      <Input
                        id="chest"
                        value={customMeasurements.chest}
                        onChange={(e) => setCustomMeasurements(prev => ({ ...prev, chest: e.target.value }))}
                        placeholder="e.g. 36"
                      />
                    </div>
                    <div>
                      <Label htmlFor="waist">Waist (inches)</Label>
                      <Input
                        id="waist"
                        value={customMeasurements.waist}
                        onChange={(e) => setCustomMeasurements(prev => ({ ...prev, waist: e.target.value }))}
                        placeholder="e.g. 32"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hips">Hips (inches)</Label>
                      <Input
                        id="hips"
                        value={customMeasurements.hips}
                        onChange={(e) => setCustomMeasurements(prev => ({ ...prev, hips: e.target.value }))}
                        placeholder="e.g. 38"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shoulders">Shoulders (inches)</Label>
                      <Input
                        id="shoulders"
                        value={customMeasurements.shoulders}
                        onChange={(e) => setCustomMeasurements(prev => ({ ...prev, shoulders: e.target.value }))}
                        placeholder="e.g. 16"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="length">Length (inches)</Label>
                    <Input
                      id="length"
                      value={customMeasurements.length}
                      onChange={(e) => setCustomMeasurements(prev => ({ ...prev, length: e.target.value }))}
                      placeholder="e.g. 28"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={customMeasurements.notes}
                      onChange={(e) => setCustomMeasurements(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any specific requirements or preferences..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount: ${getTotalPrice()}</span>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
                Back to Cart
              </Button>
              <Button onClick={handleCheckout} className="flex-1">
                Place Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};