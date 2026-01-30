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
import {
  FileText,
  Calendar,
  Activity,
  ChevronRight,
  Share2,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle
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
  const [appointmentReason, setAppointmentReason] = useState('');

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

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

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    await api.post('/patient/appointment', {
      doctorId: bookingDoctor._id,
      appointmentDate,
      reason: appointmentReason
    });
    setBookingDoctor(null);
    setAppointmentDate('');
    setAppointmentReason('');
    fetchData();
    setActiveTab('appointments');
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
        <div className="flex gap-6 border-b border-gray-200 mb-8 fade-up">
          {['overview', 'doctors', 'appointments'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold capitalize transition relative ${
                activeTab === tab
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-600 rounded"></span>
              )}
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

              <FileUpload patientId={user._id} onUploadSuccess={fetchData} />
            </div>

            {/* Reports */}
            <div className="md:col-span-2 glass rounded-2xl shadow-md overflow-hidden scale-in">
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
                      <a
                        href={`${BASE_URL}${report.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 flex items-center"
                      >
                        View <ChevronRight className="ml-1 w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              )}
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
                  </div>
                </div>

                <button
                  onClick={() => setBookingDoctor(doc)}
                  className="mt-auto bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= APPOINTMENTS ================= */}
        {activeTab === 'appointments' && (
          <div className="glass rounded-2xl shadow-md overflow-hidden scale-in">
            {appointments.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                No appointments yet
              </div>
            ) : (
              appointments.map(apt => (
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

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${
                      apt.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : apt.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {apt.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {apt.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                    {apt.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                    {apt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* ================= MODAL ================= */}
      {bookingDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="modal-card glass rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Book with {bookingDoctor.name}
            </h3>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <input
                type="date"
                required
                className="w-full border rounded-lg px-3 py-2"
                value={appointmentDate}
                onChange={e => setAppointmentDate(e.target.value)}
              />

              <textarea
                className="w-full border rounded-lg px-3 py-2 resize-none h-24"
                placeholder="Reason for visit"
                value={appointmentReason}
                onChange={e => setAppointmentReason(e.target.value)}
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
    </div>
  );
};

export default PatientDashboard;
