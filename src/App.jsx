import React, { useState, useMemo } from 'react';
import {
  Send, Search, Clock, CheckCircle, AlertCircle,
  Users, FolderOpen, ExternalLink, Loader2, Sparkles,
  X, ChevronDown, ChevronUp
} from 'lucide-react';

// ============================================================
// DATA GENERATION
// ============================================================

const DEPARTMENTS = [
  'Health', 'Electricity', 'Sanitation', 'Water Supply',
  'Roads & Transport', 'Police', 'Education', 'Housing',
  'Agriculture', 'Environment'
];

const STATUSES = ['Processing', 'Assigned', 'Resolved', 'Closed'];

const SAMPLE_TEXTS = [
  'There is a huge pothole on MG Road near the bus stop. It\'s causing accidents.',
  'Our colony has no electricity since last night. Transformer is damaged.',
  'The hospital is refusing to admit patients without a referral. My mother is sick.',
  'Garbage hasn\'t been collected from our street for 10 days. Stray dogs are everywhere.',
  'Water supply is irregular in our area. Only 1 hour per day.',
  'A stray dog bit a child in the park. No one is taking action.',
  'The school building roof is leaking during rains. Students are getting wet.',
  'A pothole on the highway caused a bus accident yesterday. 3 injured.',
  'Electric wires are hanging loose on our street. Very dangerous for kids.',
  'The sewage drain is overflowing onto the road. Smell is unbearable.',
  'Our village has no clean drinking water for the last 2 weeks.',
  'A transformer blasted near the market. Fire brigade arrived late.',
  'The local clinic has no oxygen cylinders. Patients are suffering.',
  'Streetlights on Sector 12 are broken for 3 months. Total darkness at night.',
  'A group of miscreants is creating trouble near the temple. Police not responding.',
  'Our school has no drinking water facilities. Students are falling sick.',
  'The bridge connecting our village to the main road is collapsing.',
  'A dead animal is lying on the road since yesterday. No one has removed it.',
  'The electricity bill is showing double the normal amount. No one is resolving.',
  'A water pipe burst on Main Street. Water is flooding shops.',
  'My father is having a heart attack and the nearest hospital is closed.',
  'The transformer near our school caught fire. Children are scared.',
  'Sewage water is mixing with drinking water in our colony.',
  'The main road has collapsed due to heavy rains. No one is fixing it.',
  'A gang of thieves is active in our area. Police is not responding.',
  'The local hospital has no blood supply for emergency patients.',
  'Power lines are down on sector 5. People are getting electric shocks.',
  'The garbage dump near our school is causing diseases.',
  'There is no water in our taps for the last 5 days.',
  'A bridge on the highway is cracked and dangerous.',
];

const NAMES = ['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Sneha Reddy', 'Vikram Kumar', 'Ananya Iyer', 'Rajesh Gupta', 'Meena Nair', 'Suresh Rao', 'Lakshmi Menon'];
const OFFICERS = ['Dr. Sharma', 'Mr. Gupta', 'Ms. Nair', 'Mr. Patil', 'Dr. Rao', 'Ms. Iyer', 'Mr. Singh'];

const randomDate = (days) => {
  const d = new Date();
  d.setHours(d.getHours() - Math.floor(Math.random() * days * 24) - Math.floor(Math.random() * 60));
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const generateData = (count = 30) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const text = SAMPLE_TEXTS[i % SAMPLE_TEXTS.length];
    const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const priority = Math.floor(Math.random() * 8) + 2;
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];

    const reasons = [];
    const kw = {
      health: ['heart', 'ambulance', 'hospital', 'injury', 'sick', 'oxygen', 'blood'],
      electricity: ['power', 'transformer', 'electric', 'wire', 'lines'],
      sanitation: ['garbage', 'sewage', 'drain', 'waste', 'dump'],
      water: ['water', 'pipe', 'tap', 'drinking', 'taps'],
      roads: ['road', 'pothole', 'bridge', 'traffic', 'highway'],
      police: ['police', 'stolen', 'robbery', 'threat', 'gang']
    };
    const found = (kw[dept.toLowerCase()] || []).filter(k => text.toLowerCase().includes(k));
    if (found.length) {
      reasons.push({ factor: `Keywords: "${found.slice(0, 3).join(', ')}"`, weight: 0.4 });
    }
    if (priority > 7) {
      reasons.push({ factor: 'Public safety concern', weight: 0.30 });
    } else if (priority < 4) {
      reasons.push({ factor: 'Routine maintenance', weight: 0.20 });
    }
    if (reasons.length === 0) {
      reasons.push({ factor: `Routed to ${dept}`, weight: 0.50 });
    }

    items.push({
      id: `G-${String(i + 1001).padStart(4, '0')}`,
      text,
      department: dept,
      priority,
      status,
      reasoning: {
        classification: dept,
        confidence: 0.78 + Math.random() * 0.20,
        priority,
        reasons,
        duplicate: Math.random() < 0.08,
        duplicateOf: null
      },
      createdAt: randomDate(Math.floor(Math.random() * 30) + 1),
      citizenName: NAMES[Math.floor(Math.random() * NAMES.length)],
      assignedTo: OFFICERS[Math.floor(Math.random() * OFFICERS.length)]
    });
  }
  items.sort((a, b) => b.priority - a.priority);
  return items;
};

// ============================================================
// APP COMPONENT
// ============================================================

function App() {
  const [grievances, setGrievances] = useState(generateData(30));
  const [activeTab, setActiveTab] = useState('submit');

  // Form state
  const [form, setForm] = useState({ name: '', phone: '', text: '', language: 'English' });
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  // Track state
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState(null);

  // Admin filters
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  // ── AI Simulator ──
  const simulateAI = (text) => {
    const lower = text.toLowerCase();
    let dept = 'Health';
    let priority = 5;

    const rules = [
      { words: ['electric', 'power', 'transformer', 'wire', 'lines'], dept: 'Electricity', priority: 7 },
      { words: ['garbage', 'sewage', 'drain', 'waste', 'dump'], dept: 'Sanitation', priority: 6 },
      { words: ['water', 'pipe', 'tap', 'drinking', 'taps'], dept: 'Water Supply', priority: 6 },
      { words: ['road', 'pothole', 'bridge', 'traffic', 'highway'], dept: 'Roads & Transport', priority: 7 },
      { words: ['police', 'stolen', 'robbery', 'threat', 'gang'], dept: 'Police', priority: 8 },
      { words: ['school', 'student', 'teacher', 'education'], dept: 'Education', priority: 4 },
      { words: ['hospital', 'ambulance', 'heart', 'injury', 'sick', 'oxygen', 'blood'], dept: 'Health', priority: 9 },
    ];

    for (const r of rules) {
      if (r.words.some(w => lower.includes(w))) {
        dept = r.dept;
        priority = r.priority;
        break;
      }
    }

    if (lower.includes('emergency') || lower.includes('urgent')) priority = Math.min(10, priority + 2);
    if (lower.includes('accident') || lower.includes('collapsed')) priority = Math.min(10, priority + 1);

    return { department: dept, priority };
  };

  // ── Handlers ──
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    setSubmitting(true);

    setTimeout(() => {
      const result = simulateAI(form.text);
      const newItem = {
        id: `G-${String(grievances.length + 1001).padStart(4, '0')}`,
        text: form.text,
        department: result.department,
        priority: result.priority,
        status: 'Assigned',
        reasoning: {
          classification: result.department,
          confidence: 0.85 + Math.random() * 0.12,
          priority: result.priority,
          reasons: [
            { factor: `Keywords: "${form.text.split(' ').slice(0, 4).join(' ')}..."`, weight: 0.40 },
            { factor: `Routed to ${result.department}`, weight: 0.30 },
            { factor: result.priority > 7 ? 'High distress detected' : 'Routine', weight: 0.30 }
          ],
          duplicate: false,
          duplicateOf: null
        },
        createdAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        citizenName: form.name || 'Anonymous',
        assignedTo: OFFICERS[Math.floor(Math.random() * OFFICERS.length)]
      };

      setGrievances([newItem, ...grievances]);
      setSubmittedId(newItem.id);
      setSubmitting(false);
      setForm({ name: '', phone: '', text: '', language: 'English' });

      setTimeout(() => {
        setActiveTab('track');
        setTrackId(newItem.id);
        setTrackResult(newItem);
      }, 500);
    }, 2000);
  };

  const handleTrack = (id) => {
    const searchId = id || trackId;
    if (!searchId) return;
    const found = grievances.find(g => g.id === searchId);
    setTrackResult(found || null);
  };

  // ── Filter ──
  const filtered = useMemo(() => {
    let data = [...grievances];
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(g => g.id.toLowerCase().includes(s) || g.text.toLowerCase().includes(s));
    }
    if (filterDept !== 'All') data = data.filter(g => g.department === filterDept);
    if (filterStatus !== 'All') data = data.filter(g => g.status === filterStatus);
    if (filterPriority === 'High') data = data.filter(g => g.priority >= 7);
    else if (filterPriority === 'Medium') data = data.filter(g => g.priority >= 4 && g.priority <= 6);
    else if (filterPriority === 'Low') data = data.filter(g => g.priority <= 3);
    return data;
  }, [grievances, search, filterDept, filterStatus, filterPriority]);

  // ── Helpers ──
  const priorityClass = (p) => {
    if (p >= 9) return 'bg-red-100 text-red-800 border-red-300';
    if (p >= 7) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (p >= 4) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const statusClass = (s) => {
    const map = {
      'Processing': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Assigned': 'bg-blue-100 text-blue-800 border-blue-300',
      'Resolved': 'bg-green-100 text-green-800 border-green-300',
      'Closed': 'bg-gray-100 text-gray-600 border-gray-300'
    };
    return map[s] || '';
  };

  const statusIcon = (s) => {
    const map = {
      'Processing': <Loader2 className="w-4 h-4 animate-spin" />,
      'Assigned': <Clock className="w-4 h-4" />,
      'Resolved': <CheckCircle className="w-4 h-4" />,
      'Closed': <CheckCircle className="w-4 h-4" />
    };
    return map[s] || <AlertCircle className="w-4 h-4" />;
  };

  const priorityLabel = (p) => {
    if (p >= 9) return 'Critical';
    if (p >= 7) return 'High';
    if (p >= 4) return 'Medium';
    return 'Low';
  };

  // ============================================================
  // RENDER FUNCTIONS
  // ============================================================

  const renderSubmit = () => (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Send className="w-6 h-6 text-blue-600" />
          File a Grievance
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Raj Kumar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="9876543210"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Odia'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Describe Your Issue <span className="text-red-500">*</span></label>
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              placeholder="Describe your complaint in detail..."
              required
            />
            <p className="text-xs text-gray-400 mt-1">{form.text.length} characters</p>
          </div>
          <button
            type="submit"
            disabled={submitting || !form.text.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> AI Processing...</>
            ) : (
              <><Send className="w-5 h-5" /> Submit Grievance</>
            )}
          </button>
        </form>
        {submittedId && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 animate-in">
            ✅ Submitted! ID: <strong>{submittedId}</strong> — Track it below
          </div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            AI Will Help You
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><span className="text-blue-500">✓</span> Auto-route to department</li>
            <li className="flex items-start gap-2"><span className="text-blue-500">✓</span> Priority scoring (1-10)</li>
            <li className="flex items-start gap-2"><span className="text-blue-500">✓</span> Detect duplicates</li>
            <li className="flex items-start gap-2"><span className="text-blue-500">✓</span> Transparent reasoning</li>
          </ul>
          <div className="mt-4 p-3 bg-white/60 rounded-xl text-xs text-gray-500">🌐 Supports 10+ Indian languages</div>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
          <h4 className="font-medium text-green-800 text-sm">📊 Live Stats</h4>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <p className="text-2xl font-bold text-gray-800">{grievances.length}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{grievances.filter(g => g.status === 'Resolved').length}</p>
              <p className="text-xs text-gray-500">Resolved</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
          <h4 className="font-medium text-orange-800 text-sm">🔥 High Priority</h4>
          <p className="text-2xl font-bold text-orange-600">{grievances.filter(g => g.priority >= 7).length}</p>
          <p className="text-xs text-gray-500">Need immediate attention</p>
        </div>
      </div>
    </div>
  );

  const renderTrack = () => {
    let content = null;

    if (trackResult) {
      const g = trackResult;
      content = (
        <div className="mt-6 border-t pt-6 animate-in">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{g.id}</h3>
              <p className="text-sm text-gray-500">Submitted: {g.createdAt}</p>
              <p className="text-sm text-gray-500">By: {g.citizenName}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${priorityClass(g.priority)}`}>
                Priority {g.priority} · {priorityLabel(g.priority)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusClass(g.status)}`}>
                {statusIcon(g.status)} {g.status}
              </span>
            </div>
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border">
              <p className="text-xs text-gray-500 uppercase font-semibold">Department</p>
              <p className="font-medium mt-1">{g.department}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border">
              <p className="text-xs text-gray-500 uppercase font-semibold">Assigned To</p>
              <p className="font-medium mt-1">{g.assignedTo}</p>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 rounded-xl p-4 border">
            <p className="text-xs text-gray-500 uppercase font-semibold">Complaint</p>
            <p className="text-gray-700 mt-1">{g.text}</p>
          </div>

          {/* AI Reasoning */}
          <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Reasoning & Decision Log
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-xs text-gray-500">Classification</p>
                <p className="font-bold text-blue-700">{g.reasoning.classification}</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <p className="text-xs text-gray-500">Confidence</p>
                <p className="font-bold text-green-700">{(g.reasoning.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>
            {g.reasoning.duplicate && (
              <div className="mt-2 bg-orange-100 border border-orange-300 rounded-lg p-2 text-sm text-orange-800">
                ⚠️ Duplicate detected!
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Decision Factors</p>
              {g.reasoning.reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/50 p-2 rounded-lg mb-1.5 text-sm">
                  <span className="text-blue-500 font-bold">→</span>
                  <span className="flex-1">{r.factor}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{(r.weight * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (trackId) {
      content = (
        <div className="mt-6 text-center py-8 text-gray-500 bg-gray-50 rounded-xl border">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p>No grievance found with ID: <strong>{trackId}</strong></p>
        </div>
      );
    } else {
      content = (
        <div className="mt-6 text-center py-10 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed">
          <Search className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p>Enter a Grievance ID to track its status</p>
          <p className="text-xs mt-1">Try: G-1001, G-1002, etc.</p>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Search className="w-6 h-6 text-blue-600" />
            Track Your Grievance
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              placeholder="Enter ID: G-1001"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            />
            <button
              onClick={() => handleTrack()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
            >
              Track
            </button>
          </div>
          {submittedId && (
            <div className="mt-3 text-sm text-green-600 bg-green-50 p-3 rounded-xl border border-green-200 animate-in">
              ✅ Submitted! ID: <strong>{submittedId}</strong>
            </div>
          )}
          {content}
        </div>
      </div>
    );
  };

  const renderAdmin = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: grievances.length, icon: <FolderOpen className="w-6 h-6" />, cls: 'border-l-blue-500' },
          { label: 'High Priority', value: grievances.filter(g => g.priority >= 7).length, icon: <AlertCircle className="w-6 h-6" />, cls: 'border-l-red-500' },
          { label: 'Resolved', value: grievances.filter(g => g.status === 'Resolved').length, icon: <CheckCircle className="w-6 h-6" />, cls: 'border-l-green-500' },
          { label: 'Departments', value: new Set(grievances.map(g => g.department)).size, icon: <Users className="w-6 h-6" />, cls: 'border-l-orange-500' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${stat.cls}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <span className="text-gray-300">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID or text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition min-w-[140px]"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition min-w-[140px]"
          >
            <option value="All">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition min-w-[140px]"
          >
            <option value="All">All Priority</option>
            <option value="High">High (7-10)</option>
            <option value="Medium">Medium (4-6)</option>
            <option value="Low">Low (1-3)</option>
          </select>
          <button
            onClick={() => { setSearch(''); setFilterDept('All'); setFilterStatus('All'); setFilterPriority('All'); }}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.slice(0, 25).map(g => (
                  <tr
                    key={g.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => { setActiveTab('track'); setTrackId(g.id); setTrackResult(null); setTimeout(() => handleTrack(g.id), 100); }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{g.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[200px]">{g.text.slice(0, 55)}...</td>
                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">{g.department}</span></td>
                    <td className="px-4 py-3"><span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityClass(g.priority)}`}>{g.priority}</span></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusClass(g.status)}`}>
                        {statusIcon(g.status)} {g.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition"
                        onClick={(e) => { e.stopPropagation(); setActiveTab('track'); setTrackId(g.id); setTrackResult(null); setTimeout(() => handleTrack(g.id), 100); }}
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">No grievances match your filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t flex justify-between items-center">
          <span>Showing {Math.min(filtered.length, 25)} of {filtered.length} grievances</span>
          <span className="text-gray-400">Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // MAIN RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Grievance AI</h1>
              <p className="text-xs text-blue-100">Smart Citizen Complaints System</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['submit', 'track', 'admin'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeTab === tab
                    ? 'bg-white text-blue-700 shadow-lg'
                    : 'bg-blue-500/20 hover:bg-blue-400/30 text-white'
                }`}
              >
                {tab === 'submit' && <Send className="w-4 h-4 inline mr-1.5" />}
                {tab === 'track' && <Search className="w-4 h-4 inline mr-1.5" />}
                {tab === 'admin' && <FolderOpen className="w-4 h-4 inline mr-1.5" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'submit' && renderSubmit()}
        {activeTab === 'track' && renderTrack()}
        {activeTab === 'admin' && renderAdmin()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          AI-Based Grievance Prioritization System © 2026 · Built for SIH
        </div>
      </footer>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;