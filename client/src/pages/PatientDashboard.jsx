// import { useState, useEffect, useContext } from 'react';
// import AuthContext from '../context/AuthContext';
// import api from '../services/api';
// import Navbar from '../components/Navbar';
// import FileUpload from '../components/FileUpload';
// import { FileText, Calendar, Activity, ChevronRight, Share2, Users, Stethoscope, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// const BASE_URL = 'http://localhost:5000';

// const PatientDashboard = () => {
//     const { user, loading } = useContext(AuthContext);
//     const [history, setHistory] = useState({ visits: [], prescriptions: [] });
//     const [reports, setReports] = useState([]);
//     const [doctors, setDoctors] = useState([]);
//     const [appointments, setAppointments] = useState([]);
//     const [activeTab, setActiveTab] = useState('overview'); // overview, reports, doctors, appointments
//     const [bookingDoctor, setBookingDoctor] = useState(null); // Doctor id for booking modal
//     const [appointmentDate, setAppointmentDate] = useState('');
//     const [appointmentReason, setAppointmentReason] = useState('');

//     useEffect(() => {
//         if (user) {
//             fetchData();
//         }
//     }, [user]);

//     const fetchData = async () => {
//         try {
//             const historyRes = await api.get('/patient/history');
//             setHistory(historyRes.data);

//             const reportsRes = await api.get(`/patient/reports/${user._id}`);
//             setReports(reportsRes.data);

//             const doctorsRes = await api.get('/patient/doctors');
//             setDoctors(doctorsRes.data);

//             const appointmentsRes = await api.get('/patient/appointments');
//             setAppointments(appointmentsRes.data);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const handleBookAppointment = async (e) => {
//         e.preventDefault();
//         if(!bookingDoctor || !appointmentDate) return;

//         try {
//             await api.post('/patient/appointment', {
//                 doctorId: bookingDoctor._id,
//                 appointmentDate: appointmentDate,
//                 reason: appointmentReason
//             });
//             alert('Appointment request sent successfully!');
//             setBookingDoctor(null);
//             setAppointmentDate('');
//             setAppointmentReason('');
//             fetchData(); // Refresh to show new appointment
//             setActiveTab('appointments'); // Switch to appointments tab
//         } catch (err) {
//             console.error(err);
//             alert('Failed to book appointment.');
//         }
//     };

//     if (loading || !user) return <div className="p-10 text-center">Loading...</div>;

//     return (
//         <div className="min-h-screen bg-gray-50 font-sans">
//             <Navbar />
            
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
//                     <p className="mt-1 text-gray-500">Manage your health records and view your medical history.</p>
//                 </div>

//                 {/* Tabs */}
//                 <div className="flex space-x-4 mb-6 border-b border-gray-200 pb-1 overflow-x-auto">
//                     <button 
//                         onClick={() => setActiveTab('overview')}
//                         className={`pb-2 px-1 font-medium text-sm transition whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                     >
//                         Overview
//                     </button>
//                     <button 
//                         onClick={() => setActiveTab('doctors')}
//                         className={`pb-2 px-1 font-medium text-sm transition whitespace-nowrap ${activeTab === 'doctors' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                     >
//                         Find Doctors
//                     </button>
//                     <button 
//                         onClick={() => setActiveTab('appointments')}
//                         className={`pb-2 px-1 font-medium text-sm transition whitespace-nowrap ${activeTab === 'appointments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//                     >
//                         Appointments
//                         {appointments.length > 0 && <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{appointments.length}</span>}
//                     </button>
//                 </div>

//                 {activeTab === 'overview' ? (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     {/* Sidebar / Quick Stats */}
//                     <div className="col-span-1 space-y-6">
//                         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//                              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
//                              <div className="space-y-4">
//                                 <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//                                     <div className="flex items-center">
//                                         <Activity className="text-blue-600 w-5 h-5 mr-3" />
//                                         <span className="text-gray-700 font-medium">Total Visits</span>
//                                     </div>
//                                     <span className="text-2xl font-bold text-blue-700">{history.visits.length}</span>
//                                 </div>
//                                 <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
//                                     <div className="flex items-center">
//                                         <FileText className="text-purple-600 w-5 h-5 mr-3" />
//                                         <span className="text-gray-700 font-medium">Reports</span>
//                                     </div>
//                                     <span className="text-2xl font-bold text-purple-700">{reports.length}</span>
//                                 </div>
//                              </div>
//                         </div>

//                         <FileUpload patientId={user._id} onUploadSuccess={fetchData} />
//                     </div>

//                     {/* Main Content Area */}
//                     <div className="col-span-1 md:col-span-2 space-y-6">
//                         {/* Reports Section */}
//                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
//                                 <h3 className="text-lg font-semibold text-gray-800">Recent Medical Reports</h3>
//                                 <button className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">View All</button>
//                             </div>
//                             <div className="divide-y divide-gray-100">
//                                 {reports.length === 0 ? (
//                                     <div className="p-8 text-center text-gray-500">No reports uploaded yet.</div>
//                                 ) : (
//                                     reports.map((report) => (
//                                         <div key={report._id} className="p-6 hover:bg-gray-50 transition">
//                                             <div className="flex justify-between items-start">
//                                                 <div>
//                                                     <div className="flex items-center mb-2">
//                                                         <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200 uppercase">{report.fileType}</span>
//                                                         <span className="ml-2 text-gray-400 text-sm">{new Date(report.uploadedAt).toLocaleDateString()}</span>
//                                                     </div>
//                                                     <h4 className="text-md font-semibold text-gray-900 mb-1">
//                                                         {report.analysis?.diagnosis || "Processed Report"}
//                                                     </h4>
//                                                     <p className="text-sm text-gray-600 line-clamp-2">
//                                                         {report.analysis?.observations || report.extractedText?.substring(0, 100) + "..."}
//                                                     </p>
//                                                     <div className="mt-2 flex items-center text-xs text-gray-400">
//                                                         <Share2 className="w-3 h-3 mr-1" /> Visible to you and authorized doctors
//                                                     </div>
//                                                 </div>
//                                                 <a href={`${BASE_URL}${report.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
//                                                     View File <ChevronRight className="w-4 h-4 ml-1" />
//                                                 </a>
//                                             </div>
//                                             {/* AI Insights Badge */}
//                                             {report.analysis && (
//                                                 <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
//                                                     <h5 className="text-xs font-bold text-yellow-800 uppercase mb-1 flex items-center">
//                                                         ✨ Gemini AI Insights
//                                                     </h5>
//                                                     <div className="text-sm text-gray-700 grid grid-cols-2 gap-2">
//                                                         <div><span className="font-semibold">Diagnosis:</span> {report.analysis.diagnosis || 'N/A'}</div>
//                                                         <div><span className="font-semibold">Date:</span> {report.analysis.date || 'N/A'}</div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
//                         </div>

//                         {/* Recent Visits */}
//                         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
//                                 <h3 className="text-lg font-semibold text-gray-800">Recent Visits</h3>
//                             </div>
//                             <div className="divide-y divide-gray-100">
//                                 {history.visits.length === 0 ? (
//                                     <div className="p-8 text-center text-gray-500">No visit history found.</div>
//                                 ) : (
//                                     history.visits.map((visit) => (
//                                         <div key={visit._id} className="p-6">
//                                             <div className="flex justify-between">
//                                                 <div>
//                                                     <h4 className="text-md font-bold text-gray-900">{visit.diagnosis}</h4>
//                                                     <p className="text-sm text-gray-600">Dr. {visit.doctorId.name} • {visit.doctorId.specialization}</p>
//                                                 </div>
//                                                 <div className="text-sm text-gray-500 flex items-center">
//                                                     <Calendar className="w-4 h-4 mr-1"/>
//                                                     {new Date(visit.visitDate).toLocaleDateString()}
//                                                 </div>
//                                             </div>
//                                             {visit.notes && (
//                                                 <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
//                                                     <span className="font-semibold">Notes:</span> {visit.notes}
//                                                 </p>
//                                             )}
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 ) : activeTab === 'doctors' ? (
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         {doctors.map(doctor => (
//                             <div key={doctor._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
//                                 <div className="flex items-center mb-4">
//                                      <div className="bg-green-100 p-3 rounded-full mr-4">
//                                         <Stethoscope className="w-6 h-6 text-green-600" />
//                                     </div>
//                                     <div>
//                                         <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
//                                         <p className="text-sm text-blue-600 font-medium">{doctor.specialization}</p>
//                                         <p className="text-xs text-gray-500">{doctor.hospitalName}</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex-1"></div>
//                                 <button 
//                                     onClick={() => setBookingDoctor(doctor)}
//                                     className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//                                 >
//                                     Book Appointment
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     // APPOINTMENTS TAB
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                         <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
//                             <h3 className="text-lg font-semibold text-gray-800">Your Appointments</h3>
//                         </div>
//                         <div className="divide-y divide-gray-100">
//                             {appointments.length === 0 ? (
//                                 <div className="p-12 text-center text-gray-500">
//                                     <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
//                                     You have no booked appointments.
//                                 </div>
//                             ) : (
//                                 appointments.map(apt => (
//                                     <div key={apt._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition">
//                                         <div className="mb-4 md:mb-0">
//                                             <div className="flex items-center mb-2">
//                                                 <h4 className="text-lg font-bold text-gray-900 mr-3">Dr. {apt.doctorId?.name}</h4>
//                                                 <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded border flex items-center ${
//                                                     apt.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' : 
//                                                     apt.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 
//                                                     'bg-yellow-100 text-yellow-700 border-yellow-200'
//                                                 }`}>
//                                                     {apt.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1"/>}
//                                                     {apt.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1"/>}
//                                                     {apt.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1"/>}
//                                                     {apt.status}
//                                                 </span>
//                                             </div>
//                                             <p className="text-sm text-gray-600 mb-1 flex items-center">
//                                                 <Stethoscope className="w-4 h-4 mr-2 text-gray-400"/> {apt.doctorId?.specialization} ({apt.doctorId?.hospitalName})
//                                             </p>
//                                             <p className="text-sm text-gray-600 mb-1 flex items-center">
//                                                 <Calendar className="w-4 h-4 mr-2 text-gray-400"/> {new Date(apt.appointmentDate).toDateString()}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))
//                             )}
//                         </div>
//                     </div>
//                 )}
                
//                 {/* Booking Modal */}
//                 {bookingDoctor && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                         <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
//                             <h3 className="text-xl font-bold text-gray-900 mb-4">Book with {bookingDoctor.name}</h3>
//                             <form onSubmit={handleBookAppointment} className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
//                                     <input 
//                                         type="date" 
//                                         required
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
//                                         value={appointmentDate}
//                                         onChange={(e) => setAppointmentDate(e.target.value)}
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
//                                     <textarea 
//                                         className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 resize-none h-24"
//                                         placeholder="Briefly describe your symptoms..."
//                                         value={appointmentReason}
//                                         onChange={(e) => setAppointmentReason(e.target.value)}
//                                     ></textarea>
//                                 </div>
//                                 <div className="flex justify-end gap-3 mt-6">
//                                     <button 
//                                         type="button"
//                                         onClick={() => setBookingDoctor(null)}
//                                         className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button 
//                                         type="submit"
//                                         className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
//                                     >
//                                         Confirm Booking
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 )}

//             </main>
//         </div>
//     );
// };

// export default PatientDashboard;


import { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import AIAssistant from '../components/AIAssistant';
import Messaging from '../components/Messaging';
import {
  FileText,
  Calendar,
  Activity,
  ChevronRight,
  Share2,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  PhoneCall,
  MapPin,
  HeartPulse,
  Video,
  User,
  Star,
  Pill,
  Thermometer
} from 'lucide-react';

const BASE_URL = 'http://localhost:5000';

const PatientDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const rootRef = useRef(null);

  const [history, setHistory] = useState({ visits: [], prescriptions: [] });
  const [reports, setReports] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('Morning (09:00 AM - 12:00 PM)');
  const [appointmentReason, setAppointmentReason] = useState('');
  
  // Phase 1 & 2 states
  const [showSosModal, setShowSosModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeVideoApt, setActiveVideoApt] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Detecting location...');
  const [mapUrl, setMapUrl] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  // Rating state
  const [ratingDoctor, setRatingDoctor] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState('');

  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const handleRecommendSlot = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setAppointmentDate(tomorrow.toISOString().split('T')[0]);
      
      const slots = [
          'Morning (09:00 AM - 12:00 PM)',
          'Afternoon (01:00 PM - 04:00 PM)',
          'Evening (05:00 PM - 08:00 PM)'
      ];
      setAppointmentTime(slots[Math.floor(Math.random() * slots.length)]);
  };

  useEffect(() => {
    // Listen for cross-tab communication (mocking WebSockets for demo)
    const handleStorage = (e) => {
        if (e.key === 'incoming_call' && e.newValue) {
            const data = JSON.parse(e.newValue);
            setIncomingCall(data);
            
            // Play a ringing sound if possible, or just show the modal
            setTimeout(() => {
                // Auto-clear the incoming call after 30 seconds if unanswered
                setIncomingCall(null);
            }, 30000);
        }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (showVideoModal && localStream && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
    }
  }, [showVideoModal, localStream]);

  const startVideoCall = async (apt) => {
      if (localStream) return;
      setActiveVideoApt(apt);
      setShowVideoModal(true);
      setIncomingCall(null); // Clear incoming call if answered
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setLocalStream(stream);
      } catch (err) {
          try {
              const videoOnlyStream = await navigator.mediaDevices.getUserMedia({ video: true });
              setLocalStream(videoOnlyStream);
          } catch (err2) {
              console.warn("Failed to access webcam:", err2);
              setLocalStream(null);
          }
      }
  };

  const endVideoCall = () => {
      if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
      }
      setLocalStream(null);
      setShowVideoModal(false);
      setActiveVideoApt(null);
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (showSosModal) {
      if ("geolocation" in navigator) {
        setLocationStatus('Requesting location access...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocationStatus('Location found! Showing nearby hospitals.');
            setUserLocation({ latitude, longitude });
            // Using OpenStreetMap iframe for a real map view without API key
            setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.02},${latitude-0.02},${longitude+0.02},${latitude+0.02}&layer=mapnik&marker=${latitude},${longitude}`);
          },
          (error) => {
             if (error.code === error.PERMISSION_DENIED) {
                 setLocationStatus("Location permission denied. Cannot show nearby hospitals.");
             } else {
                 setLocationStatus("Unable to retrieve your location.");
             }
          }
        );
      } else {
        setLocationStatus("Geolocation is not supported by your browser.");
      }
    } else {
       setLocationStatus('Detecting location...');
       setMapUrl('');
       setUserLocation(null);
    }
  }, [showSosModal]);

  const fetchData = async () => {
    const historyRes = await api.get('/patient/history');
    const reportsRes = await api.get(`/patient/reports/${user._id}`);
    const doctorsRes = await api.get('/patient/doctors');
    const appointmentsRes = await api.get('/patient/appointments');

    setHistory(historyRes.data);
    setReports(reportsRes.data);
    setDoctors(doctorsRes.data);
    setAppointments(appointmentsRes.data);
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
        await api.delete(`/reports/${reportId}`);
        fetchData();
    } catch (err) {
        console.error(err);
        alert('Failed to delete report.');
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    await api.post('/patient/appointment', {
      doctorId: bookingDoctor._id,
      appointmentDate: new Date(`${appointmentDate}T00:00:00`),
      reason: `${appointmentTime} - ${appointmentReason}`
    });
    setBookingDoctor(null);
    setAppointmentDate('');
    setAppointmentTime('Morning (09:00 AM - 12:00 PM)');
    setAppointmentReason('');
    fetchData();
    setActiveTab('appointments');
  };

  const handleRateDoctor = async (e) => {
    e.preventDefault();
    if (ratingValue < 1 || ratingValue > 5) {
        alert("Please select a valid rating between 1 and 5.");
        return;
    }
    try {
        await api.post('/patient/rate-doctor', {
            doctorId: ratingDoctor._id,
            rating: ratingValue,
            feedback: ratingFeedback
        });
        alert('Thank you for your feedback! Rating submitted successfully.');
        setRatingDoctor(null);
        setRatingValue(0);
        setRatingFeedback('');
        fetchData();
    } catch (err) {
        console.error(err);
        alert('Failed to submit rating.');
    }
  };

  /* ================= GSAP ANIMATIONS ================= */

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15
      });

      gsap.from('.scale-in', {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.utils.toArray('.hover-lift').forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -8, scale: 1.02, duration: 0.3 });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.3 });
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (bookingDoctor) {
      gsap.fromTo(
        '.modal-card',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [bookingDoctor]);

  const sortedAppointments = [...appointments].sort((a, b) => {
      const dateA = new Date(a.appointmentDate).getTime();
      const dateB = new Date(b.appointmentDate).getTime();
      if (dateA !== dateB) return dateA - dateB;
      
      const getTimeWeight = (reasonStr) => {
          if (!reasonStr) return 0;
          if (reasonStr.includes('Morning')) return 1;
          if (reasonStr.includes('Afternoon')) return 2;
          if (reasonStr.includes('Evening')) return 3;
          return 0;
      };
      return getTimeWeight(a.reason) - getTimeWeight(b.reason);
  });

  const latestVisitWithVitals = [...history.visits].reverse().find(v => v.vitals && (v.vitals.bloodPressure || v.vitals.heartRate || v.vitals.temperature));
  const latestVitals = latestVisitWithVitals ? latestVisitWithVitals.vitals : null;

  const latestPrescription = [...history.prescriptions].reverse()[0];
  const nextAppointment = sortedAppointments.find(a => new Date(a.appointmentDate) >= new Date(new Date().setHours(0,0,0,0)) && a.status === 'confirmed');

  if (loading || !user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden"
    >
      {/* Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-3xl"></div>

      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="fade-up mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, <span className="text-blue-600">{user.name}</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Your personal health dashboard
          </p>
        </div>

        {/* Tabs */}
        <div className="tab-container flex gap-2 p-1 bg-white/70 rounded-2xl mb-8 fade-up overflow-x-auto border border-gray-200 backdrop-blur-md shadow-sm w-fit">
          {['overview', 'doctors', 'appointments', 'messages'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn px-6 py-2.5 font-semibold capitalize transition-all rounded-xl ${
                activeTab === tab
                  ? 'active bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ================= OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glass hover-lift rounded-2xl p-6 scale-in">
                <h3 className="font-bold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between bg-blue-50 p-4 rounded-xl">
                    <span className="flex items-center">
                      <Activity className="mr-2 text-blue-600" /> Visits
                    </span>
                    <span className="font-bold text-blue-700 text-xl">
                      {history.visits.length}
                    </span>
                  </div>
                  <div className="flex justify-between bg-purple-50 p-4 rounded-xl">
                    <span className="flex items-center">
                      <FileText className="mr-2 text-purple-600" /> Reports
                    </span>
                    <span className="font-bold text-purple-700 text-xl">
                      {reports.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* SOS Emergency Widget */}
              <div className="glass hover-lift rounded-2xl p-6 scale-in bg-red-50 border border-red-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 mb-4 animate-bounce">
                  <HeartPulse className="text-white w-8 h-8" />
                </div>
                <h3 className="font-bold text-red-700 mb-2">Emergency Features</h3>
                <p className="text-sm text-red-600/80 mb-4">Quick access to medical help</p>
                <button 
                  onClick={() => setShowSosModal(true)}
                  className="w-full btn-primary bg-red-600 hover:bg-red-700 shadow-red-500/30"
                >
                  Activate SOS
                </button>
              </div>

              <FileUpload patientId={user._id} onUploadSuccess={fetchData} />

              {/* Daily Health Tip Widget */}
              <div className="glass hover-lift rounded-2xl p-6 scale-in bg-blue-50/50 border border-blue-100 text-center">
                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-blue-600">
                    <Activity className="w-6 h-6" />
                 </div>
                 <h3 className="font-bold text-blue-900 mb-2 text-sm uppercase tracking-wide">Daily Health Tip</h3>
                 <p className="text-sm text-gray-700 leading-relaxed italic">
                    "Stay hydrated! Drinking at least 8 glasses of water a day helps maintain energy levels and supports immune function."
                 </p>
              </div>
            </div>

            {/* Main Content Areas */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Upcoming Appointment */}
              {nextAppointment && (
                 <div className="glass hover-lift rounded-2xl p-6 scale-in bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold flex items-center gap-2 text-blue-50">
                          <Calendar className="w-5 h-5 text-blue-200" /> Next Upcoming Appointment
                       </h3>
                       <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Confirmed</span>
                    </div>
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-2xl font-bold mb-1">Dr. {nextAppointment.doctorId?.name}</p>
                          <p className="text-blue-200 text-sm">{nextAppointment.doctorId?.specialization}</p>
                       </div>
                       <div className="text-right">
                          <p className="font-bold">{new Date(nextAppointment.appointmentDate).toDateString()}</p>
                          <p className="text-blue-200 text-sm">{nextAppointment.reason || 'General Consultation'}</p>
                       </div>
                    </div>
                 </div>
              )}

              {/* New Features: Health Vitals & Medication */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {/* Vitals Widget */}
                 <div className="glass rounded-2xl p-6 scale-in shadow-sm border border-blue-50">
                    <h3 className="font-bold flex items-center gap-2 mb-4 text-blue-900">
                      <HeartPulse className="text-red-500 w-5 h-5" /> Latest Vitals
                    </h3>
                    {latestVitals ? (
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white/60 p-2 rounded-xl">
                           <p className="text-xs text-gray-500 mb-1">BP</p>
                           <p className="font-bold text-gray-800 text-sm">{latestVitals.bloodPressure || '--'}</p>
                        </div>
                        <div className="bg-white/60 p-2 rounded-xl">
                           <p className="text-xs text-gray-500 mb-1">Heart</p>
                           <p className="font-bold text-gray-800 text-sm">{latestVitals.heartRate ? `${latestVitals.heartRate} bpm` : '--'}</p>
                        </div>
                        <div className="bg-white/60 p-2 rounded-xl">
                           <p className="text-xs text-gray-500 mb-1">Temp</p>
                           <p className="font-bold text-gray-800 text-sm">{latestVitals.temperature || '--'}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">No vitals recorded yet.</p>
                    )}
                 </div>

                 {/* Medication Widget */}
                 <div className="glass rounded-2xl p-6 scale-in shadow-sm border border-green-50">
                    <h3 className="font-bold flex items-center gap-2 mb-4 text-green-900">
                      <Pill className="text-green-500 w-5 h-5" /> Current Medication
                    </h3>
                    {latestPrescription ? (
                      <div className="space-y-2 max-h-24 overflow-y-auto pr-2">
                        {latestPrescription.medicines.map((med, idx) => (
                           <div key={idx} className="flex justify-between items-center bg-white/60 p-2 rounded-lg text-sm">
                             <span className="font-semibold text-gray-800 truncate flex-1">{med.name}</span>
                             <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md ml-2">{med.dosage}</span>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">No active prescriptions.</p>
                    )}
                 </div>
              </div>

              {/* Reports */}
              <div className="glass rounded-2xl shadow-md overflow-hidden scale-in">
              <div className="p-6 border-b">
                <h3 className="font-bold text-lg">Recent Reports</h3>
              </div>

              {reports.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  No reports uploaded yet
                </div>
              ) : (
                reports.map(report => (
                  <div
                    key={report._id}
                    className="hover-lift p-6 border-b transition"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {report.analysis?.diagnosis || 'Processed Report'}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {report.analysis?.observations ||
                            report.extractedText?.slice(0, 120)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <a
                          href={`${BASE_URL}${report.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 flex items-center text-sm font-bold hover:text-blue-800 transition"
                        >
                          View <ChevronRight className="ml-1 w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteReport(report._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-bold transition flex items-center"
                        >
                          Remove <XCircle className="ml-1 w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          </div>
        )}

        {/* ================= DOCTORS ================= */}
        {activeTab === 'doctors' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map(doc => (
              <div
                key={doc._id}
                className="glass hover-lift rounded-2xl p-6 flex flex-col scale-in"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Stethoscope className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">{doc.name}</h3>
                    <p className="text-sm text-blue-600">{doc.specialization}</p>
                    <p className="text-xs text-gray-500">{doc.hospitalName}</p>
                    {/* Rating display */}
                    <div className="flex items-center mt-1">
                       <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                       <span className="text-sm font-bold text-gray-700">{doc.averageRating ? doc.averageRating.toFixed(1) : 'New'}</span>
                       <span className="text-xs text-gray-400 ml-1">({doc.totalRatings || 0} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  <button
                    onClick={() => setBookingDoctor(doc)}
                    className="w-full btn-primary"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= APPOINTMENTS ================= */}
        {activeTab === 'appointments' && (
          <div className="glass rounded-2xl shadow-md overflow-hidden scale-in">
            {sortedAppointments.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                No appointments yet
              </div>
            ) : (
              sortedAppointments.map(apt => (
                <div
                  key={apt._id}
                  className="p-6 border-b flex justify-between hover:bg-white/40 transition"
                >
                  <div>
                    <h4 className="font-bold">
                      Dr. {apt.doctorId?.name}
                    </h4>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(apt.appointmentDate).toDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${
                          apt.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : apt.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : apt.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {apt.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {apt.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {apt.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                        {apt.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {apt.status}
                      </span>
                      
                      {apt.status === 'confirmed' && (
                        <span className="text-xs font-bold text-gray-400">
                          View Messages to Join Call
                        </span>
                      )}

                      {apt.status === 'completed' && (
                        <button
                          onClick={() => setRatingDoctor(apt.doctorId)}
                          className="bg-yellow-50 text-yellow-700 text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-yellow-100 transition border border-yellow-200 flex items-center gap-1"
                        >
                          <Star className="w-3 h-3" /> Rate Doctor
                        </button>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ================= MESSAGES ================= */}
        {activeTab === 'messages' && (
           <div className="fade-up scale-in">
               <Messaging onStartVideoCall={(contact) => startVideoCall({ doctorId: contact })} />
           </div>
        )}

      </main>

      {/* ================= MODAL ================= */}
      {bookingDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="modal-card glass rounded-2xl p-6 w-full max-w-md relative">
            <button 
              onClick={() => setBookingDoctor(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4 pr-8">
              Book with Dr. {bookingDoctor.name}
            </h3>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleRecommendSlot}
                  className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition font-medium flex items-center gap-1"
                >
                  <Activity className="w-4 h-4" /> Recommend Slot
                </button>
              </div>

              <input
                type="date"
                required
                min={today}
                className="w-full border rounded-lg px-3 py-2"
                value={appointmentDate}
                onChange={e => setAppointmentDate(e.target.value)}
              />

              <select 
                className="w-full border rounded-lg px-3 py-2"
                value={appointmentTime}
                onChange={e => setAppointmentTime(e.target.value)}
              >
                <option>Morning (09:00 AM - 12:00 PM)</option>
                <option>Afternoon (01:00 PM - 04:00 PM)</option>
                <option>Evening (05:00 PM - 08:00 PM)</option>
              </select>

              <div className="space-y-1">
                 <label className="text-sm font-semibold text-gray-700">Select Reason for Visit</label>
                 <select
                    className="w-full border rounded-lg px-3 py-2 bg-white"
                    onChange={e => {
                        if (e.target.value !== 'Other') {
                            setAppointmentReason(e.target.value);
                        } else {
                            setAppointmentReason('');
                        }
                    }}
                 >
                    <option value="">-- Choose a Reason --</option>
                    <option value="General Checkup">General Checkup</option>
                    <option value="Fever / Cold / Cough">Fever / Cold / Cough</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Other">Other (Specify below)</option>
                 </select>
              </div>

              <textarea
                className="w-full border rounded-lg px-3 py-2 resize-none h-20"
                placeholder="Briefly describe your symptoms or reason..."
                value={appointmentReason}
                onChange={e => setAppointmentReason(e.target.value)}
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingDoctor(null)}
                  className="text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="modal-card glass rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">
              Rate Dr. {ratingDoctor.name}
            </h3>
            <p className="text-gray-500 text-sm mb-6">Your feedback improves our system's transparency.</p>

            <form onSubmit={handleRateDoctor} className="space-y-4">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRatingValue(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                        className={`w-10 h-10 ${ratingValue >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>

              <textarea
                className="w-full border rounded-lg px-3 py-2 resize-none h-24"
                placeholder="Share your experience (optional)"
                value={ratingFeedback}
                onChange={e => setRatingFeedback(e.target.value)}
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                      setRatingDoctor(null);
                      setRatingValue(0);
                      setRatingFeedback('');
                  }}
                  className="text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-5 py-2 rounded-lg transition"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant Widget */}
      <AIAssistant contextData={{ history, reports }} />

      {/* SOS Modal */}
      {showSosModal && (
        <div className="fixed inset-0 bg-red-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
            <button onClick={() => setShowSosModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
              <XCircle className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <PhoneCall className="text-red-600 w-10 h-10 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Emergency Contacts</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Ambulance</p>
                  <p className="text-sm text-gray-500">National Emergency</p>
                </div>
                <a href="tel:102" className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-red-700">102</a>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-blue-600 w-5 h-5"/>
                  <h4 className="font-bold text-gray-900">Nearby Hospitals</h4>
                </div>
                <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-300">
                    {mapUrl ? (
                        <iframe 
                            src={mapUrl} 
                            className="w-full h-full border-0" 
                            title="Nearby Hospitals Map"
                        ></iframe>
                    ) : (
                        <p className="absolute text-gray-500 text-sm font-medium px-4 text-center">{locationStatus}</p>
                    )}
                </div>
              </div>
              
              <button 
                onClick={() => {
                  let message = `*EMERGENCY SOS*\n\nPatient Name: ${user.name}\nAge: ${user.age}\nGender: ${user.gender}\nPhone: ${user.phone}\nAadhaar: ${user.aadhaar}\n\nI have triggered the emergency alert from MediConnect. Please help immediately!`;
                  if (userLocation) {
                      message += `\n\n📍 My current location: https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`;
                  }
                  window.open(`https://wa.me/917668265344?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2"
              >
                <Share2 className="w-5 h-5"/> Share Medical Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Consultation Modal */}
      {showVideoModal && activeVideoApt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 scale-in">
          <div className="bg-gray-900 rounded-3xl max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden relative shadow-2xl border border-gray-800">
            <div className="p-4 bg-gray-800 flex justify-between items-center">
               <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                   <h3 className="text-white font-bold text-lg">Consultation with Dr. {activeVideoApt.doctorId?.name || activeVideoApt.doctorId?.name || 'Doctor'}</h3>
               </div>
               <button onClick={endVideoCall} className="text-gray-400 hover:text-white bg-gray-700 p-2 rounded-full">
                 <XCircle className="w-5 h-5" />
               </button>
            </div>
            
            <div className="flex-1 bg-black relative flex items-center justify-center">
                {/* Doctor Video Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 flex-col">
                    <User className="w-24 h-24 mb-4 opacity-50 text-gray-600"/>
                    <p className="text-gray-500 font-medium">Doctor's Video Feed Active...</p>
                </div>
                
                {/* Self Video Placeholder (PIP) */}
                <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-800 rounded-xl border-2 border-gray-700 overflow-hidden shadow-xl flex items-center justify-center bg-cover bg-center">
                    {localStream ? (
                        <video 
                            ref={localVideoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center">
                           <User className="w-12 h-12 text-gray-500 mb-2"/>
                           <span className="text-xs text-gray-500">Camera Disabled</span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="p-6 bg-gray-800 flex justify-center gap-6">
                <button className="px-8 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-bold hover:bg-red-700 shadow-lg shadow-red-600/30 transition" onClick={endVideoCall}>End Call</button>
            </div>
          </div>
        </div>
      )}

      {/* Incoming Call Overlay */}
      {incomingCall && !showVideoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div className="bg-gray-900 rounded-3xl max-w-sm w-full p-8 flex flex-col items-center relative shadow-2xl border border-gray-800 scale-in text-center animate-bounce-slight">
                <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                        <Video className="w-10 h-10 text-white" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Incoming Video Call</h2>
                <p className="text-gray-400 mb-8">Dr. {incomingCall.doctorName} is calling you...</p>
                
                <div className="flex gap-4 w-full">
                    <button 
                        onClick={() => setIncomingCall(null)}
                        className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition flex items-center justify-center gap-2"
                    >
                        <XCircle className="w-5 h-5" /> Decline
                    </button>
                    <button 
                        onClick={() => startVideoCall({ doctorId: { name: incomingCall.doctorName } })}
                        className="flex-1 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 animate-pulse"
                    >
                        <Video className="w-5 h-5" /> Answer
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
