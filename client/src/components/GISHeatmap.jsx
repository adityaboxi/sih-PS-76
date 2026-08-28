import React, { useState } from 'react';
import { MapPin, Layers, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, Activity, Building, Compass } from 'lucide-react';
import { clientAi } from '../services/mockAiEngine';

export default function GISHeatmap({ onOpenXAI, onViewTracking }) {
  const [selectedWard, setSelectedWard] = useState('All Wards');
  const grievances = clientAi.getAllGrievances();

  const wards = [
    { name: 'Ward 8 (Jadavpur)', lat: 22.4988, lng: 88.3698, total: 14, critical: 6, masterIncident: 'GR-2026-WB-1001 (Water Pipeline Burst)' },
    { name: 'Ward 12 (Salt Lake)', lat: 22.5867, lng: 88.4178, total: 8, critical: 3, masterIncident: 'GR-2026-WB-1002 (11KV Wire Snap)' },
    { name: 'Ward 4 (Howrah)', lat: 22.5958, lng: 88.2636, total: 11, critical: 4, masterIncident: 'Road Cave-in (NH Flyover)' },
    { name: 'Ward 108 (EM Bypass)', lat: 22.5123, lng: 88.4011, total: 5, critical: 1, masterIncident: 'None' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2 border border-indigo-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Municipal Geospatial Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">City GIS Grievance & Cluster Heatmap</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl font-medium">
            Real-time geospatial hotspot density, emergency hazard pins, and duplicate incident cluster mapping.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/90 px-3.5 py-2 rounded-2xl border border-slate-700 text-xs font-bold">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Live GPS Telemetry Active</span>
        </div>
      </div>

      {/* Main GIS Visualization & Ward Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive GIS Grid Simulation (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Metropolitan Ward Map Grid (Kolkata & Howrah)</span>
              </h3>
              <span className="text-xs font-mono font-bold text-slate-400">EPSG:4326 WGS84</span>
            </div>

            {/* Simulated Clean GIS Map Canvas */}
            <div className="relative h-80 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 p-6 overflow-hidden flex items-center justify-center">
              {/* Subtle Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

              {/* Hotspot 1: Jadavpur Ward 8 */}
              <div className="absolute top-1/3 left-1/4 group cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-rose-400 opacity-60"></span>
                  <div className="h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black shadow-lg">
                    6
                  </div>
                </div>
                <div className="mt-1 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-bold text-white whitespace-nowrap shadow-md">
                  Ward 8 (Jadavpur) • 6 Critical
                </div>
              </div>

              {/* Hotspot 2: Salt Lake Ward 12 */}
              <div className="absolute top-1/4 right-1/4 group cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-amber-400 opacity-50"></span>
                  <div className="h-5 w-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-lg">
                    3
                  </div>
                </div>
                <div className="mt-1 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-bold text-white whitespace-nowrap shadow-md">
                  Ward 12 (Salt Lake) • 3 High
                </div>
              </div>

              {/* Hotspot 3: Howrah Ward 4 */}
              <div className="absolute bottom-1/4 left-1/3 group cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-rose-400 opacity-50"></span>
                  <div className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black shadow-lg">
                    4
                  </div>
                </div>
                <div className="mt-1 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-bold text-white whitespace-nowrap shadow-md">
                  Ward 4 (Howrah) • 4 Critical
                </div>
              </div>

              <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-mono bg-slate-950/80 px-2 py-1 rounded-md border border-slate-800">
                Lat: 22.5726° N • Long: 88.3639° E
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span>Critical Hazard</span></span>
              <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>High Priority</span></span>
              <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Routine</span></span>
            </div>
            <span>Updated 2s ago</span>
          </div>
        </div>

        {/* Ward Breakdown Cards (Right col) */}
        <div className="space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900">Ward Density & Active Master Incidents</h3>
          
          {wards.map((w, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:border-indigo-300 transition">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900">{w.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                  {w.critical} Critical
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mb-2">
                Total Complaints: <strong>{w.total}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-600">
                <span className="font-bold text-slate-800">Master Cluster:</span> {w.masterIncident}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
