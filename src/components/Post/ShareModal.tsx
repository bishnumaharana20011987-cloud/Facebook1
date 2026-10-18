import React, { useState } from 'react';
import { Post } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Share2, Link2, Send, Check, Users } from 'lucide-react';
import { sound } from '../../utils/sound';

interface ShareModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ post, isOpen, onClose }) => {
  const { createPost, sharePost, allUsers, sendMessage, openChatWithUser } = useApp();
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [sentFriendIds, setSentFriendIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleShareToFeed = () => {
    createPost({
      content: commentText.trim()
        ? `${commentText.trim()}\n\nShared post from ${post.author.name}:\n"${post.content}"`
        : `Shared post from ${post.author.name}:\n"${post.content}"`,
      images: post.images,
      privacy: 'public',
    });
    sharePost(post.id);
    onClose();
  };

  const handleCopyLink = () => {
    sound.playPop();
    const url = `${window.location.origin}#post_${post.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToFriend = (friendId: string) => {
    const friend = allUsers.find((u) => u.id === friendId);
    if (!friend) return;
    sendMessage(
      friendId,
      `Check out this post from ${post.author.name}: "${post.content.slice(0, 100)}..."`
    );
    openChatWithUser(friend);
    setSentFriendIds((prev) => [...prev, friendId]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Share Post</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Share to Feed option */}
          <div className="space-y-3">
            <textarea
              placeholder="Say something about this..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none"
            />

            {/* Post snapshot preview */}
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-200/80 dark:border-zinc-700/60 flex items-start gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {post.author.name}
                  </h4>
                  <span className="text-[11px] text-slate-500">· {post.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 mt-0.5">
                  {post.content}
                </p>
              </div>
            </div>

            <button
              onClick={handleShareToFeed}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to Feed Now</span>
            </button>
          </div>

          <hr className="border-slate-100 dark:border-zinc-800" />

          {/* Quick actions */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Send in Messenger
            </h4>
            <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
              {allUsers.slice(1, 6).map((friend) => {
                const isSent = sentFriendIds.includes(friend.id);
                return (
                  <button
                    key={friend.id}
                    onClick={() => handleSendToFriend(friend.id)}
                    disabled={isSent}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0 group"
                  >
                    <div className="relative">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500"
                      />
                      {isSent && (
                        <div className="absolute inset-0 bg-emerald-600/80 rounded-full flex items-center justify-center text-white">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 dark:text-zinc-300 max-w-[64px] truncate">
                      {friend.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg flex items-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
