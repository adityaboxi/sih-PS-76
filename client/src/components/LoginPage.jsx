import React, { useState } from 'react';
import { Shield, User, Building2, Mail, Lock, ArrowRight, CheckCircle2, Globe, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES } from '../locales/translations';
import { PAN_INDIA_GEOGRAPHY } from '../locales/panIndiaGeo';
import { VALID_DEPARTMENTS } from '../services/mockAiEngine';
import { notificationService } from '../services/notificationService';

export default function LoginPage({ currentLang, onLanguageChange, t }) {
  const { loginUser, registerCitizenWithEmail, registerOfficerWithEmail, DEMO_ROLES } = useAuth();
  const [authTab, setAuthTab] = useState('citizen'); // 'citizen' or 'officer'
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Citizen Form State (Email-Based)
  const [citizenName, setCitizenName] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [citizenState, setCitizenState] = useState('West Bengal');
  const availableDistricts = PAN_INDIA_GEOGRAPHY[citizenState]?.districts || ['Kolkata', 'Howrah'];
  const [citizenDistrict, setCitizenDistrict] = useState(availableDistricts[0]);
  const [citizenWard, setCitizenWard] = useState('Ward 8 (Jadavpur)');

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

  const handleCitizenSubmit = (e) => {
    e.preventDefault();
    if (!citizenEmail) return;

    if (isSignUp) {
      registerCitizenWithEmail({
        name: citizenName || 'Citizen User',
        email: citizenEmail,
        password: citizenPassword,
        state: citizenState,
        district: citizenDistrict,
        ward: citizenWard,
        preferredLanguage: currentLang
      });
    } else {
      const matched = DEMO_ROLES.find(r => r.email === citizenEmail && r.role === 'CITIZEN') || {
        id: 'citizen_' + citizenEmail.replace(/[^a-zA-Z0-9]/g, '_'),
        name: citizenName || citizenEmail.split('@')[0],
        role: 'CITIZEN',
        title: t.citizen || 'Citizen',
        email: citizenEmail,
        phone: '9876543210',
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
    if (!officerEmail) return;
    const deptInfo = VALID_DEPARTMENTS[officerDeptId] || VALID_DEPARTMENTS.WATER_SUPPLY;
    registerOfficerWithEmail({
      name: officerName || (officerRole === 'ADMIN_COLLECTOR' ? 'District Magistrate, IAS' : 'Nodal Officer'),
      email: officerEmail,
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
      {/* Top Utility Bar */}
      <header className="max-w-6xl w-full mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white">{t.portal_title || 'JanSetu AI'}</span>
            <span className="text-[10px] font-bold ml-2 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300">
              {t.national_portal || 'National Portal'}
            </span>
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
                <h2 className="text-xl font-black text-white">Reset Account Password</h2>
                <p className="text-xs text-slate-400 mt-1">We will send a 6-digit verification code to your registered email address.</p>
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
                    <label className="block text-xs font-bold text-slate-400 mb-1">Email Address:</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
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
                  onClick={() => { setAuthTab('citizen'); }}
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
                  onClick={() => { setAuthTab('officer'); }}
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

              {/* CITIZEN EMAIL LOGIN / SIGNUP FLOW */}
              {authTab === 'citizen' && (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-black text-white">
                      {isSignUp ? (t.create_account || 'Create Citizen Account') : 'Citizen Email Sign In'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {isSignUp ? 'Sign up with your email to report civic grievances and receive tracking updates.' : 'Enter your registered email and password to access your dashboard.'}
                    </p>
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
                      <label className="block text-xs font-bold text-slate-400 mb-1">Email Address:</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={citizenEmail}
                          onChange={(e) => setCitizenEmail(e.target.value)}
                          placeholder="aditi.roy@gmail.com"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-400">{t.security_password || 'Password'}:</label>
                        {!isSignUp && (
                          <button
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-[11px] text-blue-400 hover:underline font-bold cursor-pointer"
                          >
                            {t.forgot_password || 'Forgot Password?'}
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={citizenPassword}
                          onChange={(e) => setCitizenPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
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

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs font-extrabold transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>{isSignUp ? (t.create_account || 'Create Citizen Account') : 'Sign In to Dashboard'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => { setIsSignUp(!isSignUp); }}
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
                    <p className="text-xs text-slate-400 mt-1">Single Sign-On for State Nodal Officers & District Magistrates.</p>
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
                        {r.email}
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
