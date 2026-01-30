
import { useState, useContext, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import {
  Search,
  User,
  FileText,
  PlusCircle,
  Clipboard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Stethoscope
} from 'lucide-react';

const BASE_URL = 'http://localhost:5000';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const rootRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [patient, setPatient] = useState(null);
  const [patientReports, setPatientReports] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('search');

  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (activeTab === 'appointments') fetchAppointments();
  }, [activeTab]);

  const fetchAppointments = async () => {
    const res = await api.get('/doctor/appointments');
    setAppointments(res.data);
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

    try {
      const res = await api.get(`/doctor/search/${searchTerm}`);
      setPatient(res.data);

      const reportsRes = await api.get(`/patient/reports/${res.data._id}`);
      setPatientReports(reportsRes.data);
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
      notes
    });
    setDiagnosis('');
    setNotes('');
    alert('Diagnosis saved');
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
  }, []);

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
        <div className="fade-up flex gap-6 border-b mb-8">
          {['search', 'appointments'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-semibold capitalize relative ${
                activeTab === tab
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'search' ? 'Find Patient' : 'Appointments'}
              {activeTab === tab && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-600 rounded" />
              )}
            </button>
          ))}
        </div>

        {/* ================= FIND PATIENT ================= */}
        {activeTab === 'search' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Search */}
            <div className="md:col-span-4 space-y-6">
              <div className="glass hover-lift rounded-2xl p-6">
                <h2 className="font-bold mb-4">Search Patient</h2>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    placeholder="Enter Aadhaar"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border bg-white/70"
                  />
                  <button
                    disabled={searchLoading}
                    className="bg-blue-600 text-white px-4 rounded-xl"
                  >
                    <Search />
                  </button>
                </form>
              </div>

              {patient && (
                <div className="glass hover-lift rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <User className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{patient.name}</h3>
                      <p className="text-sm text-gray-500">
                        {patient.age} yrs • {patient.gender}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm"><strong>Phone:</strong> {patient.phone}</p>
                  <p className="text-sm"><strong>Aadhaar:</strong> {patient.aadhaar}</p>
                </div>
              )}
            </div>

            {/* Patient Workspace */}
            {patient ? (
              <div className="md:col-span-8 space-y-6">
                {/* Diagnosis */}
                <div className="glass hover-lift rounded-2xl p-6">
                  <h3 className="font-bold flex items-center gap-2 mb-4">
                    <PlusCircle className="text-green-600" />
                    Add Diagnosis
                  </h3>
                  <form onSubmit={submitDiagnosis} className="space-y-4">
                    <input
                      value={diagnosis}
                      onChange={e => setDiagnosis(e.target.value)}
                      placeholder="Diagnosis"
                      className="w-full px-4 py-2 rounded-xl border bg-white/70"
                    />
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Clinical notes"
                      className="w-full px-4 py-2 rounded-xl border bg-white/70 h-24 resize-none"
                    />
                    <div className="flex justify-end">
                      <button className="bg-green-600 text-white px-6 py-2 rounded-xl">
                        Save Record
                      </button>
                    </div>
                  </form>
                </div>

                {/* Reports */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold flex items-center gap-2 mb-4">
                    <FileText className="text-purple-600" />
                    Patient Reports
                  </h3>

                  {patientReports.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                      No reports available
                    </p>
                  ) : (
                    patientReports.map(r => (
                      <div
                        key={r._id}
                        className="hover-lift border rounded-xl p-4 mb-4 bg-white/60"
                      >
                        <div className="flex justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">
                              {r.analysis?.diagnosis || 'Medical Report'}
                            </h4>
                            <span className="text-xs text-gray-400">
                              {new Date(r.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <a
                            href={`${BASE_URL}${r.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 text-sm"
                          >
                            Open
                          </a>
                        </div>

                        {r.analysis && (
                          <div className="bg-gray-50 rounded-lg p-3 text-sm">
                            <strong>AI Summary:</strong>{' '}
                            {r.analysis.observations || 'N/A'}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="md:col-span-8 flex items-center justify-center glass rounded-2xl p-12">
                <Clipboard className="w-14 h-14 text-gray-300 mb-4" />
                <p className="text-gray-500">
                  Search a patient to start consultation
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= APPOINTMENTS ================= */}
        {activeTab === 'appointments' && (
          <div className="glass rounded-2xl overflow-hidden">
            {appointments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Calendar className="mx-auto mb-3 opacity-30" />
                No appointment requests
              </div>
            ) : (
              appointments.map(a => (
                <div
                  key={a._id}
                  className="hover-lift p-6 border-b flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold">{a.patientId?.name}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(a.appointmentDate).toDateString()}
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {a.reason || 'General Consultation'}
                    </p>
                  </div>

                  {a.status === 'pending' ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus(a._id, 'confirmed')}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl"
                      >
                        <CheckCircle className="inline mr-1 w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(a._id, 'cancelled')}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-xl"
                      >
                        <XCircle className="inline mr-1 w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        a.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {a.status}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;


