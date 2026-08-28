import React, { useState } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, User, Globe, ChevronRight } from 'lucide-react';
import { clientAi } from '../services/mockAiEngine';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export default function ChatAssistant({ currentLang, t, onViewTracking }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: t.chat_placeholder
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    { text: 'How do I apply for a new Ration Card?', label: 'Ration Card Guide' },
    { text: 'GR-2026-WB-1001 status?', label: 'Track Ticket' },
    { text: 'জরুরি পানীয় জলের পাইপ লিকেজ হলে কী করব?', label: 'বাংলায় প্রশ্ন' }
  ];

  const handleSend = async (customText) => {
    const userMsg = customText || input.trim();
    if (!userMsg) return;

    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, {
        message: userMsg,
        language_code: currentLang
      });

      if (res.data.success) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: res.data.data.reply,
            sources: res.data.data.cited_sources
          }
        ]);
        setLoading(false);
        return;
      }
    } catch (e) {
      // Local fallback
    }

    setTimeout(() => {
      const localReply = clientAi.chatRAG(userMsg, currentLang);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: localReply.reply,
          sources: localReply.cited_sources
        }
      ]);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-84 sm:w-96 h-[520px] flex flex-col overflow-hidden animate-scale-up">
          {/* Chat Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                <Bot className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h4 className="text-sm font-black">{t.chat_bot_title}</h4>
                <p className="text-[10px] text-emerald-400 font-bold">Multilingual RAG Civic Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.text)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold rounded-lg border border-slate-200 transition"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3 bg-slate-50/40">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="font-medium">{m.text}</p>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 italic">
                      Source: {m.sources[0]}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none text-xs text-slate-400 flex items-center space-x-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask in Bengali, Hindi, English..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white p-4 rounded-full shadow-2xl flex items-center space-x-2 transition hover:scale-105 border border-emerald-400/40"
        >
          <Bot className="w-6 h-6" />
          <span className="text-xs font-extrabold hidden sm:inline">{t.chat_bot_title}</span>
        </button>
      )}
    </div>
  );
}
