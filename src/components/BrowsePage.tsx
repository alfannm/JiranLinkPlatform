import { useState } from 'react';
import { Filter, Search, MapPin } from 'lucide-react';
import { Item, District } from '../types';
import { ItemCard } from './ItemCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { findNearestDistrict } from '../services/hmsLocation';
import { toast } from 'sonner@2.0.3';

interface BrowsePageProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

const districts: District[] = [
  'Kuala Lumpur',
  'Petaling Jaya',
  'Shah Alam',
  'Subang Jaya',
  'Klang',
  'Johor Bahru',
  'Penang',
  'Ipoh',
  'Kota Kinabalu',
  'Kuching',
];

export function BrowsePage({ items, onItemClick }: BrowsePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const nearestDistrict = await findNearestDistrict();
      if (nearestDistrict) {
        setSelectedDistrict(nearestDistrict);
        toast.success(`Location detected: ${nearestDistrict}`);
      } else {
        toast.error('Could not determine nearest district');
      }
    } catch (error) {
      console.error('Location detection failed:', error);
      toast.error('Failed to detect location. Please enable location services.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesPrice = item.price >= minPrice && item.price <= maxPrice;
    const matchesAvailability = !showAvailableOnly || item.available;

    return matchesSearch && matchesCategory && matchesDistrict && matchesType && matchesPrice && matchesAvailability;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Search and Filter Header */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search items or services..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search results by applying filters
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Category Filter */}
                <div className="space-y-3">
                  <Label>Category</Label>
                  <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="cat-all" />
                      <Label htmlFor="cat-all" className="cursor-pointer">All Categories</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tools" id="cat-tools" />
                      <Label htmlFor="cat-tools" className="cursor-pointer">Tools</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="appliances" id="cat-appliances" />
                      <Label htmlFor="cat-appliances" className="cursor-pointer">Appliances</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="skills" id="cat-skills" />
                      <Label htmlFor="cat-skills" className="cursor-pointer">Skills</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="services" id="cat-services" />
                      <Label htmlFor="cat-services" className="cursor-pointer">Services</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="others" id="cat-others" />
                      <Label htmlFor="cat-others" className="cursor-pointer">Others</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Type Filter */}
                <div className="space-y-3">
                  <Label>Type</Label>
                  <RadioGroup value={selectedType} onValueChange={setSelectedType} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="type-all" />
                      <Label htmlFor="type-all" className="cursor-pointer">All Types</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rent" id="type-rent" />
                      <Label htmlFor="type-rent" className="cursor-pointer">Rent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="borrow" id="type-borrow" />
                      <Label htmlFor="type-borrow" className="cursor-pointer">Borrow</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hire" id="type-hire" />
                      <Label htmlFor="type-hire" className="cursor-pointer">Hire</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Price Range */}
                <div className="space-y-3">
                  <Label>Price Range (RM)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="min-price" className="text-sm text-muted-foreground">Minimum</Label>
                      <Input
                        id="min-price"
                        type="number"
                        min={0}
                        max={maxPrice}
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="max-price" className="text-sm text-muted-foreground">Maximum</Label>
                      <Input
                        id="max-price"
                        type="number"
                        min={minPrice}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        placeholder="200"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Available Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={showAvailableOnly}
                    onCheckedChange={(checked) => setShowAvailableOnly(checked as boolean)}
                  />
                  <Label htmlFor="available" className="cursor-pointer">
                    Show available items only
                  </Label>
                </div>

                <Separator />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDistrict('all');
                    setSelectedType('all');
                    setMinPrice(0);
                    setMaxPrice(200);
                    setShowAvailableOnly(false);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button 
            variant="outline"
            onClick={handleDetectLocation}
            disabled={isDetectingLocation}
          >
            <MapPin className="w-5 h-5" />
            {isDetectingLocation ? 'Detecting...' : 'Detect Nearby'}
          </Button>

          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="appliances">Appliances</SelectItem>
              <SelectItem value="skills">Skills</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
        </p>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No items found matching your criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDistrict('all');
              setSelectedType('all');
              setMinPrice(0);
              setMaxPrice(200);
              setShowAvailableOnly(false);
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
