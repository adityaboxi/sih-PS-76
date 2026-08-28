import React from 'react';
import { Shield, Globe, FileText, Search, LayoutDashboard, BarChart3, MapPin, ShieldAlert, ChevronDown, User } from 'lucide-react';
import { LANGUAGES } from '../locales/translations';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentLang, onLanguageChange, activeTab, onTabChange, t }) {
  const { currentUser, setIsAuthModalOpen } = useAuth();

  return (
    <header className="bg-slate-950/95 text-slate-100 sticky top-0 z-40 backdrop-blur-xl border-b border-slate-800/80 shadow-md">
      {/* Subtle National Indian Tricolor Accent Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-500 opacity-80"></div>

      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo & Portal Branding */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onTabChange('file')}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-indigo-400 transition">
                  {t.portal_title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SIH PS 76
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden md:block">
                AI Prioritization, Zero-Discard & Multilingual Routing
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (Apple/Linear Segmented Style) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            {[
              { key: 'file', label: t.nav_file_grievance, icon: FileText },
              { key: 'track', label: t.nav_track_status, icon: Search },
              { key: 'officer', label: t.nav_officer_board, icon: LayoutDashboard },
              { key: 'review_queue', label: t.nav_review_queue, icon: ShieldAlert },
              { key: 'gis', label: t.nav_gis, icon: MapPin },
              { key: 'analytics', label: t.nav_analytics, icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Role Switcher + Language Dropdown */}
          <div className="flex items-center space-x-2">
            {/* Active User / Role Switcher Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer"
              title="Click to Switch Role (Citizen / Nodal Officer / DM)"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="hidden sm:inline text-slate-200">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase">({currentUser.id})</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400 mr-1.5 flex-shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-950 text-white py-1">
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around bg-slate-950 py-2 border-t border-slate-800 px-2 text-[10px]">
        <button onClick={() => onTabChange('file')} className={`flex flex-col items-center p-1 ${activeTab === 'file' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
          <FileText className="w-4 h-4 mb-0.5" />
          <span>File</span>
        </button>
        <button onClick={() => onTabChange('track')} className={`flex flex-col items-center p-1 ${activeTab === 'track' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
          <Search className="w-4 h-4 mb-0.5" />
          <span>Track</span>
        </button>
        <button onClick={() => onTabChange('officer')} className={`flex flex-col items-center p-1 ${activeTab === 'officer' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Officer</span>
        </button>
        <button onClick={() => onTabChange('review_queue')} className={`flex flex-col items-center p-1 ${activeTab === 'review_queue' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
          <ShieldAlert className="w-4 h-4 mb-0.5" />
          <span>Review</span>
        </button>
        <button onClick={() => onTabChange('gis')} className={`flex flex-col items-center p-1 ${activeTab === 'gis' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
          <MapPin className="w-4 h-4 mb-0.5" />
          <span>GIS</span>
        </button>
        <button onClick={() => onTabChange('analytics')} className={`flex flex-col items-center p-1 ${activeTab === 'analytics' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>Stats</span>
        </button>
      </div>
    </header>
  );
}
