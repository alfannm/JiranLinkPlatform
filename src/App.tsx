import { useEffect, useState } from "react";
import {
  Home,
  Search,
  PlusCircle,
  MessageCircle,
  User,
} from "lucide-react";
import { HomePage } from "./components/HomePage";
import { BrowsePage } from "./components/BrowsePage";
import { ItemDetailPage } from "./components/ItemDetailPage";
import { PostItemPage } from "./components/PostItemPage";
import { ProfilePage } from "./components/ProfilePage";
import { MessagesPage } from "./components/MessagesPage";
import { LoginPage } from "./components/LoginPage";
import { mockItems, mockMessages } from "./data/mockData";
import { Item } from "./types";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { googleLogout } from "./Auth";

type Page =
  | "home"
  | "browse"
  | "post"
  | "messages"
  | "profile"
  | "item-detail";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load persisted user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setCurrentPage("item-detail");
  };

  const handleBack = () => {
    setCurrentPage("home");
    setSelectedItem(null);
  };

  const handleCategorySelect = (category: string) => {
    setCurrentPage("browse");
  };

  const handleMessageOwner = () => {
    setCurrentPage("messages");
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    toast.success("Successfully signed in with Google");
  };

  const handleLogout = async () => {
    await googleLogout();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
    setCurrentPage("home");
    toast.success("Successfully logged out");
  };

  const userItems = mockItems.filter(
    (item) => user && item.owner.name === user.name
  );

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            items={mockItems}
            currentDistrict={"Kuala Nerus"} // fallback for now
            onSearch={setSearchQuery}
            onCategorySelect={handleCategorySelect}
            onItemClick={handleItemClick}
          />
        );
      case "browse":
        return (
          <BrowsePage
            items={mockItems}
            onItemClick={handleItemClick}
          />
        );
      case "post":
        return (
          <PostItemPage
            onBack={handleBack}
            currentDistrict={"Kuala Nerus"}
          />
        );
      case "messages":
        return <MessagesPage messages={mockMessages} />;
      case "profile":
        return (
          <ProfilePage
            user={{
              id: user.uid,
              name: user.name,
              avatar: user.avatar,
              district: "Kuala Nerus", // temporary until user profile setup
              joinDate: new Date().toISOString(),
              rating: 4.9,
              reviewCount: 23,
              email: user.email ?? "",
              phone: user.phone ?? "",
            }}
            userItems={userItems}
            onItemClick={handleItemClick}
            onLogout={handleLogout}
          />
        );
      case "item-detail":
        return selectedItem ? (
          <ItemDetailPage
            item={selectedItem}
            onBack={handleBack}
            onMessageOwner={handleMessageOwner}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}

      {/* Bottom Navigation */}
      {currentPage !== "item-detail" && currentPage !== "post" && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-around">
            <button
              onClick={() => setCurrentPage("home")}
              className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                currentPage === "home" ? "text-emerald-600" : "text-gray-600"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => setCurrentPage("browse")}
              className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                currentPage === "browse" ? "text-emerald-600" : "text-gray-600"
              }`}
            >
              <Search className="w-6 h-6" />
              <span className="text-xs">Browse</span>
            </button>

            <button
              onClick={() => setCurrentPage("post")}
              className="flex flex-col items-center gap-1 py-3 px-4 text-emerald-600"
            >
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center -mt-6 shadow-lg">
                <PlusCircle className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs">Post</span>
            </button>

            <button
              onClick={() => setCurrentPage("messages")}
              className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors relative ${
                currentPage === "messages" ? "text-emerald-600" : "text-gray-600"
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs">Messages</span>
              {mockMessages.some((m) => m.unread) && (
                <div className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentPage("profile")}
              className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                currentPage === "profile" ? "text-emerald-600" : "text-gray-600"
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </nav>
      )}

      <Toaster />
    </div>
  );
}
