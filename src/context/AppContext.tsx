import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Post,
  Story,
  MarketplaceItem,
  Group,
  NotificationItem,
  Conversation,
  FriendRequest,
  ReactionType,
  MainTab,
} from '../types';
import {
  CURRENT_USER,
  DEMO_USERS,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_MARKETPLACE,
  INITIAL_GROUPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_FRIEND_REQUESTS,
  INITIAL_CONVERSATIONS,
} from '../data/initialData';
import { sound } from '../utils/sound';

interface AppContextType {
  currentUser: User;
  switchCurrentUser: (userId: string) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  allUsers: User[];
  
  posts: Post[];
  createPost: (postData: {
    content: string;
    backgroundStyle?: string;
    images?: string[];
    feeling?: { emoji: string; text: string };
    location?: string;
    privacy: 'public' | 'friends' | 'only_me';
    groupId?: string;
    groupName?: string;
  }) => void;
  deletePost: (postId: string) => void;
  reactToPost: (postId: string, reaction: ReactionType) => void;
  removeReaction: (postId: string) => void;
  addComment: (postId: string, content: string, mediaUrl?: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  sharePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;

  stories: Story[];
  createStory: (story: { mediaUrl?: string; text?: string; background?: string }) => void;
  markStoryViewed: (storyId: string) => void;

  marketplaceItems: MarketplaceItem[];
  createMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'seller' | 'createdAt'>) => void;
  toggleSaveMarketplaceItem: (itemId: string) => void;

  groups: Group[];
  toggleJoinGroup: (groupId: string) => void;
  createGroup: (group: { name: string; category: string; privacy: 'Public' | 'Private'; description: string; coverImage?: string }) => void;

  friendRequests: FriendRequest[];
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  conversations: Conversation[];
  activeChatUserIds: string[];
  openChatWithUser: (user: User) => void;
  closeChatWindow: (userId: string) => void;
  sendMessage: (recipientId: string, text: string) => void;

  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  viewingProfileUser: User;
  navigateToProfile: (user: User) => void;

  activeStoryModalIndex: number | null;
  setActiveStoryModalIndex: (index: number | null) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'socialbook_current_user_v1',
  POSTS: 'socialbook_posts_v1',
  STORIES: 'socialbook_stories_v1',
  MARKETPLACE: 'socialbook_market_v1',
  GROUPS: 'socialbook_groups_v1',
  NOTIFICATIONS: 'socialbook_notifs_v1',
  FRIEND_REQUESTS: 'socialbook_fr_v1',
  CONVERSATIONS: 'socialbook_conv_v1',
  THEME: 'socialbook_theme_v1',
  SOUND: 'socialbook_sound_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
    return saved !== null ? saved === 'true' : true;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<MainTab>('feed');
  const [searchQuery, setSearchQuery] = useState('');

  // Current user & all users
  const [allUsers] = useState<User[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return CURRENT_USER;
  });

  // Profile currently being viewed
  const [viewingProfileUser, setViewingProfileUser] = useState<User>(currentUser);

  // Posts
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_POSTS;
  });

  // Stories
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORIES);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_STORIES;
  });
  const [activeStoryModalIndex, setActiveStoryModalIndex] = useState<number | null>(null);

  // Marketplace
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MARKETPLACE);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_MARKETPLACE;
  });

  // Groups
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROUPS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_GROUPS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Friend Requests
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FRIEND_REQUESTS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_FRIEND_REQUESTS;
  });

  // Conversations & Chat Windows
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_CONVERSATIONS;
  });
  const [activeChatUserIds, setActiveChatUserIds] = useState<string[]>([]);

  // Apply theme to HTML root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Sync sound settings
  useEffect(() => {
    sound.enabled = soundEnabled;
    localStorage.setItem(STORAGE_KEYS.SOUND, String(soundEnabled));
  }, [soundEnabled]);

  // Persist states
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MARKETPLACE, JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FRIEND_REQUESTS, JSON.stringify(friendRequests));
  }, [friendRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  // Toggle Theme
  const toggleTheme = () => {
    sound.playPop();
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  // Switch current logged in profile
  const switchCurrentUser = (userId: string) => {
    const found = allUsers.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setViewingProfileUser(found);
      sound.playPop();
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    setViewingProfileUser(prev => (prev.id === currentUser.id ? { ...prev, ...updates } : prev));
  };

  const navigateToProfile = (user: User) => {
    setViewingProfileUser(user);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Post Actions
  const createPost = (postData: {
    content: string;
    backgroundStyle?: string;
    images?: string[];
    feeling?: { emoji: string; text: string };
    location?: string;
    privacy: 'public' | 'friends' | 'only_me';
    groupId?: string;
    groupName?: string;
  }) => {
    sound.playPop();
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      content: postData.content,
      backgroundStyle: postData.backgroundStyle,
      images: postData.images,
      feeling: postData.feeling,
      location: postData.location,
      privacy: postData.privacy,
      groupId: postData.groupId,
      groupName: postData.groupName,
      createdAt: 'Just now',
      reactions: [],
      comments: [],
      sharesCount: 0,
      savedBy: [],
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const deletePost = (postId: string) => {
    sound.playPop();
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const reactToPost = (postId: string, reaction: ReactionType) => {
    sound.playReactionSound();
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const filtered = p.reactions.filter(r => r.userId !== currentUser.id);
        const newReaction = {
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          type: reaction,
          timestamp: Date.now(),
        };
        return {
          ...p,
          reactions: [...filtered, newReaction],
        };
      })
    );
  };

  const removeReaction = (postId: string) => {
    sound.playPop();
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          reactions: p.reactions.filter(r => r.userId !== currentUser.id),
        };
      })
    );
  };

  const addComment = (postId: string, content: string, mediaUrl?: string) => {
    if (!content.trim() && !mediaUrl) return;
    sound.playPop();
    const newComment = {
      id: `c_${Date.now()}`,
      postId,
      author: currentUser,
      content: content.trim(),
      mediaUrl,
      createdAt: 'Just now',
      likes: [],
      replies: [],
    };
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      })
    );
  };

  const likeComment = (postId: string, commentId: string) => {
    sound.playReactionSound();
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id !== commentId) return c;
            const alreadyLiked = c.likes.includes(currentUser.id);
            return {
              ...c,
              likes: alreadyLiked
                ? c.likes.filter(id => id !== currentUser.id)
                : [...c.likes, currentUser.id],
            };
          }),
        };
      })
    );
  };

  const sharePost = (postId: string) => {
    sound.playPop();
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        return { ...p, sharesCount: p.sharesCount + 1 };
      })
    );
  };

  const toggleSavePost = (postId: string) => {
    sound.playPop();
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const isSaved = p.savedBy?.includes(currentUser.id);
        const updatedSaved = isSaved
          ? p.savedBy.filter(id => id !== currentUser.id)
          : [...(p.savedBy || []), currentUser.id];
        return { ...p, savedBy: updatedSaved };
      })
    );
  };

  // Stories
  const createStory = (storyData: { mediaUrl?: string; text?: string; background?: string }) => {
    sound.playPop();
    const newStory: Story = {
      id: `story_${Date.now()}`,
      author: currentUser,
      mediaUrl: storyData.mediaUrl,
      text: storyData.text,
      background: storyData.background,
      createdAt: 'Just now',
      viewsCount: 1,
      viewed: false,
    };
    setStories(prev => [newStory, ...prev]);
  };

  const markStoryViewed = (storyId: string) => {
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, viewed: true, viewsCount: s.viewsCount + 1 } : s))
    );
  };

  // Marketplace
  const createMarketplaceItem = (itemData: Omit<MarketplaceItem, 'id' | 'seller' | 'createdAt'>) => {
    sound.playPop();
    const newItem: MarketplaceItem = {
      ...itemData,
      id: `market_${Date.now()}`,
      seller: currentUser,
      createdAt: 'Just now',
      saved: false,
    };
    setMarketplaceItems(prev => [newItem, ...prev]);
  };

  const toggleSaveMarketplaceItem = (itemId: string) => {
    sound.playPop();
    setMarketplaceItems(prev =>
      prev.map(m => (m.id === itemId ? { ...m, saved: !m.saved } : m))
    );
  };

  // Groups
  const toggleJoinGroup = (groupId: string) => {
    sound.playPop();
    setGroups(prev =>
      prev.map(g => {
        if (g.id !== groupId) return g;
        const joined = !g.isJoined;
        return {
          ...g,
          isJoined: joined,
          memberCount: joined ? g.memberCount + 1 : g.memberCount - 1,
        };
      })
    );
  };

  const createGroup = (data: { name: string; category: string; privacy: 'Public' | 'Private'; description: string; coverImage?: string }) => {
    sound.playPop();
    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name: data.name,
      category: data.category,
      privacy: data.privacy,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
      memberCount: 1,
      description: data.description,
      isJoined: true,
      recentActivity: 'Created today',
    };
    setGroups(prev => [newGroup, ...prev]);
  };

  // Friend requests
  const acceptFriendRequest = (requestId: string) => {
    sound.playPop();
    const req = friendRequests.find(r => r.id === requestId);
    if (req) {
      setCurrentUser(prev => ({ ...prev, friendsCount: prev.friendsCount + 1 }));
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
      // Notify
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        type: 'friend_request',
        actor: req.user,
        text: 'is now connected with you.',
        time: 'Just now',
        isRead: false,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const declineFriendRequest = (requestId: string) => {
    sound.playPop();
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    sound.playPop();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Messaging & Floating Chat Heads
  const openChatWithUser = (user: User) => {
    sound.playPop();
    if (!activeChatUserIds.includes(user.id)) {
      // Keep max 3 floating chat docks open at once on desktop
      const updated = [...activeChatUserIds, user.id].slice(-3);
      setActiveChatUserIds(updated);
    }
    // Also mark conversation as read
    setConversations(prev =>
      prev.map(c => (c.participant.id === user.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const closeChatWindow = (userId: string) => {
    sound.playPop();
    setActiveChatUserIds(prev => prev.filter(id => id !== userId));
  };

  const sendMessage = (recipientId: string, text: string) => {
    if (!text.trim()) return;
    sound.playPop();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp,
      read: true,
    };

    setConversations(prev => {
      const existing = prev.find(c => c.participant.id === recipientId);
      if (existing) {
        return prev.map(c => {
          if (c.participant.id !== recipientId) return c;
          return {
            ...c,
            messages: [...c.messages, newMessage],
            lastUpdated: Date.now(),
          };
        });
      } else {
        const participant = allUsers.find(u => u.id === recipientId) || {
          id: recipientId,
          name: 'Contact',
          handle: 'contact',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          coverPhoto: '',
          joinedDate: '',
          friendsCount: 0,
        };
        const newConv: Conversation = {
          id: `conv_${recipientId}`,
          participant,
          messages: [newMessage],
          unreadCount: 0,
          lastUpdated: Date.now(),
        };
        return [newConv, ...prev];
      }
    });

    // Auto-reply simulation for dynamic realism!
    setTimeout(() => {
      const recipient = allUsers.find(u => u.id === recipientId);
      if (!recipient) return;
      const responses = [
        "Sounds awesome! Let's catch up more on this soon. 👍",
        "Haha totally agree with that!",
        "Thanks for sending Alex! Really appreciate you sharing.",
        "Got it! I'm just wrapping up some work right now, talk in a bit!",
        "Love that idea! 🚀",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const replyMsg = {
        id: `msg_reply_${Date.now()}`,
        senderId: recipientId,
        text: randomResponse,
        timestamp: replyTime,
        read: false,
      };

      setConversations(cList =>
        cList.map(c => {
          if (c.participant.id !== recipientId) return c;
          return {
            ...c,
            messages: [...c.messages, replyMsg],
            lastUpdated: Date.now(),
          };
        })
      );
      sound.playMessageSound();
    }, 1800);
  };

  const resetToDefault = () => {
    localStorage.clear();
    setCurrentUser(CURRENT_USER);
    setViewingProfileUser(CURRENT_USER);
    setPosts(INITIAL_POSTS);
    setStories(INITIAL_STORIES);
    setMarketplaceItems(INITIAL_MARKETPLACE);
    setGroups(INITIAL_GROUPS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setFriendRequests(INITIAL_FRIEND_REQUESTS);
    setConversations(INITIAL_CONVERSATIONS);
    setActiveChatUserIds([]);
    setTheme('light');
    setSoundEnabled(true);
    sound.playPop();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchCurrentUser,
        updateCurrentUser,
        allUsers,
        posts,
        createPost,
        deletePost,
        reactToPost,
        removeReaction,
        addComment,
        likeComment,
        sharePost,
        toggleSavePost,
        stories,
        createStory,
        markStoryViewed,
        marketplaceItems,
        createMarketplaceItem,
        toggleSaveMarketplaceItem,
        groups,
        toggleJoinGroup,
        createGroup,
        friendRequests,
        acceptFriendRequest,
        declineFriendRequest,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        conversations,
        activeChatUserIds,
        openChatWithUser,
        closeChatWindow,
        sendMessage,
        activeTab,
        setActiveTab,
        viewingProfileUser,
        navigateToProfile,
        activeStoryModalIndex,
        setActiveStoryModalIndex,
        theme,
        toggleTheme,
        soundEnabled,
        toggleSound,
        searchQuery,
        setSearchQuery,
        resetToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
