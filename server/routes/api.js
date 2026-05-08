const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const reportController = require('../controllers/reportController');
const userController = require('../controllers/userController');
const aiController = require('../controllers/aiController');
const messageController = require('../controllers/messageController');
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
router.post('/patient/rate-doctor', protect, userController.rateDoctor);

// Report Routes
router.post('/reports/upload', upload.single('file'), reportController.uploadReport); // Can add protect later, but multer needs to run
router.delete('/reports/:id', protect, reportController.deleteReport);

// Doctor Routes
router.get('/doctor/search/:aadhaar', protect, userController.searchPatient);
router.post('/doctor/visit', protect, userController.addDiagnosis);
router.post('/doctor/prescription', protect, userController.addPrescription);
router.get('/doctor/profile', protect, userController.getDoctorProfile);
router.get('/doctor/appointments', protect, userController.getDoctorAppointments);
router.put('/doctor/appointment/:id/status', protect, userController.updateAppointmentStatus);
router.get('/doctor/ratings', protect, userController.getDoctorRatings);
router.get('/doctor/patient/:id/history', protect, userController.getPatientHistoryForDoctor);

// AI Routes
router.post('/ai/chat', protect, aiController.chat);

// Messaging Routes
router.post('/messages', protect, messageController.sendMessage);
router.get('/messages/contacts', protect, messageController.getContacts);
router.get('/messages/:contactId', protect, messageController.getMessages);

module.exports = router;
