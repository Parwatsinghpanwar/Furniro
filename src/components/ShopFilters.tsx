import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

interface FilterProps {
  brands: string[];
  categories: string[];
  priceRange: [number, number];
  onBrandChange: (brands: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  selectedBrands: string[];
  selectedCategories: string[];
  selectedPriceRange: [number, number];
  currentSort: string;
}

export function ShopFilters({
  brands,
  categories,
  priceRange,
  onBrandChange,
  onCategoryChange,
  onPriceRangeChange,
  onSortChange,
  onClearFilters,
  selectedBrands,
  selectedCategories,
  selectedPriceRange,
  currentSort,
}: FilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      onBrandChange([...selectedBrands, brand]);
    } else {
      onBrandChange(selectedBrands.filter(b => b !== brand));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      onCategoryChange([...selectedCategories, category]);
    } else {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {(selectedBrands.length > 0 || selectedCategories.length > 0) && (
            <span className="ml-2 bg-accent text-accent-foreground rounded-full px-2 py-1 text-xs">
              {selectedBrands.length + selectedCategories.length}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      <div className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Sort */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Label className="font-semibold">Sort By</Label>
          </div>
          <Select value={currentSort} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Price Range */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Label className="font-semibold">Price Range</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPriceRangeChange(priceRange)}
              className="text-xs"
            >
              Reset
            </Button>
          </div>
          <div className="space-y-4">
            <Slider
              value={selectedPriceRange}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              max={priceRange[1]}
              min={priceRange[0]}
              step={500000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatPrice(selectedPriceRange[0])}</span>
              <span>{formatPrice(selectedPriceRange[1])}</span>
            </div>
          </div>
        </Card>

        {/* Brands */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Label className="font-semibold">Brands</Label>
            {selectedBrands.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBrandChange([])}
                className="text-xs"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                />
                <Label
                  htmlFor={brand}
                  className="text-sm font-normal cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </Card>

        {/* Categories */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Label className="font-semibold">Categories</Label>
            {selectedCategories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryChange([])}
                className="text-xs"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label
                  htmlFor={category}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </Card>

        {/* Clear All Filters */}
        {(selectedBrands.length > 0 || selectedCategories.length > 0) && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
}