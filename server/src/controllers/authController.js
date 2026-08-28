import { User } from '../models/User.js';
import { isDBConnected } from '../db/connection.js';

export const requestOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ success: false, error: 'Valid 10-digit phone number is required' });
  }
  // Simulated OTP (1234 for demo)
  return res.json({
    success: true,
    message: 'OTP sent successfully to registered mobile',
    demo_otp: '1234'
  });
};

export const verifyOtpAndLogin = async (req, res) => {
  const { phone, otp, name, role } = req.body;
  
  if (!phone || !otp) {
    return res.status(400).json({ success: false, error: 'Phone and OTP are required' });
  }

  const userPayload = {
    id: `u-${phone.slice(-4)}`,
    phone,
    name: name || 'Aditi Roy',
    role: role || 'CITIZEN',
    token: `jwt-simulated-${Date.now()}`
  };

  return res.json({
    success: true,
    message: 'Authentication successful',
    user: userPayload
  });
};
