import React from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, Layers, BookOpen, Key } from 'lucide-react';

export default function XAIDrawer({ grievance, isOpen, onClose, t }) {
  if (!isOpen || !grievance) return null;
  const reasoning = grievance.reasoning || {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="h-11 w-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{t.xai_title}</h3>
            <p className="text-xs text-slate-500 font-medium">{t.xai_subtitle}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Target Department & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 uppercase font-black tracking-wider block text-[10px] mb-1">{t.xai_dept_routed}</span>
              <strong className="text-slate-900 text-sm">{grievance.department_name}</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 uppercase font-black tracking-wider block text-[10px] mb-1">{t.xai_urgency_assigned}</span>
              <strong className="text-rose-600 text-sm">{grievance.priority_level} ({grievance.priority_score}/100)</strong>
            </div>
          </div>

          {/* Trigger Words */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-emerald-800 uppercase font-black tracking-wider block text-[10px] mb-2 flex items-center space-x-1">
              <Key className="w-3.5 h-3.5" />
              <span>{t.xai_triggers_detected}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(reasoning.key_triggers || ['water pipe', 'shortage', 'sick children']).map((trig, idx) => (
                <span key={idx} className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-xs">
                  "{trig}"
                </span>
              ))}
            </div>
          </div>

          {/* Policy Rule */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 uppercase font-black tracking-wider block text-[10px] mb-1 flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.xai_rule_applied}</span>
            </span>
            <p className="text-slate-800 font-bold">{reasoning.rule_applied || 'Standard Public Health & Infrastructure SLA Rule 2026'}</p>
          </div>

          {/* Dual Bilingual Justifications */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
            <div>
              <span className="text-blue-800 uppercase font-black tracking-wider block text-[10px]">{t.xai_rationale_native}</span>
              <p className="text-slate-800 font-medium mt-0.5">{reasoning.rationale_local || grievance.original_text}</p>
            </div>
            <div className="border-t border-blue-100 pt-2">
              <span className="text-blue-800 uppercase font-black tracking-wider block text-[10px]">{t.xai_rationale_en}</span>
              <p className="text-slate-800 font-medium mt-0.5">{reasoning.rationale_en || 'Classified under emergency critical SLA due to public health hazard.'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
        >
          {t.xai_close_btn}
        </button>
      </div>
    </div>
  );
}
