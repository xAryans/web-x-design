import { useState, useContext, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import AIAssistant from '../components/AIAssistant';
import Messaging from '../components/Messaging';
import {
  Search,
  User,
  FileText,
  PlusCircle,
  Clipboard,
  Calendar,
  CheckCircle,
  XCircle,
  Video,
  MicOff,
  VideoOff,
  Clock,
  Stethoscope,
  Activity,
  Pill,
  History,
  Star,
  Brain,
  Globe
} from 'lucide-react';

const BASE_URL = 'http://localhost:5000';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const rootRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [patient, setPatient] = useState(null);
  const [patientReports, setPatientReports] = useState([]);
  const [patientHistory, setPatientHistory] = useState({ visits: [], prescriptions: [] });
  const [searchLoading, setSearchLoading] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [ratings, setRatings] = useState([]);

  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [vitals, setVitals] = useState({ bloodPressure: '', heartRate: '', temperature: '' });
  
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }]);
  const [workspaceTab, setWorkspaceTab] = useState('diagnosis'); // diagnosis, prescription, history, reports

  // Video Call State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeVideoApt, setActiveVideoApt] = useState(null);
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    if (showVideoModal && localStream && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
    }
  }, [showVideoModal, localStream]);

  const startVideoCall = async (apt) => {
      if (localStream) return;
      setActiveVideoApt(apt);
      setShowVideoModal(true);
      try {
          // Try both video and audio
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setLocalStream(stream);
      } catch (err) {
          try {
              // Fallback to video only if microphone is locked/missing
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
    fetchAppointments();
    fetchRatings();
  }, []);

  const fetchAppointments = async () => {
    const res = await api.get('/doctor/appointments');
    setAppointments(res.data);
  };

  const fetchRatings = async () => {
      try {
          const res = await api.get('/doctor/ratings');
          setRatings(res.data);
      } catch (e) {
          console.error(e);
      }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/doctor/appointment/${id}/status`, { status });
    fetchAppointments();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    setPatient(null);
    setPatientReports([]);
    setPatientHistory({ visits: [], prescriptions: [] });

    try {
      const res = await api.get(`/doctor/search/${searchTerm}`);
      setPatient(res.data);

      const reportsRes = await api.get(`/patient/reports/${res.data._id}`);
      setPatientReports(reportsRes.data);

      const historyRes = await api.get(`/doctor/patient/${res.data._id}/history`);
      setPatientHistory(historyRes.data);
      setWorkspaceTab('history');
    } catch {
      alert('Patient not found');
    } finally {
      setSearchLoading(false);
    }
  };

  const submitDiagnosis = async (e) => {
    e.preventDefault();
    await api.post('/doctor/visit', {
      patientId: patient._id,
      diagnosis,
      notes,
      vitals
    });
    setDiagnosis('');
    setNotes('');
    setVitals({ bloodPressure: '', heartRate: '', temperature: '' });
    alert('Diagnosis saved');
    // Refresh history
    const historyRes = await api.get(`/doctor/patient/${patient._id}/history`);
    setPatientHistory(historyRes.data);
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    const validMedicines = medicines.filter(m => m.name.trim() !== '');
    if (validMedicines.length === 0) {
        alert('Please add at least one medicine.');
        return;
    }
    await api.post('/doctor/prescription', {
      patientId: patient._id,
      medicines: validMedicines
    });
    setMedicines([{ name: '', dosage: '', duration: '' }]);
    alert('Prescription saved');
    const historyRes = await api.get(`/doctor/patient/${patient._id}/history`);
    setPatientHistory(historyRes.data);
  };

  /* ================= GSAP ================= */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15
      });

      gsap.utils.toArray('.hover-lift').forEach(el => {
        el.addEventListener('mouseenter', () =>
          gsap.to(el, { y: -6, scale: 1.02, duration: 0.25 })
        );
        el.addEventListener('mouseleave', () =>
          gsap.to(el, { y: 0, scale: 1, duration: 0.25 })
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [activeTab, workspaceTab, patient]);

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

  const filteredAppointments = sortedAppointments.filter(a => {
      if (appointmentFilter === 'all') return true;
      return a.status === appointmentFilter;
  });

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const nextAppointment = sortedAppointments.find(a => new Date(a.appointmentDate) >= new Date(new Date().setHours(0,0,0,0)) && a.status === 'confirmed');
  
  const todaysAppointments = sortedAppointments.filter(a => {
      const aptDate = new Date(a.appointmentDate);
      const today = new Date();
      return aptDate.getDate() === today.getDate() && aptDate.getMonth() === today.getMonth() && aptDate.getFullYear() === today.getFullYear() && a.status === 'confirmed';
  });
  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="fade-up mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Stethoscope className="text-green-600" />
              Dr. {user?.name}
            </h1>
            <p className="text-gray-500">
              {user?.specialization} • {user?.hospitalName}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-container flex gap-2 p-1 bg-white/70 rounded-2xl mb-8 fade-up overflow-x-auto border border-gray-200 backdrop-blur-md shadow-sm w-fit">
          {['overview', 'search', 'appointments', 'messages', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn px-6 py-2.5 font-semibold capitalize transition-all rounded-xl ${
                activeTab === tab
                  ? 'active bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
              }`}
            >
              {tab === 'search' ? 'Find Patient' : tab}
            </button>
          ))}
        </div>

        {/* ================= OVERVIEW ================= */}
        {activeTab === 'overview' && (
            <div className="space-y-8">
                {/* Upcoming Appointment Banner */}
                {nextAppointment && (
                   <div className="glass hover-lift rounded-2xl p-6 bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold flex items-center gap-2 text-green-50">
                            <Calendar className="w-5 h-5 text-green-200" /> Next Upcoming Patient
                         </h3>
                         <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Confirmed</span>
                      </div>
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-2xl font-bold mb-1">{nextAppointment.patientId?.name || 'Unknown Patient'}</p>
                            <p className="text-green-200 text-sm">Reason: {nextAppointment.reason || 'General Consultation'}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-bold">{new Date(nextAppointment.appointmentDate).toDateString()}</p>
                            <button onClick={() => { setActiveTab('search'); setSearchTerm(nextAppointment.patientId?.name); }} className="mt-2 bg-white text-green-700 px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-green-50 transition">
                                View File
                            </button>
                         </div>
                      </div>
                   </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-2xl flex items-center gap-4 hover-lift">
                        <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Appointments</p>
                            <h3 className="text-3xl font-bold text-gray-900">{appointments.length}</h3>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl flex items-center gap-4 hover-lift">
                        <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Pending Requests</p>
                            <h3 className="text-3xl font-bold text-gray-900">{pendingCount}</h3>
                        </div>
                    </div>
                    <div className="glass p-6 rounded-2xl flex items-center gap-4 hover-lift">
                        <div className="bg-green-100 p-4 rounded-full text-green-600">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Confirmed</p>
                            <h3 className="text-3xl font-bold text-gray-900">{confirmedCount}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Today's Schedule (2 Columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                                    <Clock className="text-blue-600" /> Today's Schedule
                                </h3>
                                <button onClick={() => { setActiveTab('appointments'); setAppointmentFilter('confirmed'); }} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                                    View All
                                </button>
                            </div>
                            
                            {todaysAppointments.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-500 font-medium">No confirmed appointments scheduled for today.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {todaysAppointments.slice(0, 4).map(apt => (
                                        <div key={apt._id} className="flex justify-between items-center p-4 bg-white/60 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition cursor-pointer" onClick={() => { setActiveTab('search'); setSearchTerm(apt.patientId?.name); }}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                    {apt.patientId?.name?.charAt(0) || 'P'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{apt.patientId?.name || 'Unknown Patient'}</h4>
                                                    <p className="text-sm text-gray-500">{apt.reason || 'General Consultation'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Confirmed</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions & Recent Activity (1 Column) */}
                    <div className="space-y-6">
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900"><Activity className="text-blue-600"/> Quick Actions</h3>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => setActiveTab('search')} className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3">
                                    <Stethoscope className="w-4 h-4"/> Start Consultation
                                </button>
                                <button onClick={() => { setActiveTab('appointments'); setAppointmentFilter('pending'); }} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm py-3 relative">
                                    <Clock className="w-4 h-4"/> Review Requests
                                    {pendingCount > 0 && <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                                </button>
                                <button onClick={() => setActiveTab('messages')} className="bg-purple-50 border border-purple-200 text-purple-700 font-bold w-full rounded-xl py-3 hover:bg-purple-100 transition flex items-center justify-center gap-2 text-sm">
                                    <Globe className="w-4 h-4"/> Telemedicine Portal
                                </button>
                            </div>
                        </div>

                        <div className="glass-card p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-0">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-50"><Brain className="text-indigo-400"/> AI System Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,1)]"></div>
                                    <span className="text-sm text-indigo-100">Diagnostic Model: Online</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,1)]"></div>
                                    <span className="text-sm text-indigo-100">Report Analysis: Active</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-indigo-800/50">
                                    <p className="text-xs text-indigo-300 italic">"Gemini-2.5-flash model running at optimal latency."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ================= FIND PATIENT ================= */}
        {activeTab === 'search' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Search Panel */}
            <div className="xl:col-span-4 space-y-6 fade-up">
              <div className="glass hover-lift rounded-2xl p-6">
                <h2 className="font-bold mb-4">Search Patient</h2>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    placeholder="Enter Aadhaar"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border bg-white/70 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    disabled={searchLoading}
                    className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition"
                  >
                    <Search />
                  </button>
                </form>
              </div>

              {patient && (
                <div className="glass hover-lift rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/5 rounded-bl-full"></div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl shadow-sm">
                      <User className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{patient.name}</h3>
                      <p className="text-sm text-gray-500">
                        {patient.age} yrs • {patient.gender}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4 pt-4 border-t">
                    <p className="text-sm flex justify-between"><strong className="text-gray-500">Phone:</strong> <span>{patient.phone}</span></p>
                    <p className="text-sm flex justify-between"><strong className="text-gray-500">Aadhaar:</strong> <span className="font-mono">{patient.aadhaar}</span></p>
                  </div>
                </div>
              )}
            </div>

            {/* Patient Workspace */}
            {patient ? (
              <div className="xl:col-span-8 space-y-6 fade-up">
                 <div className="glass rounded-2xl p-2 flex gap-2 overflow-x-auto">
                     {['history', 'reports', 'diagnosis', 'prescription', 'certificate'].map(tab => (
                         <button 
                            key={tab} 
                            onClick={() => setWorkspaceTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                                workspaceTab === tab ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:bg-white/50'
                            }`}
                         >
                            {tab === 'history' && <History className="inline w-4 h-4 mr-2"/>}
                            {tab === 'reports' && <FileText className="inline w-4 h-4 mr-2"/>}
                            {tab === 'diagnosis' && <PlusCircle className="inline w-4 h-4 mr-2"/>}
                            {tab === 'prescription' && <Pill className="inline w-4 h-4 mr-2"/>}
                            {tab === 'certificate' && <FileText className="inline w-4 h-4 mr-2"/>}
                            {tab}
                         </button>
                     ))}
                 </div>

                {workspaceTab === 'diagnosis' && (
                    <div className="glass hover-lift rounded-2xl p-6">
                    <h3 className="font-bold flex items-center gap-2 mb-4 text-lg">
                        <PlusCircle className="text-green-600" />
                        Add Clinical Diagnosis
                    </h3>
                    <form onSubmit={submitDiagnosis} className="space-y-4">
                        <input
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                        placeholder="Primary Diagnosis"
                        required
                        className="w-full px-4 py-3 rounded-xl border bg-white/70 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                value={vitals.bloodPressure}
                                onChange={e => setVitals({...vitals, bloodPressure: e.target.value})}
                                placeholder="BP (e.g. 120/80)"
                                className="w-full px-4 py-3 rounded-xl border bg-white/70 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                            <input
                                value={vitals.heartRate}
                                onChange={e => setVitals({...vitals, heartRate: e.target.value})}
                                placeholder="Heart Rate (bpm)"
                                className="w-full px-4 py-3 rounded-xl border bg-white/70 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                            <input
                                value={vitals.temperature}
                                onChange={e => setVitals({...vitals, temperature: e.target.value})}
                                placeholder="Temp (°F or °C)"
                                className="w-full px-4 py-3 rounded-xl border bg-white/70 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Detailed clinical notes and observations..."
                        className="w-full px-4 py-3 rounded-xl border bg-white/70 h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                        <div className="flex justify-end pt-2">
                        <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow hover:shadow-lg transition">
                            Save Record
                        </button>
                        </div>
                    </form>
                    </div>
                )}

                {workspaceTab === 'prescription' && (
                    <div className="glass hover-lift rounded-2xl p-6">
                    <h3 className="font-bold flex items-center gap-2 mb-4 text-lg">
                        <Pill className="text-blue-600" />
                        Digital Prescription
                    </h3>
                    <form onSubmit={submitPrescription} className="space-y-4">
                        {medicines.map((med, index) => (
                            <div key={index} className="flex gap-3 items-start">
                                <div className="flex-1">
                                    <input placeholder="Medicine Name" required value={med.name} onChange={e => handleMedicineChange(index, 'name', e.target.value)} className="w-full px-4 py-2 rounded-xl border bg-white/70 focus:ring-2 focus:ring-blue-500 outline-none text-sm"/>
                                </div>
                                <div className="flex-1">
                                    <input placeholder="Dosage (e.g., 1-0-1)" required value={med.dosage} onChange={e => handleMedicineChange(index, 'dosage', e.target.value)} className="w-full px-4 py-2 rounded-xl border bg-white/70 focus:ring-2 focus:ring-blue-500 outline-none text-sm"/>
                                </div>
                                <div className="flex-1">
                                    <input placeholder="Duration (e.g., 5 Days)" required value={med.duration} onChange={e => handleMedicineChange(index, 'duration', e.target.value)} className="w-full px-4 py-2 rounded-xl border bg-white/70 focus:ring-2 focus:ring-blue-500 outline-none text-sm"/>
                                </div>
                                {index === medicines.length - 1 && (
                                     <button type="button" onClick={handleAddMedicine} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition mt-0.5">
                                        <PlusCircle className="w-5 h-5"/>
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="flex justify-end pt-4 border-t mt-6">
                        <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow hover:shadow-lg transition">
                            Issue Prescription
                        </button>
                        </div>
                    </form>
                    </div>
                )}

                {workspaceTab === 'history' && (
                     <div className="glass rounded-2xl p-6">
                     <h3 className="font-bold flex items-center gap-2 mb-6 text-lg">
                       <History className="text-indigo-600" />
                       Patient Medical History
                     </h3>
                     
                     <div className="space-y-8">
                         <div>
                             <h4 className="font-semibold text-gray-700 mb-4 uppercase text-xs tracking-wider border-b pb-2">Past Diagnoses</h4>
                             {patientHistory.visits.length === 0 ? <p className="text-sm text-gray-500">No past visits recorded.</p> : (
                                 <div className="space-y-3">
                                     {patientHistory.visits.map(v => (
                                         <div key={v._id} className="bg-white/60 p-4 rounded-xl border">
                                             <div className="flex justify-between items-start mb-2">
                                                 <strong className="text-gray-900">{v.diagnosis}</strong>
                                                 <span className="text-xs text-gray-500">{new Date(v.visitDate).toLocaleDateString()}</span>
                                             </div>
                                             {v.notes && <p className="text-sm text-gray-600 mb-2">{v.notes}</p>}
                                             <p className="text-xs text-gray-400">Dr. {v.doctorId?.name}</p>
                                         </div>
                                     ))}
                                 </div>
                             )}
                         </div>

                         <div>
                             <h4 className="font-semibold text-gray-700 mb-4 uppercase text-xs tracking-wider border-b pb-2">Past Prescriptions</h4>
                             {patientHistory.prescriptions.length === 0 ? <p className="text-sm text-gray-500">No past prescriptions.</p> : (
                                 <div className="space-y-3">
                                     {patientHistory.prescriptions.map(p => (
                                         <div key={p._id} className="bg-white/60 p-4 rounded-xl border">
                                             <div className="flex justify-between items-start mb-3">
                                                 <span className="text-xs text-gray-500">{new Date(p.date).toLocaleDateString()}</span>
                                                 <p className="text-xs text-gray-400">Dr. {p.doctorId?.name}</p>
                                             </div>
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                 {p.medicines.map((m, i) => (
                                                     <div key={i} className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg text-sm">
                                                         <Pill className="w-4 h-4 text-blue-500"/>
                                                         <div>
                                                             <p className="font-semibold text-gray-800">{m.name}</p>
                                                             <p className="text-xs text-gray-500">{m.dosage} • {m.duration}</p>
                                                         </div>
                                                     </div>
                                                 ))}
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}
                         </div>
                     </div>
                   </div>
                )}

                {workspaceTab === 'reports' && (
                  <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold flex items-center gap-2 mb-6 text-lg">
                    <FileText className="text-purple-600" />
                    Laboratory & Scan Reports
                  </h3>

                  {patientReports.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 bg-white/40 rounded-xl border border-dashed">
                      No reports uploaded for this patient.
                    </p>
                  ) : (
                    <div className="space-y-4">
                    {patientReports.map(r => (
                      <div
                        key={r._id}
                        className="hover-lift border rounded-xl p-5 mb-4 bg-white/60 shadow-sm"
                      >
                        <div className="flex justify-between mb-3 items-center">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {r.analysis?.diagnosis || 'Medical Document'}
                            </h4>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3"/> {new Date(r.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <a
                            href={`${BASE_URL}${r.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-200 transition"
                          >
                            View File
                          </a>
                        </div>

                        {r.analysis && (
                          <div className="bg-purple-50 rounded-xl p-4 text-sm mt-4 border border-purple-100">
                            <strong className="text-purple-900 flex items-center gap-1 mb-1"><Activity className="w-4 h-4"/> AI Summary:</strong>{' '}
                            <p className="text-purple-800 leading-relaxed">{r.analysis.observations || 'N/A'}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    </div>
                  )}
                </div>
                )}

                {workspaceTab === 'certificate' && (
                    <div className="glass hover-lift rounded-2xl p-6">
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-lg">
                            <FileText className="text-indigo-600" />
                            Issue Medical Certificate
                        </h3>
                        <div className="space-y-4 bg-white/50 p-6 rounded-xl border border-dashed border-gray-300 relative" id="medical-certificate">
                            <h2 className="text-center font-bold text-xl uppercase tracking-widest border-b border-gray-400 pb-4 mb-4">Medical Certificate</h2>
                            <p className="text-gray-800 leading-loose">
                                This is to certify that <strong>{patient.name}</strong> (Age: {patient.age}, Gender: {patient.gender}), 
                                Aadhaar No: <strong>{patient.aadhaar}</strong>, has been examined by me on <strong>{new Date().toLocaleDateString()}</strong>.
                            </p>
                            <p className="text-gray-800 leading-loose">
                                Based on the clinical evaluation, the patient is suffering from a medical condition and is advised rest for ________ days 
                                starting from <strong>{new Date().toLocaleDateString()}</strong>.
                            </p>
                            <div className="mt-8 flex justify-between items-end">
                                <div>
                                    <p className="text-sm font-bold">Date: {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">Dr. {user?.name}</p>
                                    <p className="text-sm text-gray-500">{user?.specialization}</p>
                                    <p className="text-sm text-gray-500">{user?.hospitalName}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4 mt-2">
                            <button 
                                onClick={() => {
                                    const printContent = document.getElementById('medical-certificate').innerHTML;
                                    const originalContent = document.body.innerHTML;
                                    document.body.innerHTML = printContent;
                                    window.print();
                                    document.body.innerHTML = originalContent;
                                    window.location.reload(); // Reload to restore React state cleanly
                                }}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow hover:shadow-lg transition"
                            >
                                Print & Issue Certificate
                            </button>
                        </div>
                    </div>
                )}
              </div>
            ) : (
              <div className="xl:col-span-8 flex flex-col items-center justify-center glass rounded-2xl p-16 fade-up">
                <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                    <Clipboard className="w-16 h-16 text-blue-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Patient Selected</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Search for a patient using their Aadhaar number to view their medical history, reports, and start a new consultation.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= APPOINTMENTS ================= */}
        {activeTab === 'appointments' && (
          <div className="fade-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Appointments</h2>
                <div className="flex gap-2 glass p-1 rounded-xl">
                    {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(filter => (
                         <button 
                         key={filter}
                         onClick={() => setAppointmentFilter(filter)}
                         className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${appointmentFilter === filter ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                         >
                            {filter}
                         </button>
                    ))}
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
                {filteredAppointments.length === 0 ? (
                <div className="p-16 text-center text-gray-500">
                    <Calendar className="mx-auto mb-4 opacity-30 w-16 h-16" />
                    <p className="text-lg">No {appointmentFilter !== 'all' ? appointmentFilter : ''} appointments found</p>
                </div>
                ) : (
                filteredAppointments.map(a => (
                    <div
                    key={a._id}
                    className="hover-lift p-6 border-b flex justify-between items-center bg-white/40"
                    >
                    <div>
                        <h4 className="font-bold text-lg">{a.patientId?.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(a.appointmentDate).toDateString()}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {a.reason || 'General Consultation'}
                            </p>
                        </div>
                    </div>

                    {a.status === 'pending' ? (
                        <div className="flex gap-3">
                        <button
                            onClick={() => updateStatus(a._id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold transition flex items-center gap-1"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                        </button>
                        <button
                            onClick={() => updateStatus(a._id, 'cancelled')}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2 rounded-xl font-semibold transition flex items-center gap-1"
                        >
                            <XCircle className="w-4 h-4" />
                            Reject
                        </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-end gap-2">
                            <span
                            className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider ${
                                a.status === 'confirmed'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : a.status === 'completed'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                            >
                            {a.status}
                            </span>
                            
                            {a.status === 'confirmed' && (
                                <div className="flex flex-col items-end mt-3 gap-2">
                                    <span className="text-xs font-bold text-gray-400">
                                        Initiate call via Messages
                                    </span>
                                    <button
                                        onClick={() => updateStatus(a._id, 'completed')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                                    >
                                        Mark Completed
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                ))
                )}
            </div>
          </div>
        )}

        {/* ================= MESSAGES ================= */}
        {activeTab === 'messages' && (
           <div className="fade-up">
               <Messaging onStartVideoCall={(contact) => startVideoCall({ patientId: contact })} />
           </div>
        )}

        {/* ================= REVIEWS ================= */}
        {activeTab === 'reviews' && (
            <div className="fade-up">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Star className="text-yellow-500"/> Patient Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ratings.length === 0 ? (
                        <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                        ratings.map(r => (
                            <div key={r._id} className="glass p-6 rounded-2xl hover-lift shadow-sm">
                                <div className="flex justify-between mb-4 items-start">
                                    <div>
                                        <p className="font-bold text-gray-900">{r.patientId?.name || 'Anonymous'}</p>
                                        <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                                        <span className="font-bold text-yellow-700">{r.rating}</span>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">"{r.feedback || 'No written feedback provided.'}"</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
      </main>
      
      {/* AI Assistant Widget */}
      <AIAssistant contextData={{ patient, history: patientHistory }} />

      {/* Video Consultation Modal */}
      {showVideoModal && activeVideoApt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-900 rounded-3xl max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden relative shadow-2xl border border-gray-800">
            <div className="p-4 bg-gray-800 flex justify-between items-center">
               <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                   <h3 className="text-white font-bold text-lg">Consultation with {activeVideoApt.patientId?.name}</h3>
               </div>
               <button onClick={endVideoCall} className="text-gray-400 hover:text-white bg-gray-700 p-2 rounded-full">
                 <XCircle className="w-5 h-5" />
               </button>
            </div>
            
            <div className="flex-1 bg-black relative flex items-center justify-center">
                {/* Patient Video Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 flex-col">
                    <User className="w-24 h-24 mb-4 opacity-50 text-gray-600"/>
                    <p className="text-gray-500 font-medium">Waiting for Patient to join...</p>
                </div>
                
                {/* Self Video Placeholder (PIP) */}
                <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-800 rounded-xl border-2 border-gray-700 overflow-hidden shadow-xl flex items-center justify-center">
                    {localStream ? (
                        <video 
                            ref={localVideoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-12 h-12 text-gray-500"/>
                    )}
                </div>
            </div>
            
            <div className="p-6 bg-gray-800 flex justify-center gap-6">
                <button className="px-8 h-14 bg-red-600 rounded-full flex items-center justify-center text-white font-bold hover:bg-red-700 shadow-lg shadow-red-600/30" onClick={endVideoCall}>End Call</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
