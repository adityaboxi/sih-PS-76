import React, { useState } from 'react';
import { Mic, MicOff, Camera, MapPin, Send, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, HelpCircle, FileText, ArrowRight, User, Phone } from 'lucide-react';
import { clientAi } from '../services/mockAiEngine';
import { useAuth } from '../context/AuthContext';

export default function GrievanceForm({ currentLang, t, onOpenXAI, onViewTracking, onGrievanceCreated }) {
  const { currentUser } = useAuth();
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState(currentUser.name.split(' ')[0] || 'Aditi Roy');
  const [phone, setPhone] = useState(currentUser.phone || '9876543210');
  const [district, setDistrict] = useState(currentUser.district || 'Kolkata');
  const [ward, setWard] = useState(currentUser.ward || 'Ward 8 (Jadavpur)');
  const [attachment, setAttachment] = useState(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultGrievance, setResultGrievance] = useState(null);

  // Simulated Speech-to-Text Voice Recording
  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        if (currentLang === 'bn') {
          setDescription('আমাদের যাদবপুর ৮ নম্বর ওয়ার্ডে গত তিন দিন ধরে প্রধান পাইপ ফেটে পানীয় জল নষ্ট হচ্ছে এবং জল সরবরাহ বন্ধ। শিশুরা পানীয় জলের অভাবে অসুস্থ হয়ে পড়ছে।');
        } else if (currentLang === 'hi') {
          setDescription('मेन रोड पर 11KV का बिजली का तार टूटकर नीचे गिर गया है और उसमें स्पार्क हो रहा है। बहुत बड़ा खतरा है!');
        } else {
          setDescription('Main drinking water pipeline burst in Jadavpur Ward 8 near bus stand, clean water running into road for 3 days and water supply cut off.');
        }
        setIsRecording(false);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleApplyPreset = (presetKey) => {
    if (presetKey === 'water') {
      setDescription(currentLang === 'bn' 
        ? 'আমাদের যাদবপুর ৮ নম্বর ওয়ার্ডে গত তিন দিন ধরে প্রধান পাইপ ফেটে পানীয় জল নষ্ট হচ্ছে এবং জল সরবরাহ বন্ধ। শিশুরা পানীয় জলের অভাবে অসুস্থ হয়ে পড়ছে।'
        : 'Main water pipe burst in Ward 8 near Jadavpur market for 3 days, no water supply and children are getting sick.');
      setWard('Ward 8 (Jadavpur)');
    } else if (presetKey === 'electric') {
      setDescription(currentLang === 'hi'
        ? 'मेन रोड पर 11KV का बिजली का तार टूटकर नीचे गिर गया है और उसमें स्पार्क हो रहा है। बहुत बड़ा खतरा है!'
        : '11KV high voltage electric wire snapped and fallen on main road with active sparks, immediate danger to life.');
      setWard('Ward 12 (Salt Lake)');
    } else if (presetKey === 'road') {
      setDescription(currentLang === 'bn'
        ? 'হাওড়া ব্রিজের কাছে মেন রোডে বড় গর্ত হয়ে গিয়েছে এবং বৃষ্টির জলে রাস্তা ভেঙে অনবরত বাইক উল্টে দুর্ঘটনা ঘটছে।'
        : 'Huge deep pothole and road cave-in on highway causing continuous vehicle accidents and traffic jam.');
      setWard('Ward 4 (Howrah)');
    } else if (presetKey === 'spam') {
      setDescription('asdfghjk 12345 testing system spam random input');
      setWard('Ward 8 (Jadavpur)');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const created = clientAi.submitGrievance({
        text: description,
        citizen_name: citizenName,
        phone: phone,
        district: district,
        ward: ward,
        pincode: '700032',
        preferred_language: currentLang,
        attachment_urls: attachment ? ['photo_evidence.jpg'] : []
      });

      setResultGrievance(created);
      setSubmitting(false);
      if (onGrievanceCreated) onGrievanceCreated(created);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Apple-Style Clean Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.zero_discard_badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2">
          {t.form_title}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
          {t.form_subtitle}
        </p>
      </div>

      {/* Main Glassmorphism Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Big Voice Recording Button for Village Citizens */}
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-2xl p-5 border border-emerald-100/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`h-14 w-14 rounded-2xl flex items-center justify-center transition shadow-lg ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                }`}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{t.voice_mic_title}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {isRecording ? t.voice_listening : t.voice_tap_to_speak}
                </p>
              </div>
            </div>

            {isRecording && (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold animate-bounce">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                <span>{t.voice_listening}</span>
              </div>
            )}
          </div>

          {/* Grievance Text Area */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-2">
              {t.input_label} *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.input_placeholder}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
            />
          </div>

          {/* 1-Click Judge Presets */}
          <div>
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-2.5">
              ⚡ {t.presets_title}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleApplyPreset('water')}
                className="text-left p-3 rounded-2xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 transition"
              >
                <div className="text-xs font-bold text-blue-900">💧 {t.preset_water_title}</div>
                <div className="text-[11px] text-blue-700/80 mt-0.5 truncate">{t.preset_water_desc}</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('electric')}
                className="text-left p-3 rounded-2xl border border-amber-100 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300 transition"
              >
                <div className="text-xs font-bold text-amber-900">⚡ {t.preset_electric_title}</div>
                <div className="text-[11px] text-amber-700/80 mt-0.5 truncate">{t.preset_electric_desc}</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('road')}
                className="text-left p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
              >
                <div className="text-xs font-bold text-slate-900">🚧 {t.preset_road_title}</div>
                <div className="text-[11px] text-slate-600 mt-0.5 truncate">{t.preset_road_desc}</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('spam')}
                className="text-left p-3 rounded-2xl border border-purple-100 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-300 transition"
              >
                <div className="text-xs font-bold text-purple-900">🛡️ {t.preset_spam_title}</div>
                <div className="text-[11px] text-purple-700/80 mt-0.5 truncate">{t.preset_spam_desc}</div>
              </button>
            </div>
          </div>

          {/* Citizen Details & Location Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.name_label}</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.phone_label}</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.district_label}</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Kolkata">Kolkata (কলকাতা)</option>
                <option value="Howrah">Howrah (হাওড়া)</option>
                <option value="North 24 Parganas">North 24 Parganas</option>
                <option value="South 24 Parganas">South 24 Parganas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.ward_label}</label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Ward 8 (Jadavpur)">Ward 8 (Jadavpur / যাদবপুর)</option>
                <option value="Ward 12 (Salt Lake)">Ward 12 (Salt Lake)</option>
                <option value="Ward 4 (Howrah)">Ward 4 (Howrah)</option>
                <option value="Ward 108 (Bypass)">Ward 108 (EM Bypass)</option>
              </select>
            </div>
          </div>

          {/* Photo Evidence Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.upload_photo_label}</label>
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>{attachment ? "Photo Attached (1 file)" : "Choose Photo File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAttachment(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-400">{t.upload_photo_hint}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm font-black transition shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {submitting ? (
              <span>{t.submitting_button}</span>
            ) : (
              <>
                <span>{t.submit_button}</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Success Notification Card */}
      {resultGrievance && (
        <div className="mt-8 bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-800 animate-scale-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.success_title}</span>
              </div>
              <div className="text-2xl font-black font-mono tracking-wider text-emerald-400">
                {resultGrievance.ticket_number}
              </div>
              <p className="text-xs text-emerald-200">
                {t.dept_distribution_title}: <strong>{resultGrievance.department_name}</strong> • 
                Priority: <strong className="text-amber-300">{resultGrievance.priority_level} ({resultGrievance.priority_score}/100)</strong> • 
                SLA: <strong>{resultGrievance.sla_hours} {t.hours_unit}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => onOpenXAI(resultGrievance)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition border border-white/20 flex items-center space-x-1"
              >
                <HelpCircle className="w-4 h-4 text-emerald-300" />
                <span>{t.inspect_xai_btn}</span>
              </button>

              <button
                onClick={() => onViewTracking(resultGrievance.ticket_number)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition shadow-lg flex items-center space-x-1.5"
              >
                <span>{t.view_tracking_btn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
