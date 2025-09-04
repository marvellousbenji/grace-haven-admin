import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingBag, Calendar, Phone, Mail, MapPin, Plus, Upload } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductUpload } from "@/components/ProductUpload";
import { Product } from "@/types/product";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  const handleProductAdded = (product: Product) => {
    setProducts(prev => [...prev, product]);
    setShowUploadDialog(false);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleBookAppointment = (product: Product) => {
    // Redirect to booking page with product ID
    window.location.href = `/booking?productId=${product.id}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-playfair font-bold text-primary">Grace Haven</h1>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#shop" className="text-foreground hover:text-primary transition-colors">Shop</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowUploadDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/booking">
                <Calendar className="h-4 w-4 mr-2" />
                Book Fitting
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-6">
            Curated Fashion
            <span className="block text-primary">Just for You</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover unique pieces handpicked by our stylists. Upload your latest designs and book personal fitting sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shop Collection
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3" onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-5 w-5 mr-2" />
              Upload Product
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="shop" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-playfair font-bold text-foreground mb-4">
              {products.length > 0 ? 'Our Collection' : 'Start Your Collection'}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {products.length > 0 
                ? 'Handselected items that embody elegance and style. Each piece is carefully chosen for its quality and design.'
                : 'Upload your first product to start showcasing your beautiful designs to customers.'
              }
            </p>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-4">No products yet</h4>
              <p className="text-muted-foreground mb-6">Upload your first product to start building your collection</p>
              <Button onClick={() => setShowUploadDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                  onBookAppointment={handleBookAppointment}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="about" className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-playfair font-bold text-foreground mb-4">Our Services</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer personalized services to help you look and feel your best.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 bg-card">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-playfair">Personal Styling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  One-on-one styling sessions to discover your perfect look and build a curated wardrobe.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 bg-card">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-playfair">Custom Fitting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Professional alterations and custom fitting to ensure every piece fits you perfectly.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 bg-card">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-playfair">Wardrobe Curation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Expert curation of timeless pieces that reflect your personal style and lifestyle needs.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-playfair font-bold text-foreground mb-8">Visit Our Boutique</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Location</h4>
              <p className="text-muted-foreground">123 Fashion Avenue<br />Style District, NY 10001</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Phone</h4>
              <p className="text-muted-foreground">(555) 123-4567</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-muted-foreground">hello@gracehaven.com</p>
            </div>
          </div>
          
          <Button size="lg" className="text-lg px-8 py-3" asChild>
            <Link to="/booking">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Appointment
            </Link>
          </Button>
        </div>
      </section>

      {/* Product Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload New Product</DialogTitle>
          </DialogHeader>
          <ProductUpload onProductAdded={handleProductAdded} />
        </DialogContent>
      </Dialog>

      {/* Product Details Dialog */}
      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="max-w-4xl">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <img
                  src={selectedProduct.images[0] || '/placeholder.svg'}
                  alt={selectedProduct.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                {selectedProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.images.slice(1, 5).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedProduct.name} ${index + 2}`}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-playfair font-bold">{selectedProduct.name}</h3>
                  <p className="text-3xl font-bold text-primary mt-2">${selectedProduct.price}</p>
                </div>
                <p className="text-muted-foreground">{selectedProduct.description}</p>
                <div className="space-y-2">
                  <p><strong>Material:</strong> {selectedProduct.material}</p>
                  <p><strong>Category:</strong> {selectedProduct.category}</p>
                  {selectedProduct.sizes.length > 0 && (
                    <div>
                      <strong>Available Sizes:</strong>
                      <div className="flex gap-2 mt-1">
                        {selectedProduct.sizes.map(size => (
                          <Badge key={size} variant="outline">{size}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedProduct.colors.length > 0 && (
                    <div>
                      <strong>Available Colors:</strong>
                      <div className="flex gap-2 mt-1">
                        {selectedProduct.colors.map(color => (
                          <Badge key={color} variant="outline">{color}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={() => handleBookAppointment(selectedProduct)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;