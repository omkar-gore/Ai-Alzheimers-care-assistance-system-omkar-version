import mongoose from 'mongoose';

const patientProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caregiverName: { type: String, required: false },
  emergencyContact: { type: String, required: false },
  address: { type: String, required: false },
  dateOfBirth: { type: Date, required: false },
  caregiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Reference to caregiver user
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to doctor user (optional initially)
}, { timestamps: true });

export default mongoose.model('PatientProfile', patientProfileSchema);
