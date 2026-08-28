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
import { DICTIONARY } from './locales/translations';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getSocket } from './services/socketClient';

function MainApp() {
  const [currentLang, setCurrentLang] = useState(() => import.meta.env.VITE_DEFAULT_LANGUAGE || 'bn');
  const [activeTab, setActiveTab] = useState('file');
  const [selectedXAI, setSelectedXAI] = useState(null);
  const [isXAIModalOpen, setIsXAIModalOpen] = useState(false);
  const [trackingTicket, setTrackingTicket] = useState(null);
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  const t = DICTIONARY[currentLang] || DICTIONARY.en;

  // Initialize WebSockets for real-time live events
  useEffect(() => {
    const socket = getSocket();
    socket.on('grievance:created', (data) => {
      console.log('⚡ [Real-Time WebSocket] New Grievance Created:', data.ticket_number);
    });
    socket.on('grievance:updated', (data) => {
      console.log('⚡ [Real-Time WebSocket] Grievance Status Updated:', data.ticket_number, data.status);
    });
    return () => {
      socket.off('grievance:created');
      socket.off('grievance:updated');
    };
  }, []);

  const handleOpenXAI = (grievance) => {
    setSelectedXAI(grievance);
    setIsXAIModalOpen(true);
  };

  const handleViewTracking = (ticketNumber) => {
    setTrackingTicket(ticketNumber);
    setActiveTab('track');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        t={t}
      />

      <main className="flex-1">
        {activeTab === 'file' && (
          <GrievanceForm
            currentLang={currentLang}
            t={t}
            onOpenXAI={handleOpenXAI}
            onViewTracking={handleViewTracking}
            onGrievanceCreated={() => {}}
          />
        )}

        {activeTab === 'track' && (
          <GrievanceTracker
            t={t}
            initialTicket={trackingTicket}
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

      {/* Floating Multilingual Conversational RAG Assistant */}
      <ChatAssistant
        currentLang={currentLang}
        t={t}
        onViewTracking={handleViewTracking}
      />

      {/* Explainable AI Transparent Reasoning Inspector */}
      <XAIDrawer
        grievance={selectedXAI}
        isOpen={isXAIModalOpen}
        onClose={() => setIsXAIModalOpen(false)}
        t={t}
      />

      {/* Role & Authority Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-6 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-300">
            JanSetu AI — AI-Based Citizen Grievance Prioritization and Routing System
          </p>
          <p className="text-slate-500">
            Smart India Hackathon 2026 | Problem Statement 76 | Developed for High-Scale Multilingual Public Governance
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
