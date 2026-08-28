import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck, Award, Clock } from 'lucide-react';
import { clientAi } from '../services/mockAiEngine';

export default function AnalyticsView({ t }) {
  const grievances = clientAi.getAllGrievances();
  const total = grievances.length;
  const critical = grievances.filter(g => g.priority_level === 'CRITICAL').length;
  const resolved = grievances.filter(g => g.status === 'RESOLVED').length;
  const duplicates = grievances.filter(g => g.is_duplicate).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2">
          {t.analytics_title}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
          {t.analytics_subtitle}
        </p>
      </div>

      {/* KPI Cards Grid (Apple Minimalist Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.stat_total_intake}</span>
            <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 font-bold"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-slate-900">{total}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">↑ 100% Ingested with Zero Loss</div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.stat_critical_emergency}</span>
            <div className="p-2 rounded-2xl bg-rose-50 text-rose-600 font-bold"><AlertTriangle className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-rose-600">{critical}</div>
          <div className="text-[11px] text-rose-500 font-bold mt-1">Assigned 2–4h SLA Targets</div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.stat_resolved_rate}</span>
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-600 font-bold"><CheckCircle2 className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {total > 0 ? Math.round((resolved / total) * 100) : 0}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">{resolved} Complaints Closed</div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.stat_sla_adherence}</span>
            <div className="p-2 rounded-2xl bg-purple-50 text-purple-600 font-bold"><Award className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-purple-600">96.4%</div>
          <div className="text-[11px] text-purple-500 font-bold mt-1">High Citizen Satisfaction</div>
        </div>
      </div>
    </div>
  );
}
