import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Gift, MoreHorizontal, Video } from 'lucide-react';
import { sound } from '../../utils/sound';

export const RightSidebar: React.FC = () => {
  const {
    allUsers,
    currentUser,
    friendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    openChatWithUser,
    navigateToProfile,
  } = useApp();

  const [contactSearch, setContactSearch] = useState('');

  const contacts = allUsers
    .filter((u) => u.id !== currentUser.id)
    .filter((u) => u.name.toLowerCase().includes(contactSearch.toLowerCase()));

  return (
    <aside className="w-64 lg:w-72 xl:w-80 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto no-scrollbar p-3 hidden lg:block space-y-4">
      {/* Sponsored Ad */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Sponsored
        </span>
        <a
          href="#sponsor"
          onClick={(e) => e.preventDefault()}
          className="group block p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=240&q=80"
              alt="Workspace gear"
              className="w-24 h-16 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0">
              <h5 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                Ergonomic mechanical keyboards for developers
              </h5>
              <span className="text-[11px] text-slate-400 block mt-0.5">keychron.com</span>
            </div>
          </div>
        </a>
      </div>

      <hr className="border-slate-200 dark:border-zinc-800" />

      {/* Friend Requests Widget */}
      {friendRequests.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Friend Requests ({friendRequests.length})
            </span>
          </div>

          <div className="space-y-3">
            {friendRequests.map((fr) => (
              <div key={fr.id} className="p-2.5 bg-slate-50 dark:bg-zinc-800/60 rounded-xl space-y-2 border border-slate-200/60 dark:border-zinc-750">
                <div
                  className="flex items-center gap-2.5 cursor-pointer"
                  onClick={() => navigateToProfile(fr.user)}
                >
                  <img
                    src={fr.user.avatar}
                    alt={fr.user.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {fr.user.name}
                    </h5>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">
                      {fr.mutualFriends} mutual friends · {fr.time}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => acceptFriendRequest(fr.id)}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => declineFriendRequest(fr.id)}
                    className="py-1.5 px-3 bg-slate-200 dark:bg-zinc-700 hover:bg-slate-300 dark:hover:bg-zinc-600 text-slate-700 dark:text-zinc-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Birthdays Reminder */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Birthdays
        </span>
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-800 dark:text-zinc-300 leading-snug">
            <span className="font-semibold text-slate-900 dark:text-white">Chloe Bennett</span> has her birthday today!
          </p>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-zinc-800" />

      {/* Contacts List with Instant Chat Dock launch */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-bold uppercase tracking-wider">Contacts</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => sound.playPop()}
              className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              title="Search contacts"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Contacts search field */}
        <input
          type="text"
          value={contactSearch}
          onChange={(e) => setContactSearch(e.target.value)}
          placeholder="Filter contacts..."
          className="w-full px-3 py-1.5 text-xs bg-slate-100 dark:bg-zinc-800/80 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-1"
        />

        <div className="space-y-0.5">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => openChatWithUser(contact)}
              className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-900" />
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {contact.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
