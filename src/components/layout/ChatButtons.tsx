import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageSquare, Bot, X } from 'lucide-react';
import ChatModalAI from './chat/ChatModalAI';
import ChatModalStaff from './chat/ChatModalStaff';

export default function ChatButtons() {
  const [activeChat, setActiveChat] = useState<'ai' | 'staff' | null>(null);

  const toggleChat = (type: 'ai' | 'staff') => {
    if (activeChat === type) {
      setActiveChat(null);
    } else {
      setActiveChat(type);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* CHAT WINDOWS */}
      <AnimatePresence>
        {activeChat === 'ai' && (
          <ChatModalAI onClose={() => setActiveChat(null)} />
        )}

        {activeChat === 'staff' && (
          <ChatModalStaff onClose={() => setActiveChat(null)} />
        )}
      </AnimatePresence>

      {/* FLOATING ACTION BUTTONS */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        {/* AI Chatbot Button */}
        <div className="relative flex items-center justify-end group">
          <span className="absolute right-14 bg-emerald-950 text-white text-[12px] font-medium px-3.5 py-1.5 rounded-full opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-lg pointer-events-none whitespace-nowrap">
            Trợ lý AI Morning Fruit
          </span>
          <button
            type="button"
            onClick={() => toggleChat('ai')}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 cursor-pointer ${
              activeChat === 'ai'
                ? 'bg-emerald-700 rotate-90 scale-95 shadow-inner'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-500 hover:scale-110 hover:shadow-emerald-300/40 hover:-translate-y-0.5'
            }`}
            title="Chatbot AI"
          >
            {activeChat === 'ai' ? (
              <X className="w-5 h-5" />
            ) : (
              <Bot className="w-5.5 h-5.5" />
            )}
          </button>
        </div>

        {/* Staff Chat Button */}
        <div className="relative flex items-center justify-end group">
          <span className="absolute right-14 bg-slate-900 text-white text-[12px] font-medium px-3.5 py-1.5 rounded-full opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-lg pointer-events-none whitespace-nowrap">
            Chat với nhân viên
          </span>
          <button
            type="button"
            onClick={() => toggleChat('staff')}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 cursor-pointer ${
              activeChat === 'staff'
                ? 'bg-orange-700 rotate-90 scale-95 shadow-inner'
                : 'bg-gradient-to-tr from-orange-500 to-amber-500 hover:scale-110 hover:shadow-orange-300/40 hover:-translate-y-0.5'
            }`}
            title="Chat với nhân viên"
          >
            {activeChat === 'staff' ? (
              <X className="w-5 h-5" />
            ) : (
              <MessageSquare className="w-5.5 h-5.5" />
            )}
          </button>
        </div>
      </div>
      
    </div>
  );
}
