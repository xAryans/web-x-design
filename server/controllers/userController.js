const { Patient, Doctor, Report, Visit, Prescription, Appointment } = require('../models');

// Patient Controllers
exports.getPatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user.id).select('-password');
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPatientHistory = async (req, res) => {
    try {
        const visits = await Visit.find({ patientId: req.user.id }).populate('doctorId', 'name specialization');
        const prescriptions = await Prescription.find({ patientId: req.user.id }).populate('doctorId', 'name');
        res.json({ visits, prescriptions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select('-password');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const { doctorId, appointmentDate, reason } = req.body;
        const appointment = await Appointment.create({
            patientId: req.user.id,
            doctorId,
            appointmentDate,
            reason
        });
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id })
            .populate('doctorId', 'name specialization hospitalName')
            .sort({ appointmentDate: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.user.id })
            .populate('patientId', 'name age gender')
            .sort({ appointmentDate: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Doctor Controllers
exports.searchPatient = async (req, res) => {
    try {
        const { aadhaar } = req.params;
        const patient = await Patient.findOne({ aadhaar }).select('-password');
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addDiagnosis = async (req, res) => {
    try {
        const { patientId, diagnosis, notes } = req.body;
        const visit = await Visit.create({
            patientId,
            doctorId: req.user.id,
            diagnosis,
            notes
        });
        res.status(201).json(visit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addPrescription = async (req, res) => {
    try {
        const { patientId, medicines } = req.body;
        const prescription = await Prescription.create({
            patientId,
            doctorId: req.user.id,
            medicines
        });
        res.status(201).json(prescription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user.id).select('-password');
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
