import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Bookmark,
  Store,
  Tv,
  Clock,
  Calendar,
  Flag,
  ChevronDown,
  Sparkles,
  Layers,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const LeftSidebar: React.FC = () => {
  const {
    currentUser,
    navigateToProfile,
    setActiveTab,
    activeTab,
    groups,
    friendRequests,
  } = useApp();

  const handleNav = (tab: any) => {
    sound.playPop();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="w-64 lg:w-72 xl:w-80 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto no-scrollbar p-3 hidden md:flex flex-col justify-between">
      <div className="space-y-1">
        {/* User profile row */}
        <button
          onClick={() => navigateToProfile(currentUser)}
          className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 flex items-center gap-3 transition-colors cursor-pointer text-left group"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500"
          />
          <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
            {currentUser.name}
          </span>
        </button>

        {/* Navigation items */}
        <button
          onClick={() => handleNav('friends')}
          className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
            activeTab === 'friends'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-slate-800 dark:text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-cyan-600" />
            <span className="text-sm font-medium">Friends</span>
          </div>
          {friendRequests.length > 0 && (
            <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 font-bold">
              {friendRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNav('watch')}
          className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer ${
            activeTab === 'watch'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-slate-800 dark:text-zinc-200'
          }`}
        >
          <Tv className="w-6 h-6 text-blue-500" />
          <span className="text-sm font-medium">Watch &amp; Reels</span>
        </button>

        <button
          onClick={() => handleNav('marketplace')}
          className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer ${
            activeTab === 'marketplace'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-slate-800 dark:text-zinc-200'
          }`}
        >
          <Store className="w-6 h-6 text-blue-600" />
          <span className="text-sm font-medium">Marketplace</span>
        </button>

        <button
          onClick={() => handleNav('groups')}
          className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer ${
            activeTab === 'groups'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-slate-800 dark:text-zinc-200'
          }`}
        >
          <Layers className="w-6 h-6 text-emerald-500" />
          <span className="text-sm font-medium">Groups</span>
        </button>

        <button
          onClick={() => handleNav('saved')}
          className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-colors cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
              : 'hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-slate-800 dark:text-zinc-200'
          }`}
        >
          <Bookmark className="w-6 h-6 text-purple-500" />
          <span className="text-sm font-medium">Saved</span>
        </button>

        <div className="pt-3 pb-1 px-2.5">
          <hr className="border-slate-200 dark:border-zinc-800" />
        </div>

        {/* Shortcuts: Joined Groups */}
        <div className="pt-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2.5 mb-1 block">
            Your Shortcuts
          </span>
          {groups.slice(0, 3).map((group) => (
            <button
              key={group.id}
              onClick={() => handleNav('groups')}
              className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
            >
              <img
                src={group.avatar}
                alt={group.name}
                className="w-8 h-8 rounded-lg object-cover shrink-0"
              />
              <span className="text-xs font-medium text-slate-800 dark:text-zinc-200 truncate">
                {group.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer metadata */}
      <div className="p-3 text-[11px] text-slate-400 dark:text-zinc-500 space-y-1">
        <p>
          Privacy · Terms · Advertising · Cookies · SocialBook © 2026
        </p>
      </div>
    </aside>
  );
};
