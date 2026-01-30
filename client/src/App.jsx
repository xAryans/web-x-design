import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import LandingPage from './pages/Landingpage';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />; 
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
             <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/patient" 
              element={
                <PrivateRoute role="patient">
                  <PatientDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/doctor" 
              element={
                <PrivateRoute role="doctor">
                  <DoctorDashboard />
                </PrivateRoute>
              } 
            />
           
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
