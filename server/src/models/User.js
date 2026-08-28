import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ['CITIZEN', 'NODAL_OFFICER', 'TRIAGE_OFFICER', 'DISTRICT_MAGISTRATE', 'ADMIN'],
    default: 'CITIZEN'
  },
  departmentId: { type: String, default: null },
  district: { type: String, default: 'Kolkata' },
  ward: { type: String, default: 'Ward 8 (Jadavpur)' },
  preferredLanguage: { type: String, default: 'bn' },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
