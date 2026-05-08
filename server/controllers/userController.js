const { Patient, Doctor, Report, Visit, Prescription, Appointment, Rating } = require('../models');

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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Auto-cancel past appointments
        await Appointment.updateMany(
            { appointmentDate: { $lt: today }, status: { $ne: 'completed' } },
            { $set: { status: 'cancelled' } }
        );

        // Fetch only active/completed ones to remove cancelled from UI
        const appointments = await Appointment.find({ patientId: req.user.id, status: { $ne: 'cancelled' } })
            .populate('doctorId', 'name specialization hospitalName')
            .sort({ appointmentDate: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDoctorAppointments = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Auto-cancel past appointments
        await Appointment.updateMany(
            { appointmentDate: { $lt: today }, status: { $ne: 'completed' } },
            { $set: { status: 'cancelled' } }
        );

        const appointments = await Appointment.find({ doctorId: req.user.id, status: { $ne: 'cancelled' } })
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

exports.rateDoctor = async (req, res) => {
    try {
        const { doctorId, rating, feedback } = req.body;
        
        // Ensure rating is between 1 and 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Create the rating
        const newRating = await Rating.create({
            patientId: req.user.id,
            doctorId,
            rating,
            feedback
        });

        // Update doctor's average rating and total ratings
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const newTotalRatings = doctor.totalRatings + 1;
        const newAverageRating = ((doctor.averageRating * doctor.totalRatings) + rating) / newTotalRatings;

        await Doctor.findByIdAndUpdate(doctorId, {
            averageRating: newAverageRating,
            totalRatings: newTotalRatings
        });

        res.status(201).json(newRating);
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
        const { patientId, diagnosis, notes, vitals } = req.body;
        const visit = await Visit.create({
            patientId,
            doctorId: req.user.id,
            diagnosis,
            notes,
            vitals
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

exports.getPatientHistoryForDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const visits = await Visit.find({ patientId: id }).populate('doctorId', 'name specialization').sort({ visitDate: -1 });
        const prescriptions = await Prescription.find({ patientId: id }).populate('doctorId', 'name').sort({ date: -1 });
        res.json({ visits, prescriptions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDoctorRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ doctorId: req.user.id })
            .populate('patientId', 'name')
            .sort({ createdAt: -1 });
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
