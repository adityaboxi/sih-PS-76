import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  officer: { type: String, default: 'Automated AI Dispatch' }
}, { _id: false });

const reasoningSchema = new mongoose.Schema({
  rule_applied: { type: String, default: 'Statutory_Public_SLA_Charter_2026' },
  key_triggers: [{ type: String }],
  rationale_en: { type: String },
  rationale_local: { type: String },
  language_code: { type: String, default: 'en' },
  confidence_score: { type: Number, default: 90 }
}, { _id: false });

const grievanceSchema = new mongoose.Schema({
  ticket_number: { type: String, required: true, unique: true, index: true },
  citizen_name: { type: String, required: true, index: true },
  phone: { type: String, required: true, index: true },
  email: { type: String, default: '' },
  original_text: { type: String, required: true },
  input_language: { type: String, default: 'en' },
  input_language_name: { type: String, default: 'English' },
  normalized_english_text: { type: String },
  department_id: { type: String, required: true, index: true },
  department_name: { type: String, required: true },
  sub_category: { type: String, default: 'General Public Grievance' },
  priority_level: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM', index: true },
  priority_score: { type: Number, min: 0, max: 100, default: 50 },
  sla_hours: { type: Number, default: 48 },
  state: { type: String, default: 'West Bengal', index: true },
  district: { type: String, default: 'Kolkata', index: true },
  ward: { type: String, default: 'Ward 8 (Jadavpur)' },
  pincode: { type: String, default: '700032' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [88.3639, 22.5726] }
  },
  is_duplicate: { type: Boolean, default: false, index: true },
  master_ticket_id: { type: String, default: null },
  duplicate_similarity_score: { type: Number, default: 0.0 },
  spam_score: { type: Number, default: 0.05 },
  verification_status: { type: String, enum: ['VERIFIED', 'FLAGGED_REVIEW'], default: 'VERIFIED', index: true },
  status: { type: String, enum: ['SUBMITTED', 'IN_PROGRESS', 'RESOLVED', 'FLAGGED_REVIEW', 'RE_ROUTED'], default: 'SUBMITTED', index: true },
  assigned_officer: { type: String, default: 'Nodal Officer Cell' },
  assigned_officer_id: { type: String, default: null },
  reasoning: reasoningSchema,
  attachment_urls: [{ type: String }],
  timeline: [timelineEventSchema]
}, {
  timestamps: true
});

// Geospatial 2dsphere index for GIS Heatmap radius queries
grievanceSchema.index({ location: '2dsphere' });
grievanceSchema.index({ department_id: 1, status: 1 });
grievanceSchema.index({ state: 1, district: 1 });

export const Grievance = mongoose.models.Grievance || mongoose.model('Grievance', grievanceSchema);
