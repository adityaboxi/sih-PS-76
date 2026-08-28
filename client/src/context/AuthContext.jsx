import React, { createContext, useContext, useState, useEffect } from 'react';

export const USER_ROLES = {
  CITIZEN: {
    id: 'CITIZEN',
    name: 'Aditi Roy (Citizen)',
    title: 'Citizen Complainant',
    phone: '9876543210',
    district: 'Kolkata',
    ward: 'Ward 8 (Jadavpur)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: 'User'
  },
  WATER_OFFICER: {
    id: 'OFFICER',
    departmentId: 'WATER_SUPPLY',
    name: 'Er. Soumen Banerjee',
    title: 'Executive Engineer (Water Supply & Sanitation)',
    phone: '9830011223',
    district: 'Kolkata',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: 'Building2'
  },
  POWER_OFFICER: {
    id: 'OFFICER',
    departmentId: 'ELECTRICITY_POWER',
    name: 'K. N. Verma',
    title: 'Divisional Inspector (Electricity & Power)',
    phone: '9830055443',
    district: 'Howrah',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: 'Zap'
  },
  TRIAGE_OFFICER: {
    id: 'TRIAGE',
    name: 'P. Mukherjee',
    title: 'Zero-Discard Triage Supervisor',
    phone: '9830077889',
    district: 'State Central Control Room',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: 'ShieldCheck'
  },
  DISTRICT_MAGISTRATE: {
    id: 'ADMIN',
    name: 'Dr. Rajesh Kumar, IAS',
    title: 'District Magistrate & Collector',
    phone: '9830099001',
    district: 'Kolkata District HQ',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    icon: 'Crown'
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('jansetu_active_user');
    return saved ? JSON.parse(saved) : USER_ROLES.CITIZEN;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('jansetu_active_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (roleKey) => {
    if (USER_ROLES[roleKey]) {
      setCurrentUser(USER_ROLES[roleKey]);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, switchRole, USER_ROLES, isAuthModalOpen, setIsAuthModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
