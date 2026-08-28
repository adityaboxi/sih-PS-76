import { Department } from '../models/Department.js';

const DEPARTMENTS = [
  {
    code: 'WATER_SUPPLY',
    name: 'Water Supply & Sanitation Department',
    nameLocal: 'জল সরবরাহ ও স্বাস্থ্যবিধান বিভাগ',
    icon: 'Droplets',
    defaultSlaHours: 4,
    emergencyHelpline: '1800-345-5555'
  },
  {
    code: 'ELECTRICITY_POWER',
    name: 'Electricity & Power Distribution',
    nameLocal: 'বিদ্যুৎ ও শক্তি বণ্টন বিভাগ',
    icon: 'Zap',
    defaultSlaHours: 2,
    emergencyHelpline: '1912'
  },
  {
    code: 'PUBLIC_WORKS_ROADS',
    name: 'Public Works & Roads (PWD)',
    nameLocal: 'পূর্ত ও সড়ক বিভাগ (PWD)',
    icon: 'Construction',
    defaultSlaHours: 48,
    emergencyHelpline: '1800-120-1111'
  },
  {
    code: 'HEALTHCARE',
    name: 'Healthcare & Family Welfare',
    nameLocal: 'স্বাস্থ্য ও পরিবার কল্যাণ বিভাগ',
    icon: 'HeartPulse',
    defaultSlaHours: 12,
    emergencyHelpline: '108'
  },
  {
    code: 'SOLID_WASTE',
    name: 'Solid Waste & Urban Cleanliness',
    nameLocal: 'কঠিন বর্জ্য ও পরিচ্ছন্নতা বিভাগ',
    icon: 'Trash2',
    defaultSlaHours: 24,
    emergencyHelpline: '1800-200-3333'
  }
];

export const getDepartments = (req, res) => {
  return res.json({ success: true, count: DEPARTMENTS.length, data: DEPARTMENTS });
};
