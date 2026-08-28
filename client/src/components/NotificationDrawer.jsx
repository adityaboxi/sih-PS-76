import React, { useState, useEffect } from 'react';
import { X, Bell, Mail, Smartphone, CheckCheck, ArrowRight, Clock, Shield } from 'lucide-react';
import { notificationService } from '../services/notificationService';

export default function NotificationDrawer({ isOpen, onClose, onViewTracking }) {
  const [notifications, setNotifications] = useState(notificationService.getAllNotifications());
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((updated) => {
      setNotifications([...updated]);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    setNotifications([...notificationService.getAllNotifications()]);
  };

  const filtered = notifications.filter(n => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 text-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Govt Notification Center</h3>
                <p className="text-[11px] text-slate-400">Live Email & SMS dispatch logs for your complaints</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills & Mark as Read */}
          <div className="flex items-center justify-between py-3 border-b border-slate-800">
            <div className="flex items-center space-x-1.5 text-xs font-bold">
              {['ALL', 'EMAIL', 'SMS'].map((ft) => (
                <button
                  key={ft}
                  onClick={() => setFilterType(ft)}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    filterType === ft
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {ft}
                </button>
              ))}
            </div>

            <button
              onClick={handleMarkAllRead}
              className="text-[11px] text-blue-400 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>
        </div>

        {/* Notifications Scroll Feed */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No notifications yet.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition ${
                  item.read
                    ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                    : 'bg-slate-850 border-blue-500/40 text-white shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider">
                    {item.type === 'EMAIL' ? (
                      <span className="flex items-center space-x-1 text-blue-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Official Email</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-amber-400">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Govt SMS</span>
                      </span>
                    )}
                    <span>•</span>
                    <span className="text-slate-500">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                    {item.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mb-1">{item.subject}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{item.body}</p>

                {item.ticketNumber && item.ticketNumber !== 'SECURITY_AUTH' && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">{item.ticketNumber}</span>
                    <button
                      onClick={() => {
                        onViewTracking(item.ticketNumber);
                        onClose();
                      }}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Track Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500">
          JanSetu National Automated Notification Gateway (SMS + Email)
        </div>
      </div>
    </div>
  );
}
