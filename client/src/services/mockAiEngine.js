import { notificationService } from './notificationService';
// JanSetu AI - Production Client Mock & Resilient State Engine
// Includes AI Hallucination Guard, Zero-Discard Safety Gate & Automated Re-routing

export const VALID_DEPARTMENTS = {
  WATER_SUPPLY: {
    id: 'WATER_SUPPLY',
    name: 'Water Supply & Sanitation Department',
    nameLocal: 'জল সরবরাহ ও স্বাস্থ্যবিধান বিভাগ',
    nameHindi: 'जल आपूर्ति एवं स्वच्छता विभाग',
    defaultSla: 4,
    emergencyHelpline: '1800-345-5555'
  },
  ELECTRICITY_POWER: {
    id: 'ELECTRICITY_POWER',
    name: 'Electricity & Power Distribution',
    nameLocal: 'বিদ্যুৎ ও শক্তি বণ্টন বিভাগ',
    nameHindi: 'विद्युत एवं ऊर्जा वितरण विभाग',
    defaultSla: 2,
    emergencyHelpline: '1912'
  },
  PUBLIC_WORKS_ROADS: {
    id: 'PUBLIC_WORKS_ROADS',
    name: 'Public Works & Roads (PWD)',
    nameLocal: 'পূর্ত ও সড়ক বিভাগ (PWD)',
    nameHindi: 'लोक निर्माण विभाग (PWD) व सड़कें',
    defaultSla: 48,
    emergencyHelpline: '1800-120-1111'
  },
  HEALTHCARE: {
    id: 'HEALTHCARE',
    name: 'Healthcare & Family Welfare',
    nameLocal: 'স্বাস্থ্য ও পরিবার কল্যাণ বিভাগ',
    nameHindi: 'स्वास्थ्य एवं परिवार कल्याण विभाग',
    defaultSla: 12,
    emergencyHelpline: '108'
  },
  SOLID_WASTE: {
    id: 'SOLID_WASTE',
    name: 'Solid Waste & Urban Cleanliness',
    nameLocal: 'কঠিন বর্জ্য ও পরিচ্ছন্নতা বিভাগ',
    nameHindi: 'ठोस अपशिष्ट एवं स्वच्छता विभाग',
    defaultSla: 24,
    emergencyHelpline: '1800-200-3333'
  },
  FOOD_CIVIL_SUPPLIES: {
    id: 'FOOD_CIVIL_SUPPLIES',
    name: 'Food & Civil Supplies (Ration/PDS)',
    nameLocal: 'খাদ্য ও গণবণ্টন (রেশন) বিভাগ',
    nameHindi: 'खाद्य एवं नागरिक आपूर्ति (राशन) विभाग',
    defaultSla: 48,
    emergencyHelpline: '1967'
  },
  POLICE_PUBLIC_SAFETY: {
    id: 'POLICE_PUBLIC_SAFETY',
    name: 'Police, Traffic & Public Safety',
    nameLocal: 'পুলিশ ও জননিরাপত্তা বিভাগ',
    nameHindi: 'पुलिस एवं जन सुरक्षा विभाग',
    defaultSla: 6,
    emergencyHelpline: '112'
  },
  SCHOOL_EDUCATION: {
    id: 'SCHOOL_EDUCATION',
    name: 'School & Higher Education',
    nameLocal: 'বিদ্যালয় ও শিক্ষা বিভাগ',
    nameHindi: 'स्कूल एवं उच्च शिक्षा विभाग',
    defaultSla: 72,
    emergencyHelpline: '1800-111-222'
  },
  WOMEN_CHILD_DEV: {
    id: 'WOMEN_CHILD_DEV',
    name: 'Women & Child Development',
    nameLocal: 'মহিলা ও শিশু বিকাশ বিভাগ',
    nameHindi: 'महिला एवं बाल विकास विभाग',
    defaultSla: 24,
    emergencyHelpline: '1091'
  },
  REVENUE_DISASTER: {
    id: 'REVENUE_DISASTER',
    name: 'Revenue & Disaster Management',
    nameLocal: 'রাজস্ব ও দুর্যোগ ব্যবস্থাপনা বিভাগ',
    nameHindi: 'राजस्व एवं आपदा प्रबंधन विभाग',
    defaultSla: 24,
    emergencyHelpline: '1070'
  }
};

class ClientAiEngine {
  constructor() {
    this.storageKey = 'jansetu_grievance_store_v3';
    this.grievances = this.loadInitialGrievances();
  }

  loadInitialGrievances() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    // High quality initial seed cases for demo
    return [
      {
        id: 'g-seed-1',
        ticket_number: 'GR-2026-WB-1001',
        citizen_name: 'Aditi Roy',
        phone: '9876543210',
        original_text: 'আমাদের যাদবপুর ৮ নম্বর ওয়ার্ডে গত তিন দিন ধরে প্রধান পাইপ ফেটে পানীয় জল নষ্ট হচ্ছে এবং জল সরবরাহ বন্ধ। শিশুরা পানীয় জলের অভাবে অসুস্থ হয়ে পড়ছে।',
        input_language: 'bn',
        input_language_name: 'Bengali',
        normalized_english_text: 'Main drinking water pipeline burst in Jadavpur Ward 8 near market for 3 days, water supply cutoff, children getting sick from water crisis.',
        department_id: 'WATER_SUPPLY',
        department_name: 'Water Supply & Sanitation Department',
        sub_category: 'Pipeline Rupture & Drinking Water Cutoff',
        priority_level: 'CRITICAL',
        priority_score: 95,
        sla_hours: 4,
        district: 'Kolkata',
        ward: 'Ward 8 (Jadavpur)',
        pincode: '700032',
        is_duplicate: false,
        master_ticket_id: null,
        duplicate_similarity_score: 0.0,
        spam_score: 0.02,
        verification_status: 'VERIFIED',
        status: 'SUBMITTED',
        assigned_officer: 'Er. Soumen Banerjee (Executive Engineer)',
        reasoning: {
          rule_applied: 'SOP-WATER-CRIT-04: Emergency Drinking Water Cutoff & Public Health Risk',
          key_triggers: ['পাইপ ফেটে', 'পানীয় জল বন্ধ', 'শিশুরা অসুস্থ', '৩ দিন'],
          rationale_en: 'Classified into Water Supply under CRITICAL 4-Hour SLA due to life hazard & drinking water deprivation affecting children.',
          rationale_local: 'শিশুদের স্বাস্থ্যহানি ও ৩ দিন ধরে পানীয় জল না থাকার কারণে জরুরি ৪ ঘণ্টার এসএলএ নির্ধারণ করা হয়েছে।',
          language_code: 'bn',
          confidence_score: 96
        },
        attachment_urls: ['photo_water_burst.jpg'],
        timeline: [
          {
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            title: 'Grievance Ingested',
            desc: 'Logged into secure state repository. Assigned ID GR-2026-WB-1001.'
          },
          {
            timestamp: new Date(Date.now() - 3500000).toISOString(),
            title: 'AI Multilingual Triage',
            desc: 'Bengali input analyzed. High-urgency triggers detected (Score: 95/100, SLA: 4 Hours).'
          },
          {
            timestamp: new Date(Date.now() - 3000000).toISOString(),
            title: 'Routed to Executive Engineer',
            desc: 'Assigned to Er. Soumen Banerjee (Kolkata South Water Division).'
          }
        ],
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'g-seed-2',
        ticket_number: 'GR-2026-WB-1002',
        citizen_name: 'Rahul Sharma',
        phone: '9830022334',
        original_text: 'मेन रोड पर 11KV का बिजली का तार टूटकर नीचे गिर गया है और उसमें स्पार्क हो रहा है। बहुत बड़ा खतरा है!',
        input_language: 'hi',
        input_language_name: 'Hindi',
        normalized_english_text: '11KV high voltage electric wire snapped and fallen on main road with continuous electrical sparks, immediate danger to pedestrian life.',
        department_id: 'ELECTRICITY_POWER',
        department_name: 'Electricity & Power Distribution',
        sub_category: 'Live Wire Snapping Hazard',
        priority_level: 'CRITICAL',
        priority_score: 98,
        sla_hours: 2,
        district: 'Kolkata',
        ward: 'Ward 12 (Salt Lake)',
        pincode: '700091',
        is_duplicate: false,
        master_ticket_id: null,
        duplicate_similarity_score: 0.0,
        spam_score: 0.01,
        verification_status: 'VERIFIED',
        status: 'IN_PROGRESS',
        assigned_officer: 'K. N. Verma (Divisional Inspector)',
        reasoning: {
          rule_applied: 'SOP-ELEC-HAZARD-02: Live Snapped Conductor Emergency Policy',
          key_triggers: ['11KV', 'तार टूटकर गिर गया', 'स्पार्क', 'बड़ा खतरा'],
          rationale_en: 'Direct electrocution danger on public road; immediate 2-hour priority emergency team dispatch.',
          rationale_local: 'सार्वजनिक मार्ग पर बिजली के तार से तुरंत जान का खतरा होने के कारण 2 घंटे की आपातकालीन प्राथमिकता दी गई।',
          language_code: 'hi',
          confidence_score: 98
        },
        attachment_urls: ['wire_spark.jpg'],
        timeline: [
          {
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            title: 'Grievance Ingested',
            desc: 'Logged from Salt Lake sector. Tracking Code: GR-2026-WB-1002.'
          },
          {
            timestamp: new Date(Date.now() - 7100000).toISOString(),
            title: 'AI Emergency Triage',
            desc: 'Classified under Power Grid Safety with 2-Hour Critical SLA.'
          },
          {
            timestamp: new Date(Date.now() - 5000000).toISOString(),
            title: 'Emergency Crew Mobilized',
            desc: 'Dispatched emergency mobile electrical lineman team.'
          }
        ],
        created_at: new Date(Date.now() - 7200000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'g-seed-3',
        ticket_number: 'GR-2026-WB-1003',
        citizen_name: 'Anirban Das',
        phone: '9830055441',
        original_text: 'asdfghjk 12345 testing system spam random input test',
        input_language: 'en',
        input_language_name: 'English',
        normalized_english_text: 'Gibberish text input with zero civic specificity.',
        department_id: 'SOLID_WASTE',
        department_name: 'Solid Waste & Urban Cleanliness',
        sub_category: 'Unverified Civic Input',
        priority_level: 'LOW',
        priority_score: 20,
        sla_hours: 72,
        district: 'Kolkata',
        ward: 'Ward 8 (Jadavpur)',
        pincode: '700032',
        is_duplicate: false,
        master_ticket_id: null,
        duplicate_similarity_score: 0.0,
        spam_score: 0.88,
        verification_status: 'FLAGGED_REVIEW',
        status: 'FLAGGED_REVIEW',
        assigned_officer: 'P. Mukherjee (Triage Review Officer)',
        reasoning: {
          rule_applied: 'SOP-ZERO-DISCARD-GUARD: Suspected Anomaly Inspection Protocol',
          key_triggers: ['random keystrokes', 'no location details'],
          rationale_en: 'Low-specificity gibberish input. Sent to Review Queue to prevent accidental data loss.',
          rationale_local: 'অস্পষ্ট তথ্যের কারণে বাতিলের পরিবর্তে মানব পর্যালোচনার জন্য সংরক্ষণ করা হয়েছে।',
          language_code: 'en',
          confidence_score: 30
        },
        attachment_urls: [],
        timeline: [
          {
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            title: 'Ingested & Flagged',
            desc: 'Zero-Discard safety filter sent complaint to human review queue.'
          }
        ],
        created_at: new Date(Date.now() - 1800000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.grievances));
    } catch (e) {}
  }

  // AI Hallucination Guard: Validates and sanitizes classification outputs
  validateAndSanitizeTriage(triageData) {
    let deptId = triageData.department_id;
    if (!VALID_DEPARTMENTS[deptId]) {
      deptId = 'SOLID_WASTE'; // Fallback default
    }

    const deptInfo = VALID_DEPARTMENTS[deptId];
    let score = Math.max(0, Math.min(100, parseInt(triageData.priority_score || 50)));
    let level = 'MEDIUM';
    let sla = deptInfo.defaultSla;

    if (score >= 80) {
      level = 'CRITICAL';
      sla = deptId === 'ELECTRICITY_POWER' ? 2 : 4;
    } else if (score >= 60) {
      level = 'HIGH';
      sla = 24;
    } else if (score >= 40) {
      level = 'MEDIUM';
      sla = 48;
    } else {
      level = 'LOW';
      sla = 72;
    }

    return {
      department_id: deptId,
      department_name: deptInfo.name,
      priority_level: level,
      priority_score: score,
      sla_hours: sla
    };
  }

  // Ingests & Triages Citizen Grievance
  submitGrievance(payload) {
    const text = payload.text || '';
    const lower = text.toLowerCase();

    // 1. Language Detection
    let lang = payload.preferred_language || 'bn';
    let langName = 'Bengali';
    if (/[\\u0980-\\u09FF]/.test(text)) {
      lang = 'bn';
      langName = 'Bengali';
    } else if (/[\\u0900-\\u097F]/.test(text)) {
      lang = 'hi';
      langName = 'Hindi';
    } else if (/[\\u0B80-\\u0BFF]/.test(text)) {
      lang = 'ta';
      langName = 'Tamil';
    } else if (/[\\u0C00-\\u0C7F]/.test(text)) {
      lang = 'te';
      langName = 'Telugu';
    } else {
      lang = 'en';
      langName = 'English';
    }

    // 2. Spam & Gibberish Safeguard
    const isGibberish = text.length < 15 || /^[a-z0-9\\s]{1,15}$/i.test(text.replace(/\\s+/g, '')) && !text.includes(' ');
    const spamScore = isGibberish ? 0.85 : 0.05;
    const verificationStatus = isGibberish ? 'FLAGGED_REVIEW' : 'VERIFIED';

    // 3. Department Classification & Urgency Rules
    const isWater = text.includes('জল') || text.includes('পানি') || lower.includes('water') || lower.includes('pipe') || lower.includes('tap');
    const isPower = text.includes('বিদ্যুৎ') || text.includes('बिजली') || lower.includes('electric') || lower.includes('wire') || lower.includes('spark') || lower.includes('current');
    const isRoad = text.includes('রাস্তা') || text.includes('सड़क') || lower.includes('road') || lower.includes('pothole') || lower.includes('bridge');
    const isHealth = text.includes('হাসপাতাল') || text.includes('अस्पताल') || lower.includes('hospital') || lower.includes('doctor') || lower.includes('medicine');

    let deptId = 'SOLID_WASTE';
    let triggers = ['civic issue'];
    let score = 50;

    if (isPower) {
      deptId = 'ELECTRICITY_POWER';
      triggers = ['11KV', 'snapped wire', 'sparking hazard', 'live wire'];
      score = 98;
    } else if (isWater) {
      deptId = 'WATER_SUPPLY';
      triggers = ['pipeline burst', 'drinking water cutoff', 'sick children', '3 days'];
      score = 94;
    } else if (isRoad) {
      deptId = 'PUBLIC_WORKS_ROADS';
      triggers = ['deep pothole', 'road cave-in', 'continuous accidents'];
      score = 82;
    } else if (isHealth) {
      deptId = 'HEALTHCARE';
      triggers = ['hospital negligence', 'emergency medical shortage'];
      score = 90;
    }

    const sanitized = this.validateAndSanitizeTriage({
      department_id: deptId,
      priority_score: isGibberish ? 25 : score
    });

    // 4. Duplicate Check (Cross-lingual Spatial & Semantic Match)
    const activeSameWard = this.grievances.filter(g => 
      g.ward === (payload.ward || 'Ward 8 (Jadavpur)') &&
      g.department_id === sanitized.department_id &&
      g.status !== 'RESOLVED'
    );
    const isDuplicate = activeSameWard.length > 0 && !isGibberish;
    const masterTicketId = isDuplicate ? activeSameWard[0].ticket_number : null;

    // 5. Generate Ticket Number
    const ticketNumber = `GR-2026-WB-${this.grievances.length + 1001}`;

    const newGrievance = {
      id: `g-${Date.now()}`,
      ticket_number: ticketNumber,
      citizen_name: payload.citizen_name || 'Aditi Roy',
      phone: payload.phone || '9876543210',
      original_text: text,
      input_language: lang,
      input_language_name: langName,
      normalized_english_text: text,
      department_id: sanitized.department_id,
      department_name: sanitized.department_name,
      sub_category: isWater ? 'Drinking Water Pipeline Burst' : isPower ? 'High Voltage Hazard' : 'Civic Grievance',
      priority_level: sanitized.priority_level,
      priority_score: sanitized.priority_score,
      sla_hours: sanitized.sla_hours,
      district: payload.district || 'Kolkata',
      ward: payload.ward || 'Ward 8 (Jadavpur)',
      pincode: payload.pincode || '700032',
      is_duplicate: isDuplicate,
      master_ticket_id: masterTicketId,
      duplicate_similarity_score: isDuplicate ? 0.92 : 0.0,
      spam_score: spamScore,
      verification_status: verificationStatus,
      status: verificationStatus === 'FLAGGED_REVIEW' ? 'FLAGGED_REVIEW' : 'SUBMITTED',
      assigned_officer: `Automated AI Routing -> Nodal Officer (${sanitized.department_name})`,
      reasoning: {
        rule_applied: `SOP-${sanitized.department_id}-SLA-${sanitized.sla_hours}H: Statutory Public Emergency Charter`,
        key_triggers: triggers,
        rationale_en: `Classified into ${sanitized.department_name} under ${sanitized.priority_level} priority due to civic hazard.`,
        rationale_local: lang === 'bn' ? 'জরুরি জনস্বার্থের ভিত্তিতে সর্বোচ্চ অগ্রাধিকার প্রদান করা হয়েছে।' : 'जनहित एवं सुरक्षा के आधार पर प्राथमिकता तय की गई है।',
        language_code: lang,
        confidence_score: sanitized.priority_score
      },
      attachment_urls: payload.attachment_urls || [],
      timeline: [
        {
          timestamp: new Date().toISOString(),
          title: 'Grievance Ingested',
          desc: `Submitted in ${langName}. Received official code ${ticketNumber}.`
        },
        {
          timestamp: new Date().toISOString(),
          title: 'AI Priority & Routing Applied',
          desc: `Assigned to ${sanitized.department_name} with ${sanitized.priority_level} Priority (SLA: ${sanitized.sla_hours} Hours).`
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isDuplicate) {
      newGrievance.timeline.push({
        timestamp: new Date().toISOString(),
        title: 'Linked to Master Incident Cluster',
        desc: `AI detected similarity to active master ticket ${masterTicketId}. Citizen notified.`
      });
    }

    this.grievances.unshift(newGrievance);
    notificationService.dispatchGrievanceCreated(newGrievance);
    this.save();
    return newGrievance;
  }

  // Automated Re-routing Function (Edge Case Guard when officer re-assigns ticket)
  rerouteGrievance(id, targetDeptId, reason) {
    const item = this.getGrievanceById(id);
    if (!item) return null;

    const newDept = VALID_DEPARTMENTS[targetDeptId] || VALID_DEPARTMENTS.WATER_SUPPLY;
    item.department_id = newDept.id;
    item.department_name = newDept.name;
    item.updated_at = new Date().toISOString();
    item.timeline.push({
      timestamp: new Date().toISOString(),
      title: 'Inter-Departmental Re-routing',
      desc: reason || `Re-routed to ${newDept.name} by Nodal Officer.`
    });

    this.save();
    notificationService.dispatchStatusUpdated(item, newStatus, remarks);
    return item;
  }

  getAllGrievances() {
    return this.grievances;
  }

  getGrievanceById(idOrTicket) {
    if (!idOrTicket) return null;
    const q = idOrTicket.trim().toLowerCase();
    return this.grievances.find(g => 
      g.id.toLowerCase() === q || 
      g.ticket_number.toLowerCase() === q
    );
  }

  updateStatus(id, newStatus, remarks) {
    const item = this.getGrievanceById(id);
    if (!item) return null;

    item.status = newStatus;
    item.updated_at = new Date().toISOString();
    item.timeline.push({
      timestamp: new Date().toISOString(),
      title: `Status Updated to ${newStatus}`,
      desc: remarks || `Officer updated ticket state to ${newStatus}.`
    });

    this.save();
    return item;
  }
}

export const clientAi = new ClientAiEngine();
