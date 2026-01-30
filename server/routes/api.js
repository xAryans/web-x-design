const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const reportController = require('../controllers/reportController');
const userController = require('../controllers/userController');
const upload = require('../utils/multerConfig');
const { protect } = require('../middleware/authMiddleware');

// Auth Routes
router.post('/auth/patient/login', authController.patientLogin);
router.post('/auth/patient/register', authController.patientRegister);
router.post('/auth/doctor/login', authController.doctorLogin);
router.post('/auth/doctor/register', authController.doctorRegister);

// Patient Routes
// Using 'protect' middleware to ensure user is logged in
router.get('/patient/profile', protect, userController.getPatientProfile);
router.get('/patient/history', protect, userController.getPatientHistory);
router.get('/patient/reports/:patientId', protect, reportController.getPatientReports); // Keep simple for now
router.get('/patient/doctors', protect, userController.getAllDoctors);
router.post('/patient/appointment', protect, userController.bookAppointment);
router.get('/patient/appointments', protect, userController.getPatientAppointments);

// Report Routes
router.post('/reports/upload', upload.single('file'), reportController.uploadReport); // Can add protect later, but multer needs to run

// Doctor Routes
router.get('/doctor/search/:aadhaar', protect, userController.searchPatient);
router.post('/doctor/visit', protect, userController.addDiagnosis);
router.post('/doctor/prescription', protect, userController.addPrescription);
router.get('/doctor/profile', protect, userController.getDoctorProfile);
router.get('/doctor/appointments', protect, userController.getDoctorAppointments);
router.put('/doctor/appointment/:id/status', protect, userController.updateAppointmentStatus);

module.exports = router;
