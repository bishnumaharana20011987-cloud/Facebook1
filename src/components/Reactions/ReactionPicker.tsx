import React from 'react';
import { ReactionType } from '../../types';

export interface ReactionConfig {
  type: ReactionType;
  label: string;
  emoji: string;
  color: string;
  iconBg: string;
}

export const REACTION_CONFIGS: Record<ReactionType, ReactionConfig> = {
  like: {
    type: 'like',
    label: 'Like',
    emoji: '👍',
    color: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-600',
  },
  love: {
    type: 'love',
    label: 'Love',
    emoji: '❤️',
    color: 'text-red-500',
    iconBg: 'bg-red-500',
  },
  care: {
    type: 'care',
    label: 'Care',
    emoji: '🥰',
    color: 'text-amber-500',
    iconBg: 'bg-amber-400',
  },
  haha: {
    type: 'haha',
    label: 'Haha',
    emoji: '😆',
    color: 'text-yellow-500',
    iconBg: 'bg-yellow-400',
  },
  wow: {
    type: 'wow',
    label: 'Wow',
    emoji: '😮',
    color: 'text-amber-500',
    iconBg: 'bg-amber-400',
  },
  sad: {
    type: 'sad',
    label: 'Sad',
    emoji: '😢',
    color: 'text-amber-600',
    iconBg: 'bg-yellow-500',
  },
  angry: {
    type: 'angry',
    label: 'Angry',
    emoji: '😡',
    color: 'text-orange-600',
    iconBg: 'bg-orange-500',
  },
};

interface ReactionPickerProps {
  onSelect: (type: ReactionType) => void;
  onClose?: () => void;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect, onClose }) => {
  return (
    <div
      className="absolute bottom-full left-0 mb-2.5 z-40 flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-zinc-800 rounded-full shadow-xl border border-slate-200/80 dark:border-zinc-700 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
      onMouseLeave={onClose}
    >
      {(Object.keys(REACTION_CONFIGS) as ReactionType[]).map((type) => {
        const item = REACTION_CONFIGS[type];
        return (
          <button
            key={type}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(type);
            }}
            className="group relative flex flex-col items-center justify-center p-1 hover:-translate-y-2 hover:scale-135 transition-all duration-200 active:scale-110 focus:outline-none"
            aria-label={item.label}
          >
            <span className="text-2xl filter drop-shadow-sm transition-transform duration-200">
              {item.emoji}
            </span>
            <span className="pointer-events-none absolute -top-8 px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-sm">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
