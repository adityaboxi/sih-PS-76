import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Filter, CheckCircle, AlertTriangle, Layers, Clock, ArrowUpRight, HelpCircle, Check, ShieldAlert, Users, List, Grid } from 'lucide-react';
import { clientAi } from '../services/mockAiEngine';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export default function OfficerDashboard({ t, onOpenXAI, onViewTracking }) {
  const [grievances, setGrievances] = useState([]);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterDept, setFilterDept] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [loading, setLoading] = useState(false);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await axios.get();
      if (res.data.success) {
        setGrievances(res.data.data);
        setLoading(false);
        return;
      }
    } catch (e) {
      // Local fallback
    }

    setGrievances(clientAi.getAllGrievances());
    setLoading(false);
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/grievances/${id}/status`, {
        status: newStatus,
        notes: `Nodal officer marked ticket as ${newStatus}`
      });
      fetchGrievances();
      return;
    } catch (e) {
      // Local fallback
    }

    clientAi.updateStatus(id, newStatus, `Officer updated status to ${newStatus}`);
    fetchGrievances();
  };

  const filtered = grievances.filter(g => {
    if (filterPriority === 'REVIEW_QUEUE') {
      return g.verification_status === 'FLAGGED_REVIEW';
    }
    if (filterPriority !== 'ALL' && g.priority_level !== filterPriority) return false;
    if (filterDept !== 'ALL' && g.department_id !== filterDept) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-extrabold text-slate-900">{t.officer_title}</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Live AI Queue
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated priority scoring, duplicate clustering, and zero-discard triage queue.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center space-x-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
              title="Kanban Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
              title="Detailed Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={fetchGrievances}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'REVIEW_QUEUE'].map(p => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              filterPriority === p
                ? p === 'CRITICAL' ? 'bg-red-600 text-white shadow-sm' :
                  p === 'HIGH' ? 'bg-amber-600 text-white shadow-sm' :
                  p === 'REVIEW_QUEUE' ? 'bg-purple-700 text-white shadow-sm' :
                  'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{p === 'ALL' ? 'All Grievances' : p === 'REVIEW_QUEUE' ? '🔍 Zero-Discard Review Queue' : p}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
              {grievances.filter(g => p === 'ALL' || (p === 'REVIEW_QUEUE' ? g.verification_status === 'FLAGGED_REVIEW' : g.priority_level === p)).length}
            </span>
          </button>
        ))}
      </div>

      {/* View Mode: Grid (Kanban Style) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(g => (
            <div
              key={g.id}
              className={`bg-white rounded-3xl p-5 shadow-md border transition flex flex-col justify-between ${
                g.priority_level === 'CRITICAL' ? 'border-red-300 ring-2 ring-red-500/10' :
                g.priority_level === 'HIGH' ? 'border-amber-300' :
                g.verification_status === 'FLAGGED_REVIEW' ? 'border-purple-300 bg-purple-50/20' :
                'border-slate-200'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                    {g.ticket_number}
                  </span>

                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    g.priority_level === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-300' :
                    g.priority_level === 'HIGH' ? 'bg-amber-100 text-amber-700 border border-amber-300' :
                    'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  }`}>
                    {g.priority_level} ({g.priority_score})
                  </span>
                </div>

                {/* Department */}
                <div className="text-xs font-extrabold text-emerald-800 mb-2">
                  {g.department_name}
                </div>

                {/* Grievance Text */}
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-3 mb-3 font-medium">
                  "{g.original_text}"
                </p>

                {/* Metadata Strip */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span>Lang: <strong>{g.input_language_name}</strong></span>
                  <span>SLA: <strong>{g.sla_hours}h</strong></span>
                  <span className="font-bold text-slate-800">{g.status}</span>
                </div>

                {g.is_duplicate && (
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold p-2 rounded-xl mb-3 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
                    <span>Linked to Master: {g.master_ticket_id}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenXAI(g)}
                  className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center space-x-1 py-1"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Explain AI</span>
                </button>

                <div className="flex items-center space-x-2">
                  {g.status !== 'RESOLVED' ? (
                    <button
                      onClick={() => handleUpdateStatus(g.id, 'RESOLVED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1 shadow-sm"
                    >
                      <Check className="w-3 h-3" />
                      <span>Resolve</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Resolved</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Ticket</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Grievance Summary</th>
                  <th className="p-4">Language</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">SLA</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50/80">
                    <td className="p-4 font-mono font-bold">{g.ticket_number}</td>
                    <td className="p-4 font-bold text-slate-800">{g.department_name}</td>
                    <td className="p-4 max-w-xs truncate text-slate-600">{g.original_text}</td>
                    <td className="p-4">{g.input_language_name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        g.priority_level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        g.priority_level === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {g.priority_level}
                      </span>
                    </td>
                    <td className="p-4 font-bold">{g.sla_hours}h</td>
                    <td className="p-4 font-bold">{g.status}</td>
                    <td className="p-4 flex items-center space-x-2">
                      <button
                        onClick={() => onOpenXAI(g)}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        XAI
                      </button>
                      <button
                        onClick={() => onViewTracking(g.ticket_number)}
                        className="text-slate-700 font-bold hover:underline"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
