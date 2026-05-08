// import { Link, useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import AuthContext from '../context/AuthContext';
// import { LogOut, User, Activity } from 'lucide-react';

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <Link to="/" className="flex-shrink-0 flex items-center text-blue-600 font-bold text-xl">
//               <Activity className="h-6 w-6 mr-2" />
//               MediConnect
//             </Link>
//           </div>
//           <div className="flex items-center">
//             {user ? (
//               <div className="flex items-center space-x-4">
//                 <span className="text-gray-700 flex items-center">
//                     <User className="h-4 w-4 mr-1"/>
//                     Hello, {user.name} ({user.role})
//                 </span>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center text-gray-500 hover:text-red-600 transition"
//                 >
//                   <LogOut className="h-5 w-5 mr-1" />
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="space-x-4">
//                 <Link to="/" className="text-gray-500 hover:text-blue-600">Login</Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { Link, useNavigate } from 'react-router-dom';
import { useContext, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Activity, Bell, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  const mockNotifs = user?.role === 'doctor' ? [
    "New appointment request from a patient.",
    "A patient uploaded a new lab report.",
    "System update: Phase 3 is now live."
  ] : [
    "Your appointment is confirmed.",
    "Time to take your medication: Paracetamol.",
    "Your lab report is ready for viewing."
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* GSAP animation */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nav-item', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link
            to="/"
            className="nav-item flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <span className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Activity className="h-5 w-5" />
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MediConnect
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-6 nav-item">
            {user ? (
              <>
                {/* User Badge */}
                <div className="user-badge hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 shadow-inner border">
                  <User className="user-icon h-4 w-4 text-blue-600" />
                  <span className="user-name text-sm font-medium text-slate-800">
                    {user.name}
                  </span>
                  <span className="user-role text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {user.role}
                  </span>
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-full hover:bg-gray-100 transition relative"
                >
                  {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => {
                        setShowNotifs(!showNotifs);
                        if (hasUnread) setHasUnread(false);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 relative transition"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {hasUnread && (
                      <>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                      </>
                    )}
                  </button>
                  
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white font-bold flex justify-between items-center">
                        Smart Notifications
                        {hasUnread && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">3 New</span>}
                      </div>
                      <div className="divide-y max-h-64 overflow-y-auto">
                        {mockNotifs.map((n, i) => (
                          <div key={i} className="p-4 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer transition">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                              <p>{n}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600
                text-white font-semibold shadow hover:shadow-lg transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

