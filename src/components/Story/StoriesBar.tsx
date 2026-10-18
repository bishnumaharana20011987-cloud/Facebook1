import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { CreateStoryModal } from './CreateStoryModal';
import { sound } from '../../utils/sound';

export const StoriesBar: React.FC = () => {
  const { currentUser, stories, setActiveStoryModalIndex } = useApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleOpenStory = (index: number) => {
    sound.playPop();
    setActiveStoryModalIndex(index);
  };

  return (
    <>
      <div className="relative mb-4 group/carousel">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer hidden sm:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Stories Horizontal Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {/* Create Story Card */}
          <div
            onClick={() => {
              sound.playPop();
              setIsCreateOpen(true);
            }}
            className="group relative w-28 sm:w-32 h-48 sm:h-52 rounded-xl overflow-hidden shrink-0 shadow-xs border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-pointer transition-transform duration-200 hover:scale-102 flex flex-col justify-between"
          >
            <div className="h-[70%] w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
              />
            </div>

            <div className="relative h-[30%] bg-white dark:bg-zinc-900 flex flex-col items-center justify-end pb-2.5 px-2">
              <div className="absolute -top-4 w-8 h-8 rounded-full bg-blue-600 text-white ring-4 ring-white dark:ring-zinc-900 flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white text-center leading-tight">
                Create story
              </span>
            </div>
          </div>

          {/* Friends' Stories */}
          {stories.map((story, index) => {
            return (
              <div
                key={story.id}
                onClick={() => handleOpenStory(index)}
                className="group relative w-28 sm:w-32 h-48 sm:h-52 rounded-xl overflow-hidden shrink-0 shadow-xs border border-slate-200/80 dark:border-zinc-800 cursor-pointer transition-transform duration-200 hover:scale-102 select-none"
              >
                {/* Background image or gradient */}
                {story.mediaUrl ? (
                  <img
                    src={story.mediaUrl}
                    alt={story.author.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    style={{ background: story.background || '#1877F2' }}
                    className="w-full h-full p-2 flex items-center justify-center text-center text-white text-[11px] font-bold"
                  >
                    <span className="line-clamp-4">{story.text}</span>
                  </div>
                )}

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

                {/* Author Avatar with active story border ring */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <img
                    src={story.author.avatar}
                    alt={story.author.name}
                    className={`w-9 h-9 rounded-full object-cover ring-3 ${
                      story.viewed ? 'ring-slate-400' : 'ring-blue-600'
                    } shadow-md`}
                  />
                </div>

                {/* Author Name */}
                <div className="absolute bottom-2.5 inset-x-2 z-10">
                  <span className="text-xs font-semibold text-white drop-shadow-md truncate block">
                    {story.author.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all opacity-0 group-hover/carousel:opacity-100 cursor-pointer hidden sm:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <CreateStoryModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
};
