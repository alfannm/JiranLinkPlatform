import { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner@2.0.3';
import { District } from '../types';

interface PostItemPageProps {
  onBack: () => void;
  currentDistrict: string;
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

export function PostItemPage({ onBack, currentDistrict }: PostItemPageProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tools',
    type: 'rent',
    price: '',
    deposit: '',
    priceUnit: 'day',
    district: currentDistrict,
    address: '',
    condition: 'good',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Item posted successfully! It will be visible to your neighbors soon.');
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="flex-1">Post an Item</h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images Upload */}
          <div>
            <Label>Photos *</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-1">Click to upload photos</p>
              <p className="text-sm text-gray-500">Up to 5 photos (JPG, PNG)</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Makita Power Drill Set"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="mt-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your item in detail..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-2 min-h-[120px]"
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="appliances">Appliances</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div>
            <Label>Type *</Label>
            <RadioGroup value={formData.type} onValueChange={(value) => handleInputChange('type', value)} className="mt-2 flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rent" id="type-rent" />
                <Label htmlFor="type-rent">Rent (with fee)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="borrow" id="type-borrow" />
                <Label htmlFor="type-borrow">Borrow (free)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hire" id="type-hire" />
                <Label htmlFor="type-hire">Hire (service)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">
                {formData.type === 'borrow' ? 'Price (Optional)' : 'Price (RM) *'}
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="mt-2"
                required={formData.type !== 'borrow'}
              />
            </div>
            <div>
              <Label htmlFor="priceUnit">Per</Label>
              <Select value={formData.priceUnit} onValueChange={(value) => handleInputChange('priceUnit', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Hour</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="job">Job</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deposit */}
          {formData.type === 'rent' && (
            <div>
              <Label htmlFor="deposit">Security Deposit (RM)</Label>
              <Input
                id="deposit"
                type="number"
                placeholder="Optional"
                value={formData.deposit}
                onChange={(e) => handleInputChange('deposit', e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">Refundable upon return in good condition</p>
            </div>
          )}

          {/* Condition */}
          {formData.category !== 'skills' && formData.category !== 'services' && (
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Location */}
          <div>
            <Label htmlFor="district">District *</Label>
            <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">Pickup Address *</Label>
            <Input
              id="address"
              placeholder="e.g., Section 17, Petaling Jaya"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="mt-2"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Your exact address will only be shared after booking confirmation</p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700">
              Post Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
