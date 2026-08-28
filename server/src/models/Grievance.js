import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  officer: { type: String, default: 'System' }
}, { _id: false });

const reasoningSchema = new mongoose.Schema({
  ruleApplied: { type: String, default: 'Standard_Public_SLA_Policy' },
  keyTriggers: [{ type: String }],
  rationaleEn: { type: String },
  rationaleLocal: { type: String },
  confidenceScore: { type: Number, default: 85 }
}, { _id: false });

const grievanceSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  citizenName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, index: true },
  email: { type: String, default: '' },
  
  // Complaint Ingestion
  originalText: { type: String, required: true },
  inputLanguage: { type: String, default: 'en' },
  inputLanguageName: { type: String, default: 'English' },
  normalizedEnglishText: { type: String },
  
  // Department & Classification
  departmentId: { type: String, required: true, index: true },
  departmentName: { type: String, required: true },
  subCategory: { type: String, default: 'Civic Grievance' },
  
  // Urgency & SLA
  priorityLevel: {
    type: String,
    enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
    default: 'MEDIUM',
    index: true
  },
  priorityScore: { type: Number, min: 0, max: 100, default: 50 },
  slaHours: { type: Number, default: 48 },
  
  // Geospatial Location
  location: {
    state: { type: String, default: 'West Bengal' },
    district: { type: String, default: 'Kolkata', index: true },
    ward: { type: String, default: 'Ward 8 (Jadavpur)', index: true },
    pincode: { type: String, default: '700032' },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [88.3639, 22.5726]
    }
  },
  
  // Duplicate Detection & Clustering
  isDuplicate: { type: Boolean, default: false, index: true },
  masterTicketId: { type: String, default: null, index: true },
  duplicateSimilarityScore: { type: Number, default: 0.0 },
  
  // Zero-Discard Spam Safeguard
  spamScore: { type: Number, default: 0.0 },
  verificationStatus: {
    type: String,
    enum: ['VERIFIED', 'FLAGGED_REVIEW', 'LOW_SPECIFICITY'],
    default: 'VERIFIED',
    index: true
  },
  
  // Lifecycle Status
  status: {
    type: String,
    enum: ['SUBMITTED', 'AI_TRIAGED', 'ROUTED', 'IN_PROGRESS', 'RESOLVED', 'FLAGGED_REVIEW'],
    default: 'SUBMITTED',
    index: true
  },
  assignedOfficer: { type: String, default: 'Automated Routing -> Nodal Officer' },
  
  // Explainable AI (XAI)
  reasoning: { type: reasoningSchema, default: () => ({}) },
  
  // Evidence & Attachments
  attachmentUrls: [{ type: String }],
  
  // Audit Trail
  timeline: [timelineEventSchema]
}, {
  timestamps: true
});

// Geospatial 2dsphere index for GIS radius querying
grievanceSchema.index({ 'location.coordinates': '2dsphere' });

export const Grievance = mongoose.models.Grievance || mongoose.model('Grievance', grievanceSchema);
