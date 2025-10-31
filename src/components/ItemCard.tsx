import { MapPin, Star } from 'lucide-react';
import { Item } from '../types';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const priceLabel = item.type === 'hire' 
    ? `RM${item.price}/${item.priceUnit}`
    : `RM${item.price}/${item.priceUnit}`;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="relative aspect-[4/3]">
        <ImageWithFallback
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-white">Not Available</Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-emerald-600 text-white capitalize">
            {item.type}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="mb-1 line-clamp-1">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{item.district}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-emerald-600">{priceLabel}</div>
            {item.deposit && (
              <div className="text-xs text-gray-500">Deposit: RM{item.deposit}</div>
            )}
          </div>
          
          {item.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{item.rating.toFixed(1)}</span>
              <span className="text-gray-400">({item.reviewCount})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
