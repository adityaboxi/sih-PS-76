import React, { createContext, useContext, useState, useEffect } from 'react';
import { PAN_INDIA_GEOGRAPHY } from '../locales/panIndiaGeo';
import { notificationService } from '../services/notificationService';

export const DEMO_ROLES = [
  {
    id: 'citizen',
    name: 'Aditi Roy',
    role: 'CITIZEN',
    title: 'Citizen',
    email: 'aditi.roy@citizen.gov.in',
    phone: '9876543210',
    state: 'West Bengal',
    district: 'Kolkata',
    ward: 'Ward 8 (Jadavpur)',
    preferredLanguage: 'en',
    allowedTabs: ['citizen_home', 'file', 'track']
  },
  {
    id: 'officer_water',
    name: 'Er. Rajesh Deshmukh',
    role: 'NODAL_OFFICER',
    departmentId: 'WATER_SUPPLY',
    departmentName: 'Water Supply & Jal Jeevan Mission',
    title: 'Nodal Officer (Water Supply)',
    email: 'rajesh.deshmukh@mh.gov.in',
    phone: '9820011223',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    preferredLanguage: 'en',
    allowedTabs: ['officer', 'track', 'gis']
  },
  {
    id: 'officer_power',
    name: 'K. N. Verma, EE',
    role: 'NODAL_OFFICER',
    departmentId: 'ELECTRICITY_POWER',
    departmentName: 'State Electricity Distribution (DISCOM)',
    title: 'Executive Engineer (Power Grid)',
    email: 'kn.verma@uppcl.gov.in',
    phone: '9415022334',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    preferredLanguage: 'en',
    allowedTabs: ['officer', 'track', 'gis']
  },
  {
    id: 'triage_supervisor',
    name: 'P. Mukherjee',
    role: 'TRIAGE_SUPERVISOR',
    title: 'Zero-Discard Triage Supervisor',
    email: 'p.mukherjee@jansetu.gov.in',
    phone: '9830099887',
    state: 'National Portal',
    district: 'Central Triage Cell',
    preferredLanguage: 'en',
    allowedTabs: ['review_queue', 'officer', 'gis', 'analytics']
  },
  {
    id: 'district_magistrate',
    name: 'Dr. Anand Kumar, IAS',
    role: 'ADMIN_COLLECTOR',
    title: 'District Magistrate & Collector (IAS)',
    email: 'collector.bengaluru@kar.nic.in',
    phone: '9945033445',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    preferredLanguage: 'en',
    allowedTabs: ['analytics', 'gis', 'officer', 'review_queue', 'track']
  }
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('jansetu_auth_session_email_v4');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return null; // Start unauthenticated
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('jansetu_auth_session_email_v4');
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loginUser = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('jansetu_auth_session_email_v4', JSON.stringify(userData));
    } catch (e) {}
  };

  // Email-Based Citizen Registration
  const registerCitizenWithEmail = ({ name, email, password, state, district, ward, preferredLanguage }) => {
    const cleanEmail = email.trim().toLowerCase();
    const newUser = {
      id: 'citizen_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
      name: name || 'Citizen User',
      role: 'CITIZEN',
      title: 'Citizen',
      email: cleanEmail,
      phone: '9876543210',
      state: state || 'West Bengal',
      district: district || 'Kolkata',
      ward: ward || 'Ward 8 (Jadavpur)',
      preferredLanguage: preferredLanguage || 'en',
      allowedTabs: ['citizen_home', 'file', 'track']
    };
    loginUser(newUser);

    // Dispatch welcome notification to user's real email
    try {
      notificationService.dispatchWelcomeEmail(cleanEmail, name);
    } catch (e) {}

    return newUser;
  };

  // Email-Based Official Registration
  const registerOfficerWithEmail = ({ name, email, departmentId, departmentName, state, district, role }) => {
    const cleanEmail = email.trim().toLowerCase();
    const newUser = {
      id: 'officer_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
      name: name || 'Government Officer',
      role: role || 'NODAL_OFFICER',
      departmentId: departmentId || 'WATER_SUPPLY',
      departmentName: departmentName || 'Water Supply Department',
      title: 'Officer (' + (departmentName || 'Civic') + ')',
      email: cleanEmail,
      phone: '9800000000',
      state: state || 'National Portal',
      district: district || 'Central District',
      preferredLanguage: 'en',
      allowedTabs: role === 'ADMIN_COLLECTOR' ? ['analytics', 'gis', 'officer', 'review_queue', 'track'] : ['officer', 'track', 'gis']
    };
    loginUser(newUser);
    return newUser;
  };

  const switchRole = (roleId) => {
    const target = DEMO_ROLES.find(r => r.id === roleId) || DEMO_ROLES[0];
    loginUser(target);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('jansetu_auth_session_email_v4');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      loginUser,
      registerCitizenWithEmail,
      registerOfficerWithEmail,
      switchRole,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      DEMO_ROLES
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: null,
      isAuthenticated: false,
      loginUser: () => {},
      registerCitizenWithEmail: () => {},
      registerOfficerWithEmail: () => {},
      switchRole: () => {},
      logout: () => {},
      isAuthModalOpen: false,
      setIsAuthModalOpen: () => {},
      DEMO_ROLES
    };
  }
  return context;
};
