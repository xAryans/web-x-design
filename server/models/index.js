const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    aadhaar: { type: String, required: true, unique: true }, // In real app, this would be hashed
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    password: { type: String, required: true }, // Simple password for now
    role: { type: String, default: 'patient' },
    createdAt: { type: Date, default: Date.now }
});

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    medicalId: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
    hospitalName: { type: String, default: 'General Hospital' },
    password: { type: String, required: true },
    role: { type: String, default: 'doctor' },
    createdAt: { type: Date, default: Date.now }
});

const ReportSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    fileUrl: { type: String, required: true }, // Path to file/Cloudinary URL
    fileType: { type: String, required: true }, // 'pdf' or 'image'
    extractedText: { type: String }, // Raw text from Gemini
    analysis: { type: Object }, // JSON structured data from Gemini
    uploadedAt: { type: Date, default: Date.now }
});

const VisitSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    diagnosis: { type: String, required: true },
    notes: { type: String },
    visitDate: { type: Date, default: Date.now }
});

const PrescriptionSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    medicines: [{
        name: String,
        dosage: String,
        duration: String
    }],
    date: { type: Date, default: Date.now }
});

const AppointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentDate: { type: Date, required: true },
    reason: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    Patient: mongoose.model('Patient', PatientSchema),
    Doctor: mongoose.model('Doctor', DoctorSchema),
    Report: mongoose.model('Report', ReportSchema),
    Visit: mongoose.model('Visit', VisitSchema),
    Prescription: mongoose.model('Prescription', PrescriptionSchema),
    Appointment: mongoose.model('Appointment', AppointmentSchema)
};
