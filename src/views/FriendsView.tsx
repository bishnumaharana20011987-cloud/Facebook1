import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, UserPlus, Check, MessageCircle, UserX } from 'lucide-react';
import { sound } from '../utils/sound';

export const FriendsView: React.FC = () => {
  const {
    friendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    allUsers,
    currentUser,
    openChatWithUser,
    navigateToProfile,
  } = useApp();

  const myFriends = allUsers.filter((u) => u.id !== currentUser.id);

  return (
    <div className="max-w-4xl mx-auto py-6 px-3 sm:px-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-xs border border-slate-200/80 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-cyan-600" />
          <span>Friends</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Manage your friend requests and connect with people in your network
        </p>
      </div>

      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
            Friend Requests ({friendRequests.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {friendRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200/80 dark:border-zinc-800 flex items-center gap-3 shadow-xs"
              >
                <img
                  src={req.user.avatar}
                  alt={req.user.name}
                  className="w-14 h-14 rounded-full object-cover shrink-0 cursor-pointer"
                  onClick={() => navigateToProfile(req.user)}
                />

                <div className="flex-1 min-w-0">
                  <h4
                    className="text-sm font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:underline"
                    onClick={() => navigateToProfile(req.user)}
                  >
                    {req.user.name}
                  </h4>
                  <span className="text-xs text-slate-500 block">
                    {req.mutualFriends} mutual friends
                  </span>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => acceptFriendRequest(req.id)}
                      className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => declineFriendRequest(req.id)}
                      className="flex-1 py-1.5 px-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Friends List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
          All Friends ({myFriends.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {myFriends.map((friend) => (
            <div
              key={friend.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between shadow-xs"
            >
              <div
                className="flex items-center gap-3 min-w-0 cursor-pointer group"
                onClick={() => navigateToProfile(friend)}
              >
                <div className="relative shrink-0">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
                  />
                  {friend.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-900" />
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                    {friend.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {friend.mutualFriends || 12} mutual friends
                  </span>
                </div>
              </div>

              <button
                onClick={() => openChatWithUser(friend)}
                className="p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-xl transition-colors cursor-pointer"
                title="Message"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
