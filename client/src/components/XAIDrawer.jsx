import React from 'react';
import { X, Sparkles, ShieldCheck, FileCheck, Layers, Clock, AlertCircle } from 'lucide-react';

export default function XAIDrawer({ grievance, isOpen, onClose, t }) {
  if (!isOpen || !grievance) return null;

  const reasoning = grievance.reasoning || {};
  const triggers = reasoning.key_triggers || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{t.xai_title}</h3>
            <p className="text-xs text-slate-500 font-mono">Ticket: {grievance.ticket_number}</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {/* AI Decision Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                <span className="text-xs font-bold text-slate-800">{grievance.department_name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Priority</span>
                <span className="text-xs font-bold text-red-600">{grievance.priority_level} ({grievance.priority_score}/100)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Language</span>
                <span className="text-xs font-bold text-slate-800">{grievance.input_language_name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">SLA</span>
                <span className="text-xs font-bold text-emerald-700">{grievance.sla_hours} Hours</span>
              </div>
            </div>
          </div>

          {/* Highlighted Triggers */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              {t.xai_triggers}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {triggers.length > 0 ? triggers.map((trig, idx) => (
                <span
                  key={idx}
                  className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg"
                >
                  ⚡ "{trig}"
                </span>
              )) : (
                <span className="text-xs text-slate-400">Standard semantic context match</span>
              )}
            </div>
          </div>

          {/* Bilingual Reasoning */}
          <div className="space-y-2">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Citizen Language Explanation ({grievance.input_language_name})
              </span>
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 text-xs sm:text-sm leading-relaxed font-medium">
                {reasoning.rationale_local || reasoning.rationale_en}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Official Audit Log Rationale (English)
              </span>
              <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 text-xs sm:text-sm leading-relaxed font-mono">
                {reasoning.rationale_en}
              </div>
            </div>
          </div>

          {/* Rule Applied */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Policy: <strong>{reasoning.rule_applied || 'Govt_Civic_SLA_Triage_Policy_2026'}</strong></span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
