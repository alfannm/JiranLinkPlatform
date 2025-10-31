import { Search, Send } from 'lucide-react';
import { useState } from 'react';
import { Message } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MessagesPageProps {
  messages: Message[];
}

export function MessagesPage({ messages }: MessagesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [chatInput, setChatInput] = useState('');

  const filteredMessages = messages.filter((msg) =>
    msg.from.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      // In a real app, this would send the message
      setChatInput('');
    }
  };

  if (selectedMessage) {
    return (
      <div className="h-screen flex flex-col pb-16">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(null)}>
              ← Back
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedMessage.from.avatar} />
              <AvatarFallback>{selectedMessage.from.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div>{selectedMessage.from.name}</div>
              <div className="text-sm text-gray-500">Online</div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Item Context */}
            {selectedMessage.item && (
              <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
                <div className="text-sm text-gray-500 mb-1">Regarding:</div>
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedMessage.item.images[0]} 
                    alt={selectedMessage.item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div>{selectedMessage.item.title}</div>
                    <div className="text-sm text-emerald-600">
                      RM{selectedMessage.item.price}/{selectedMessage.item.priceUnit}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedMessage.from.avatar} />
                <AvatarFallback>{selectedMessage.from.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-white rounded-lg p-3 inline-block max-w-[80%]">
                  <p>{selectedMessage.lastMessage}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(selectedMessage.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="flex-1 flex justify-end">
                <div className="bg-emerald-500 text-white rounded-lg p-3 inline-block max-w-[80%]">
                  <p>Hi! Yes, it's available. When would you like to rent it?</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Input
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} className="bg-emerald-600 hover:bg-emerald-700">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="max-w-4xl mx-auto">
        {filteredMessages.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className="px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={message.from.avatar} />
                      <AvatarFallback>{message.from.name[0]}</AvatarFallback>
                    </Avatar>
                    {message.unread && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-600 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={message.unread ? '' : 'text-gray-900'}>
                        {message.from.name}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {message.item && (
                      <div className="text-sm text-emerald-600 mb-1">
                        Re: {message.item.title}
                      </div>
                    )}

                    <p className={`text-sm line-clamp-2 ${message.unread ? '' : 'text-gray-500'}`}>
                      {message.lastMessage}
                    </p>
                  </div>

                  {message.unread && (
                    <Badge className="bg-emerald-600 text-white">New</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No messages found</p>
          </div>
        )}
      </div>
    </div>
  );
}
