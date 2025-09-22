import { useState, useEffect, useMemo } from 'react';
import { ShopHeader } from '@/components/ShopHeader';
import { ShopFilters } from '@/components/ShopFilters';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Award, Shield, Truck, Headphones } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import product images
import syltherine from '@/assets/syltherine.jpg';
import leviosa from '@/assets/leviosa.jpg';
import lolito from '@/assets/lolito.jpg';
import respira from '@/assets/respira.jpg';
import heroImage from '@/assets/hero.jpg';

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

// Mock product data based on the requirements
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Syltherine',
    description: 'Stylish cafe chair',
    price: 2500000,
    originalPrice: 3500000,
    image: syltherine,
    brand: 'Furniro',
    category: 'Chair',
    discount: 30,
  },
  {
    id: '2',
    name: 'Leviosa',
    description: 'Stylish cafe chair',
    price: 2500000,
    image: leviosa,
    brand: 'Furniro',
    category: 'Chair',
    isNew: true,
  },
  {
    id: '3',
    name: 'Lolito',
    description: 'Luxury big sofa',
    price: 7000000,
    image: lolito,
    brand: 'Luxury Living',
    category: 'Sofa',
  },
  {
    id: '4',
    name: 'Respira',
    description: 'Outdoor bar table and stool',
    price: 500000,
    image: respira,
    brand: 'Outdoor Plus',
    category: 'Table',
    isNew: true,
  },
  // Duplicate some products with variations to reach 32 items
  ...Array.from({ length: 28 }, (_, i) => ({
    id: `${i + 5}`,
    name: ['Syltherine', 'Leviosa', 'Lolito', 'Respira'][i % 4],
    description: ['Stylish cafe chair', 'Stylish cafe chair', 'Luxury big sofa', 'Outdoor bar table and stool'][i % 4],
    price: [2500000, 2500000, 7000000, 500000][i % 4] + (Math.random() * 1000000),
    originalPrice: i % 3 === 0 ? [3500000, 3000000, 8000000, 800000][i % 4] : undefined,
    image: [syltherine, leviosa, lolito, respira][i % 4],
    brand: ['Furniro', 'Furniro', 'Luxury Living', 'Outdoor Plus'][i % 4],
    category: ['Chair', 'Chair', 'Sofa', 'Table'][i % 4],
    isNew: i % 5 === 0,
    discount: i % 3 === 0 ? Math.floor(Math.random() * 50) + 10 : undefined,
  })),
];

const ITEMS_PER_PAGE_OPTIONS = [16, 24, 32];

export default function Shop() {
  const { toast } = useToast();
  
  // State
  const [products] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  // Extract unique brands and categories
  const brands = useMemo(() => 
    Array.from(new Set(products.map(p => p.brand))).sort()
  , [products]);
  
  const categories = useMemo(() => 
    Array.from(new Set(products.map(p => p.category))).sort()
  , [products]);

  const priceRange = useMemo(() => {
    const prices = products.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)] as [number, number];
  }, [products]);

  // Initialize price range
  useEffect(() => {
    setSelectedPriceRange(priceRange);
  }, [priceRange]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1];

      return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // Default sorting (keep original order)
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedBrands, selectedCategories, selectedPriceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBrands, selectedCategories, selectedPriceRange, sortBy, itemsPerPage]);

  // Handlers
  const handleAddToCart = (productId: string) => {
    setCartItems(prev => [...prev, productId]);
    toast({
      title: "Added to cart",
      description: "Product has been added to your cart.",
    });
  };

  const handleWishlist = (productId: string) => {
    setWishlistItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    toast({
      title: wishlistItems.includes(productId) ? "Removed from wishlist" : "Added to wishlist",
      description: wishlistItems.includes(productId) 
        ? "Product removed from your wishlist." 
        : "Product added to your wishlist.",
    });
  };

  const handleCompare = (productId: string) => {
    toast({
      title: "Compare feature",
      description: "Product comparison feature coming soon!",
    });
  };

  const handleQuickView = (productId: string) => {
    toast({
      title: "Quick view",
      description: "Quick view feature coming soon!",
    });
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedPriceRange(priceRange);
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ShopHeader
        cartItemCount={cartItems.length}
        onMenuClick={() => {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Luxury furniture collection" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/40" />
        </div>
        <div className="relative text-center text-primary-foreground">
          <h1 className="text-5xl font-bold mb-4">Shop</h1>
          <p className="text-xl">Discover our premium furniture collection</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ShopFilters
              brands={brands}
              categories={categories}
              priceRange={priceRange}
              selectedBrands={selectedBrands}
              selectedCategories={selectedCategories}
              selectedPriceRange={selectedPriceRange}
              currentSort={sortBy}
              onBrandChange={setSelectedBrands}
              onCategoryChange={setSelectedCategories}
              onPriceRangeChange={setSelectedPriceRange}
              onSortChange={setSortBy}
              onClearFilters={clearAllFilters}
            />
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} results
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show</span>
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEMS_PER_PAGE_OPTIONS.map(option => (
                        <SelectItem key={option} value={option.toString()}>
                          {option}
                        </SelectItem>
                      ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedBrands.length > 0 || selectedCategories.length > 0 || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <Badge variant="secondary">
                    Search: {searchQuery}
                  </Badge>
                )}
                {selectedBrands.map(brand => (
                  <Badge key={brand} variant="secondary">
                    Brand: {brand}
                  </Badge>
                ))
                }
                {selectedCategories.map(category => (
                  <Badge key={category} variant="secondary">
                    Category: {category}
                  </Badge>
                ))
                }
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onWishlist={handleWishlist}
                  onCompare={handleCompare}
                  onQuickView={handleQuickView}
                />
              ))
              }
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))
                }
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Footer */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="font-semibold text-lg mb-2">High Quality</h3>
              <p className="text-muted-foreground">Crafted from top materials</p>
            </div>
            
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="font-semibold text-lg mb-2">Warranty Protection</h3>
              <p className="text-muted-foreground">Over 2 years</p>
            </div>
            
            <div className="text-center">
              <Truck className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Order over 150 $</p>
            </div>
            
            <div className="text-center">
              <Headphones className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="font-semibold text-lg mb-2">24 / 7 Support</h3>
              <p className="text-muted-foreground">Dedicated support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
