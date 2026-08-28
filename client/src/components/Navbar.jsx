import React from 'react';
import { Shield, Globe, FileText, Search, LayoutDashboard, BarChart3, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { LANGUAGES } from '../locales/translations';

export default function Navbar({ currentLang, onLanguageChange, activeTab, onTabChange, t }) {
  return (
    <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-40 border-b border-slate-800">
      {/* Indian Tricolor Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600"></div>

      {/* Emergency Helpline Strip */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-1 text-[11px] text-slate-400 hidden sm:flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-1.5"></span>
            National Grievance Portal (SIH 2026 PS 76)
          </span>
          <span>Emergency Toll-Free: <strong>112 (Police) | 1912 (Power) | 108 (Ambulance)</strong></span>
        </div>
        <div className="flex items-center space-x-3 font-semibold text-emerald-400">
          <span>⚡ Zero-Discard AI Triage Active</span>
          <span>•</span>
          <span>12+ Indian Languages Supported</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('file')}>
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
              <Shield className="w-6 h-6 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  {t.portal_title}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  PS 76
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                AI Citizen Grievance Prioritization & Routing System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onTabChange('file')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'file'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.nav_file_grievance}</span>
            </button>

            <button
              onClick={() => onTabChange('track')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'track'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{t.nav_track_status}</span>
            </button>

            <button
              onClick={() => onTabChange('officer')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'officer'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.nav_officer_board}</span>
            </button>

            <button
              onClick={() => onTabChange('gis')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'gis'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>GIS Heatmap</span>
            </button>

            <button
              onClick={() => onTabChange('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'analytics'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{t.nav_analytics}</span>
            </button>
          </nav>

          {/* Language Selector Dropdown */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center bg-slate-800/90 border border-slate-700 rounded-2xl px-3 py-1.5 shadow-inner">
              <Globe className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer pr-2"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white py-1">
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around bg-slate-950 py-2.5 border-t border-slate-800 px-2 text-[10px]">
        <button
          onClick={() => onTabChange('file')}
          className={`flex flex-col items-center p-1 ${activeTab === 'file' ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>{t.nav_file_grievance}</span>
        </button>
        <button
          onClick={() => onTabChange('track')}
          className={`flex flex-col items-center p-1 ${activeTab === 'track' ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}`}
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span>{t.nav_track_status}</span>
        </button>
        <button
          onClick={() => onTabChange('officer')}
          className={`flex flex-col items-center p-1 ${activeTab === 'officer' ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>{t.nav_officer_board}</span>
        </button>
        <button
          onClick={() => onTabChange('gis')}
          className={`flex flex-col items-center p-1 ${activeTab === 'gis' ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}`}
        >
          <MapPin className="w-4 h-4 mb-0.5" />
          <span>GIS Map</span>
        </button>
        <button
          onClick={() => onTabChange('analytics')}
          className={`flex flex-col items-center p-1 ${activeTab === 'analytics' ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>{t.nav_analytics}</span>
        </button>
      </div>
    </header>
  );
}
