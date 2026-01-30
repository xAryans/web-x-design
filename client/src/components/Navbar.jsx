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
import { useContext, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Activity } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const navRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/landing');
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
                <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 shadow-inner border">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                    {user.role}
                  </span>
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

