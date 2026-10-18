import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navigation/Navbar';
import { LeftSidebar } from './components/Navigation/LeftSidebar';
import { RightSidebar } from './components/Navigation/RightSidebar';
import { FeedView } from './views/FeedView';
import { WatchView } from './views/WatchView';
import { MarketplaceView } from './views/MarketplaceView';
import { GroupsView } from './views/GroupsView';
import { ProfileView } from './views/ProfileView';
import { SavedView } from './views/SavedView';
import { FriendsView } from './views/FriendsView';
import { StoryViewerModal } from './components/Story/StoryViewerModal';
import { FloatingMessengerDock } from './components/Messenger/FloatingMessengerDock';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#18191A] text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-150">
      <Navbar />

      <main className="flex justify-between w-full max-w-[1920px] mx-auto min-h-[calc(100vh-3.5rem)]">
        {activeTab === 'feed' && (
          <>
            <LeftSidebar />
            <section className="flex-1 min-w-0 overflow-y-auto">
              <FeedView />
            </section>
            <RightSidebar />
          </>
        )}

        {activeTab === 'watch' && (
          <section className="flex-1 min-w-0 overflow-y-auto">
            <WatchView />
          </section>
        )}

        {activeTab === 'marketplace' && (
          <section className="flex-1 min-w-0 overflow-y-auto">
            <MarketplaceView />
          </section>
        )}

        {activeTab === 'groups' && (
          <section className="flex-1 min-w-0 overflow-y-auto">
            <GroupsView />
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="flex-1 min-w-0 overflow-y-auto">
            <ProfileView />
          </section>
        )}

        {activeTab === 'saved' && (
          <section className="flex-1 min-w-0 overflow-y-auto">
            <SavedView />
          </section>
        )}

        {activeTab === 'friends' && (
          <section className="flex-1 min-w-0 overflow-y-auto">
            <FriendsView />
          </section>
        )}
      </main>

      {/* Floating Messenger Dock (Desktop & Mobile) */}
      <FloatingMessengerDock />

      {/* Story Player Modal */}
      <StoryViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
