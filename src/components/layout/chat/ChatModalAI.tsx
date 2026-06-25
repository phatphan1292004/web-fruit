import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, X, Send } from 'lucide-react';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
};

interface ChatModalAIProps {
  onClose: () => void;
}

export default function ChatModalAI({ onClose }: ChatModalAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'ai-init',
      sender: 'bot',
      text: 'Xin chào! Mình là Trợ lý AI của Morning Fruit. 🍊 Bạn cần mình hỗ trợ thông tin gì về trái cây sạch, bảng giá, chính sách giao hàng hay ưu đãi hôm nay?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // AI response generation logic
  const getAiResponse = (userInput: string): string => {
    const text = userInput.toLowerCase();
    if (text.includes('giá') || text.includes('bao nhiêu') || text.includes('tiền')) {
      return 'Morning Fruit cung cấp các loại trái cây organic tươi ngon như táo Envy, nho mẫu đơn, xoài cát Hòa Lộc... Bạn có thể xem bảng giá chi tiết tại trang Danh mục trái cây hoặc hỏi mình chi tiết về loại quả nào nhé!';
    }
    if (text.includes('ship') || text.includes('giao hàng') || text.includes('vận chuyển') || text.includes('địa chỉ')) {
      return 'Morning Fruit miễn phí giao hàng cho đơn hàng trên 500k trong nội thành. Đơn hàng sẽ được giao siêu tốc trong vòng 2 giờ kể từ khi xác nhận đó bạn! 🚚';
    }
    if (text.includes('khuyến mãi') || text.includes('ưu đãi') || text.includes('sale') || text.includes('giảm giá')) {
      return 'Hiện tại Morning Fruit đang có chương trình giảm giá 10% cho khách hàng mua lần đầu tiên và tặng kèm thiệp trang trí cho các giỏ quà trái cây. Đừng bỏ lỡ nhé! 🎁';
    }
    if (text.includes('tươi') || text.includes('sạch') || text.includes('nguồn gốc') || text.includes('an toàn')) {
      return 'Trái cây của Morning Fruit được lấy trực tiếp từ các nông trại sạch đạt tiêu chuẩn VietGAP/GlobalGAP và nhập khẩu chính ngạch từ các quốc gia như Mỹ, Úc, New Zealand, Nhật Bản. Đầy đủ giấy tờ chứng nhận đó ạ! 🍎';
    }
    if (text.includes('tạm biệt') || text.includes('cảm ơn') || text.includes('thank')) {
      return 'Dạ không có gì ạ! Chúc bạn một ngày tốt lành và chọn được những trái cây ưng ý nhất cho gia dịch nhé! 🍊';
    }
    return 'Cảm ơn câu hỏi của bạn. Mình là Trợ lý AI Morning Fruit, rất vui được hỗ trợ. Bạn có thể hỏi mình về: Giá cả trái cây, Chính sách giao hàng, Nguồn gốc sản phẩm hoặc các chương trình Ưu đãi hôm nay nha!';
  };

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Trigger AI response simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiReply: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: getAiResponse(messageText),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1200);
  };

  const handleQuickReply = (question: string) => {
    handleSend(question);
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
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl relative">
            <Bot className="w-5.5 h-5.5 animate-pulse text-emerald-100" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-emerald-600 rounded-full" />
          </div>
          <div>
            <h3 className="font-semibold text-[15px] flex items-center gap-1.5 leading-none">
              Trợ lý AI Morning Fruit
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            </h3>
            <p className="text-[11px] text-emerald-100/80 mt-1">Trả lời tự động 24/7</p>
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

      {/* Messages body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`text-[9px] block text-right mt-1.5 ${
                  msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => handleQuickReply('🍊 Trái cây hôm nay có gì tươi ngon?')}
          className="text-[12px] bg-white hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 border border-slate-200/80 rounded-full px-3 py-1.5 transition-all cursor-pointer font-medium shadow-xs"
        >
          🍊 Trái cây tươi hôm nay
        </button>
        <button
          type="button"
          onClick={() => handleQuickReply('🚚 Phí ship và thời gian giao hàng như thế nào?')}
          className="text-[12px] bg-white hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 border border-slate-200/80 rounded-full px-3 py-1.5 transition-all cursor-pointer font-medium shadow-xs"
        >
          🚚 Phí ship & giao hàng
        </button>
        <button
          type="button"
          onClick={() => handleQuickReply('🎁 Đang có khuyến mãi hay ưu đãi gì vậy AI?')}
          className="text-[12px] bg-white hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 border border-slate-200/80 rounded-full px-3 py-1.5 transition-all cursor-pointer font-medium shadow-xs"
        >
          🎁 Khuyến mãi & ưu đãi
        </button>
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
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi của bạn..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[13.5px] focus:outline-hidden focus:border-emerald-500 text-slate-800"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
}
