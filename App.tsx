
import React, { useState } from 'react';
import ColoringBookGenerator from './components/ColoringBookGenerator';
import ChatBot from './components/ChatBot';
import { BrushIcon, ChatIcon } from './components/icons';

type ActiveTab = 'generator' | 'chat';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');

  const getTabClass = (tabName: ActiveTab) => {
    return activeTab === tabName
      ? 'bg-white text-pink-600 shadow-md'
      : 'bg-white/50 text-gray-600 hover:bg-white/80';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 font-sans p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
          Creative Fun Zone
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Generate Coloring Books & Chat with a Friendly Bot!
        </p>
      </header>
      
      <nav className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-white/60 p-2 rounded-full shadow-sm">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-semibold ${getTabClass('generator')}`}
          >
            <BrushIcon className="w-5 h-5" />
            Coloring Book
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-semibold ${getTabClass('chat')}`}
          >
            <ChatIcon className="w-5 h-5" />
            Chat Bot
          </button>
        </div>
      </nav>

      <main>
        {activeTab === 'generator' && <ColoringBookGenerator />}
        {activeTab === 'chat' && <ChatBot />}
      </main>
    </div>
  );
};

export default App;
   