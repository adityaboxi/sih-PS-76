import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, ArrowRight, HelpCircle, Layers, AlertTriangle, RefreshCw, Check, MessageSquare } from 'lucide-react';
import { clientAi } from '../services/mockAiEngine';

export default function TriageReviewQueue({ onOpenXAI, onViewTracking }) {
  const [reviewItems, setReviewItems] = useState([]);

  const fetchItems = () => {
    const all = clientAi.getAllGrievances();
    setReviewItems(all.filter(g => g.verification_status === 'FLAGGED_REVIEW' || g.priority_score < 40));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleApprove = (id, targetDept) => {
    clientAi.updateStatus(id, 'SUBMITTED', 'Triage Review Officer verified and approved complaint for field routing.');
    const item = clientAi.getGrievanceById(id);
    if (item) {
      item.verification_status = 'VERIFIED';
      item.priority_level = 'HIGH';
      item.priority_score = 75;
    }
    fetchItems();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-2 border border-purple-500/30">
              <ShieldAlert className="w-4 h-4" />
              <span>Zero-Discard Human-in-the-Loop Safeguard</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Triage Review & Verification Queue</h2>
            <p className="text-purple-200 text-xs sm:text-sm mt-1 max-w-2xl">
              Suspected spam, ambiguous complaints, or low-specificity submissions are routed here for human validation so that <strong>no genuine citizen emergency is ever deleted</strong>.
            </p>
          </div>

          <button
            onClick={fetchItems}
            className="self-start md:self-auto bg-white text-purple-950 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md hover:bg-purple-50 flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* List of Flagged Grievances */}
      <div className="space-y-4">
        {reviewItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">All Triage Queues Clear!</h3>
            <p className="text-xs text-slate-500 mt-1">No flagged or ambiguous grievances pending review.</p>
          </div>
        ) : (
          reviewItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-purple-200 hover:border-purple-300 transition flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-black bg-purple-100 text-purple-900 px-2.5 py-1 rounded-lg">
                    {item.ticket_number}
                  </span>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    Spam Score: {Math.round(item.spam_score * 100)}%
                  </span>
                  <span className="text-xs text-slate-400">Lang: {item.input_language_name}</span>
                </div>

                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  "{item.original_text}"
                </p>

                <div className="text-xs text-slate-500 flex items-center space-x-4">
                  <span>Citizen: <strong>{item.citizen_name}</strong> ({item.phone})</span>
                  <span>Location: <strong>{item.ward || item.district}</strong></span>
                </div>
              </div>

              {/* Triage Officer Actions */}
              <div className="flex items-center space-x-2.5 flex-shrink-0">
                <button
                  onClick={() => onOpenXAI(item)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center space-x-1"
                >
                  <HelpCircle className="w-4 h-4 text-slate-600" />
                  <span>Inspect XAI</span>
                </button>

                <button
                  onClick={() => handleApprove(item.id, item.department_id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify as Genuine</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
