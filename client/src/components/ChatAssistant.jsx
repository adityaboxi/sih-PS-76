import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, HelpCircle, ArrowRight } from 'lucide-react';

export default function ChatAssistant({ currentLang, t, onViewTracking }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: t.chat_welcome || 'নমস্কার! আমি নাগরিক সহায়ক। আপনার অভিযোগের অবস্থা জানতে বা সরকারি নিয়ম সম্পর্কে যে কোনো প্রশ্ন করতে পারেন।'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Live Token Streaming Typewriter Simulator
  const streamBotResponse = (fullText) => {
    let currentText = '';
    const words = fullText.split(' ');
    let wordIdx = 0;

    setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

    const interval = setInterval(() => {
      if (wordIdx < words.length) {
        currentText += (wordIdx === 0 ? '' : ' ') + words[wordIdx];
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: 'bot', text: currentText };
          return updated;
        });
        wordIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40); // 40ms per word streaming
  };

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = query.toLowerCase();

      if (lower.includes('track') || query.includes('ট্র্যাক') || query.includes('অবস্থা') || query.includes('1001')) {
        reply = currentLang === 'bn'
          ? 'আপনার অভিযোগ নম্বর GR-2026-WB-1001 বর্তমানে "প্রক্রিয়াধীন (In Progress)" অবস্থায় রয়েছে। নির্বাহী বাস্তুকার সৌমেন ব্যানার্জি জরুরি দল পাঠিয়েছেন।'
          : 'Grievance #GR-2026-WB-1001 is currently "In Progress". Executive Engineer Er. Soumen Banerjee has dispatched the field repair crew.';
      } else if (lower.includes('water') || query.includes('জল') || query.includes('পানি')) {
        reply = currentLang === 'bn'
          ? 'পানীয় জল সংকটের ক্ষেত্রে আমাদের দপ্তর ৪ ঘণ্টার মধ্যে জরুরি পরিষেবা প্রদান করে। আপনি সরাসরি "অভিযোগ জানান" ট্যাব থেকে অভিযোগ দাখিল করতে পারেন।'
          : 'For drinking water pipeline emergencies, field teams are dispatched within a 4-hour SLA window. You can file directly from the "File Grievance" tab.';
      } else if (lower.includes('electric') || query.includes('বিদ্যুৎ') || query.includes('তার') || query.includes('तार')) {
        reply = currentLang === 'bn'
          ? 'ছেঁড়া বিদ্যুৎ তার বা ট্রান্সফরমার স্পার্কের মতো জরুরি বিপদে বিদ্যুৎ হেল্পলাইন ১৯১২ অথবা ১১২ তে কল করুন। আমাদের পোর্টালে ২ ঘণ্টার ইমার্জেন্সি এসএলএ বরাদ্দ হয়।'
          : 'For live wire snapping or sparking hazards, please call emergency 1912 or 112 immediately. Tickets filed here receive an emergency 2-hour SLA.';
      } else {
        reply = currentLang === 'bn'
          ? 'আপনার প্রশ্নের জন্য ধন্যবাদ। জনসেতু এআই ২৪x৭ নাগরিক সমস্যা সমাধান ও সঠিক সরকারি দপ্তরে প্রেরণে সাহায্য করে।'
          : 'Thank you for your question. JanSetu AI operates 24x7 to route civic complaints to the right authorities with zero data loss.';
      }

      streamBotResponse(reply);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-2xl flex items-center justify-center transition-all cursor-pointer shadow-blue-600/30 group"
          title="Open Nagrik Sahayak AI Chat"
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-80 sm:w-96 flex flex-col h-[520px] overflow-hidden">
          {/* Header */}
          <div className="bg-slate-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>{t.chat_title}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">RAG Stream</span>
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">{t.chat_subtitle}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Chips */}
          <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center space-x-1.5 overflow-x-auto text-[10px] font-bold">
            <button
              onClick={() => handleSendMessage(t.chat_chip_track)}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition cursor-pointer"
            >
              🔍 {t.chat_chip_track}
            </button>
            <button
              onClick={() => handleSendMessage(t.chat_chip_water)}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition cursor-pointer"
            >
              💧 {t.chat_chip_water}
            </button>
            <button
              onClick={() => handleSendMessage(t.chat_chip_power)}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition cursor-pointer"
            >
              ⚡ {t.chat_chip_power}
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed font-medium ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t.chat_input_placeholder}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
