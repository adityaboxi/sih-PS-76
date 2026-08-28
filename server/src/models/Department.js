import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  nameLocal: { type: String, default: '' },
  icon: { type: String, default: 'Building2' },
  defaultSlaHours: { type: Number, default: 48 },
  nodalOfficers: [{
    name: String,
    designation: String,
    phone: String,
    email: String,
    wardOrDistrict: String
  }],
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);
