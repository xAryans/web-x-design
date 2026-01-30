// import { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';
// import api from '../services/api';
// import { User, Stethoscope, UserPlus, LogIn } from 'lucide-react';

// const Login = () => {
//   const [role, setRole] = useState('patient');
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [formData, setFormData] = useState({
//     identifier: '', // aadhaar or medicalId
//     password: '',
//     name: '',
//     age: '',
//     gender: 'Male',
//     phone: '',
//     specialization: '',
//     hospitalName: ''
//   });
  
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     // Login Logic
//     if (!isRegistering) {
//         const endpoint = role === 'patient' ? '/auth/patient/login' : '/auth/doctor/login';
//         const payload = role === 'patient' 
//             ? { aadhaar: formData.identifier, password: formData.password }
//             : { medicalId: formData.identifier, password: formData.password };

//         try {
//           const res = await api.post(endpoint, payload);
//           login(res.data, res.data.token, res.data.role);
//           navigate(role === 'patient' ? '/patient' : '/doctor');
//         } catch (err) {
//           setError(err.response?.data?.message || 'Login failed');
//         }
//         return;
//     }

//     // Registration Logic
//     const endpoint = role === 'patient' ? '/auth/patient/register' : '/auth/doctor/register';
//     let payload = {};
    
//     if (role === 'patient') {
//         payload = {
//             aadhaar: formData.identifier,
//             password: formData.password,
//             name: formData.name,
//             age: formData.age,
//             gender: formData.gender,
//             phone: formData.phone
//         };
//     } else {
//         payload = {
//             medicalId: formData.identifier,
//             password: formData.password,
//             name: formData.name,
//             specialization: formData.specialization,
//             hospitalName: formData.hospitalName
//         };
//     }

//     try {
//         const res = await api.post(endpoint, payload);
//         login(res.data, res.data.token, res.data.role);
//         navigate(role === 'patient' ? '/patient' : '/doctor');
//     } catch (err) {
//         setError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           {isRegistering ? `Create ${role === 'patient' ? 'Patient' : 'Doctor'} Account` : 'Sign in to your account'}
//         </h2>
        
//         {/* Role Toggle */}
//         <div className="mt-4 flex justify-center space-x-4">
//             <button
//                 type="button"
//                 onClick={() => setRole('patient')}
//                 className={`px-4 py-2 rounded-md flex items-center transition ${role === 'patient' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
//             >
//                 <User className="w-4 h-4 mr-2" /> Patient
//             </button>
//             <button
//                 type="button"
//                 onClick={() => setRole('doctor')}
//                  className={`px-4 py-2 rounded-md flex items-center transition ${role === 'doctor' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
//             >
//                 <Stethoscope className="w-4 h-4 mr-2" /> Doctor
//             </button>
//         </div>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
            
//             {/* Common Fields */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 {role === 'patient' ? 'Aadhaar Number' : 'Medical ID'}
//               </label>
//               <input
//                 name="identifier"
//                 type="text"
//                 required
//                 value={formData.identifier}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//             </div>

//             {/* Registration Fields */}
//             {isRegistering && (
//                 <>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                         <input
//                             name="name"
//                             type="text"
//                             required
//                             value={formData.name}
//                             onChange={handleChange}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         />
//                     </div>

//                     {role === 'patient' ? (
//                         <>
//                              <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Age</label>
//                                     <input
//                                         name="age"
//                                         type="number"
//                                         required
//                                         value={formData.age}
//                                         onChange={handleChange}
//                                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Gender</label>
//                                     <select
//                                         name="gender"
//                                         value={formData.gender}
//                                         onChange={handleChange}
//                                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                     >
//                                         <option>Male</option>
//                                         <option>Female</option>
//                                         <option>Other</option>
//                                     </select>
//                                 </div>
//                              </div>
//                              <div>
//                                 <label className="block text-sm font-medium text-gray-700">Phone</label>
//                                 <input
//                                     name="phone"
//                                     type="tel"
//                                     required
//                                     value={formData.phone}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                 />
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                              <div>
//                                 <label className="block text-sm font-medium text-gray-700">Specialization</label>
//                                 <input
//                                     name="specialization"
//                                     type="text"
//                                     required
//                                     value={formData.specialization}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
//                                 <input
//                                     name="hospitalName"
//                                     type="text"
//                                     value={formData.hospitalName}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                 />
//                             </div>
//                         </>
//                     )}
//                 </>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 name="password"
//                 type="password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//               />
//             </div>

//             {error && <div className="text-red-600 text-sm">{error}</div>}

//             <div>
//               <button
//                 type="submit"
//                 className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${role === 'patient' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//               >
//                 {isRegistering ? (
//                     <>
//                         <UserPlus className="w-4 h-4 mr-2" /> Register & Login
//                     </>
//                 ) : (
//                     <>
//                         <LogIn className="w-4 h-4 mr-2" /> Sign In
//                     </>
//                 )}
//               </button>
//             </div>
            
//             <div className="mt-6 text-center">
//                 <button
//                     type="button"
//                     onClick={() => {
//                         setIsRegistering(!isRegistering);
//                         setError('');
//                     }}
//                     className="text-sm text-blue-600 hover:text-blue-500 font-medium"
//                 >
//                     {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register"}
//                 </button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import { useState, useContext, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { User, Stethoscope, UserPlus, LogIn, Activity, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState('patient');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    specialization: '',
    hospitalName: ''
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const rootRef = useRef(null);

  /* ================= GSAP ================= */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12
      });

      gsap.from('.card-scale', {
        scale: 0.9,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isRegistering) {
      const endpoint =
        role === 'patient' ? '/auth/patient/login' : '/auth/doctor/login';

      const payload =
        role === 'patient'
          ? { aadhaar: formData.identifier, password: formData.password }
          : { medicalId: formData.identifier, password: formData.password };

      try {
        const res = await api.post(endpoint, payload);
        login(res.data, res.data.token, res.data.role);
        navigate(role === 'patient' ? '/patient' : '/doctor');
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      }
      return;
    }

    const endpoint =
      role === 'patient'
        ? '/auth/patient/register'
        : '/auth/doctor/register';

    let payload =
      role === 'patient'
        ? {
            aadhaar: formData.identifier,
            password: formData.password,
            name: formData.name,
            age: formData.age,
            gender: formData.gender,
            phone: formData.phone
          }
        : {
            medicalId: formData.identifier,
            password: formData.password,
            name: formData.name,
            specialization: formData.specialization,
            hospitalName: formData.hospitalName
          };

    try {
      const res = await api.post(endpoint, payload);
      login(res.data, res.data.token, res.data.role);
      navigate(role === 'patient' ? '/patient' : '/doctor');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
      ref={rootRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden"
    >
      {/* Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-40 w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md px-6">
        {/* Brand */}
        <div className="fade-up text-center mb-6">
          <div className="inline-flex items-center gap-2 font-bold text-2xl">
            <span className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
              <Activity className="w-5 h-5" />
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MediConnect
            </span>
          </div>
          <p className="text-gray-500 mt-2 text-sm flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            Secure Healthcare Access
          </p>
        </div>

        {/* Card */}
        <div className="card-scale glass rounded-2xl shadow-xl p-8">
          <h2 className="fade-up text-center text-2xl font-bold text-gray-900">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="fade-up text-center text-sm text-gray-500 mb-6">
            {isRegistering
              ? 'Register to manage your health digitally'
              : 'Sign in to continue to your dashboard'}
          </p>

          {/* Role Toggle */}
          <div className="fade-up flex justify-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition ${
                role === 'patient'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white/70 border'
              }`}
            >
              <User className="w-4 h-4" /> Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition ${
                role === 'doctor'
                  ? 'bg-green-600 text-white shadow'
                  : 'bg-white/70 border'
              }`}
            >
              <Stethoscope className="w-4 h-4" /> Doctor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="identifier"
              required
              value={formData.identifier}
              onChange={handleChange}
              placeholder={role === 'patient' ? 'Aadhaar Number' : 'Medical ID'}
              className="w-full px-4 py-2 rounded-xl border bg-white/70 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {isRegistering && (
              <>
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 rounded-xl border bg-white/70"
                />

                {role === 'patient' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        name="age"
                        type="number"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                        className="px-4 py-2 rounded-xl border bg-white/70"
                      />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="px-4 py-2 rounded-xl border bg-white/70"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <input
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border bg-white/70"
                    />
                  </>
                ) : (
                  <>
                    <input
                      name="specialization"
                      placeholder="Specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border bg-white/70"
                    />
                    <input
                      name="hospitalName"
                      placeholder="Hospital Name"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border bg-white/70"
                    />
                  </>
                )}
              </>
            )}

            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-xl border bg-white/70"
            />

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-white transition ${
                role === 'patient'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
              {isRegistering ? 'Register & Continue' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              {isRegistering
                ? 'Already have an account? Sign in'
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
