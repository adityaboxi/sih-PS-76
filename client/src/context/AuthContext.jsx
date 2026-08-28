import React, { createContext, useContext, useState, useEffect } from 'react';
import { PAN_INDIA_GEOGRAPHY } from '../locales/panIndiaGeo';

export const DEMO_ROLES = [
  {
    id: 'citizen',
    name: 'Aditi Roy',
    role: 'CITIZEN',
    title: 'Citizen (नागरिक / নাগরিক)',
    phone: '9876543210',
    email: 'aditi.roy@citizen.gov.in',
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
    phone: '9820011223',
    email: 'rajesh.deshmukh@mh.gov.in',
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
    phone: '9415022334',
    email: 'kn.verma@uppcl.gov.in',
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
    phone: '9830099887',
    email: 'p.mukherjee@jansetu.gov.in',
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
    phone: '9945033445',
    email: 'collector.bengaluru@kar.nic.in',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    preferredLanguage: 'en',
    allowedTabs: ['analytics', 'gis', 'officer', 'review_queue', 'track']
  }
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // STRICT AUTHENTICATION: Must Sign Up or Log In first
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('jansetu_auth_session_v3');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return null; // Start logged out
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('jansetu_auth_session_v3');
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loginUser = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('jansetu_auth_session_v3', JSON.stringify(userData));
    } catch (e) {}
  };

  const registerCitizen = ({ name, phone, state, district, ward, preferredLanguage }) => {
    const p = phone || '9876543210';
    const newUser = {
      id: 'citizen_' + p,
      name: name || 'Citizen User',
      role: 'CITIZEN',
      title: 'Citizen (नागरिक / নাগরিক)',
      phone: p,
      email: p + '@citizen.nic.in',
      state: state || 'West Bengal',
      district: district || 'Kolkata',
      ward: ward || 'Ward 8 (Jadavpur)',
      preferredLanguage: preferredLanguage || 'en',
      allowedTabs: ['citizen_home', 'file', 'track']
    };
    loginUser(newUser);
    return newUser;
  };

  const registerOfficer = ({ name, email, departmentId, departmentName, state, district, role }) => {
    const em = email || 'officer@gov.in';
    const newUser = {
      id: 'officer_' + Date.now(),
      name: name || 'Government Officer',
      role: role || 'NODAL_OFFICER',
      departmentId: departmentId || 'WATER_SUPPLY',
      departmentName: departmentName || 'Water Supply Department',
      title: 'Officer (' + (departmentName || 'Civic') + ')',
      phone: '9800000000',
      email: em,
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
      localStorage.removeItem('jansetu_auth_session_v3');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      loginUser,
      registerCitizen,
      registerOfficer,
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
      registerCitizen: () => {},
      registerOfficer: () => {},
      switchRole: () => {},
      logout: () => {},
      isAuthModalOpen: false,
      setIsAuthModalOpen: () => {},
      DEMO_ROLES
    };
  }
  return context;
};
