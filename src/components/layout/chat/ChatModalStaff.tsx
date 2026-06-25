import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Headset, X, Send, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { readCookie, fetchChatHistory, type ChatMessage } from '../../../lib/api/chat';

interface ChatModalStaffProps {
  onClose: () => void;
}

export default function ChatModalStaff({ onClose }: ChatModalStaffProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStaffTyping, setIsStaffTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const customerUid = readCookie('userId');
  const customerName = localStorage.getItem('displayName') || 'Khách hàng';

  // Connect to Socket and load history
  useEffect(() => {
    if (!customerUid) return;

    // 1. Fetch chat history
    fetchChatHistory(customerUid)
      .then((history) => {
        setMessages(history);
      })
      .catch((err) => {
        console.error('Failed to load chat history', err);
      });

    // 2. Initialize Socket Connection
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socketClient = io(socketUrl, {
      query: {
        firebaseUid: customerUid,
        role: 'customer'
      }
    });

    setSocket(socketClient);

    socketClient.on('connect', () => {
      console.log('Customer connected to socket');
    });

    socketClient.on('receive_message', (msg: ChatMessage) => {
      if (msg.customerId === customerUid) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    });

    socketClient.on('typing', (data: { customerId: string; senderId: string; isTyping: boolean }) => {
      if (data.customerId === customerUid && data.senderId !== customerUid) {
        setIsStaffTyping(data.isTyping);
      }
    });

    return () => {
      socketClient.disconnect();
    };
  }, [customerUid]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStaffTyping]);

  const handleSend = () => {
    if (!input.trim() || !socket || !customerUid) return;

    const payload = {
      customerId: customerUid,
      senderId: customerUid,
      senderName: customerName,
      senderRole: 'customer',
      content: input.trim()
    };

    socket.emit('send_message', payload);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('typing', {
      customerId: customerUid,
      senderId: customerUid,
      isTyping: false
    });

    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!socket || !customerUid) return;

    socket.emit('typing', {
      customerId: customerUid,
      senderId: customerUid,
      isTyping: true
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        customerId: customerUid,
        senderId: customerUid,
        isTyping: false
      });
    }, 2000);
  };

  const getFormatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-[360px] sm:w-[380px] h-[500px] rounded-3xl glass border border-white/20 shadow-2xl flex flex-col overflow-hidden pointer-events-auto mb-3"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl relative">
            <Headset className="w-5.5 h-5.5 animate-bounce text-orange-100" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-orange-500 rounded-full" />
          </div>
          <div>
            <h3 className="font-semibold text-[15px] leading-none">Hỗ trợ trực tuyến</h3>
            <p className="text-[11px] text-orange-100/80 mt-1">Nhân viên hỗ trợ đang online</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
          title="Đóng"
        >
          <X className="w-4 h-4 text-white/90" />
        </button>
      </div>

      {customerUid ? (
        <>
          {/* Messages body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <span className="text-[11px] bg-slate-200/60 text-slate-500 px-3.5 py-1 rounded-full font-medium">
                  Hãy gửi tin nhắn để bắt đầu trò chuyện hỗ trợ nhé!
                </span>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.senderRole === 'customer';
              return (
                <div
                  key={msg._id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                    }`}
                  >
                    {!isUser && (
                      <span className="block text-[9px] font-bold text-slate-400 mb-0.5">
                        {msg.senderName}
                      </span>
                    )}
                    <p>{msg.content}</p>
                    <span
                      className={`text-[9px] block text-right mt-1.5 ${
                        isUser ? 'text-orange-100' : 'text-slate-400'
                      }`}
                    >
                      {getFormatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}

            {isStaffTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[13.5px] focus:outline-hidden focus:border-orange-500 text-slate-800"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50/50 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4 border border-orange-100 shadow-inner">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h4 className="font-bold text-slate-700 text-[15px]">Yêu cầu đăng nhập</h4>
          <p className="text-[13px] text-slate-500 mt-2 max-w-[240px]">
            Vui lòng đăng nhập để bắt đầu cuộc trò chuyện hỗ trợ trực tuyến với chúng tôi.
          </p>
          <Link
            to="/login"
            onClick={onClose}
            className="mt-5 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-[13.5px] rounded-full shadow-md shadow-orange-500/10 hover:shadow-lg transition-all"
          >
            Đăng nhập ngay
          </Link>
        </div>
      )}
    </motion.div>
  );
}
