import React, { useState, useRef } from 'react';
import { Post, ReactionType } from '../../types';
import { useApp } from '../../context/AppContext';
import { REACTION_CONFIGS, ReactionPicker } from '../Reactions/ReactionPicker';
import { ReactionSummaryModal } from '../Reactions/ReactionSummaryModal';
import { ShareModal } from './ShareModal';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Trash2,
  Globe,
  Users,
  Lock,
  Smile,
  Image,
  Send,
  Heart,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    currentUser,
    reactToPost,
    removeReaction,
    addComment,
    likeComment,
    toggleSavePost,
    deletePost,
    navigateToProfile,
  } = useApp();

  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current user reacted
  const userReaction = post.reactions.find((r) => r.userId === currentUser.id);
  const isSaved = post.savedBy?.includes(currentUser.id);
  const isAuthor = post.author.id === currentUser.id;

  // Group reactions for summary pills
  const topReactions = Array.from(new Set(post.reactions.map((r) => r.type))).slice(0, 3);

  const handleMouseEnterLike = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowReactionPicker(true);
    }, 280);
  };

  const handleMouseLeaveLike = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleReactionSelect = (type: ReactionType) => {
    reactToPost(post.id, type);
    setShowReactionPicker(false);
  };

  const handleLikeClick = () => {
    if (userReaction) {
      removeReaction(post.id);
    } else {
      reactToPost(post.id, 'like');
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() && !commentImage) return;
    addComment(post.id, commentText, commentImage || undefined);
    setCommentText('');
    setCommentImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCommentImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <article className="bg-white dark:bg-zinc-900 rounded-xl shadow-xs border border-slate-200/80 dark:border-zinc-800 mb-4 overflow-hidden">
        {/* Post Header */}
        <div className="p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateToProfile(post.author)}
              className="relative group cursor-pointer focus:outline-none"
            >
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
              />
            </button>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => navigateToProfile(post.author)}
                  className="font-semibold text-sm text-slate-900 dark:text-white hover:underline cursor-pointer"
                >
                  {post.author.name}
                </button>
                {post.author.verified && (
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-blue-600 text-white rounded-full text-[9px] font-bold">
                    ✓
                  </span>
                )}

                {post.groupName && (
                  <>
                    <span className="text-xs text-slate-400">in</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                      {post.groupName}
                    </span>
                  </>
                )}

                {post.feeling && (
                  <span className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                    <span>is</span>
                    <span>{post.feeling.emoji}</span>
                    <span className="font-medium text-slate-700 dark:text-zinc-300">
                      {post.feeling.text}
                    </span>
                  </span>
                )}
              </div>

              {/* Metadata row: Clean inline text with separators (Zero-Pill compliant) */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                <span>{post.createdAt}</span>
                {post.location && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="hover:underline cursor-pointer">{post.location}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                {post.privacy === 'public' && <Globe className="w-3 h-3" />}
                {post.privacy === 'friends' && <Users className="w-3 h-3" />}
                {post.privacy === 'only_me' && <Lock className="w-3 h-3" />}
              </div>
            </div>
          </div>

          {/* Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              aria-label="Post options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-slate-200 dark:border-zinc-700 py-1.5 z-30 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => {
                    toggleSavePost(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2.5 transition-colors"
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-blue-600" />
                      <span>Unsave Post</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Save Post</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    sound.playPop();
                    setShowMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2.5 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Copy Link</span>
                </button>

                {isAuthor && (
                  <button
                    onClick={() => {
                      deletePost(post.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Post</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        {post.backgroundStyle ? (
          <div
            style={{ background: post.backgroundStyle }}
            className="p-8 min-h-[220px] flex items-center justify-center text-center text-white font-bold text-xl md:text-2xl shadow-inner select-none px-6"
          >
            <p className="drop-shadow-sm max-w-lg leading-relaxed">{post.content}</p>
          </div>
        ) : (
          <div className="px-4 pb-3">
            <p className="text-sm md:text-[15px] text-slate-900 dark:text-zinc-100 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>
        )}

        {/* Images Grid */}
        {post.images && post.images.length > 0 && (
          <div className="mt-1">
            {post.images.length === 1 && (
              <div
                className="cursor-pointer max-h-[500px] overflow-hidden bg-slate-950 flex items-center justify-center"
                onClick={() => setLightboxImage(post.images![0])}
              >
                <img
                  src={post.images[0]}
                  alt="Post visual"
                  className="w-full h-auto object-cover max-h-[500px] hover:opacity-95 transition-opacity"
                />
              </div>
            )}

            {post.images.length === 2 && (
              <div className="grid grid-cols-2 gap-1 max-h-[420px] overflow-hidden">
                {post.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="h-72 cursor-pointer bg-slate-900 overflow-hidden"
                    onClick={() => setLightboxImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            {post.images.length >= 3 && (
              <div className="grid grid-cols-2 gap-1 max-h-[460px] overflow-hidden">
                <div
                  className="h-80 cursor-pointer bg-slate-900 overflow-hidden"
                  onClick={() => setLightboxImage(post.images![0])}
                >
                  <img
                    src={post.images[0]}
                    alt="Photo 1"
                    className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                  />
                </div>
                <div className="grid grid-rows-2 gap-1 h-80">
                  <div
                    className="h-40 cursor-pointer bg-slate-900 overflow-hidden"
                    onClick={() => setLightboxImage(post.images![1])}
                  >
                    <img
                      src={post.images[1]}
                      alt="Photo 2"
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                  <div
                    className="relative h-40 cursor-pointer bg-slate-900 overflow-hidden"
                    onClick={() => setLightboxImage(post.images![2])}
                  >
                    <img
                      src={post.images[2]}
                      alt="Photo 3"
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                    />
                    {post.images.length > 3 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl backdrop-blur-xs">
                        +{post.images.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reaction & Comment Stats Row */}
        <div className="px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
          {/* Reaction icons stack */}
          {post.reactions.length > 0 ? (
            <button
              onClick={() => setShowSummaryModal(true)}
              className="flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <div className="flex items-center -space-x-1">
                {topReactions.map((type) => {
                  const cfg = REACTION_CONFIGS[type];
                  return (
                    <span
                      key={type}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-50 dark:bg-zinc-800 ring-2 ring-white dark:ring-zinc-900 text-xs"
                    >
                      {cfg.emoji}
                    </span>
                  );
                })}
              </div>
              <span className="font-medium">
                {userReaction
                  ? post.reactions.length === 1
                    ? 'You'
                    : `You and ${post.reactions.length - 1} others`
                  : post.reactions.length}
              </span>
            </button>
          ) : (
            <span className="text-slate-400">Be the first to react</span>
          )}

          {/* Comment & Share counts */}
          <div className="flex items-center gap-3">
            {post.comments.length > 0 && (
              <button
                onClick={() => commentInputRef.current?.focus()}
                className="hover:underline cursor-pointer"
              >
                {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
              </button>
            )}
            {post.sharesCount > 0 && (
              <span>
                {post.sharesCount} {post.sharesCount === 1 ? 'share' : 'shares'}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="px-2 py-1 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-zinc-300">
          {/* Like / React button */}
          <div
            className="relative flex-1"
            onMouseEnter={handleMouseEnterLike}
            onMouseLeave={handleMouseLeaveLike}
          >
            {showReactionPicker && (
              <ReactionPicker
                onSelect={handleReactionSelect}
                onClose={() => setShowReactionPicker(false)}
              />
            )}

            <button
              onClick={handleLikeClick}
              className={`w-full py-2 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                userReaction ? REACTION_CONFIGS[userReaction.type].color : ''
              }`}
            >
              {userReaction ? (
                <>
                  <span className="text-base">{REACTION_CONFIGS[userReaction.type].emoji}</span>
                  <span>{REACTION_CONFIGS[userReaction.type].label}</span>
                </>
              ) : (
                <>
                  <ThumbsUp className="w-4 h-4" />
                  <span>Like</span>
                </>
              )}
            </button>
          </div>

          {/* Comment button */}
          <button
            onClick={() => commentInputRef.current?.focus()}
            className="flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Comment</span>
          </button>

          {/* Share button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="p-4 space-y-3 bg-slate-50/50 dark:bg-zinc-900/60">
          {/* Existing Comments list */}
          {post.comments.map((comment) => {
            const isCommentLiked = comment.likes.includes(currentUser.id);
            return (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <button
                    onClick={() => navigateToProfile(comment.author)}
                    className="shrink-0 cursor-pointer"
                  >
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>

                  <div className="flex-1">
                    <div className="bg-slate-100 dark:bg-zinc-800 rounded-2xl px-3.5 py-2 inline-block max-w-[92%]">
                      <button
                        onClick={() => navigateToProfile(comment.author)}
                        className="text-xs font-semibold text-slate-900 dark:text-white hover:underline block text-left"
                      >
                        {comment.author.name}
                      </button>
                      <p className="text-xs text-slate-800 dark:text-zinc-200 mt-0.5 leading-relaxed">
                        {comment.content}
                      </p>
                      {comment.mediaUrl && (
                        <img
                          src={comment.mediaUrl}
                          alt="Comment attachment"
                          className="mt-2 rounded-lg max-h-48 object-cover cursor-pointer"
                          onClick={() => setLightboxImage(comment.mediaUrl!)}
                        />
                      )}
                    </div>

                    {/* Comment sub-actions */}
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-1 ml-2">
                      <button
                        onClick={() => likeComment(post.id, comment.id)}
                        className={`hover:underline cursor-pointer ${
                          isCommentLiked ? 'text-blue-600 dark:text-blue-400' : ''
                        }`}
                      >
                        Like {comment.likes.length > 0 && `(${comment.likes.length})`}
                      </button>
                      <button
                        onClick={() => setReplyingToCommentId(comment.id)}
                        className="hover:underline cursor-pointer"
                      >
                        Reply
                      </button>
                      <span className="font-normal text-slate-400">{comment.createdAt}</span>
                    </div>

                    {/* Replies if any */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-2 space-y-2 pl-4 border-l-2 border-slate-200 dark:border-zinc-700">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-2">
                            <img
                              src={reply.author.avatar}
                              alt={reply.author.name}
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                            <div>
                              <div className="bg-slate-100 dark:bg-zinc-800 rounded-2xl px-3 py-1.5 inline-block">
                                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                                  {reply.author.name}
                                </span>
                                <span className="text-xs text-slate-800 dark:text-zinc-200">
                                  {reply.content}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 ml-2 block mt-0.5">
                                {reply.createdAt}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* New Comment Input Box */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="relative flex-1 flex items-center bg-slate-100 dark:bg-zinc-800 rounded-full px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                ref={commentInputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Write a comment as ${currentUser.name.split(' ')[0]}...`}
                className="w-full bg-transparent text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-zinc-400 focus:outline-none"
              />

              <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 hover:text-slate-800 dark:hover:text-white rounded-full transition-colors cursor-pointer"
                  title="Attach photo"
                >
                  <Image className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  type="submit"
                  disabled={!commentText.trim() && !commentImage}
                  className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Comment Image preview if selected */}
          {commentImage && (
            <div className="relative inline-block ml-10 mt-2">
              <img
                src={commentImage}
                alt="Selected preview"
                className="h-20 w-auto rounded-lg object-cover ring-1 ring-slate-300 dark:ring-zinc-700"
              />
              <button
                type="button"
                onClick={() => setCommentImage(null)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </article>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Expanded view"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* Summary modal */}
      <ReactionSummaryModal
        reactions={post.reactions}
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
      />

      {/* Share modal */}
      <ShareModal
        post={post}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
};
