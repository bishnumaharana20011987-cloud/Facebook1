import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MarketplaceItem } from '../types';
import {
  Search,
  Plus,
  MapPin,
  Bookmark,
  MessageCircle,
  X,
  Tag,
  ShieldCheck,
  Image,
  Filter,
} from 'lucide-react';
import { sound } from '../utils/sound';

const MARKETPLACE_CATEGORIES = [
  'All',
  'Electronics',
  'Furniture',
  'Bicycles',
  'Musical Instruments',
  'Apparel',
];

export const MarketplaceView: React.FC = () => {
  const {
    marketplaceItems,
    createMarketplaceItem,
    toggleSaveMarketplaceItem,
    openChatWithUser,
    navigateToProfile,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Listing Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [condition, setCondition] = useState<'Brand New' | 'Like New' | 'Good' | 'Fair'>('Like New');
  const [location, setLocation] = useState('San Francisco, CA');
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter listings
  const filteredItems = marketplaceItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    createMarketplaceItem({
      title: title.trim(),
      price: parseFloat(price) || 0,
      currency: '$',
      location: location.trim() || 'San Francisco, CA',
      category,
      condition,
      description: description.trim(),
      images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'],
    });

    setTitle('');
    setPrice('');
    setDescription('');
    setIsCreateOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMessageSeller = (item: MarketplaceItem) => {
    openChatWithUser(item.seller);
    setSelectedItem(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-3 sm:px-4">
      {/* Top Banner & Search / Sell Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-zinc-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Marketplace
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Buy and sell items locally in your community
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Marketplace"
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => {
              sound.playPop();
              setIsCreateOpen(true);
            }}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create listing</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category Sidebar */}
        <div className="w-full lg:w-56 shrink-0 space-y-1 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800 h-fit">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
            Categories
          </span>
          {MARKETPLACE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playPop();
                setSelectedCategory(cat);
              }}
              className={`w-full px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="flex-1">
          {filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-zinc-800">
              <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                No items found
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for something else or list an item for sale!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playPop();
                    setSelectedItem(item);
                  }}
                  className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-zinc-800 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveMarketplaceItem(item.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-xs transition-colors"
                      title={item.saved ? 'Unsave item' : 'Save item'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          item.saved ? 'fill-blue-500 text-blue-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      {item.currency}{item.price.toLocaleString()}
                    </div>
                    <h4 className="text-xs font-medium text-slate-800 dark:text-zinc-200 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 flex flex-col md:flex-row max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image viewer */}
            <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative min-h-[260px]">
              <img
                src={selectedItem.images[0]}
                alt={selectedItem.title}
                className="w-full h-full object-cover max-h-[420px]"
              />
            </div>

            {/* Info panel */}
            <div className="w-full md:w-1/2 p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {selectedItem.currency}{selectedItem.price.toLocaleString()}
                    </h3>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200 leading-snug mt-1">
                      {selectedItem.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                  <span>{selectedItem.condition}</span>
                  <span>·</span>
                  <span>{selectedItem.category}</span>
                  <span>·</span>
                  <span>{selectedItem.location}</span>
                </div>

                <hr className="border-slate-100 dark:border-zinc-800" />

                <div>
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Description
                  </h5>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                    {selectedItem.description}
                  </p>
                </div>

                <hr className="border-slate-100 dark:border-zinc-800" />

                {/* Seller Info */}
                <div>
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Seller Information
                  </h5>
                  <div
                    onClick={() => {
                      navigateToProfile(selectedItem.seller);
                      setSelectedItem(null);
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={selectedItem.seller.avatar}
                      alt={selectedItem.seller.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {selectedItem.seller.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {selectedItem.seller.friendsCount} friends
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-2">
                <button
                  onClick={() => handleMessageSeller(selectedItem)}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send seller a message</span>
                </button>
                <button
                  onClick={() => toggleSaveMarketplaceItem(selectedItem.id)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 transition-colors"
                  title="Save item"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      selectedItem.saved ? 'fill-blue-500 text-blue-500' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Item for sale
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What are you selling?"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {MARKETPLACE_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your item..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Photo upload */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Photos
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-3 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center gap-1.5"
                  >
                    <Image className="w-4 h-4 text-blue-500" />
                    <span>Upload photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Publish listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
