import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Group } from '../types';
import {
  Users,
  Plus,
  Lock,
  Globe,
  Search,
  Check,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const GroupsView: React.FC = () => {
  const { groups, toggleJoinGroup, createGroup, posts } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'joined' | 'discover'>('joined');
  const [searchFilter, setSearchFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create Group form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Science & Tech');
  const [privacy, setPrivacy] = useState<'Public' | 'Private'>('Public');
  const [description, setDescription] = useState('');

  const joinedGroups = groups.filter((g) => g.isJoined);
  const discoverGroups = groups.filter((g) => !g.isJoined);

  const displayedGroups = (
    activeSubTab === 'joined' ? joinedGroups : discoverGroups
  ).filter((g) => g.name.toLowerCase().includes(searchFilter.toLowerCase()));

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createGroup({
      name: name.trim(),
      category,
      privacy,
      description: description.trim(),
    });

    setName('');
    setDescription('');
    setIsCreateOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-3 sm:px-4 space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-500" />
            <span>Groups</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Find communities of people who share your passions and curiosities
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Sub tabs: Joined vs Discover */}
          <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => {
                sound.playPop();
                setActiveSubTab('joined');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'joined'
                  ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Your groups ({joinedGroups.length})
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setActiveSubTab('discover');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'discover'
                  ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Discover
            </button>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              setIsCreateOpen(true);
            }}
            className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create group</span>
          </button>
        </div>
      </div>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedGroups.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-zinc-800">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              No groups found in this tab
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Switch to Discover to explore active communities!
            </p>
          </div>
        ) : (
          displayedGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between"
            >
              <div>
                {/* Cover Banner */}
                <div className="h-32 bg-slate-900 overflow-hidden relative">
                  <img
                    src={group.coverImage}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded-md text-[11px] font-medium text-white flex items-center gap-1">
                    {group.privacy === 'Public' ? (
                      <Globe className="w-3 h-3" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    <span>{group.privacy} Group</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {group.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                    <span>{group.category}</span>
                    <span>·</span>
                    <span>{group.memberCount.toLocaleString()} members</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                    {group.description}
                  </p>
                </div>
              </div>

              {/* Bottom footer button */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 mt-2">
                <span className="text-[11px] text-slate-400">{group.recentActivity}</span>
                <button
                  onClick={() => toggleJoinGroup(group.id)}
                  className={`py-1.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    group.isJoined
                      ? 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {group.isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <span>Join Group</span>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Group Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Create new group
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name your group"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Science & Tech">Science & Tech</option>
                    <option value="Photography">Photography</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Outdoor & Adventure">Outdoor & Adventure</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                    Privacy
                  </label>
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this group about?"
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
