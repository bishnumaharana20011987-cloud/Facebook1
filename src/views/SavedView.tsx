import React from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/Post/PostCard';
import { Bookmark, Store, ExternalLink } from 'lucide-react';

export const SavedView: React.FC = () => {
  const { posts, currentUser, marketplaceItems, setActiveTab } = useApp();

  const savedPosts = posts.filter((p) => p.savedBy?.includes(currentUser.id));
  const savedMarketplace = marketplaceItems.filter((m) => m.saved);

  return (
    <div className="max-w-3xl mx-auto py-6 px-3 sm:px-4 space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-xs border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-purple-500 fill-purple-500" />
            <span>Saved Items</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Posts, videos, and marketplace listings you saved for later
          </p>
        </div>
      </div>

      {/* Saved Marketplace Items if any */}
      {savedMarketplace.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
            Marketplace Items ({savedMarketplace.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedMarketplace.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab('marketplace')}
                className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-slate-200/80 dark:border-zinc-800 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <span className="text-sm font-extrabold text-blue-600 block">
                    ${item.price}
                  </span>
                  <span className="text-[11px] text-slate-400">{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Posts */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
          Saved Posts ({savedPosts.length})
        </h3>

        {savedPosts.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-zinc-800">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              No saved posts yet
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Click the three dots on any post in your feed and select "Save Post".
            </p>
          </div>
        ) : (
          savedPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};
