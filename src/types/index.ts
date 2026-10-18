export type ReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverPhoto: string;
  bio?: string;
  work?: string;
  education?: string;
  livesIn?: string;
  from?: string;
  relationship?: string;
  joinedDate: string;
  verified?: boolean;
  friendsCount: number;
  isOnline?: boolean;
  mutualFriends?: number;
}

export interface PostReaction {
  userId: string;
  userName: string;
  userAvatar: string;
  type: ReactionType;
  timestamp: number;
}

export interface CommentReply {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  likes: string[];
  replies?: CommentReply[];
}

export interface Post {
  id: string;
  author: User;
  content: string;
  backgroundStyle?: string;
  images?: string[];
  videoUrl?: string;
  feeling?: {
    emoji: string;
    text: string;
  };
  location?: string;
  privacy: 'public' | 'friends' | 'only_me';
  createdAt: string;
  reactions: PostReaction[];
  comments: Comment[];
  sharesCount: number;
  savedBy: string[];
  tags?: string[];
  groupId?: string;
  groupName?: string;
}

export interface Story {
  id: string;
  author: User;
  mediaUrl?: string;
  text?: string;
  background?: string;
  createdAt: string;
  viewsCount: number;
  viewed?: boolean;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  category: string;
  condition: 'Brand New' | 'Like New' | 'Good' | 'Fair';
  description: string;
  images: string[];
  seller: User;
  createdAt: string;
  saved?: boolean;
}

export interface Group {
  id: string;
  name: string;
  category: string;
  privacy: 'Public' | 'Private';
  coverImage: string;
  avatar: string;
  memberCount: number;
  description: string;
  isJoined?: boolean;
  recentActivity: string;
}

export interface NotificationItem {
  id: string;
  type: 'reaction' | 'comment' | 'friend_request' | 'story' | 'marketplace' | 'group' | 'birthday';
  actor: User;
  text: string;
  time: string;
  isRead: boolean;
  targetId?: string;
  targetType?: 'post' | 'story' | 'marketplace' | 'group';
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  mediaUrl?: string;
  read?: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  messages: Message[];
  unreadCount: number;
  lastUpdated: number;
}

export interface FriendRequest {
  id: string;
  user: User;
  mutualFriends: number;
  time: string;
}

export type MainTab = 'feed' | 'watch' | 'marketplace' | 'groups' | 'profile' | 'saved' | 'friends';
