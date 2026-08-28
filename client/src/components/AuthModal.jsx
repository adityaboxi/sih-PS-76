import React, { useState } from 'react';
import { X, UserCheck, Shield, Crown, Building2, Zap, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, switchRole, USER_ROLES } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="h-11 w-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">JanSetu Role & Authority Switcher</h3>
            <p className="text-xs text-slate-500 font-medium">Switch roles instantly to test citizen and officer workflows for judges.</p>
          </div>
        </div>

        {/* 1-Click Role Switcher Grid */}
        <div className="mb-6">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-2.5">
            ⚡ Select Active Role for Hackathon Demo:
          </span>

          <div className="space-y-2.5">
            {Object.entries(USER_ROLES).map(([key, role]) => {
              const isSelected = currentUser.title === role.title;
              return (
                <div
                  key={key}
                  onClick={() => { switchRole(key); onClose(); }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl border font-bold text-xs ${role.badgeColor}`}>
                      {role.icon === 'Crown' ? <Crown className="w-4 h-4" /> :
                       role.icon === 'Zap' ? <Zap className="w-4 h-4" /> :
                       role.icon === 'Building2' ? <Building2 className="w-4 h-4" /> :
                       <Shield className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                        <span>{role.name}</span>
                        {isSelected && <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.2 rounded-full">Active</span>}
                      </div>
                      <div className="text-[11px] text-slate-500">{role.title} • {role.district}</div>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-300'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Simulated Citizen OTP Login */}
        <div className="border-t border-slate-100 pt-4">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block mb-2">
            📲 Or Login via Citizen Mobile OTP:
          </span>
          <form onSubmit={otpSent ? handleVerify : handleSendOtp} className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={otpSent ? otp : phoneNumber}
                onChange={(e) => otpSent ? setOtp(e.target.value) : setPhoneNumber(e.target.value)}
                placeholder={otpSent ? "Enter 4-digit OTP (e.g. 1234)" : "Enter 10-digit Phone Number"}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition whitespace-nowrap"
            >
              {otpSent ? "Verify & Login" : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
