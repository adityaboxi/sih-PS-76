import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'grievances_data.json');

const INITIAL_DEPARTMENTS = [
  { id: 'WATER_SUPPLY', code: 'WATER_SUPPLY', name_en: 'Water Supply & Sanitation', name_bn: 'জল সরবরাহ ও স্যানিটেশন বিভাগ', name_hi: 'जल आपूर्ति एवं स्वच्छता विभाग', sla_critical: 4, sla_routine: 48, active_officers: 14 },
  { id: 'ELECTRICITY_POWER', code: 'ELECTRICITY_POWER', name_en: 'Electricity & Power Distribution', name_bn: 'বিদ্যুৎ ও শক্তি বণ্টন বিভাগ', name_hi: 'विद्युत एवं ऊर्जा वितरण विभाग', sla_critical: 2, sla_routine: 24, active_officers: 22 },
  { id: 'ROADS_PUBLIC_WORKS', code: 'ROADS_PUBLIC_WORKS', name_en: 'Public Works & Roads (PWD)', name_bn: 'পূর্ত ও সড়ক বিভাগ (PWD)', name_hi: 'लोक निर्माण एवं सड़क विभाग (PWD)', sla_critical: 12, sla_routine: 72, active_officers: 18 },
  { id: 'HEALTH_PUBLIC_SAFETY', code: 'HEALTH_PUBLIC_SAFETY', name_en: 'Healthcare & Public Health', name_bn: 'স্বাস্থ্য ও জনস্বাস্থ্য বিভাগ', name_hi: 'स्वास्थ्य एवं जन स्वास्थ्य विभाग', sla_critical: 2, sla_routine: 24, active_officers: 30 },
  { id: 'MUNICIPAL_WASTE', code: 'MUNICIPAL_WASTE', name_en: 'Solid Waste & Urban Cleanliness', name_bn: 'কঠিন বর্জ্য ও পুর পরিচ্ছন্নতা বিভাগ', name_hi: 'ठोस अपशिष्ट एवं नगर स्वच्छता विभाग', sla_critical: 8, sla_routine: 48, active_officers: 25 },
  { id: 'FOOD_CIVIL_SUPPLIES', code: 'FOOD_CIVIL_SUPPLIES', name_en: 'Food & Civil Supplies (PDS / Ration)', name_bn: 'খাদ্য ও গণবণ্টন বিভাগ (রেশন)', name_hi: 'खाद्य एवं नागरिक आपूर्ति विभाग (राशन)', sla_critical: 24, sla_routine: 72, active_officers: 12 },
  { id: 'POLICE_PUBLIC_ORDER', code: 'POLICE_PUBLIC_ORDER', name_en: 'Police, Traffic & Public Safety', name_bn: 'পুলিশ ও জননিরাপত্তা বিভাগ', name_hi: 'पुलिस एवं जन सुरक्षा विभाग', sla_critical: 1, sla_routine: 24, active_officers: 45 },
  { id: 'WOMEN_CHILD_WELFARE', code: 'WOMEN_CHILD_WELFARE', name_en: 'Women & Child Development', name_bn: 'নারী ও শিশু কল্যাণ বিভাগ', name_hi: 'महिला एवं बाल विकास विभाग', sla_critical: 4, sla_routine: 48, active_officers: 10 }
];

const INITIAL_GRIEVANCES = [
  {
    id: 'g-101',
    ticket_number: 'GR-2026-WB-1001',
    citizen_name: 'Aditi Roy',
    phone: '9876543210',
    original_text: 'আমাদের যাদবপুর ৮ নম্বর ওয়ার্ডে গত তিন দিন ধরে প্রধান পাইপ ফেটে পানীয় জল নষ্ট হচ্ছে এবং জল সরবরাহ বন্ধ রয়েছে। এলাকার বাচ্চারা অসুস্থ হয়ে পড়ছে।',
    input_language: 'bn',
    input_language_name: 'Bengali (বাংলা)',
    normalized_english_text: 'water pipeline burst drinking water supply cut children sick',
    department_id: 'WATER_SUPPLY',
    department_name: 'Water Supply & Sanitation',
    sub_category: 'Water Supply & Sanitation (Water Resolution)',
    priority_level: 'CRITICAL',
    priority_score: 92,
    sla_hours: 4,
    district: 'Kolkata',
    pincode: '700032',
    is_duplicate: false,
    master_ticket_id: null,
    duplicate_count: 3,
    spam_score: 0.1,
    verification_status: 'VERIFIED',
    status: 'IN_PROGRESS',
    assigned_officer: 'Er. Soumen Banerjee (Executive Engineer)',
    reasoning: {
      rule_applied: 'Govt_Civic_SLA_Triage_Policy_2026_CRITICAL',
      key_triggers: ['জল', 'পাইপ ফেটে', 'অসুস্থ', 'বাচ্চারা'],
      rationale_en: 'Classified into Water Supply & Sanitation with CRITICAL priority (Score: 92/100) due to pipeline burst and children falling sick. Mandated SLA: 4 hours.',
      rationale_local: 'অভিযোগটিকে জল সরবরাহ ও স্যানিটেশন বিভাগে অন্তর্ভুক্ত করা হয়েছে এবং জরুরি স্তর CRITICAL (স্কোর: ৯২/১০০) ধার্য করা হয়েছে কারণ এতে পাইপ ফেটে যাওয়া ও শিশুদের অসুস্থতার তথ্য রয়েছে।'
    },
    timeline: [
      { timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), title: 'Grievance Submitted', desc: 'Submitted by citizen via Web Portal in Bengali.' },
      { timestamp: new Date(Date.now() - 3600000 * 2.9).toISOString(), title: 'AI Triage & Prioritization', desc: 'AI classified as CRITICAL (Score 92) -> Water Supply Department.' },
      { timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), title: 'Officer Assigned', desc: 'Dispatched to Executive Engineer Soumen Banerjee.' }
    ],
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'g-102',
    ticket_number: 'GR-2026-WB-1002',
    citizen_name: 'Ramesh Sharma',
    phone: '9830112233',
    original_text: 'मेन रोड पर 11KV का बिजली का तार टूटकर नीचे गिर गया है और उसमें स्पार्क हो रहा है। बहुत बड़ा खतरा है!',
    input_language: 'hi',
    input_language_name: 'Hindi (हिन्दी)',
    normalized_english_text: 'main road 11kv electricity wire broken spark big danger',
    department_id: 'ELECTRICITY_POWER',
    department_name: 'Electricity & Power Distribution',
    sub_category: 'Electricity & Power Distribution (Spark Hazard)',
    priority_level: 'CRITICAL',
    priority_score: 98,
    sla_hours: 2,
    district: 'Howrah',
    pincode: '711101',
    is_duplicate: false,
    master_ticket_id: null,
    duplicate_count: 1,
    spam_score: 0.05,
    verification_status: 'VERIFIED',
    status: 'IN_PROGRESS',
    assigned_officer: 'K. N. Verma (Power Grid Inspector)',
    reasoning: {
      rule_applied: 'Govt_Civic_SLA_Triage_Policy_2026_CRITICAL',
      key_triggers: ['बिजली', 'तार टूट', 'स्पार्क', 'खतरा'],
      rationale_en: 'Classified into Electricity & Power with CRITICAL priority (Score: 98/100) due to fallen live wire and sparking hazards. Mandated SLA: 2 hours.',
      rationale_local: 'शिकायत को विद्युत एवं ऊर्जा वितरण विभाग में वर्गीकृत किया गया है और तात्कालिकता स्तर CRITICAL (स्कोर: 98/100) तय किया गया है क्योंकि इसमें टूटा हुआ तार व स्पार्किंग का खतरा है।'
    },
    timeline: [
      { timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(), title: 'Grievance Submitted', desc: 'Submitted by citizen via Voice Transcription in Hindi.' },
      { timestamp: new Date(Date.now() - 3600000 * 1.1).toISOString(), title: 'AI Emergency Escalation', desc: 'AI flagged immediate live wire hazard -> 2-hour SLA.' }
    ],
    created_at: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    updated_at: new Date().toISOString()
  }
];

class Store {
  constructor() {
    this.departments = INITIAL_DEPARTMENTS;
    this.grievances = [];
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.grievances = JSON.parse(raw);
      } else {
        this.grievances = INITIAL_GRIEVANCES;
        this.saveData();
      }
    } catch (err) {
      console.error('Error loading store data, falling back to defaults:', err);
      this.grievances = INITIAL_GRIEVANCES;
    }
  }

  saveData() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.grievances, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving store data:', err);
    }
  }

  getDepartments() {
    return this.departments;
  }

  getAllGrievances() {
    return this.grievances;
  }

  getGrievanceById(idOrTicket) {
    return this.grievances.find(g => g.id === idOrTicket || g.ticket_number === idOrTicket);
  }

  addGrievance(grievance) {
    this.grievances.unshift(grievance);
    this.saveData();
    return grievance;
  }

  updateGrievance(idOrTicket, updates) {
    const idx = this.grievances.findIndex(g => g.id === idOrTicket || g.ticket_number === idOrTicket);
    if (idx !== -1) {
      this.grievances[idx] = {
        ...this.grievances[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.saveData();
      return this.grievances[idx];
    }
    return null;
  }
}

export const db = new Store();
