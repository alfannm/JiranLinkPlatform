import { Star, MapPin, Calendar, Settings, Heart, Package, MessageCircle, Shield, LogOut } from 'lucide-react';
import { User, Item } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ItemCard } from './ItemCard';
import { Badge } from './ui/badge';

interface ProfilePageProps {
  user: User;
  userItems: Item[];
  onItemClick: (item: Item) => void;
}

export function ProfilePage({ user, userItems, onItemClick }: ProfilePageProps) {
  const activeItems = userItems.filter(item => item.available);
  const inactiveItems = userItems.filter(item => !item.available);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-4 pt-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end gap-2 mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={() => {
                // TODO: Implement logout functionality
                console.log('Logout clicked');
              }}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-white mb-2">{user.name}</h1>
              <div className="flex items-center gap-2 text-emerald-50 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{user.district}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-50">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-4">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg">{user.rating.toFixed(1)}</span>
            <span className="text-emerald-50">({user.reviewCount} reviews)</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">{userItems.length}</div>
              <div className="text-sm text-emerald-50">Items</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">12</div>
              <div className="text-sm text-emerald-50">Rentals</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">8</div>
              <div className="text-sm text-emerald-50">Borrowed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="outline" className="justify-start gap-2">
            <Heart className="w-5 h-5" />
            Favorites
          </Button>
          <Button variant="outline" className="justify-start gap-2">
            <Package className="w-5 h-5" />
            My Bookings
          </Button>
        </div>

        {/* Verification Badge */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-900">Verification Status</span>
                <Badge className="bg-green-600">Verified</Badge>
              </div>
              <p className="text-sm text-blue-800">
                Phone number and email verified. ID verification pending.
              </p>
              <Button variant="link" className="text-blue-600 px-0 mt-1 h-auto">
                Complete verification →
              </Button>
            </div>
          </div>
        </div>

        {/* My Items Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">
              Active ({activeItems.length})
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex-1">
              Inactive ({inactiveItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {activeItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeItems.map((item) => (
                  <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No active items</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="mt-4">
            {inactiveItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inactiveItems.map((item) => (
                  <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No inactive items</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Reviews Section */}
        <div className="mt-8">
          <h3 className="mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Reviewer1" />
                  <AvatarFallback>R1</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>Lim Mei Ling</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Great experience! Item was exactly as described and in perfect condition.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Reviewer2" />
                  <AvatarFallback>R2</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>Hassan Ibrahim</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <Star className="w-3 h-3 text-gray-300" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Very helpful and responsive. Would rent from again!
                  </p>
                  <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
