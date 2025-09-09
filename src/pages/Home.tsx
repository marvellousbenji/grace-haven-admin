import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingBag, Calendar, Phone, Mail, MapPin, Plus, Upload, LogOut, User, MessageCircle, Menu, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductUpload } from "@/components/ProductUpload";
import { Cart } from "@/components/Cart";
import { MessageCenter } from "@/components/MessageCenter";
import { Product } from "@/types/product";
import { storage } from "@/lib/storage";
import { favorites } from "@/lib/favorites";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { toast } = useToast();
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactTailorId, setContactTailorId] = useState<string>("");
  const [contactTailorName, setContactTailorName] = useState<string>("");
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(storage.getProducts());
    if (user) {
      loadFavoriteProducts();
    }
  }, [user]);

  const loadFavoriteProducts = () => {
    if (!user) return;
    const favoriteIds = favorites.getFavorites(user.id);
    const allProducts = storage.getProducts();
    const favProducts = allProducts.filter(p => favoriteIds.includes(p.id));
    setFavoriteProducts(favProducts);
  };

  const handleProductAdded = (product: Product) => {
    setProducts(prev => [...prev, product]);
    setShowUploadDialog(false);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleBookAppointment = (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book an appointment",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
    // Redirect to booking page with product ID
    window.location.href = `/booking?productId=${product.id}`;
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const handleContactTailor = (tailorId: string, tailorName: string) => {
    setContactTailorId(tailorId);
    setContactTailorName(tailorName);
    setShowMessages(true);
  };

  const handleShowFavorites = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to view your favorites",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
    loadFavoriteProducts();
    document.getElementById('favorites')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-playfair font-bold text-primary">Grace Haven</h1>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#shop" className="text-foreground hover:text-primary transition-colors">Shop</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {user?.role === 'admin' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowUploadDialog(true)}
              >
                <Plus className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">Add Product</span>
              </Button>
            )}
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" onClick={handleShowFavorites}>
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowCart(true)}>
                  <ShoppingBag className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowMessages(true)}>
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/booking">
                    <Calendar className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:inline">Book Fitting</span>
                  </Link>
                </Button>
                <div className="hidden lg:flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Hi, {user?.firstName}
                  </span>
                  {user?.role === 'user' && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/customer-dashboard">
                        <User className="h-4 w-4 mr-2" />
                        My Account
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-card">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="flex flex-col space-y-3">
                <a href="#" className="text-foreground hover:text-primary transition-colors py-2">Home</a>
                <a href="#shop" className="text-foreground hover:text-primary transition-colors py-2">Shop</a>
                <a href="#about" className="text-foreground hover:text-primary transition-colors py-2">About</a>
                <a href="#contact" className="text-foreground hover:text-primary transition-colors py-2">Contact</a>
              </div>
              
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hi, {user?.firstName}</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={handleShowFavorites}>
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setShowCart(true)}>
                        <ShoppingBag className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setShowMessages(true)}>
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowUploadDialog(true)}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link to="/booking">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Fitting
                    </Link>
                  </Button>
                  
                  {user?.role === 'user' && (
                    <Button variant="outline" size="sm" asChild className="justify-start">
                      <Link to="/customer-dashboard">
                        <User className="h-4 w-4 mr-2" />
                        My Account
                      </Link>
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-4 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold text-foreground mb-6">
            Curated Fashion
            <span className="block text-primary">Just for You</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
            Discover unique pieces handpicked by our stylists. Upload your latest designs and book personal fitting sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shop Collection
            </Button>
            {user?.role === 'admin' && (
              <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3" onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-5 w-5 mr-2" />
                Upload Product
              </Button>
            )}
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
              <p className="text-muted-foreground mb-6">
                {user?.role === 'admin' ? 'Upload your first product to start building your collection' : 'No products available yet. Check back soon!'}
              </p>
              {user?.role === 'admin' && (
                <Button onClick={() => setShowUploadDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                  onBookAppointment={handleBookAppointment}
                  onContactTailor={handleContactTailor}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Favorites Section */}
      {isAuthenticated && favoriteProducts.length > 0 && (
        <section id="favorites" className="py-16 px-4 bg-accent/5">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-playfair font-bold text-foreground mb-4">Your Favorites</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Items you've saved for later. Perfect pieces picked by you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                  onBookAppointment={handleBookAppointment}
                  onContactTailor={handleContactTailor}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section id="about" className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-playfair font-bold text-foreground mb-4">Our Services</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer personalized services to help you look and feel your best.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
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

      {/* Cart */}
      <Cart isOpen={showCart} onOpenChange={setShowCart} />

      {/* Messages */}
      <MessageCenter 
        isOpen={showMessages} 
        onOpenChange={setShowMessages}
        initialTailorId={contactTailorId}
        initialTailorName={contactTailorName}
      />

      {/* Product Upload Dialog - Admin Only */}
      {user?.role === 'admin' && (
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload New Product</DialogTitle>
            </DialogHeader>
            <ProductUpload onProductAdded={handleProductAdded} />
          </DialogContent>
        </Dialog>
      )}

      {/* Product Details Dialog */}
      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
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
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button className="flex-1" onClick={() => handleBookAppointment(selectedProduct)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 sm:flex-initial"
                    onClick={() => handleContactTailor(selectedProduct.id, "Grace Haven Tailor")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Tailor
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