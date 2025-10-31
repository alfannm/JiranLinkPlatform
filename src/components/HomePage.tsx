import { Search, MapPin, Wrench, Laptop, Lightbulb, Briefcase, Package } from 'lucide-react';
import { Item } from '../types';
import { ItemCard } from './ItemCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HomePageProps {
  items: Item[];
  currentDistrict: string;
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
  onItemClick: (item: Item) => void;
}

const categories = [
  { id: 'all', label: 'All', icon: Package },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'appliances', label: 'Appliances', icon: Laptop },
  { id: 'skills', label: 'Skills', icon: Lightbulb },
  { id: 'services', label: 'Services', icon: Briefcase },
];

export function HomePage({ items, currentDistrict, onSearch, onCategorySelect, onItemClick }: HomePageProps) {
  const featuredItems = items.filter(item => item.available).slice(0, 6);
  const nearbyItems = items.filter(item => item.district === currentDistrict && item.available);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-2">Welcome to JiranLink</h1>
          <p className="text-emerald-50 mb-4">Share tools, skills & services with your neighbors</p>
          
          <div className="flex items-center gap-2 mb-4 text-emerald-50">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{currentDistrict}</span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for items or services..."
              className="pl-10 bg-white text-gray-900"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Categories */}
        <div className="py-6">
          <h2 className="mb-4">Categories</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-sm">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nearby Items */}
        {nearbyItems.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2>Near You</h2>
              <Button variant="ghost" size="sm" onClick={() => onCategorySelect('all')}>
                See all
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nearbyItems.slice(0, 4).map((item) => (
                <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
              ))}
            </div>
          </div>
        )}

        {/* Featured Items */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2>Featured</h2>
            <Button variant="ghost" size="sm" onClick={() => onCategorySelect('all')}>
              See all
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-6 mb-8 border border-teal-200">
          <h3 className="mb-2">Reviving the Kampung Spirit 🏘️</h3>
          <p className="text-gray-600 mb-4">
            JiranLink connects neighbors to share resources, save money, and build a stronger community. 
            Borrow what you need, share what you have.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Badge variant="secondary" className="bg-white">✓ Verified Users</Badge>
            <Badge variant="secondary" className="bg-white">✓ Secure Payments</Badge>
            <Badge variant="secondary" className="bg-white">✓ Local Community</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
