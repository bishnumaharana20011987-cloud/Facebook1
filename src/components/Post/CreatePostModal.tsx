import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Globe,
  Users,
  Lock,
  Image,
  Smile,
  MapPin,
  UserPlus,
  Palette,
  Sparkles,
  Camera,
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'standard' | 'photo' | 'feeling';
}

const BACKGROUND_PRESETS = [
  { id: 'none', label: 'Default', style: '' },
  { id: 'sunset', label: 'Sunset', style: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
  { id: 'ocean', label: 'Ocean', style: 'linear-gradient(135deg, #1877F2 0%, #00C6FF 100%)' },
  { id: 'purple', label: 'Electric', style: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' },
  { id: 'emerald', label: 'Forest', style: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #6ee7b7 100%)' },
  { id: 'darkness', label: 'Obsidian', style: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
];

const FEELING_OPTIONS = [
  { emoji: '😊', text: 'happy' },
  { emoji: '🎉', text: 'celebrating' },
  { emoji: '🏔️', text: 'adventurous' },
  { emoji: '☕', text: 'productive' },
  { emoji: '🥰', text: 'blessed' },
  { emoji: '🚀', text: 'excited' },
  { emoji: '🎧', text: 'listening to music' },
  { emoji: '✈️', text: 'traveling' },
];

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'standard',
}) => {
  const { currentUser, createPost } = useApp();

  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'only_me'>('public');
  const [selectedBackground, setSelectedBackground] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<{ emoji: string; text: string } | null>(null);
  const [location, setLocation] = useState('');

  // Sub-drawers
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFeelingPicker, setShowFeelingPicker] = useState(defaultMode === 'feeling');
  const [showLocationInput, setShowLocationInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;

    createPost({
      content: content.trim(),
      backgroundStyle: selectedBackground || undefined,
      images: images.length > 0 ? images : undefined,
      feeling: selectedFeeling || undefined,
      location: location.trim() || undefined,
      privacy,
    });

    // Reset & close
    setContent('');
    setImages([]);
    setSelectedBackground('');
    setSelectedFeeling(null);
    setLocation('');
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target!.result as string]);
            setSelectedBackground(''); // Clear background if photos added
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const addPresetImage = (url: string) => {
    setImages((prev) => [...prev, url]);
    setSelectedBackground('');
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-5 py-4 border-b border-slate-100 dark:border-zinc-800 text-center">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Create post</h3>
          <button
            onClick={onClose}
            className="absolute right-3.5 top-3.5 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Author & Privacy row */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                  {currentUser.name}
                </span>
                {selectedFeeling && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <span>is</span>
                    <span>{selectedFeeling.emoji}</span>
                    <span className="font-medium text-slate-700 dark:text-zinc-300">
                      {selectedFeeling.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedFeeling(null)}
                      className="text-slate-400 hover:text-slate-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {/* Privacy selector control */}
              <div className="flex items-center gap-1 mt-1">
                <div className="relative inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded-md text-xs font-medium text-slate-700 dark:text-zinc-300">
                  {privacy === 'public' && <Globe className="w-3 h-3 text-slate-500" />}
                  {privacy === 'friends' && <Users className="w-3 h-3 text-slate-500" />}
                  {privacy === 'only_me' && <Lock className="w-3 h-3 text-slate-500" />}
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value as any)}
                    className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="public" className="bg-white dark:bg-zinc-800">Public</option>
                    <option value="friends" className="bg-white dark:bg-zinc-800">Friends</option>
                    <option value="only_me" className="bg-white dark:bg-zinc-800">Only Me</option>
                  </select>
                </div>

                {location && (
                  <span className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                    <MapPin className="w-3 h-3 text-red-500" />
                    <span className="truncate max-w-[120px]">{location}</span>
                    <button
                      type="button"
                      onClick={() => setLocation('')}
                      className="text-slate-400 hover:text-slate-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Text input area or Colored background canvas */}
          {selectedBackground ? (
            <div
              style={{ background: selectedBackground }}
              className="rounded-xl p-6 min-h-[180px] flex items-center justify-center text-center shadow-inner relative"
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
                rows={3}
                className="w-full bg-transparent text-white font-bold text-xl md:text-2xl text-center placeholder:text-white/70 focus:outline-none resize-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSelectedBackground('')}
                className="absolute top-2 right-2 p-1 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
                title="Remove colored background"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
                rows={4}
                className={`w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none resize-none ${
                  content.length < 80 && images.length === 0 ? 'text-lg md:text-xl' : 'text-sm md:text-base'
                }`}
                autoFocus
              />
            </div>
          )}

          {/* Background presets palette */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Palette className="w-4 h-4 text-purple-500" />
              <span>Themes</span>
            </button>

            {showColorPicker && (
              <div className="flex items-center gap-1.5">
                {BACKGROUND_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedBackground(preset.style);
                      if (preset.style) setImages([]); // Clear images if selecting colored card
                    }}
                    style={{ background: preset.style || '#e2e8f0' }}
                    className={`w-6 h-6 rounded-md border-2 transition-transform ${
                      selectedBackground === preset.style
                        ? 'border-blue-600 scale-110 shadow-md'
                        : 'border-white dark:border-zinc-700 hover:scale-105'
                    }`}
                    title={preset.label}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Images preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 dark:bg-zinc-800/40 rounded-xl border border-slate-200 dark:border-zinc-700/60 max-h-56 overflow-y-auto">
              {images.map((img, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden h-28 bg-slate-900">
                  <img src={img} alt="Uploaded preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-white rounded-full hover:bg-black transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Feeling Picker Drawer */}
          {showFeelingPicker && (
            <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  How are you feeling?
                </span>
                <button
                  type="button"
                  onClick={() => setShowFeelingPicker(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FEELING_OPTIONS.map((f, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedFeeling(f);
                      setShowFeelingPicker(false);
                    }}
                    className="p-2 rounded-lg bg-white dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs font-medium text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 border border-slate-200/60 dark:border-zinc-700/60 transition-colors"
                  >
                    <span className="text-lg">{f.emoji}</span>
                    <span className="truncate">{f.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location Drawer */}
          {showLocationInput && (
            <div className="p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  Add Location
                </span>
                <button
                  type="button"
                  onClick={() => setShowLocationInput(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you? (e.g. San Francisco, California)"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {['San Francisco, CA', 'New York, NY', 'Tokyo, Japan', 'London, UK'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setLocation(city);
                      setShowLocationInput(false);
                    }}
                    className="text-[11px] px-2 py-1 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to your post toolbar */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Add to your post
            </span>

            <div className="flex items-center gap-1">
              {/* Photo Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-emerald-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                title="Photo/video"
              >
                <Image className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Sample Photo picker */}
              <button
                type="button"
                onClick={() => addPresetImage(SAMPLE_PHOTO_PRESETS[images.length % SAMPLE_PHOTO_PRESETS.length])}
                className="p-2 text-cyan-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                title="Add sample photography"
              >
                <Sparkles className="w-5 h-5" />
              </button>

              {/* Tag Friends / People */}
              <button
                type="button"
                onClick={() => setShowFeelingPicker(!showFeelingPicker)}
                className="p-2 text-amber-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                title="Feeling/activity"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Location */}
              <button
                type="button"
                onClick={() => setShowLocationInput(!showLocationInput)}
                className="p-2 text-rose-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                title="Check in"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!content.trim() && images.length === 0}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};
