import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GrievanceForm from './components/GrievanceForm';
import GrievanceTracker from './components/GrievanceTracker';
import OfficerDashboard from './components/OfficerDashboard';
import TriageReviewQueue from './components/TriageReviewQueue';
import GISHeatmap from './components/GISHeatmap';
import AnalyticsView from './components/AnalyticsView';
import XAIDrawer from './components/XAIDrawer';
import ChatAssistant from './components/ChatAssistant';
import AuthModal from './components/AuthModal';
import CitizenDashboard from './components/CitizenDashboard';
import LoginPage from './components/LoginPage';
import NotificationDrawer from './components/NotificationDrawer';
import { DICTIONARY as TRANSLATIONS } from './locales/translations';
import { useAuth } from './context/AuthContext';
import { getSocket } from './services/socketClient';

export default function App() {
  const { currentUser, isAuthenticated } = useAuth();
  const [currentLang, setCurrentLang] = useState(import.meta.env.VITE_DEFAULT_LANGUAGE || 'en');
  const [activeTab, setActiveTab] = useState(currentUser.role === 'CITIZEN' ? 'citizen_home' : 'officer');
  
  const [selectedXAIItem, setSelectedXAIItem] = useState(null);
  const [trackTicketParam, setTrackTicketParam] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // When role changes, switch to default allowed tab for that role
  useEffect(() => {
    if (currentUser && currentUser.allowedTabs && !currentUser.allowedTabs.includes(activeTab)) {
      setActiveTab(currentUser.allowedTabs[0] || 'citizen_home');
    }
  }, [currentUser]);

  // Connect Socket for live updates
  useEffect(() => {
    try {
      const socket = getSocket();
      socket.on('grievance:created', (data) => {
        console.log('⚡ Socket event grievance:created:', data);
      });
      return () => {
        socket.off('grievance:created');
      };
    } catch (e) {}
  }, []);

  const handleOpenXAI = (item) => {
    setSelectedXAIItem(item);
  };

  const handleViewTracking = (ticketNumber) => {
    setTrackTicketParam(ticketNumber);
    setActiveTab('track');
  };

  // If not logged in, render the clean Login / Registration portal
  if (!isAuthenticated) {
    return (
      <LoginPage
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        t={t}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'citizen_home' && (
          <CitizenDashboard
            onTabChange={setActiveTab}
            onViewTracking={handleViewTracking}
            onOpenXAI={handleOpenXAI}
            t={t}
          />
        )}

        {activeTab === 'file' && (
          <GrievanceForm
            currentLang={currentLang}
            t={t}
            onOpenXAI={handleOpenXAI}
            onViewTracking={handleViewTracking}
            onGrievanceCreated={(item) => {
              setTrackTicketParam(item.ticket_number);
            }}
          />
        )}

        {activeTab === 'track' && (
          <GrievanceTracker
            currentLang={currentLang}
            t={t}
            initialTicketParam={trackTicketParam}
            onOpenXAI={handleOpenXAI}
          />
        )}

        {activeTab === 'officer' && (
          <OfficerDashboard
            t={t}
            onOpenXAI={handleOpenXAI}
            onViewTracking={handleViewTracking}
          />
        )}

        {activeTab === 'review_queue' && (
          <TriageReviewQueue
            t={t}
            onOpenXAI={handleOpenXAI}
            onViewTracking={handleViewTracking}
          />
        )}

        {activeTab === 'gis' && (
          <GISHeatmap
            onOpenXAI={handleOpenXAI}
            onViewTracking={handleViewTracking}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            t={t}
          />
        )}
      </main>

      {/* Notification Center Drawer (Email & SMS Delivery Logs) */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onViewTracking={handleViewTracking}
      />

      {/* Explainable AI (XAI) Modal Drawer */}
      <XAIDrawer
        isOpen={!!selectedXAIItem}
        onClose={() => setSelectedXAIItem(null)}
        item={selectedXAIItem}
        currentLang={currentLang}
        t={t}
      />

      {/* Floating Pan-India Multilingual RAG Chatbot ("Nagrik Sahayak") */}
      <ChatAssistant
        currentLang={currentLang}
        t={t}
        onViewTracking={handleViewTracking}
      />

      {/* Role Switcher & Phone OTP Modal */}
      <AuthModal
        t={t}
      />
    </div>
  );
}
