import React, { useState, useEffect } from 'react';
import { Shield, Globe, FileText, Search, LayoutDashboard, BarChart3, MapPin, ShieldAlert, ChevronDown, User, Home, LogOut, Bell } from 'lucide-react';
import { LANGUAGES } from '../locales/translations';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';

export default function Navbar({ currentLang, onLanguageChange, activeTab, onTabChange, onOpenNotifications, t }) {
  const { currentUser, setIsAuthModalOpen, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(notificationService.getUnreadCount());

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(() => {
      setUnreadCount(notificationService.getUnreadCount());
    });
    return unsubscribe;
  }, []);

  const allTabDefs = {
    citizen_home: { key: 'citizen_home', label: 'My Home', icon: Home },
    file: { key: 'file', label: t.nav_file_grievance || 'Report Issue', icon: FileText },
    track: { key: 'track', label: t.nav_track_status || 'Track Status', icon: Search },
    officer: { key: 'officer', label: t.nav_officer_board || 'Officer Workspace', icon: LayoutDashboard },
    review_queue: { key: 'review_queue', label: t.nav_review_queue || 'Review Queue', icon: ShieldAlert },
    gis: { key: 'gis', label: t.nav_gis || 'City Map', icon: MapPin },
    analytics: { key: 'analytics', label: t.nav_analytics || 'Analytics', icon: BarChart3 }
  };

  const allowedTabKeys = currentUser.allowedTabs || ['citizen_home', 'file', 'track'];
  const visibleTabs = allowedTabKeys.map(k => allTabDefs[k]).filter(Boolean);

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Clean Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onTabChange(allowedTabKeys[0] || 'file')}
          >
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-blue-400 transition">
                  {t.portal_title || 'JanSetu AI'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300">
                  National Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden md:block">
                Simple, Fair & Fast Civic Grievance Redressal
              </p>
            </div>
          </div>

          {/* Clean Segmented Navigation */}
          <nav className="hidden lg:flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {visibleTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Notification Bell + Role Pill + Language Dropdown + Logout */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Notification Bell with Badge */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition cursor-pointer"
              title="Open Notification Center (Email & SMS Logs)"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Switcher Pill */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer"
              title="Click to Switch Role"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-slate-200">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase">({currentUser.role.replace('_', ' ')})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400 mr-1.5 flex-shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white py-1">
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700 text-slate-400 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="lg:hidden flex items-center justify-around bg-slate-950 py-2.5 border-t border-slate-800 px-2 text-xs">
        {visibleTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-col items-center p-1 font-bold ${isActive ? 'text-blue-400' : 'text-slate-400'}`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[10px]">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
