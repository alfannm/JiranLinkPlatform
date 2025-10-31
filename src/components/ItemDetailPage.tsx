import { ArrowLeft, MapPin, Star, Shield, MessageCircle, Calendar, User, Phone } from 'lucide-react';
import { Item } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface ItemDetailPageProps {
  item: Item;
  onBack: () => void;
  onMessageOwner: () => void;
}

export function ItemDetailPage({ item, onBack, onMessageOwner }: ItemDetailPageProps) {
  const handleBookNow = () => {
    if (!item.available) {
      toast.error('This item is currently not available');
      return;
    }
    toast.success('Booking request sent! The owner will contact you soon.');
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="flex-1 line-clamp-1">Item Details</h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Image Gallery */}
        <div className="relative aspect-[4/3] bg-gray-100">
          <ImageWithFallback
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          {!item.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="bg-white text-lg py-2 px-4">
                Not Available
              </Badge>
            </div>
          )}
        </div>

        <div className="px-4 py-6">
          {/* Title and Price */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1>{item.title}</h1>
              <Badge className="bg-emerald-600 text-white capitalize">
                {item.type}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 mb-3">
              <div>
                <div className="text-emerald-600 text-2xl">
                  RM{item.price}/{item.priceUnit}
                </div>
                {item.deposit && (
                  <div className="text-gray-500">Deposit: RM{item.deposit}</div>
                )}
              </div>
              
              {item.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{item.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({item.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{item.address}, {item.district}</span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{item.description}</p>
          </div>

          {/* Item Details */}
          <div className="mb-6">
            <h3 className="mb-3">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Category</div>
                <div className="capitalize">{item.category}</div>
              </div>
              {item.condition && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Condition</div>
                  <div className="capitalize">{item.condition}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-500 mb-1">Posted</div>
                <div>{new Date(item.postedDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Views</div>
                <div>{item.views}</div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Owner Info */}
          <div className="mb-6">
            <h3 className="mb-3">Owner</h3>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarImage src={item.owner.avatar} />
                <AvatarFallback>{item.owner.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="mb-1">{item.owner.name}</div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{item.owner.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({item.owner.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{item.owner.district}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(item.owner.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-900 mb-1">Safety Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Meet in a safe, public location if possible</li>
                  <li>• Inspect the item before making payment</li>
                  <li>• Use JiranLink's secure payment system</li>
                  <li>• Report any suspicious activity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onMessageOwner}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Message
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleBookNow}
            disabled={!item.available}
          >
            <Calendar className="w-5 h-5 mr-2" />
            {item.type === 'hire' ? 'Hire Now' : item.type === 'borrow' ? 'Request to Borrow' : 'Rent Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
