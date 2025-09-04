import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { storage } from '@/lib/storage';
import { removeBackground, loadImage } from '@/lib/backgroundRemoval';

interface ProductUploadProps {
  onProductAdded: (product: Product) => void;
}

export function ProductUpload({ onProductAdded }: ProductUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    material: '',
    category: '',
    sizes: [] as string[],
    colors: [] as string[]
  });
  const [images, setImages] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveBackground = async (imageIndex: number) => {
    try {
      setIsRemovingBg(true);
      const imageUrl = images[imageIndex];
      
      // Convert base64 to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Load image and remove background
      const imageElement = await loadImage(blob);
      const processedBlob = await removeBackground(imageElement);
      
      // Convert back to base64
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const newImages = [...images];
          newImages[imageIndex] = reader.result as string;
          setImages(newImages);
          toast({
            title: "Background removed successfully!",
            description: "The image background has been removed."
          });
        }
      };
      reader.readAsDataURL(processedBlob);
    } catch (error) {
      console.error('Error removing background:', error);
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRemovingBg(false);
    }
  };

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }));
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const product: Product = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        material: formData.material,
        category: formData.category,
        images,
        sizes: formData.sizes,
        colors: formData.colors,
        createdAt: new Date().toISOString()
      };

      storage.addProduct(product);
      onProductAdded(product);

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        material: '',
        category: '',
        sizes: [],
        colors: []
      });
      setImages([]);

      toast({
        title: "Product added successfully!",
        description: "Your product has been added to the catalog."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-playfair text-2xl">Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <Label>Product Images</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Click to upload images or drag and drop
                </p>
              </label>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRemoveBackground(index)}
                        disabled={isRemovingBg}
                      >
                        <Wand2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                placeholder="e.g. Cotton, Silk, Denim"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dresses">Dresses</SelectItem>
                  <SelectItem value="tops">Tops</SelectItem>
                  <SelectItem value="bottoms">Bottoms</SelectItem>
                  <SelectItem value="outerwear">Outerwear</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>Available Sizes</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Add size (e.g. S, M, L)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
              />
              <Button type="button" variant="outline" onClick={addSize}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map(size => (
                <Badge key={size} variant="outline" className="gap-1">
                  {size}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSize(size)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label>Available Colors</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Add color"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
              />
              <Button type="button" variant="outline" onClick={addColor}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map(color => (
                <Badge key={color} variant="outline" className="gap-1">
                  {color}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeColor(color)} />
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? 'Adding Product...' : 'Add Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}