import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Image, Type, Palette, Sparkles } from 'lucide-react';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORY_BACKGROUNDS = [
  'linear-gradient(135deg, #1877F2 0%, #00C6FF 100%)',
  'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #059669 0%, #10b981 100%)',
  'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
  'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
];

const PRESET_STORY_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, createStory } = useApp();
  const [mode, setMode] = useState<'photo' | 'text'>('photo');
  const [text, setText] = useState('');
  const [selectedBg, setSelectedBg] = useState(STORY_BACKGROUNDS[0]);
  const [mediaUrl, setMediaUrl] = useState<string | null>(PRESET_STORY_IMAGES[0]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleShare = () => {
    if (mode === 'photo' && !mediaUrl) return;
    if (mode === 'text' && !text.trim()) return;

    createStory({
      mediaUrl: mode === 'photo' ? mediaUrl || undefined : undefined,
      text: text.trim() || undefined,
      background: mode === 'text' ? selectedBg : undefined,
    });

    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col md:flex-row h-[560px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Control Panel */}
        <div className="w-full md:w-72 p-5 border-b md:border-b-0 md:border-r border-slate-100 dark:border-zinc-800 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Your Story</h3>
              <button
                onClick={onClose}
                className="md:hidden p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode selection buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('photo')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  mode === 'photo'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('text')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  mode === 'text'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Type className="w-4 h-4" />
                <span>Text</span>
              </button>
            </div>

            {/* Mode inputs */}
            {mode === 'photo' ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Image className="w-4 h-4 text-blue-500" />
                  <span>Upload Local Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Or pick sample:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {PRESET_STORY_IMAGES.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMediaUrl(url)}
                      className={`h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-transform ${
                        mediaUrl === url ? 'border-blue-500 scale-102' : 'border-transparent'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add text to photo..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">
                    Story Text
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing..."
                    rows={4}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1.5">
                    Background Gradient
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {STORY_BACKGROUNDS.map((bg, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedBg(bg)}
                        style={{ background: bg }}
                        className={`h-10 rounded-lg border-2 transition-transform ${
                          selectedBg === bg ? 'border-white ring-2 ring-blue-500 scale-105' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleShare}
              disabled={(mode === 'photo' && !mediaUrl) || (mode === 'text' && !text.trim())}
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
            >
              Share to story
            </button>
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="flex-1 bg-slate-100 dark:bg-zinc-950 p-6 flex flex-col items-center justify-center relative">
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            Preview
          </span>

          {/* Phone-like Story Canvas */}
          <div className="w-64 h-[440px] rounded-2xl shadow-2xl overflow-hidden relative border border-slate-300/40 dark:border-zinc-800 select-none">
            {mode === 'photo' && mediaUrl ? (
              <div className="w-full h-full relative">
                <img src={mediaUrl} alt="Story visual" className="w-full h-full object-cover" />
                {text && (
                  <div className="absolute inset-x-4 bottom-12 p-3 bg-black/60 backdrop-blur-xs rounded-xl text-white text-center text-xs font-semibold">
                    {text}
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{ background: selectedBg }}
                className="w-full h-full p-6 flex items-center justify-center text-center text-white font-bold text-lg leading-relaxed"
              >
                {text || 'Your story text will look like this...'}
              </div>
            )}

            {/* Author header snapshot */}
            <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-10 bg-black/30 backdrop-blur-xs p-1.5 rounded-full text-white">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500"
              />
              <span className="text-xs font-semibold truncate">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
