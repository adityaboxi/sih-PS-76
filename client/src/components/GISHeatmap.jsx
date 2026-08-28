import React, { useState } from 'react';
import { MapPin, Layers, AlertCircle, Building2, Flame, CheckCircle } from 'lucide-react';
import { clientAi } from '../services/mockAiEngine';

export default function GISHeatmap({ onOpenXAI, onViewTracking }) {
  const grievances = clientAi.getAllGrievances();
  const [selectedWard, setSelectedWard] = useState('ALL');

  const wards = [
    { name: 'Ward 8 (Jadavpur / South)', critical: 2, total: 5, lat: 22.4988, lng: 88.3712 },
    { name: 'Ward 14 (Howrah Station / Central)', critical: 1, total: 3, lat: 22.5850, lng: 88.3426 },
    { name: 'Ward 22 (Salt Lake Sector 5)', critical: 1, total: 4, lat: 22.5800, lng: 88.4300 },
    { name: 'Ward 31 (New Town / North)', critical: 0, total: 2, lat: 22.5950, lng: 88.4800 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-extrabold text-slate-900">City GIS Grievance & Cluster Heatmap</h2>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Active Hotspots</span>
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Geospatial visualization of citizen reports, semantic duplicate clusters, and field dispatch status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Simulated GIS Map Canvas */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 text-white relative min-h-[460px] flex flex-col justify-between overflow-hidden">
          {/* Grid lines background */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">Kolkata & Greater Region GIS Grid</span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span>Critical</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>High</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Routine</span></span>
            </div>
          </div>

          {/* Interactive Grievance Hotspots on Map */}
          <div className="relative z-10 my-auto grid grid-cols-2 gap-8 p-4">
            {wards.map((w, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedWard(w.name)}
                className={`p-4 rounded-2xl border cursor-pointer transition transform hover:scale-105 ${
                  selectedWard === w.name
                    ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-white flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{w.name}</span>
                  </span>
                  {w.critical > 0 && (
                    <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                      {w.critical} Critical
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">
                  Total Incidents: <strong className="text-white">{w.total}</strong> | Coords: {w.lat}, {w.lng}
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-3">
            <span>Spatial Clustering: <strong>DBSCAN + Cosine Vector Distance</strong></span>
            <span>Real-time GIS Sync: <strong>Active</strong></span>
          </div>
        </div>

        {/* Selected Ward Detail Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
              Ward Hotspot Analysis
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Detailed breakdown of complaints and duplicate incidents in selected zone.
            </p>

            <div className="space-y-3">
              {grievances.slice(0, 3).map(g => (
                <div key={g.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="font-mono">{g.ticket_number}</span>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] ${g.priority_level === 'CRITICAL' ? 'text-red-700 bg-red-100' : 'text-emerald-700 bg-emerald-100'}`}>
                      {g.priority_level}
                    </span>
                  </div>
                  <p className="text-slate-700 line-clamp-2">{g.original_text}</p>
                  <div className="flex justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                    <span>{g.department_name}</span>
                    <button onClick={() => onOpenXAI(g)} className="text-emerald-700 font-bold underline">
                      Inspect AI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
            <strong>Pro Tip:</strong> Semantic duplicate detection merges repeat complaints within a 500m radius, saving field officer dispatch time by 42%.
          </div>
        </div>
      </div>
    </div>
  );
}
