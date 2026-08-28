import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, Layers, ShieldAlert, Users, Award } from 'lucide-react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export default function AnalyticsView({ t }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get().then(res => {
      if (res.data.success) {
        setStats(res.data.data);
      }
    }).catch(console.error);
  }, []);

  if (!stats) {
    return <div className="p-8 text-center text-slate-500">Loading Analytics...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900">{t.nav_analytics}</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          City-wide triage performance, multilingual distribution, and duplicate avoidance metrics.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Received</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-200 bg-red-50/20">
          <div className="text-xs font-bold text-red-500 uppercase">Critical Urgency</div>
          <div className="text-2xl font-black text-red-600 mt-1">{stats.critical}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-200 bg-emerald-50/20">
          <div className="text-xs font-bold text-emerald-600 uppercase">Resolved Cases</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.resolved}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-xs font-bold text-slate-400 uppercase">SLA Adherence</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.avgSlaAdherence}%</div>
        </div>
      </div>

      {/* Distribution Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
            Department Load Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.departmentDistribution || {}).map(([dept, count]) => (
              <div key={dept}>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>{dept}</span>
                  <span>{count} tickets</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (count / Math.max(1, stats.total)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
            Multilingual Citizen Intake
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(stats.languageDistribution || {}).map(([lang, count]) => (
              <span
                key={lang}
                className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200"
              >
                {lang}: <strong>{count}</strong>
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            All regional queries are indexed in unified vector embeddings, allowing seamless cross-lingual duplicate detection and routing.
          </p>
        </div>
      </div>
    </div>
  );
}
