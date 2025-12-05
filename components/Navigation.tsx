import React from 'react';
import { View } from '../types';
import { Home, MessageCircle, BarChart2, BookOpen, Wind } from 'lucide-react';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: View.HOME, label: 'Home', icon: <Home size={24} /> },
    { view: View.CHAT, label: 'Chat', icon: <MessageCircle size={24} /> },
    { view: View.MOOD, label: 'Mood', icon: <BarChart2 size={24} /> },
    { view: View.JOURNAL, label: 'Journal', icon: <BookOpen size={24} /> },
    { view: View.BREATHE, label: 'Breathe', icon: <Wind size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 pb-safe shadow-lg z-50 md:sticky md:top-0 md:h-screen md:w-24 md:flex-col md:border-r md:border-t-0 md:justify-center">
      <div className="flex justify-around items-center h-16 md:h-auto md:flex-col md:space-y-8 md:py-8">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center justify-center w-full h-full md:h-auto md:w-auto transition-colors duration-200 group ${
              currentView === item.view ? 'text-serenity-600' : 'text-gray-400 hover:text-serenity-400'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all ${
               currentView === item.view ? 'bg-serenity-50' : 'bg-transparent group-hover:bg-gray-50'
            }`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;