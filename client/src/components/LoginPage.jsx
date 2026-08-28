import React, { useState, useEffect } from 'react';
import { Shield, User, Building2, Phone, Mail, Lock, ArrowRight, CheckCircle2, Globe, Sparkles, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES } from '../locales/translations';
import { PAN_INDIA_GEOGRAPHY } from '../locales/panIndiaGeo';
import { VALID_DEPARTMENTS } from '../services/mockAiEngine';
import { notificationService } from '../services/notificationService';

export default function LoginPage({ currentLang, onLanguageChange, t }) {
  const { loginUser, registerCitizen, registerOfficer, DEMO_ROLES } = useAuth();
  const [authTab, setAuthTab] = useState('citizen');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Citizen Form State
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenState, setCitizenState] = useState('West Bengal');
  const availableDistricts = PAN_INDIA_GEOGRAPHY[citizenState]?.districts || ['Kolkata', 'Howrah'];
  const [citizenDistrict, setCitizenDistrict] = useState(availableDistricts[0]);
  const [citizenWard, setCitizenWard] = useState('Ward 8 (Jadavpur)');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Officer Form State
  const [officerName, setOfficerName] = useState('');
  const [officerEmail, setOfficerEmail] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [officerDeptId, setOfficerDeptId] = useState('WATER_SUPPLY');
  const [officerRole, setOfficerRole] = useState('NODAL_OFFICER');

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleCitizenSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (citizenPhone.length >= 10) {
        setOtpSent(true);
        setCountdown(60);
      }
      return;
    }

    if (isSignUp) {
      registerCitizen({
        name: citizenName || 'Citizen User',
        phone: citizenPhone,
        state: citizenState,
        district: citizenDistrict,
        ward: citizenWard,
        preferredLanguage: currentLang
      });
    } else {
      const matched = DEMO_ROLES.find(r => r.phone === citizenPhone && r.role === 'CITIZEN') || {
        id: 'citizen_' + citizenPhone,
        name: citizenName || 'Citizen User',
        role: 'CITIZEN',
        title: t.citizen || 'Citizen',
        phone: citizenPhone,
        email: citizenPhone + '@citizen.nic.in',
        state: citizenState,
        district: citizenDistrict,
        ward: citizenWard,
        preferredLanguage: currentLang,
        allowedTabs: ['citizen_home', 'file', 'track']
      };
      loginUser(matched);
    }
  };

  const handleOfficerSubmit = (e) => {
    e.preventDefault();
    const deptInfo = VALID_DEPARTMENTS[officerDeptId] || VALID_DEPARTMENTS.WATER_SUPPLY;
    registerOfficer({
      name: officerName || (officerRole === 'ADMIN_COLLECTOR' ? 'District Magistrate, IAS' : 'Nodal Officer'),
      email: officerEmail || 'officer@gov.in',
      departmentId: officerDeptId,
      departmentName: deptInfo.name,
      state: citizenState,
      district: citizenDistrict,
      role: officerRole
    });
  };

  const handleSendResetOtp = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    const generatedOtp = '582914';
    notificationService.dispatchPasswordResetOtp(resetEmail, generatedOtp);
    setResetOtpSent(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (resetOtp.length >= 4 && newPassword.length >= 6) {
      setResetSuccess(true);
      setTimeout(() => {
        setIsForgotPassword(false);
        setResetSuccess(false);
        setResetOtpSent(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Simple Utility Bar */}
      <header className="max-w-6xl w-full mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white">{t.portal_title || 'JanSetu AI'}</span>
            <span className="text-[10px] font-bold ml-2 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300">{t.national_portal || 'National Portal'}</span>
          </div>
        </div>

        {/* Global Language Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
          <Globe className="w-4 h-4 text-blue-400" />
          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                {lang.native}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-lg w-full mx-auto px-4 py-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* FORGOT PASSWORD WORKFLOW */}
          {isForgotPassword ? (
            <div>
              <button
                onClick={() => { setIsForgotPassword(false); setResetOtpSent(false); }}
                className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white mb-4 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>

              <div className="text-center mb-6">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-white">Reset Official Password</h2>
                <p className="text-xs text-slate-400 mt-1">We will send a 6-digit security OTP to your registered government email.</p>
              </div>

              {resetSuccess ? (
                <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-500/40 text-center space-y-1 text-xs text-blue-300 font-bold animate-fade-in">
                  <CheckCircle2 className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <div>Password Reset Successfully!</div>
                  <div className="text-[11px] text-slate-400 font-normal">Redirecting you to sign in...</div>
                </div>
              ) : !resetOtpSent ? (
                <form onSubmit={handleSendResetOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">{t.official_email || 'Official Government Email'}:</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="officer.name@nic.in"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300">
                    OTP sent to <strong>{resetEmail}</strong> (Demo OTP: <strong>582914</strong>)
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Enter 6-Digit Email OTP:</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      placeholder="582914"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono tracking-widest text-center text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">New Secure Password:</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition shadow-md shadow-blue-600/30 cursor-pointer"
                  >
                    Confirm & Update Password
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* Role Tab Switcher */}
              <div className="flex rounded-2xl bg-slate-950 p-1.5 mb-6 border border-slate-800">
                <button
                  onClick={() => { setAuthTab('citizen'); setOtpSent(false); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                    authTab === 'citizen'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{t.citizen || 'Citizen'}</span>
                </button>

                <button
                  onClick={() => { setAuthTab('officer'); setOtpSent(false); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                    authTab === 'officer'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>{t.govt_official || 'Government Official'}</span>
                </button>
              </div>

              {/* CITIZEN LOGIN / SIGNUP FLOW */}
              {authTab === 'citizen' && (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-white">
                      {isSignUp ? (t.create_account || 'Create Citizen Account') : (t.citizen_sign_in || 'Citizen Mobile OTP Sign In')}
                    </h2>
                  </div>

                  <form onSubmit={handleCitizenSubmit} className="space-y-4">
                    {isSignUp && (
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">{t.full_name || 'Full Name'}:</label>
                        <input
                          type="text"
                          required
                          value={citizenName}
                          onChange={(e) => setCitizenName(e.target.value)}
                          placeholder="e.g. Aditi Roy"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">{t.mobile_number || 'Mobile Number'}:</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">+91</span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={citizenPhone}
                          onChange={(e) => setCitizenPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210"
                          className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {isSignUp && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">{t.state || 'State'}:</label>
                            <select
                              value={citizenState}
                              onChange={(e) => {
                                const st = e.target.value;
                                setCitizenState(st);
                                const dists = PAN_INDIA_GEOGRAPHY[st]?.districts || [];
                                if (dists.length > 0) setCitizenDistrict(dists[0]);
                              }}
                              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                            >
                              {Object.keys(PAN_INDIA_GEOGRAPHY).map((st) => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">{t.district || 'District'}:</label>
                            <select
                              value={citizenDistrict}
                              onChange={(e) => setCitizenDistrict(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                            >
                              {availableDistricts.map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1">{t.ward_locality || 'Ward / Locality'}:</label>
                          <input
                            type="text"
                            value={citizenWard}
                            onChange={(e) => setCitizenWard(e.target.value)}
                            placeholder="e.g. Ward 8 (Jadavpur), Sector 5"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </>
                    )}

                    {otpSent && (
                      <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-blue-300 font-bold">Verification SMS OTP:</span>
                          <span className="text-slate-400 text-[10px]">Demo OTP: <strong>1234</strong></span>
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP (e.g. 1234)"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-blue-400 text-sm font-mono tracking-widest text-center text-white focus:outline-none"
                        />
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>{countdown > 0 ? `Resend code in ${countdown}s` : 'Did not receive code?'}</span>
                          {countdown === 0 && (
                            <button
                              type="button"
                              onClick={() => setCountdown(60)}
                              className="text-blue-400 hover:underline font-bold cursor-pointer"
                            >
                              Resend SMS OTP
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs font-extrabold transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>{otpSent ? (t.verify_continue || 'Verify & Continue to Dashboard') : (t.send_otp || 'Send Verification OTP')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => { setIsSignUp(!isSignUp); setOtpSent(false); }}
                        className="text-xs text-blue-400 hover:underline font-bold cursor-pointer"
                      >
                        {isSignUp ? (t.already_have_account || 'Already have an account? Sign In') : (t.register_new_citizen || "Don't have an account? Register as New Citizen")}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* OFFICIAL / AUTHORITY LOGIN FLOW */}
              {authTab === 'officer' && (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-white">{t.govt_official || 'Government Official'} Sign In</h2>
                  </div>

                  <form onSubmit={handleOfficerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">{t.auth_role || 'Administrative Role'}:</label>
                      <select
                        value={officerRole}
                        onChange={(e) => setOfficerRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="NODAL_OFFICER">Department Nodal Officer</option>
                        <option value="TRIAGE_SUPERVISOR">Zero-Discard Triage Supervisor</option>
                        <option value="ADMIN_COLLECTOR">District Magistrate & Collector (IAS)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">{t.official_email || 'Official Government Email'}:</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={officerEmail}
                          onChange={(e) => setOfficerEmail(e.target.value)}
                          placeholder="officer.name@nic.in"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">{t.assigned_dept || 'Assigned Department'}:</label>
                      <select
                        value={officerDeptId}
                        onChange={(e) => setOfficerDeptId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                      >
                        {Object.values(VALID_DEPARTMENTS).map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-400">{t.security_password || 'Security Password'}:</label>
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-[11px] text-blue-400 hover:underline font-bold cursor-pointer"
                        >
                          {t.forgot_password || 'Forgot Password?'}
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={officerPassword}
                          onChange={(e) => setOfficerPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs font-extrabold transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>{t.authenticate_btn || 'Authenticate & Open Workspace'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* FAST 1-CLICK JUDGE DEMO LOGIN STRIP */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-3 text-center">
                  ⚡ {t.fast_demo_logins || 'Fast Demo Logins'}:
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => loginUser(r)}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition cursor-pointer group"
                    >
                      <div className="text-[11px] font-bold text-white group-hover:text-blue-400 truncate">
                        {r.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {r.role.replace('_', ' ')} • {r.district || r.state}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-500">
        JanSetu AI • {t.national_portal || 'National Public Grievance Portal'}
      </footer>
    </div>
  );
}
