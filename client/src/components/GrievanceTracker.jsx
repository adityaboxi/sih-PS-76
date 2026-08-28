import React, { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle2, AlertCircle, Building2, User, Layers, HelpCircle, Printer, Download, MapPin, Shield } from 'lucide-react';
import { clientAi } from '../services/mockAiEngine';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export default function GrievanceTracker({ t, onOpenXAI, initialTicket }) {
  const [ticketInput, setTicketInput] = useState(initialTicket || 'GR-2026-WB-1001');
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const fetchTicket = async (query) => {
    if (!query) return;
    setLoading(true);
    setNotFound(false);

    try {
      const res = await axios.get(`${API_BASE}/grievances/${query}`);
      if (res.data.success) {
        setGrievance(res.data.data);
        setLoading(false);
        return;
      }
    } catch (e) {
      // Use local fallback
    }

    const localItem = clientAi.getGrievanceById(query);
    if (localItem) {
      setGrievance(localItem);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialTicket) {
      setTicketInput(initialTicket);
      fetchTicket(initialTicket);
    } else {
      fetchTicket('GR-2026-WB-1001');
    }
  }, [initialTicket]);

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchTicket(ticketInput.trim());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search Bar Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{t.track_title}</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Real-time status tracking, automated SLA timer, and officer assignment.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="e.g. GR-2026-WB-1001"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 text-slate-900 text-sm font-mono focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-2xl text-sm transition shadow-md flex items-center justify-center space-x-2"
          >
            {loading ? <span>Searching...</span> : <span>{t.track_btn}</span>}
          </button>
        </form>

        {/* Demo Ticket Quick Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Quick Demo Tickets:</span>
          <button
            type="button"
            onClick={() => { setTicketInput('GR-2026-WB-1001'); fetchTicket('GR-2026-WB-1001'); }}
            className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold"
          >
            GR-2026-WB-1001 (Bengali Water Critical)
          </button>
          <button
            type="button"
            onClick={() => { setTicketInput('GR-2026-WB-1002'); fetchTicket('GR-2026-WB-1002'); }}
            className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold"
          >
            GR-2026-WB-1002 (Hindi Wire Critical)
          </button>
        </div>
      </div>

      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 text-sm">
          No grievance found with tracking ID: <strong>{ticketInput}</strong>. Please check your tracking number.
        </div>
      )}

      {grievance && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 animate-fade-in space-y-6">
          {/* Header Ticket Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Tracking Code</span>
              <h3 className="text-2xl font-mono font-extrabold text-slate-900">{grievance.ticket_number}</h3>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${
                grievance.priority_level === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-300' :
                grievance.priority_level === 'HIGH' ? 'bg-amber-100 text-amber-700 border border-amber-300' :
                'bg-emerald-100 text-emerald-700 border border-emerald-300'
              }`}>
                {grievance.priority_level} (Priority: {grievance.priority_score}/100)
              </span>

              <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                {grievance.status}
              </span>
            </div>
          </div>

          {/* 5-Step Visual Progress Stepper */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-4">
              AI Grievance Resolution Lifecycle
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">
                1. Submitted ✅
              </div>
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">
                2. AI Triaged ✅
              </div>
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-sm">
                3. Routed to Dept ✅
              </div>
              <div className={`p-2.5 rounded-xl font-bold ${
                grievance.status === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950 animate-pulse'
              }`}>
                4. Field Team Dispatched ⚡
              </div>
              <div className={`p-2.5 rounded-xl font-bold ${
                grievance.status === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                5. Resolved {grievance.status === 'RESOLVED' ? '✅' : '⏳'}
              </div>
            </div>
          </div>

          {/* Grievance Text Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400 font-bold uppercase">
                Citizen Grievance ({grievance.input_language_name})
              </span>
              <span className="text-xs text-slate-500 font-mono">Location: {grievance.ward || grievance.district}</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              "{grievance.original_text}"
            </p>
          </div>

          {/* Department & Officer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase mb-1">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Assigned Department</span>
              </div>
              <div className="text-sm font-bold text-slate-900">{grievance.department_name}</div>
              <div className="text-xs text-slate-500 mt-1">Resolution SLA: <strong>{grievance.sla_hours} Hours Target</strong></div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/60">
              <div className="flex items-center space-x-2 text-sky-800 font-bold text-xs uppercase mb-1">
                <User className="w-4 h-4 text-sky-600" />
                <span>Dispatched Nodal Officer</span>
              </div>
              <div className="text-sm font-bold text-slate-900">{grievance.assigned_officer}</div>
              <div className="text-xs text-slate-500 mt-1">Contact: {grievance.phone}</div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Audit Timeline Trail</span>
            </h4>

            <div className="relative border-l-2 border-emerald-500 ml-3.5 space-y-5 pb-2">
              {(grievance.timeline || []).map((t, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {new Date(t.timestamp).toLocaleString()}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{t.title}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setShowReceiptModal(true)}
              className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Acknowledgement Receipt</span>
            </button>

            <button
              onClick={() => onOpenXAI(grievance)}
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>{t.xai_title}</span>
            </button>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {showReceiptModal && grievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <div className="text-center border-b border-slate-200 pb-4 mb-4">
              <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-extrabold text-base text-slate-900 uppercase">Government of West Bengal / India</h3>
              <p className="text-xs text-slate-500 font-semibold">Official Citizen Grievance Acknowledgement Slip</p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Tracking Code:</span>
                <span className="font-mono font-bold text-slate-900">{grievance.ticket_number}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Citizen Name:</span>
                <span className="font-bold">{grievance.citizen_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Department:</span>
                <span className="font-bold text-emerald-700">{grievance.department_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">AI Priority Level:</span>
                <span className="font-bold text-red-600">{grievance.priority_level} (SLA: {grievance.sla_hours} Hours)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Submission Date:</span>
                <span>{new Date(grievance.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => window.print()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
