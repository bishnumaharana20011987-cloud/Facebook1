import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { User, Post } from '../types';
import { PostCard } from '../components/Post/PostCard';
import { CreatePostBox } from '../components/Post/CreatePostBox';
import {
  Camera,
  Edit,
  Plus,
  MessageCircle,
  UserPlus,
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  Heart,
  Image as ImageIcon,
  Users,
  Grid,
  Check,
  X,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const ProfileView: React.FC = () => {
  const {
    viewingProfileUser,
    currentUser,
    updateCurrentUser,
    posts,
    openChatWithUser,
    allUsers,
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<'posts' | 'about' | 'friends' | 'photos'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit profile states
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [work, setWork] = useState(currentUser.work || '');
  const [education, setEducation] = useState(currentUser.education || '');
  const [livesIn, setLivesIn] = useState(currentUser.livesIn || '');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const isMe = viewingProfileUser.id === currentUser.id;

  // Filter posts by this author
  const userPosts = posts.filter((p) => p.author.id === viewingProfileUser.id);

  // Extract all photos from user's posts
  const userPhotos = userPosts.flatMap((p) => p.images || []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name,
      bio,
      work,
      education,
      livesIn,
    });
    setIsEditModalOpen(false);
    sound.playPop();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateCurrentUser({ avatar: event.target!.result as string });
          sound.playPop();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateCurrentUser({ coverPhoto: event.target!.result as string });
          sound.playPop();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shadow-xs">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-72 md:h-80 bg-slate-800 overflow-hidden rounded-b-2xl">
          <img
            src={viewingProfileUser.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />

          {isMe && (
            <>
              <button
                onClick={() => coverInputRef.current?.click()}
                className="absolute bottom-4 right-4 py-2 px-3.5 bg-white/90 hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-900 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 backdrop-blur-xs transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Edit cover photo</span>
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </>
          )}
        </div>

        {/* Profile Avatar & Primary Info */}
        <div className="px-4 sm:px-8 pb-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              {/* Avatar with Camera badge */}
              <div className="relative group">
                <img
                  src={viewingProfileUser.avatar}
                  alt={viewingProfileUser.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-white dark:ring-zinc-900 shadow-xl bg-white"
                />
                {isMe && (
                  <>
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute bottom-2 right-2 p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-white rounded-full shadow-md ring-2 ring-white dark:ring-zinc-900 transition-colors cursor-pointer"
                      title="Update profile picture"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {viewingProfileUser.name}
                  </h1>
                  {viewingProfileUser.verified && (
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
                  {viewingProfileUser.friendsCount.toLocaleString()} friends
                  {viewingProfileUser.mutualFriends && ` · ${viewingProfileUser.mutualFriends} mutual`}
                </p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2">
              {isMe ? (
                <>
                  <button
                    onClick={() => {
                      sound.playPop();
                      setIsEditModalOpen(true);
                    }}
                    className="py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit profile</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openChatWithUser(viewingProfileUser)}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                  <button className="py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer">
                    <UserPlus className="w-4 h-4" />
                    <span>Friends</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio text */}
          {viewingProfileUser.bio && (
            <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 text-center sm:text-left max-w-xl pb-2">
              {viewingProfileUser.bio}
            </p>
          )}

          <hr className="my-2 border-slate-100 dark:border-zinc-800" />

          {/* Profile Navigation Tabs (Posts, About, Friends, Photos) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {(['posts', 'about', 'friends', 'photos'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  sound.playPop();
                  setActiveProfileTab(tab);
                }}
                className={`py-2 px-4 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                  activeProfileTab === tab
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Profile Content Area */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 mt-4">
        {/* TAB: POSTS */}
        {activeProfileTab === 'posts' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Intro Card */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-3.5">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Intro</h3>

                <div className="space-y-3 text-xs text-slate-700 dark:text-zinc-300">
                  {viewingProfileUser.work && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{viewingProfileUser.work}</span>
                    </div>
                  )}

                  {viewingProfileUser.education && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{viewingProfileUser.education}</span>
                    </div>
                  )}

                  {viewingProfileUser.livesIn && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Lives in {viewingProfileUser.livesIn}</span>
                    </div>
                  )}

                  {viewingProfileUser.relationship && (
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{viewingProfileUser.relationship}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{viewingProfileUser.joinedDate}</span>
                  </div>
                </div>

                {isMe && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Edit details
                  </button>
                )}
              </div>

              {/* Photos Snapshot Box */}
              {userPhotos.length > 0 && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Photos</h3>
                    <button
                      onClick={() => setActiveProfileTab('photos')}
                      className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      See all
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
                    {userPhotos.slice(0, 6).map((img, idx) => (
                      <div key={idx} className="aspect-square bg-slate-900 overflow-hidden">
                        <img
                          src={img}
                          alt={`Snapshot ${idx}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Feed Stream */}
            <div className="md:col-span-7 space-y-4">
              {isMe && <CreatePostBox />}

              {userPosts.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-zinc-800">
                  <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    No posts published yet
                  </p>
                </div>
              ) : (
                userPosts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>
        )}

        {/* TAB: ABOUT */}
        {activeProfileTab === 'about' && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-4 max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Overview</h3>
            <div className="space-y-4 divide-y divide-slate-100 dark:divide-zinc-800 text-sm">
              <div className="pt-3 flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Work</span>
                  <span className="text-slate-600 dark:text-zinc-300">
                    {viewingProfileUser.work || 'Not specified'}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Education</span>
                  <span className="text-slate-600 dark:text-zinc-300">
                    {viewingProfileUser.education || 'Not specified'}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Places lived</span>
                  <span className="text-slate-600 dark:text-zinc-300">
                    Lives in {viewingProfileUser.livesIn || 'San Francisco, CA'}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Joined SocialBook</span>
                  <span className="text-slate-600 dark:text-zinc-300">
                    {viewingProfileUser.joinedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: FRIENDS */}
        {activeProfileTab === 'friends' && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Friends</h3>
                <span className="text-xs text-slate-400">
                  {allUsers.length - 1} mutual friends in network
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allUsers
                .filter((u) => u.id !== viewingProfileUser.id)
                .map((friend) => (
                  <div
                    key={friend.id}
                    className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl flex items-center justify-between border border-slate-200/60 dark:border-zinc-700/60"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-11 h-11 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                          {friend.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-zinc-400 block truncate">
                          {friend.friendsCount} friends
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => openChatWithUser(friend)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Send message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB: PHOTOS */}
        {activeProfileTab === 'photos' && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-zinc-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Photos</h3>
            {userPhotos.length === 0 ? (
              <p className="text-xs text-slate-500">No photos uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {userPhotos.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-xl overflow-hidden bg-slate-900 shadow-xs cursor-pointer group"
                  >
                    <img
                      src={img}
                      alt={`Photo ${idx}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Work
                </label>
                <input
                  type="text"
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Education
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={livesIn}
                  onChange={(e) => setLivesIn(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
