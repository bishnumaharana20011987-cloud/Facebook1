import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MainTab, User } from '../../types';
import {
  Search,
  Home,
  Tv,
  Store,
  Users,
  Gamepad2,
  Menu,
  MessageCircle,
  Bell,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  RotateCcw,
  UserCheck,
  ChevronDown,
  X,
  ExternalLink,
  Bookmark,
  Check,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchCurrentUser,
    allUsers,
    activeTab,
    setActiveTab,
    navigateToProfile,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    conversations,
    openChatWithUser,
    searchQuery,
    setSearchQuery,
    resetToDefault,
    posts,
    marketplaceItems,
    groups,
  } = useApp();

  const [showMessengerMenu, setShowMessengerMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const messengerRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (messengerRef.current && !messengerRef.current.contains(e.target as Node)) {
        setShowMessengerMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Search filtered results
  const matchingUsers = searchQuery.trim()
    ? allUsers.filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const matchingPosts = searchQuery.trim()
    ? posts.filter((p) => p.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const matchingMarketplace = searchQuery.trim()
    ? marketplaceItems.filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleTabClick = (tab: MainTab) => {
    sound.playPop();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shadow-xs h-14 px-3 sm:px-4 flex items-center justify-between select-none">
      {/* LEFT: Brand Logo & Live Search */}
      <div className="flex items-center gap-2.5 flex-1 max-w-xs md:max-w-sm">
        <button
          onClick={() => handleTabClick('feed')}
          className="flex items-center gap-2 cursor-pointer group focus:outline-none"
          title="SocialBook Home"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-md tracking-tighter group-hover:scale-105 transition-transform">
            f
          </div>
          <span className="font-bold text-lg text-blue-600 dark:text-blue-500 hidden xl:inline tracking-tight">
            socialbook
          </span>
        </button>

        {/* Search Bar */}
        <div ref={searchRef} className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search SocialBook"
              className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-zinc-800 rounded-full text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Live Results Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-slate-200 dark:border-zinc-700 py-2 z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                People
              </div>
              {matchingUsers.length === 0 ? (
                <div className="px-3 py-1.5 text-xs text-slate-400">No people found</div>
              ) : (
                matchingUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      navigateToProfile(u);
                      setShowSearchDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-zinc-700/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                        {u.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{u.friendsCount} friends</span>
                    </div>
                  </button>
                ))
              )}

              <div className="px-3 py-1 pt-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 dark:border-zinc-700 mt-1">
                Marketplace Items
              </div>
              {matchingMarketplace.length === 0 ? (
                <div className="px-3 py-1.5 text-xs text-slate-400">No items found</div>
              ) : (
                matchingMarketplace.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveTab('marketplace');
                      setShowSearchDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-zinc-700/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <img src={m.images[0]} alt={m.title} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate block">
                        {m.title}
                      </span>
                      <span className="text-[11px] text-blue-600 font-bold">${m.price}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Main Tabs Navigation (Facebook Icons) */}
      <nav className="hidden md:flex items-center justify-center flex-1 max-w-lg h-full">
        <button
          onClick={() => handleTabClick('feed')}
          className={`relative h-full flex-1 flex items-center justify-center transition-colors group cursor-pointer ${
            activeTab === 'feed'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
          title="Home"
        >
          <Home className="w-6 h-6 transition-transform group-hover:scale-105" />
          {activeTab === 'feed' && (
            <div className="absolute bottom-0 inset-x-2 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => handleTabClick('watch')}
          className={`relative h-full flex-1 flex items-center justify-center transition-colors group cursor-pointer ${
            activeTab === 'watch'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
          title="Video"
        >
          <Tv className="w-6 h-6 transition-transform group-hover:scale-105" />
          {activeTab === 'watch' && (
            <div className="absolute bottom-0 inset-x-2 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => handleTabClick('marketplace')}
          className={`relative h-full flex-1 flex items-center justify-center transition-colors group cursor-pointer ${
            activeTab === 'marketplace'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
          title="Marketplace"
        >
          <Store className="w-6 h-6 transition-transform group-hover:scale-105" />
          {activeTab === 'marketplace' && (
            <div className="absolute bottom-0 inset-x-2 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => handleTabClick('groups')}
          className={`relative h-full flex-1 flex items-center justify-center transition-colors group cursor-pointer ${
            activeTab === 'groups'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
          title="Groups"
        >
          <Users className="w-6 h-6 transition-transform group-hover:scale-105" />
          {activeTab === 'groups' && (
            <div className="absolute bottom-0 inset-x-2 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => handleTabClick('saved')}
          className={`relative h-full flex-1 flex items-center justify-center transition-colors group cursor-pointer ${
            activeTab === 'saved'
              ? 'text-blue-600 dark:text-blue-500'
              : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
          title="Saved Items"
        >
          <Bookmark className="w-6 h-6 transition-transform group-hover:scale-105" />
          {activeTab === 'saved' && (
            <div className="absolute bottom-0 inset-x-2 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
          )}
        </button>
      </nav>

      {/* RIGHT: Actions (Messenger, Notifications, Account Switcher & Settings) */}
      <div className="flex items-center gap-2">
        {/* Messenger Icon & Dropdown */}
        <div ref={messengerRef} className="relative">
          <button
            onClick={() => {
              sound.playPop();
              setShowMessengerMenu(!showMessengerMenu);
              setShowNotifMenu(false);
              setShowUserMenu(false);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative cursor-pointer ${
              showMessengerMenu
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
            }`}
            title="Messenger"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-zinc-900">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Messenger Dropdown Menu */}
          {showMessengerMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-700 py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 pb-2 border-b border-slate-100 dark:border-zinc-700 flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Chats</h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold cursor-pointer">
                  See all in Messenger
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-700/50 py-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      openChatWithUser(conv.participant);
                      setShowMessengerMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-zinc-700/50 flex items-center gap-3 transition-colors cursor-pointer group"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.participant.avatar}
                        alt={conv.participant.name}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                      {conv.participant.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-800" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {conv.participant.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {conv.messages[conv.messages.length - 1]?.timestamp || 'Now'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                        {conv.messages[conv.messages.length - 1]?.text || 'Started a conversation'}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon & Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              sound.playPop();
              setShowNotifMenu(!showNotifMenu);
              setShowMessengerMenu(false);
              setShowUserMenu(false);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative cursor-pointer ${
              showNotifMenu
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-zinc-900">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-700 py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 pb-2 border-b border-slate-100 dark:border-zinc-700 flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Notifications</h3>
                {unreadNotifsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-700/50 py-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.actor) navigateToProfile(n.actor);
                      setShowNotifMenu(false);
                    }}
                    className={`px-4 py-2.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors ${
                      !n.isRead ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''
                    }`}
                  >
                    <img
                      src={n.actor.avatar}
                      alt={n.actor.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-800 dark:text-zinc-200 leading-snug">
                        <span className="font-bold">{n.actor.name}</span> {n.text}
                      </p>
                      <span className="text-[11px] text-slate-400 block mt-1">{n.time}</span>
                    </div>
                    {!n.isRead && (
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Settings Menu */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => {
              sound.playPop();
              setShowUserMenu(!showUserMenu);
              setShowMessengerMenu(false);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer focus:outline-none"
            title="Account &amp; Settings"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent"
            />
          </button>

          {/* Account & Settings Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-700 p-3 z-50 animate-in fade-in zoom-in-95 space-y-3">
              {/* Profile Card Button */}
              <button
                onClick={() => {
                  navigateToProfile(currentUser);
                  setShowUserMenu(false);
                }}
                className="w-full p-2.5 bg-slate-50 dark:bg-zinc-700/50 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">
                    See your profile
                  </span>
                </div>
              </button>

              <hr className="border-slate-100 dark:border-zinc-700" />

              {/* Profile Switcher Section */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Switch Active Profile
                </span>
                <div className="space-y-0.5">
                  {allUsers.map((u) => {
                    const isCurrent = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchCurrentUser(u.id);
                          setShowUserMenu(false);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-zinc-700/60 text-slate-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs">{u.name}</span>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-slate-100 dark:border-zinc-700" />

              {/* Utility Toggles: Dark Mode & Sound & Reset */}
              <div className="space-y-1">
                {/* Dark Mode toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full px-2.5 py-2 rounded-lg flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>Display: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Toggle</span>
                </button>

                {/* Sound FX toggle */}
                <button
                  onClick={toggleSound}
                  className="w-full px-2.5 py-2 rounded-lg flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <span>Sound Effects: {soundEnabled ? 'Enabled' : 'Muted'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Toggle</span>
                </button>

                {/* Reset Data */}
                <button
                  onClick={() => {
                    resetToDefault();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-2.5 py-2 rounded-lg flex items-center gap-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Sample Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
