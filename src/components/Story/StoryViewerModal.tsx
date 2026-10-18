import React, { useState, useEffect, useRef } from 'react';
import { Story } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, ChevronLeft, ChevronRight, Pause, Play, Send, Heart } from 'lucide-react';
import { sound } from '../../utils/sound';

export const StoryViewerModal: React.FC = () => {
  const {
    stories,
    activeStoryModalIndex,
    setActiveStoryModalIndex,
    markStoryViewed,
    sendMessage,
    openChatWithUser,
  } = useApp();

  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [sentToast, setSentToast] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentIndex = activeStoryModalIndex;
  const currentStory: Story | undefined =
    currentIndex !== null && stories[currentIndex] ? stories[currentIndex] : undefined;

  // Mark viewed
  useEffect(() => {
    if (currentStory) {
      markStoryViewed(currentStory.id);
      setProgress(0);
    }
  }, [currentIndex, currentStory?.id]);

  // Timed progress bar (5s duration)
  useEffect(() => {
    if (currentIndex === null || isPaused || !currentStory) return;

    const interval = 50; // ms
    const step = 100 / (5000 / interval);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, currentStory?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeStoryModalIndex === null) return;
      if (e.key === 'Escape') setActiveStoryModalIndex(null);
      if (e.key === 'ArrowRight') goToNextStory();
      if (e.key === 'ArrowLeft') goToPrevStory();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStoryModalIndex, stories.length]);

  if (currentIndex === null || !currentStory) return null;

  const goToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setActiveStoryModalIndex(currentIndex + 1);
      setProgress(0);
    } else {
      setActiveStoryModalIndex(null);
    }
  };

  const goToPrevStory = () => {
    if (currentIndex > 0) {
      setActiveStoryModalIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sendMessage(
      currentStory.author.id,
      `Replied to your story: "${replyText.trim()}"`
    );
    setReplyText('');
    setSentToast(true);
    setTimeout(() => setSentToast(false), 2000);
  };

  const handleQuickReaction = (emoji: string) => {
    sound.playReactionSound();
    sendMessage(
      currentStory.author.id,
      `Reacted ${emoji} to your story!`
    );
    setSentToast(true);
    setTimeout(() => setSentToast(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md select-none animate-in fade-in duration-200"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Close button */}
      <button
        onClick={() => setActiveStoryModalIndex(null)}
        className="absolute top-5 right-5 z-50 p-2.5 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 rounded-full transition-colors cursor-pointer"
        aria-label="Close stories"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Previous / Next buttons */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevStory();
          }}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors hidden sm:block cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNextStory();
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors hidden sm:block cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Story Container */}
      <div className="relative w-full max-w-sm h-[85vh] max-h-[720px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10 bg-zinc-950">
        {/* Progress bars row */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5">
          {stories.map((s, idx) => (
            <div
              key={s.id}
              className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header (Author + Time + Pause toggle) */}
        <div className="absolute top-6 inset-x-3 z-30 flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.author.avatar}
              alt={currentStory.author.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div>
              <h4 className="text-sm font-bold leading-tight flex items-center gap-1">
                <span>{currentStory.author.name}</span>
                {currentStory.author.verified && (
                  <span className="text-[10px] bg-blue-500 text-white rounded-full px-1">
                    ✓
                  </span>
                )}
              </h4>
              <span className="text-[11px] text-white/80">{currentStory.createdAt}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(!isPaused);
            }}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>

        {/* Visual Story Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {currentStory.mediaUrl ? (
            <div className="w-full h-full relative">
              <img
                src={currentStory.mediaUrl}
                alt="Story content"
                className="w-full h-full object-cover"
              />
              {currentStory.text && (
                <div className="absolute inset-x-4 bottom-24 p-3.5 bg-black/60 backdrop-blur-md rounded-xl text-white text-center text-sm font-semibold shadow-lg">
                  {currentStory.text}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{ background: currentStory.background || '#1877F2' }}
              className="w-full h-full p-8 flex items-center justify-center text-center text-white font-bold text-xl leading-relaxed shadow-inner"
            >
              <p className="max-w-xs">{currentStory.text}</p>
            </div>
          )}
        </div>

        {/* Invisible Click Zones for tap next / prev on touch */}
        <div
          className="absolute inset-y-16 left-0 w-1/3 z-20 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            goToPrevStory();
          }}
        />
        <div
          className="absolute inset-y-16 right-0 w-2/3 z-20 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            goToNextStory();
          }}
        />

        {/* Bottom Reaction & Reply Bar */}
        <div
          className="relative z-30 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-8 space-y-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick Reaction Emojis */}
          <div className="flex items-center justify-around py-1">
            {['❤️', '🔥', '😂', '😮', '👏', '🎉'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleQuickReaction(emoji)}
                className="text-2xl hover:scale-130 active:scale-110 transition-transform duration-150 cursor-pointer filter drop-shadow-sm"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${currentStory.author.name.split(' ')[0]}...`}
              className="flex-1 bg-white/20 focus:bg-white/30 text-white placeholder:text-white/70 px-4 py-2 rounded-full text-xs md:text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-full transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Reply Sent Toast */}
      {sentToast && (
        <div className="absolute bottom-6 z-50 bg-white/90 dark:bg-zinc-800 text-slate-900 dark:text-white px-4 py-2 rounded-full text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          Reply sent in Messenger!
        </div>
      )}
    </div>
  );
};
