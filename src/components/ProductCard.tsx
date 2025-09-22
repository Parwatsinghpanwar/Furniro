import { useState } from 'react';
import { Heart, ShoppingCart, Eye, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  category: string;
  isNew?: boolean;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onWishlist: (productId: string) => void;
  onCompare: (productId: string) => void;
  onQuickView: (productId: string) => void;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onWishlist, 
  onCompare, 
  onQuickView 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWishlist = () => {
    setIsLiked(!isLiked);
    onWishlist(product.id);
  };

  return (
    <Card 
      className="group relative overflow-hidden transition-smooth shadow-elegant hover:shadow-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-luxury text-luxury-foreground">New</Badge>
          )}
          {product.discount && (
            <Badge className="bg-destructive text-destructive-foreground">
              -{product.discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          size="sm"
          variant="secondary"
          className={`absolute top-4 right-4 h-8 w-8 p-0 transition-smooth ${
            isLiked ? 'bg-destructive text-destructive-foreground' : ''
          }`}
          onClick={handleWishlist}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>

        {/* Hover Actions */}
        <div className={`absolute inset-0 bg-primary/80 flex items-center justify-center gap-4 transition-smooth ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAddToCart(product.id)}
            className="bg-background text-foreground hover:bg-accent"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to cart
          </Button>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onCompare(product.id)}
              className="h-8 w-8 p-0 bg-background text-foreground hover:bg-accent"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onQuickView(product.id)}
              className="h-8 w-8 p-0 bg-background text-foreground hover:bg-accent"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-smooth">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}