import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, AlertTriangle, CheckCircle2, Copy, FileCheck, Layers, HelpCircle, Image as ImageIcon, MapPin, Check, ShieldAlert, ArrowRight } from 'lucide-react';
import { clientAi } from '../services/mockAiEngine';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const DEMO_PRESETS = [
  {
    lang: 'bn',
    badge: 'বাংলা (জরুরি জল)',
    text: 'আমাদের যাদবপুর ৮ নম্বর ওয়ার্ডে গত তিন দিন ধরে প্রধান পাইপ ফেটে পানীয় জল নষ্ট হচ্ছে এবং জল সরবরাহ বন্ধ। শিশুরা পানীয় জলের অভাবে অসুস্থ হয়ে পড়ছে।'
  },
  {
    lang: 'hi',
    badge: 'हिन्दी (आपातकालीन बिजली)',
    text: 'मेन रोड पर 11KV का बिजली का तार टूटकर नीचे गिर गया है और उसमें स्पार्क हो रहा है। बहुत बड़ा खतरा है!'
  },
  {
    lang: 'en',
    badge: 'English (Road Hazard)',
    text: 'Large dangerous pothole and asphalt cave-in on the flyover near Sector 5. Multiple bike skids reported today.'
  },
  {
    lang: 'ta',
    badge: 'தமிழ் (குடிநீர்)',
    text: 'எங்கள் பகுதியில் குடிநீர் குழாய் உடைந்து கடந்த இரண்டு நாட்களாக தண்ணீர் விநியோகம் இல்லை.'
  },
  {
    lang: 'en',
    badge: 'Spam Safeguard Test',
    text: 'asdfghjk 12345 testing test'
  }
];

export default function GrievanceForm({ currentLang, t, onGrievanceCreated, onOpenXAI, onViewTracking }) {
  const [text, setText] = useState('');
  const [name, setName] = useState('Aditi Roy');
  const [phone, setPhone] = useState('9876543210');
  const [district, setDistrict] = useState('Kolkata');
  const [ward, setWard] = useState('Ward 8 (Jadavpur)');
  const [pincode, setPincode] = useState('700032');
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdGrievance, setCreatedGrievance] = useState(null);
  const [error, setError] = useState(null);

  // Simulated & Real Speech Recognition
  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        if (currentLang === 'bn') {
          setText(prev => (prev ? prev + ' ' : '') + 'আমাদের এলাকায় ৩ দিন ধরে জল নেই এবং নর্দমা উপচে রাস্তায় নোংরা জল জমেছে। শিশুরা অসুস্থ হয়ে পড়ছে।');
        } else if (currentLang === 'hi') {
          setText(prev => (prev ? prev + ' ' : '') + 'हमारे मोहल्ले में 11KV बिजली का नंगा तार टूटा पड़ा है और चिंगारियां निकल रही हैं।');
        } else {
          setText(prev => (prev ? prev + ' ' : '') + 'Severe water pipeline leakage on main road causing massive overflow and road damage.');
        }
      }, 2000);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const langMap = {
      bn: 'bn-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN',
      gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', en: 'en-IN'
    };
    recognition.lang = langMap[currentLang] || 'en-IN';

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => (prev ? prev + ' ' : '') + transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please provide or record your grievance description.');
      return;
    }

    setLoading(true);
    setError(null);

    // Try backend API first, seamlessly fallback to client-side AI engine
    try {
      const res = await axios.post(`${API_BASE}/grievances`, {
        text,
        citizen_name: name,
        phone,
        district,
        ward,
        pincode,
        preferred_language: currentLang,
        attachment_urls: attachmentPreview ? [attachmentPreview] : []
      });

      if (res.data.success) {
        setCreatedGrievance(res.data.data);
        if (onGrievanceCreated) onGrievanceCreated(res.data.data);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend unavailable, utilizing embedded Client AI Engine...');
    }

    // Embedded Client AI Engine execution
    setTimeout(() => {
      const result = clientAi.analyzeGrievance({
        text,
        name,
        phone,
        district,
        ward,
        pincode,
        preferred_language: currentLang,
        attachmentUrl: attachmentPreview
      });
      setCreatedGrievance(result);
      if (onGrievanceCreated) onGrievanceCreated(result);
      setLoading(false);
    }, 600);
  };

  const resetForm = () => {
    setCreatedGrievance(null);
    setText('');
    setAttachmentPreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 mb-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Zero-Discard Multilingual Grievance Redressal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {t.hero_title}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            {t.hero_desc}
          </p>
        </div>
      </div>

      {createdGrievance ? (
        /* Submission Success & AI Diagnostics Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 animate-fade-in space-y-6">
          <div className="flex items-center space-x-3 text-emerald-600">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t.success_title}</h2>
              <p className="text-xs text-slate-500">Processed by AI Prioritization & Routing Engine</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase block">{t.tracking_number}</span>
                <div className="text-lg font-mono font-black text-slate-900 flex items-center space-x-2">
                  <span>{createdGrievance.ticket_number}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase block">{t.ai_department}</span>
                <div className="text-sm font-bold text-slate-800">
                  {createdGrievance.department_name}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase block">{t.ai_priority}</span>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${
                    createdGrievance.priority_level === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-300' :
                    createdGrievance.priority_level === 'HIGH' ? 'bg-amber-100 text-amber-700 border border-amber-300' :
                    'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  }`}>
                    {createdGrievance.priority_level} ({createdGrievance.priority_score}/100)
                  </span>
                </div>
              </div>
            </div>

            {createdGrievance.is_duplicate && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-amber-900 text-xs font-semibold flex items-center space-x-2">
                <Layers className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>
                  Semantic Duplicate Grouping: Linked to active master ticket <strong>{createdGrievance.master_ticket_id}</strong>.
                </span>
              </div>
            )}

            {createdGrievance.verification_status === 'FLAGGED_REVIEW' && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 text-purple-900 text-xs font-semibold flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-purple-600" />
                <span>
                  Zero-Discard Safeguard: Assigned to Triage Officer Review Queue for manual validation (No genuine complaint dropped).
                </span>
              </div>
            )}

            <div className="border-t border-slate-200 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <span>
                Mandated SLA: <strong>{createdGrievance.sla_hours} Hours</strong> | Language: <strong>{createdGrievance.input_language_name}</strong>
              </span>

              <button
                onClick={() => onOpenXAI(createdGrievance)}
                className="inline-flex items-center space-x-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition border border-emerald-200"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.xai_title}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onViewTracking(createdGrievance.ticket_number)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-2xl transition shadow-md flex items-center justify-center space-x-2 text-sm"
            >
              <span>Track Live Status & Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={resetForm}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-2xl transition text-sm"
            >
              Submit Another Grievance
            </button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t.file_title}</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{t.file_desc}</p>
            </div>
          </div>

          {/* Quick Demo Prompts for Judges */}
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
              ⚡ 1-Click Judge Demo Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {DEMO_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText(p.text)}
                  className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl transition font-semibold"
                >
                  {p.badge}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Description Box with Voice Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Grievance Description (Any Language)
                </label>
                {text && <span className="text-xs text-slate-400">{text.length} chars</span>}
              </div>

              <div className="relative">
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t.input_placeholder}
                  className="w-full rounded-2xl border border-slate-300 p-4 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition text-sm leading-relaxed"
                ></textarea>

                {/* Voice Recording Button */}
                <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                      isRecording
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 border border-slate-200'
                    }`}
                    title="Speak in Bengali / Hindi / Mother Tongue"
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{isRecording ? t.voice_recording : t.voice_record}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Photo Attachment & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Attach Photo / Proof (Optional)
                </label>
                <label className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-3 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition text-xs text-slate-500 space-x-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>{attachmentPreview ? 'Photo Attached ✅' : 'Upload Hazard / Site Photo'}</span>
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </label>
              </div>

              {/* Ward / Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ward / Local Area
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder="e.g. Ward 8 (Jadavpur)"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Citizen Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.your_name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.your_phone}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.pincode}
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 font-bold py-3.5 px-6 rounded-2xl transition shadow-lg ${
                loading
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-emerald-600/20'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.submitting}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.submit_btn}</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
