import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onBookAppointment: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails, onBookAppointment }: ProductCardProps) {
  return (
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
          variant="secondary"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Heart className="h-4 w-4" />
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
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(product)}
          >
            View Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onBookAppointment(product)}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Book
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}