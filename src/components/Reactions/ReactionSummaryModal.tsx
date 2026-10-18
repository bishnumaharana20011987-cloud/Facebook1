import React, { useState } from 'react';
import { PostReaction, ReactionType } from '../../types';
import { REACTION_CONFIGS } from './ReactionPicker';
import { X, UserPlus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ReactionSummaryModalProps {
  reactions: PostReaction[];
  isOpen: boolean;
  onClose: () => void;
}

export const ReactionSummaryModal: React.FC<ReactionSummaryModalProps> = ({
  reactions,
  isOpen,
  onClose,
}) => {
  const { navigateToProfile, allUsers } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | ReactionType>('all');
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  // Count by reaction type
  const counts: Record<string, number> = { all: reactions.length };
  reactions.forEach((r) => {
    counts[r.type] = (counts[r.type] || 0) + 1;
  });

  const filteredReactions =
    selectedFilter === 'all'
      ? reactions
      : reactions.filter((r) => r.type === selectedFilter);

  const toggleFollow = (userId: string) => {
    setFollowedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
          {/* Reaction filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                selectedFilter === 'all'
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>All</span>
              <span>{reactions.length}</span>
            </button>
            {(Object.keys(REACTION_CONFIGS) as ReactionType[]).map((type) => {
              const count = counts[type] || 0;
              if (count === 0) return null;
              const config = REACTION_CONFIGS[type];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedFilter(type)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                    selectedFilter === type
                      ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <span className="text-base">{config.emoji}</span>
                  <span>{count}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of reacted users */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/60 p-2">
          {filteredReactions.map((reaction, idx) => {
            const config = REACTION_CONFIGS[reaction.type];
            const fullUser = allUsers.find((u) => u.id === reaction.userId);
            const isFollowed = followedIds.includes(reaction.userId);

            return (
              <div
                key={`${reaction.userId}_${idx}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => {
                    if (fullUser) {
                      navigateToProfile(fullUser);
                      onClose();
                    }
                  }}
                >
                  <div className="relative">
                    <img
                      src={reaction.userAvatar}
                      alt={reaction.userName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
                    />
                    <span className="absolute -bottom-1 -right-1 text-sm filter drop-shadow-sm">
                      {config.emoji}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {reaction.userName}
                    </h4>
                    {fullUser?.bio && (
                      <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 max-w-[200px]">
                        {fullUser.bio}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFollow(reaction.userId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isFollowed
                      ? 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {isFollowed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Friends</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add Friend</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
