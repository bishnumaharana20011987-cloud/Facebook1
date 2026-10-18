import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface WatchItem {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  videoUrl: string;
  poster: string;
  views: string;
  timeAgo: string;
  category: string;
  likesCount: number;
  commentsCount: number;
}

const SAMPLE_VIDEOS: WatchItem[] = [
  {
    id: 'vid_1',
    creatorName: 'Alpine Cinema',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    title: 'Cinematic drone flight through the clouds over Seceda, Dolomites (4K 60FPS)',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    views: '1.4M views',
    timeAgo: '3 days ago',
    category: 'Travel & Nature',
    likesCount: 42100,
    commentsCount: 1820,
  },
  {
    id: 'vid_2',
    creatorName: 'Modern Architecture Labs',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    title: 'Transforming an abandoned industrial warehouse into a net-zero biophilic loft',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    poster: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    views: '890K views',
    timeAgo: '1 week ago',
    category: 'Design',
    likesCount: 28400,
    commentsCount: 940,
  },
  {
    id: 'vid_3',
    creatorName: 'Code & Craft Studio',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    title: 'Designing ultra-responsive web interfaces with fluid typography & micro-interactions',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-smartphone-with-green-screen-42996-large.mp4',
    poster: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    views: '540K views',
    timeAgo: '2 days ago',
    category: 'Tech',
    likesCount: 19800,
    commentsCount: 650,
  },
];

export const WatchView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>([]);
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>([]);
  const [muted, setMuted] = useState(true);

  const categories = ['All', 'Travel & Nature', 'Design', 'Tech', 'Music', 'Live'];

  const filteredVideos =
    selectedCategory === 'All'
      ? SAMPLE_VIDEOS
      : SAMPLE_VIDEOS.filter((v) => v.category === selectedCategory);

  const toggleLike = (id: string) => {
    sound.playReactionSound();
    setLikedVideoIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleSave = (id: string) => {
    sound.playPop();
    setSavedVideoIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-4 px-3 sm:px-0 space-y-4">
      {/* Category Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-2 shadow-xs border border-slate-200/80 dark:border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playPop();
              setSelectedCategory(cat);
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Feed */}
      <div className="space-y-4">
        {filteredVideos.map((video) => {
          const isLiked = likedVideoIds.includes(video.id);
          const isSaved = savedVideoIds.includes(video.id);

          return (
            <div
              key={video.id}
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-xs border border-slate-200/80 dark:border-zinc-800 overflow-hidden"
            >
              {/* Creator Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={video.creatorAvatar}
                    alt={video.creatorName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {video.creatorName}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                      <span>{video.timeAgo}</span>
                      <span>·</span>
                      <span>{video.views}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleSave(video.id)}
                  className="p-2 text-slate-400 hover:text-blue-600 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
                </button>
              </div>

              {/* Title */}
              <div className="px-4 pb-2.5">
                <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">
                  {video.title}
                </p>
              </div>

              {/* Video Player */}
              <div className="relative bg-black aspect-video group">
                <video
                  src={video.videoUrl}
                  poster={video.poster}
                  controls
                  muted={muted}
                  playsInline
                  className="w-full h-full object-contain"
                />

                <button
                  onClick={() => setMuted(!muted)}
                  className="absolute bottom-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="px-3 py-1 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-zinc-300">
                <button
                  onClick={() => toggleLike(video.id)}
                  className={`flex-1 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                    isLiked ? 'text-blue-600 dark:text-blue-400' : ''
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-blue-600' : ''}`} />
                  <span>{video.likesCount + (isLiked ? 1 : 0)} Likes</span>
                </button>

                <button className="flex-1 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  <span>{video.commentsCount} Comments</span>
                </button>

                <button className="flex-1 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
