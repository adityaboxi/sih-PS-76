import React from 'react';
import { FileText, Search, Clock, CheckCircle2, ArrowRight, Shield, Mic, MessageSquare, MapPin, User, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clientAi } from '../services/mockAiEngine';

export default function CitizenDashboard({ onTabChange, onViewTracking, onOpenXAI, t }) {
  const { currentUser } = useAuth();
  const allGrievances = clientAi.getAllGrievances();
  
  const myGrievances = allGrievances.filter(g => 
    g.citizen_name.toLowerCase().includes('aditi') || 
    g.phone === currentUser.phone || 
    g.id.includes('seed-1') ||
    !g.is_duplicate
  );

  const activeCount = myGrievances.filter(g => g.status !== 'RESOLVED').length;
  const resolvedCount = myGrievances.filter(g => g.status === 'RESOLVED').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2.5">
            <User className="w-3.5 h-3.5" />
            <span>Citizen Portal • {currentUser.district}, {currentUser.state}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Hello, {currentUser.name}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg font-medium">
            Report any water, electricity, road, or civic issue in your mother tongue and track its real-time resolution.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => onTabChange('file')}
          className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold px-6 py-3.5 rounded-2xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
        >
          <FileText className="w-4 h-4" />
          <span>Report an Issue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Simple Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-slate-400 mb-1">Total Reported</div>
          <div className="text-3xl font-black text-slate-900">{myGrievances.length}</div>
          <div className="text-xs text-slate-500 mt-1">Complaints logged into system</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-amber-600 mb-1">In Progress</div>
          <div className="text-3xl font-black text-amber-600">{activeCount}</div>
          <div className="text-xs text-slate-500 mt-1">Under active officer repair</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase text-blue-600 mb-1">Resolved</div>
          <div className="text-3xl font-black text-blue-600">{resolvedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Fixed within statutory SLA</div>
        </div>
      </div>

      {/* My Complaints List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">My Complaints & Live Status</h3>
            <p className="text-xs text-slate-500">Click "Track Live" on any complaint to see its timeline and download the official receipt.</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {myGrievances.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800">
                    {item.ticket_number}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    item.priority_level === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    item.priority_level === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {item.priority_level} Priority
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{item.department_name}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  "{item.original_text}"
                </p>

                <div className="text-xs text-slate-400 flex items-center space-x-3 pt-1">
                  <span>Location: <strong>{item.ward || item.district}</strong></span>
                  <span>•</span>
                  <span>Target Resolution: <strong className="text-slate-700">{item.sla_hours} Hours</strong></span>
                </div>
              </div>

              {/* Track Action */}
              <button
                onClick={() => onViewTracking(item.ticket_number)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5 cursor-pointer whitespace-nowrap self-end md:self-center"
              >
                <span>Track Live</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
