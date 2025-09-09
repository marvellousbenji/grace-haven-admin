import { useState, useEffect } from "react";
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Heart, ShoppingBag, Plus, Calendar, MessageCircle } from 'lucide-react';
import { storage } from "@/lib/storage";
import { favorites } from "@/lib/favorites";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onBookAppointment: (product: Product) => void;
  onContactTailor?: (tailorId: string, tailorName: string) => void;
}

export function ProductCard({ product, onViewDetails, onBookAppointment, onContactTailor }: ProductCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      setIsFavorite(favorites.isFavorite(user.id, product.id));
    }
  }, [user, product.id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }
    
    if (product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Size required",
        description: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    
    if (product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Color required", 
        description: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    storage.addToCart({
      productId: product.id,
      quantity: 1,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });

    setShowAddToCart(false);
    setSelectedSize("");
    setSelectedColor("");
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to favorites",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite) {
      favorites.removeFromFavorites(user.id, product.id);
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: `${product.name} has been removed from your favorites`,
      });
    } else {
      favorites.addToFavorites(user.id, product.id);
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites`,
      });
    }
  };

  const handleContactTailor = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to contact the tailor",
        variant: "destructive",
      });
      return;
    }
    
    if (onContactTailor) {
      onContactTailor(product.id, "Grace Haven Tailor");
    }
  };

  return (
    <>
      <Card className="group overflow-hidden bg-card hover:shadow-elegant transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button
            size="icon"
            variant={isFavorite ? "default" : "secondary"}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-playfair text-lg font-semibold text-foreground line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xl font-bold text-primary">${product.price}</p>
              <Badge variant="outline" className="text-xs">
                {product.material}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 min-w-0"
              onClick={() => onViewDetails(product)}
            >
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">Details</span>
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              className="flex-1 min-w-0"
              onClick={() => setShowAddToCart(true)}
            >
              <ShoppingBag className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Cart</span>
            </Button>
            <Button 
              size="sm" 
              className="flex-1 min-w-0"
              onClick={() => onBookAppointment(product)}
            >
              <Calendar className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Book</span>
              <span className="sm:hidden">Book</span>
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              className="flex-1 min-w-0"
              onClick={handleContactTailor}
            >
              <MessageCircle className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Contact</span>
              <span className="sm:hidden">Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add to Cart Dialog */}
      <Dialog open={showAddToCart} onOpenChange={setShowAddToCart}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Add to Cart</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4">
              <img
                src={product.images[0] || '/placeholder.svg'}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-xl font-bold text-primary">${product.price}</p>
              </div>
            </div>
            
            {product.sizes.length > 0 && (
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {product.colors.length > 0 && (
              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddToCart(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddToCart} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}