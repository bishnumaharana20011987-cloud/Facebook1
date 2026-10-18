import React, { useState, useEffect, useRef } from 'react';
import { User, Conversation } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Minus,
  Maximize2,
  Send,
  ThumbsUp,
  Image,
  Phone,
  Video,
  Smile,
  MoreVertical,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface ChatWindowProps {
  userId: string;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ userId, onClose }) => {
  const { allUsers, currentUser, conversations, sendMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [callNotice, setCallNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const participant = allUsers.find((u) => u.id === userId) || {
    id: userId,
    name: 'Friend',
    handle: 'friend',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverPhoto: '',
    joinedDate: '',
    friendsCount: 0,
    isOnline: true,
  };

  const conversation = conversations.find((c) => c.participant.id === userId);
  const messages = conversation?.messages || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isMinimized]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(userId, inputText);
    setInputText('');
  };

  const handleSendLike = () => {
    sound.playReactionSound();
    sendMessage(userId, '👍');
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    sound.playPop();
    setCallNotice(`Calling ${participant.name}...`);
    setTimeout(() => {
      setCallNotice(`${participant.name} is currently unavailable.`);
      setTimeout(() => setCallNotice(null), 3000);
    }, 2500);
  };

  if (isMinimized) {
    return (
      <div
        onClick={() => {
          sound.playPop();
          setIsMinimized(false);
        }}
        className="w-48 bg-white dark:bg-zinc-800 rounded-t-xl shadow-xl border border-b-0 border-slate-200 dark:border-zinc-700 px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-700/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            {participant.isOnline && (
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white dark:ring-zinc-800" />
            )}
          </div>
          <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
            {participant.name}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 sm:w-80 h-96 bg-white dark:bg-zinc-900 rounded-t-xl shadow-2xl border border-b-0 border-slate-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-150">
      {/* Chat Window Header */}
      <div className="px-3 py-2 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            {participant.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-900" />
            )}
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
              {participant.name}
            </h4>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 block truncate">
              {participant.isOnline ? 'Active now' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Call & window controls */}
        <div className="flex items-center gap-1 text-slate-500 dark:text-zinc-400">
          <button
            onClick={() => handleStartCall('audio')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full hover:text-blue-600 transition-colors"
            title="Start voice call"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleStartCall('video')}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full hover:text-blue-600 transition-colors"
            title="Start video chat"
          >
            <Video className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full hover:text-red-500 transition-colors"
            title="Close chat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Call Notice Alert if triggered */}
      {callNotice && (
        <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 border-b border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-[11px] font-medium text-center">
          {callNotice}
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-slate-50/50 dark:bg-zinc-950/50">
        {messages.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-14 h-14 rounded-full mx-auto object-cover ring-2 ring-slate-200 dark:ring-zinc-700"
            />
            <h5 className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
              {participant.name}
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              You are connected on SocialBook
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-6 h-6 rounded-full object-cover shrink-0 mb-0.5"
                  />
                )}

                <div
                  className={`max-w-[75%] px-3 py-1.5 rounded-2xl text-xs leading-relaxed break-words shadow-xs ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-200/60 dark:border-zinc-700/60 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Footer */}
      <form
        onSubmit={handleSend}
        className="p-2 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-1.5"
      >
        <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-zinc-800 rounded-full px-3 py-1.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Aa"
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {inputText.trim() ? (
          <button
            type="submit"
            className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSendLike}
            className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-transform active:scale-125 cursor-pointer"
            title="Send Like"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};
