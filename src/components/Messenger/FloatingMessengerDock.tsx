import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChatWindow } from './ChatWindow';

export const FloatingMessengerDock: React.FC = () => {
  const { activeChatUserIds, closeChatWindow } = useApp();

  if (activeChatUserIds.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-4 sm:right-6 z-40 flex items-end gap-3 pointer-events-none">
      <div className="flex items-end gap-3 pointer-events-auto">
        {activeChatUserIds.map((userId) => (
          <ChatWindow
            key={userId}
            userId={userId}
            onClose={() => closeChatWindow(userId)}
          />
        ))}
      </div>
    </div>
  );
};
