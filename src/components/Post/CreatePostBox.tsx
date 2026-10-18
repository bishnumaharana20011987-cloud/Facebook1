import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreatePostModal } from './CreatePostModal';
import { Video, Image, Smile } from 'lucide-react';
import { sound } from '../../utils/sound';

export const CreatePostBox: React.FC = () => {
  const { currentUser, navigateToProfile } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'standard' | 'photo' | 'feeling'>('standard');
  const [liveToast, setLiveToast] = useState(false);

  const openWithMode = (mode: 'standard' | 'photo' | 'feeling') => {
    sound.playPop();
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const triggerLive = () => {
    sound.playPop();
    setLiveToast(true);
    setTimeout(() => setLiveToast(false), 3000);
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xs border border-slate-200/80 dark:border-zinc-800 p-3.5 mb-4">
        {/* Top row: Avatar + Input trigger button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateToProfile(currentUser)}
            className="cursor-pointer shrink-0 group focus:outline-none"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
            />
          </button>

          <button
            onClick={() => openWithMode('standard')}
            className="flex-1 bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-left px-4 py-2.5 rounded-full text-slate-500 dark:text-zinc-400 text-sm transition-colors cursor-pointer select-none"
          >
            What's on your mind, {currentUser.name.split(' ')[0]}?
          </button>
        </div>

        <hr className="my-3 border-slate-100 dark:border-zinc-800" />

        {/* Action icons row */}
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={triggerLive}
            className="py-2 px-1 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs md:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Video className="w-5 h-5 text-rose-500" />
            <span className="hidden sm:inline">Live video</span>
            <span className="sm:hidden">Live</span>
          </button>

          <button
            onClick={() => openWithMode('photo')}
            className="py-2 px-1 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs md:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Image className="w-5 h-5 text-emerald-500" />
            <span className="hidden sm:inline">Photo/video</span>
            <span className="sm:hidden">Photo</span>
          </button>

          <button
            onClick={() => openWithMode('feeling')}
            className="py-2 px-1 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs md:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Smile className="w-5 h-5 text-amber-500" />
            <span className="hidden sm:inline">Feeling/activity</span>
            <span className="sm:hidden">Feeling</span>
          </button>
        </div>
      </div>

      {liveToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          <span className="text-xs font-medium">
            Live Stream studio ready! Camera &amp; mic configured.
          </span>
        </div>
      )}

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultMode={modalMode}
      />
    </>
  );
};
