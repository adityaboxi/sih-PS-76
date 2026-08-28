import React, { useState } from 'react';
import Navbar from './components/Navbar';
import GrievanceForm from './components/GrievanceForm';
import GrievanceTracker from './components/GrievanceTracker';
import OfficerDashboard from './components/OfficerDashboard';
import GISHeatmap from './components/GISHeatmap';
import AnalyticsView from './components/AnalyticsView';
import XAIDrawer from './components/XAIDrawer';
import ChatAssistant from './components/ChatAssistant';
import { DICTIONARY } from './locales/translations';

export default function App() {
  const [currentLang, setCurrentLang] = useState('bn'); // Default Bengali as requested
  const [activeTab, setActiveTab] = useState('file');
  const [selectedXAI, setSelectedXAI] = useState(null);
  const [isXAIModalOpen, setIsXAIModalOpen] = useState(false);
  const [trackingTicket, setTrackingTicket] = useState(null);

  const t = DICTIONARY[currentLang] || DICTIONARY.en;

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

      {/* Floating Multilingual RAG Citizen Chatbot */}
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
