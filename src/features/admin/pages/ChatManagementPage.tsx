import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { 
  Send, 
  MessageSquare, 
  Search, 
  Clock, 
  Smile,
  Shield,
  Circle
} from 'lucide-react';
import { 
  fetchConversations, 
  fetchChatHistory, 
  readCookie, 
  type ChatMessage, 
  type Conversation 
} from '../../../lib/api/chat';

export default function ChatManagementPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const adminUid = readCookie('userId') || '';
  const adminRole = localStorage.getItem('role') || 'admin';
  const adminName = localStorage.getItem('displayName') || 'Admin';

  // 1. Initialize Socket.io Connection
  useEffect(() => {
    if (!adminUid) {
      toast.error('Không tìm thấy thông tin tài khoản Admin.');
      return;
    }

    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socketClient = io(socketUrl, {
      query: {
        firebaseUid: adminUid,
        role: adminRole
      }
    });

    setSocket(socketClient);

    socketClient.on('connect', () => {
      console.log('Admin connected to socket server');
    });

    // Handle receiving real-time messages
    socketClient.on('receive_message', (msg: ChatMessage) => {
      // Append to messages if it's the active conversation
      setSelectedConversation((current) => {
        if (current && msg.customerId === current.customerId) {
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        }
        return current;
      });

      // Update conversations list
      setConversations((prevConvs) => {
        const existIdx = prevConvs.findIndex((c) => c.customerId === msg.customerId);
        if (existIdx > -1) {
          const updated = [...prevConvs];
          updated[existIdx] = {
            ...updated[existIdx],
            lastMessage: {
              content: msg.content,
              senderId: msg.senderId,
              senderName: msg.senderName,
              senderRole: msg.senderRole,
              createdAt: msg.createdAt
            }
          };
          // Move to top
          const item = updated.splice(existIdx, 1)[0];
          return [item, ...updated];
        } else {
          // If completely new conversation, reload conversation list
          loadConversations();
          return prevConvs;
        }
      });
    });

    // Handle typing events
    socketClient.on('typing', (data: { customerId: string; senderId: string; isTyping: boolean }) => {
      setSelectedConversation((current) => {
        if (current && data.customerId === current.customerId && data.senderId !== adminUid) {
          setIsCustomerTyping(data.isTyping);
        }
        return current;
      });
    });

    return () => {
      socketClient.disconnect();
    };
  }, [adminUid, adminRole]);

  // 2. Fetch Conversations
  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await fetchConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast.error('Không thể tải danh sách cuộc trò chuyện.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // 3. Load Chat History when selecting a user
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      setIsCustomerTyping(false);
      return;
    }

    const loadHistory = async () => {
      try {
        setLoadingHistory(true);
        const history = await fetchChatHistory(selectedConversation.customerId);
        setMessages(history);
      } catch (error) {
        console.error('Failed to load chat history:', error);
        toast.error('Không thể tải lịch sử tin nhắn.');
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
    setIsCustomerTyping(false);
  }, [selectedConversation]);

  // 4. Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isCustomerTyping]);

  // 5. Handle Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConversation || !socket) return;

    const payload = {
      customerId: selectedConversation.customerId,
      senderId: adminUid,
      senderName: adminName,
      senderRole: adminRole as 'admin' | 'staff',
      content: inputMessage.trim()
    };

    // Emit socket event
    socket.emit('send_message', payload);

    // Stop typing state immediately
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('typing', {
      customerId: selectedConversation.customerId,
      senderId: adminUid,
      isTyping: false
    });

    setInputMessage('');
  };

  // 6. Handle Input Typing Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (!socket || !selectedConversation) return;

    // Emit typing status
    socket.emit('typing', {
      customerId: selectedConversation.customerId,
      senderId: adminUid,
      isTyping: true
    });

    // Debounce: Emit typing false after 2 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        customerId: selectedConversation.customerId,
        senderId: adminUid,
        isTyping: false
      });
    }, 2000);
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((c) => {
    const name = c.customer?.displayName || 'Khách hàng';
    const email = c.customer?.email || '';
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
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
    <div className="h-[calc(100vh-100px)] flex flex-col bg-slate-50/50 rounded-3xl overflow-hidden border border-slate-200/60 shadow-xs">
      
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Trung tâm hỗ trợ khách hàng</h2>
          <p className="text-xs text-slate-500 mt-0.5">Quản lý và giải đáp các thắc mắc trực tuyến của khách hàng</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-700 text-xs font-semibold">
          <Circle className="w-2 h-2 fill-emerald-500 stroke-emerald-500 animate-pulse" />
          <span>Hệ thống trực tuyến (Socket active)</span>
        </div>
      </div>

      {/* Main body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Users List */}
        <div className="w-80 sm:w-96 bg-white border-r border-slate-200/80 flex flex-col">
          {/* Search box */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm khách hàng..."
                className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13.5px] focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-slate-700 transition-all"
              />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60">
            {loading ? (
              <div className="p-8 text-center text-slate-400">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <span className="text-sm">Đang tải danh sách...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                <p className="text-sm">Không tìm thấy cuộc trò chuyện nào.</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const customerName = conv.customer?.displayName || 'Khách hàng';
                const isSelected = selectedConversation?.customerId === conv.customerId;
                const isLastMsgFromCustomer = conv.lastMessage.senderRole === 'customer';

                return (
                  <button
                    key={conv.customerId}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left p-4 flex gap-3 hover:bg-slate-50/70 transition-all relative ${
                      isSelected ? 'bg-emerald-50/40 border-l-3 border-emerald-500' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {conv.customer?.avatarUrl ? (
                        <img
                          src={conv.customer.avatarUrl}
                          alt={customerName}
                          className="w-11 h-11 rounded-full object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm shadow-inner">
                          {getInitials(customerName)}
                        </div>
                      )}
                      {isLastMsgFromCustomer && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-[14px] text-slate-800 truncate">
                          {customerName}
                        </h4>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getFormatTime(conv.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="text-[12px] text-slate-500 mt-1 truncate">
                        {isLastMsgFromCustomer ? '' : 'Bạn: '}{conv.lastMessage.content}
                      </p>
                      {conv.customer?.email && (
                        <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                          {conv.customer.email}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Conversation Area */}
        <div className="flex-1 bg-slate-50/40 flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Active User Header */}
              <div className="bg-white border-b border-slate-200/80 px-6 py-4.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  {selectedConversation.customer?.avatarUrl ? (
                    <img
                      src={selectedConversation.customer.avatarUrl}
                      alt={selectedConversation.customer?.displayName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-100"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm shadow-inner">
                      {getInitials(selectedConversation.customer?.displayName || 'Khách')}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-[15px] text-slate-800">
                      {selectedConversation.customer?.displayName || 'Khách hàng'}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      <span>Firebase UID: {selectedConversation.customerId}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium border border-slate-200">
                    Khách mua hàng
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                {loadingHistory ? (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-2.5" />
                    <span className="text-sm">Đang tải lịch sử tin nhắn...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <span className="text-[10px] bg-slate-200/60 text-slate-500 px-3 py-1 rounded-full font-medium">
                        Bắt đầu cuộc trò chuyện hỗ trợ
                      </span>
                    </div>

                    {messages.map((msg) => {
                      const isMe = msg.senderId === adminUid;
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed shadow-xs ${
                              isMe
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-tr-none'
                                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                            }`}
                          >
                            {!isMe && (
                              <span className="block text-[10px] font-bold text-slate-400 mb-1">
                                {msg.senderName}
                              </span>
                            )}
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <span
                              className={`text-[9px] block text-right mt-1.5 ${
                                isMe ? 'text-emerald-100' : 'text-slate-400'
                              }`}
                            >
                              {getFormatTime(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {isCustomerTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="bg-white border-t border-slate-200/85 p-4 flex items-center gap-3"
              >
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-1.5 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder={`Trả lời ${selectedConversation.customer?.displayName || 'khách hàng'}...`}
                    className="flex-1 bg-transparent border-0 outline-hidden py-1.5 text-[14px] text-slate-700"
                  />
                  <button
                    type="button"
                    className="p-1 hover:bg-slate-200/60 rounded-lg text-slate-400 transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-500/10 hover:shadow-lg cursor-pointer"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4 shadow-inner">
                <MessageSquare className="w-9.5 h-9.5" />
              </div>
              <h3 className="font-bold text-slate-700 text-lg">Chưa chọn cuộc hội thoại nào</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">
                Chọn một khách hàng trong danh sách bên trái để xem lịch sử và bắt đầu hỗ trợ trực tuyến.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
