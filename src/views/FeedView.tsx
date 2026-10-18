import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StoriesBar } from '../components/Story/StoriesBar';
import { CreatePostBox } from '../components/Post/CreatePostBox';
import { PostCard } from '../components/Post/PostCard';
import { CheckCircle2, Sparkles, Image, Clock } from 'lucide-react';
import { sound } from '../utils/sound';

export const FeedView: React.FC = () => {
  const { posts } = useApp();
  const [feedFilter, setFeedFilter] = useState<'all' | 'photos' | 'recent'>('all');

  const filteredPosts = posts.filter((p) => {
    if (feedFilter === 'photos') return p.images && p.images.length > 0;
    return true;
  });

  return (
    <div className="max-w-[590px] xl:max-w-[620px] mx-auto py-4 px-2 sm:px-0">
      {/* Stories Carousel */}
      <StoriesBar />

      {/* Create Post Widget */}
      <CreatePostBox />

      {/* Filter Segmented Controls */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <button
            onClick={() => {
              sound.playPop();
              setFeedFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              feedFilter === 'all'
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top Posts</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setFeedFilter('recent');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              feedFilter === 'recent'
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recent</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              setFeedFilter('photos');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              feedFilter === 'photos'
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Photos</span>
          </button>
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Caught up banner */}
      <div className="py-8 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
          You're all caught up
        </h4>
        <p className="text-xs text-slate-400">
          You've seen all new posts from the past 3 days.
        </p>
      </div>
    </div>
  );
};
