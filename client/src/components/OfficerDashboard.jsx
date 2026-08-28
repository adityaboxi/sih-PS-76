import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Table, Filter, CheckCircle2, Clock, MapPin, HelpCircle, ArrowRight, UserCheck, RefreshCw, Send, ArrowLeftRight, X } from 'lucide-react';
import { clientAi, VALID_DEPARTMENTS } from '../services/mockAiEngine';
import { useAuth } from '../context/AuthContext';

export default function OfficerDashboard({ t, onOpenXAI, onViewTracking }) {
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState('kanban');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [grievances, setGrievances] = useState([]);
  
  // Re-routing Modal State
  const [reroutingItem, setReroutingItem] = useState(null);
  const [targetDeptId, setTargetDeptId] = useState('WATER_SUPPLY');
  const [rerouteReason, setRerouteReason] = useState('');

  const fetchGrievances = () => {
    let all = clientAi.getAllGrievances();
    if (currentUser.departmentId) {
      all = all.filter(g => g.department_id === currentUser.departmentId || g.department_id === 'WATER_SUPPLY');
    }
    setGrievances(all);
  };

  useEffect(() => {
    fetchGrievances();
  }, [currentUser]);

  const handleUpdateStatus = (id, newStatus) => {
    clientAi.updateStatus(id, newStatus, `Officer ${currentUser.name} updated ticket status to ${newStatus}.`);
    fetchGrievances();
  };

  const handleExecuteReroute = (e) => {
    e.preventDefault();
    if (!reroutingItem) return;
    clientAi.rerouteGrievance(reroutingItem.id, targetDeptId, rerouteReason);
    setReroutingItem(null);
    setRerouteReason('');
    fetchGrievances();
  };

  const filtered = grievances.filter(g => {
    if (priorityFilter === 'ALL') return true;
    return g.priority_level === priorityFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Officer Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2 border border-indigo-500/30">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{currentUser.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{t.officer_title}</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl font-medium">{t.officer_subtitle}</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t.kanban_view}</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{t.table_view}</span>
          </button>
        </div>
      </div>

      {/* Priority Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[
          { key: 'ALL', label: t.filter_all },
          { key: 'CRITICAL', label: t.filter_critical },
          { key: 'HIGH', label: t.filter_high },
          { key: 'MEDIUM', label: t.filter_medium },
          { key: 'LOW', label: t.filter_low }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setPriorityFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
              priorityFilter === f.key
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Kanban Board Feed */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                    {item.ticket_number}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                    item.priority_level === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    item.priority_level === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {item.priority_level} ({item.priority_score}/100)
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                  {item.department_name}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed font-medium">
                  "{item.original_text}"
                </p>

                <div className="text-[11px] text-slate-400 space-y-1 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.ward || item.district}</span>
                  </div>
                  <div>Citizen: <strong>{item.citizen_name}</strong> ({item.phone})</div>
                  <div>SLA Window: <strong className="text-slate-800 font-bold">{item.sla_hours} {t.hours_unit}</strong></div>
                </div>
              </div>

              {/* Action Buttons: Inspect XAI, Re-route, Dispatch/Resolve */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenXAI(item)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                  title="Inspect AI Reasoning (XAI)"
                >
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                </button>

                <button
                  onClick={() => setReroutingItem(item)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                  title="Re-route to another department"
                >
                  <ArrowLeftRight className="w-4 h-4 text-amber-600" />
                </button>

                {item.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleUpdateStatus(item.id, item.status === 'SUBMITTED' ? 'IN_PROGRESS' : 'RESOLVED')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white transition shadow-xs flex items-center justify-center space-x-1 cursor-pointer ${
                      item.status === 'SUBMITTED' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    <span>{item.status === 'SUBMITTED' ? t.action_dispatch : t.action_resolve}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 text-center">
                    ✓ {t.status_resolved}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Ticket</th>
                <th className="p-4">Department & Ward</th>
                <th className="p-4">Citizen Description</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-mono font-bold text-slate-900">{item.ticket_number}</td>
                  <td className="p-4">{item.department_name}<br/><span className="text-[10px] text-slate-400">{item.ward}</span></td>
                  <td className="p-4 max-w-xs truncate">"{item.original_text}"</td>
                  <td className="p-4"><span className="font-bold">{item.priority_level}</span></td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold">{item.status}</span></td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => onOpenXAI(item)} className="text-indigo-600 font-bold hover:underline">XAI</button>
                    <button onClick={() => setReroutingItem(item)} className="text-amber-600 font-bold hover:underline">Re-route</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Re-Routing Modal (Edge Case Guard) */}
      {reroutingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setReroutingItem(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 font-bold">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Inter-Departmental Re-Routing</h3>
                <p className="text-xs text-slate-500 font-medium">Transfer ticket to another authority with full audit logging.</p>
              </div>
            </div>

            <form onSubmit={handleExecuteReroute} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Government Department:</label>
                <select
                  value={targetDeptId}
                  onChange={(e) => setTargetDeptId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:border-indigo-500"
                >
                  {Object.values(VALID_DEPARTMENTS).map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Re-Routing:</label>
                <textarea
                  rows={3}
                  required
                  value={rerouteReason}
                  onChange={(e) => setRerouteReason(e.target.value)}
                  placeholder="e.g. Field inspection confirmed this issue is under PWD road maintenance jurisdiction."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReroutingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
                >
                  Confirm & Re-route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
