const jwt = require('jsonwebtoken');
const { Patient, Doctor } = require('../models');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Patient Login (Mock Aadhaar)
exports.patientLogin = async (req, res) => {
    const { aadhaar, password } = req.body;

    try {
        // In a real app, verify Aadhaar with API. Here we just find by Aadhaar.
        // For hackathon, we can auto-register if not exists or just login
        let patient = await Patient.findOne({ aadhaar });

        if (!patient) {
            // Auto-register for demo purposes if not found? 
            // Or require separate register. Let's do separate register/login or auto-create.
            // Let's assume registration is done separately or we do a quick signup here.
            // For simplicity: If not found, return error.
            return res.status(400).json({ message: 'Patient not found. Please register first.' });
        }

        if (patient.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: patient._id,
            name: patient.name,
            role: 'patient',
            token: generateToken(patient._id, 'patient'),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.patientRegister = async (req, res) => {
    const { name, aadhaar, age, gender, phone, password } = req.body;
    try {
        const patientExists = await Patient.findOne({ aadhaar });
        if (patientExists) {
            return res.status(400).json({ message: 'Patient already exists' });
        }
        const patient = await Patient.create({
            name, aadhaar, age, gender, phone, password
        });
        res.status(201).json({
            _id: patient._id,
            name: patient.name,
            role: 'patient',
            token: generateToken(patient._id, 'patient')
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Doctor Login
exports.doctorLogin = async (req, res) => {
    const { medicalId, password } = req.body;

    try {
        const doctor = await Doctor.findOne({ medicalId });

        if (!doctor) {
            // Auto-register doctor for demo ease? Maybe.
            return res.status(400).json({ message: 'Doctor not found' });
        }

        if (doctor.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: doctor._id,
            name: doctor.name,
            role: 'doctor',
            token: generateToken(doctor._id, 'doctor'),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.doctorRegister = async (req, res) => {
    const { name, medicalId, specialization, hospitalName, password } = req.body;
    try {
        const doctorExists = await Doctor.findOne({ medicalId });
        if (doctorExists) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }
        const doctor = await Doctor.create({
            name, medicalId, specialization, hospitalName, password
        });
        res.status(201).json({
            _id: doctor._id,
            name: doctor.name,
            role: 'doctor',
            token: generateToken(doctor._id, 'doctor')
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
