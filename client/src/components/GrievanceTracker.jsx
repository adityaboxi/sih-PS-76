import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, MapPin, Printer, HelpCircle, AlertCircle, ArrowRight, User, Shield, Layers, FileCheck } from 'lucide-react';
import { clientAi } from '../services/mockAiEngine';

export default function GrievanceTracker({ t, initialTicket, onOpenXAI }) {
  const [searchTicket, setSearchTicket] = useState(initialTicket || 'GR-2026-WB-1001');
  const [grievance, setGrievance] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (initialTicket) {
      setSearchTicket(initialTicket);
      handleSearch(initialTicket);
    } else {
      handleSearch('GR-2026-WB-1001');
    }
  }, [initialTicket]);

  const handleSearch = (idToSearch) => {
    const term = (idToSearch || searchTicket).trim();
    if (!term) return;
    const found = clientAi.getGrievanceById(term);
    setGrievance(found || null);
  };

  const getStageIndex = (status) => {
    switch (status) {
      case 'SUBMITTED': return 1;
      case 'AI_TRIAGED': return 2;
      case 'ROUTED': return 3;
      case 'IN_PROGRESS': return 4;
      case 'RESOLVED': return 5;
      default: return 1;
    }
  };

  const currentStage = grievance ? getStageIndex(grievance.status) : 1;

  const stages = [
    { num: 1, title: t.stage_submitted, desc: 'Logged into secure state repository' },
    { num: 2, title: t.stage_triaged, desc: 'AI prioritized and SLA assigned' },
    { num: 3, title: t.stage_routed, desc: 'Sent to Executive Engineer' },
    { num: 4, title: t.stage_dispatched, desc: 'Field technician team mobilized' },
    { num: 5, title: t.stage_resolved, desc: 'Inspection & repair verified' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Clean Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2">
          {t.tracker_title}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
          {t.tracker_subtitle}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTicket}
              onChange={(e) => setSearchTicket(e.target.value)}
              placeholder={t.search_placeholder}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            {t.track_button}
          </button>
        </form>
      </div>

      {/* Grievance Details Card */}
      {grievance ? (
        <div className="space-y-6">
          {/* Top Status & SLA Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Official Grievance Code
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900">
                  {grievance.ticket_number}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  {grievance.department_name} • {grievance.ward || grievance.district}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className={`px-3 py-1.5 rounded-xl border text-xs font-black uppercase ${
                  grievance.priority_level === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  grievance.priority_level === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {grievance.priority_level} ({grievance.priority_score}/100)
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>SLA: {grievance.sla_hours} {t.hours_unit}</span>
                </div>
              </div>
            </div>

            {/* Duplicate Notice Banner if Linked */}
            {grievance.is_duplicate && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center space-x-3 text-amber-900 text-xs font-medium">
                <Layers className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  {t.duplicate_notice.replace('{count}', '4')} <strong>(Master Ticket: {grievance.master_ticket_id || 'GR-2026-WB-1001'})</strong>.
                </div>
              </div>
            )}

            {/* 5-Stage Visual Stepper */}
            <div className="py-4">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-4">
                Lifecycle Resolution Progress
              </span>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {stages.map((st) => {
                  const isDone = st.num <= currentStage;
                  const isCurrent = st.num === currentStage;
                  return (
                    <div
                      key={st.num}
                      className={`p-3.5 rounded-2xl border transition ${
                        isCurrent
                          ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                          : isDone
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-white border-slate-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isDone ? '✓' : st.num}
                        </div>
                        <div className="text-xs font-bold text-slate-900">{st.title}</div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">{st.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
              <button
                onClick={() => onOpenXAI(grievance)}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>{t.inspect_xai_btn}</span>
              </button>

              <button
                onClick={() => setShowReceipt(true)}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>{t.print_receipt_btn}</span>
              </button>
            </div>
          </div>

          {/* Timeline Trail */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-4">
              {t.timeline_title}
            </h3>
            <div className="space-y-4">
              {grievance.timeline.map((evt, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-slate-900">{evt.title}</div>
                    <div className="text-slate-500 mt-0.5">{evt.desc}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {new Date(evt.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-md">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Grievance Found</h3>
          <p className="text-xs text-slate-500 mt-1">Please verify your tracking code.</p>
        </div>
      )}

      {/* Official Receipt Modal */}
      {showReceipt && grievance && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200">
            <div className="text-center border-b border-slate-200 pb-4 mb-4">
              <h2 className="text-lg font-black text-slate-900">Government of West Bengal / India</h2>
              <p className="text-xs text-slate-500 font-medium">Public Grievance Redressal Acknowledgement Receipt</p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 py-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Tracking Code:</span>
                <span className="font-mono font-bold text-slate-900">{grievance.ticket_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Citizen Name:</span>
                <span className="font-bold">{grievance.citizen_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-bold">{grievance.department_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned SLA:</span>
                <span className="font-bold">{grievance.sla_hours} Hours</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceipt(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
