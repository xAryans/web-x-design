import { Link, useNavigate } from 'react-router-dom';
import { useLayoutEffect, useRef, useEffect, useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { gsap } from 'gsap';
import {
  Activity,
  Brain,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowRight,
  HeartPulse,
  User,
  CheckCircle,
  Video,
  Stethoscope,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Send
} from 'lucide-react';

const LandingPage = () => {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!loading && user) {
      navigate(user.role === 'patient' ? '/patient' : '/doctor');
    }
  }, [user, loading, navigate]);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 15; // Max 15 degree rotation
    const y = (clientY / innerHeight - 0.5) * -15;
    setMousePos({ x, y });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.from('.nav-item', { y: -20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
      gsap.from('.hero-text', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
      gsap.from('.hero-card', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
      
      gsap.from('.feature-card', {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.6
      });

      // Subtle floating elements animation
      gsap.to('.float-element', {
        y: -15, rotation: 2, repeat: -1, yoyo: true, duration: 3, ease: 'sine.inOut', stagger: 0.2
      });

    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={rootRef} 
      className="relative min-h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden selection:bg-indigo-500/30"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Aurora Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/30 blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/30 blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

      {/* NAVBAR */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="nav-item flex items-center gap-3 font-extrabold text-2xl tracking-tighter">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-white">MediConnect<span className="text-indigo-500">.</span></span>
        </div>
        <div className="nav-item flex items-center gap-6">
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition">Sign In</Link>
          <Link to="/login" state={{ isRegistering: true }} className="px-6 py-2.5 rounded-full bg-white text-slate-900 text-sm font-bold hover:bg-slate-200 transition shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        <div className="hero-text inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold tracking-wide uppercase mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-indigo-400" /> The Future of Healthcare
        </div>
        
        <h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-8 max-w-5xl">
          Healthcare, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Intelligently Connected.
          </span>
        </h1>
        
        <p className="hero-text text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Unify patient records, automate AI diagnostics, and conduct telemedicine natively. The all-in-one operating system for modern medical practices.
        </p>
        
        <div className="hero-text flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/login" className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2">
            Enter Patient Portal <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" state={{ role: 'doctor' }} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2">
            <Stethoscope className="w-5 h-5" /> Doctor Access
          </Link>
        </div>

        {/* 3D INTERACTIVE MOCKUP */}
        <div 
          className="hero-card relative mt-24 w-full max-w-5xl perspective-1000"
          style={{ perspective: '1000px' }}
        >
          <div 
            ref={heroRef}
            className="w-full relative rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-200 ease-out"
            style={{ 
                transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
                transformStyle: 'preserve-3d'
            }}
          >
            {/* Mockup Header */}
            <div className="h-12 border-b border-white/10 flex items-center px-6 gap-2 bg-slate-800/50">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            
            {/* Mockup Body */}
            <div className="p-8 grid md:grid-cols-3 gap-6 relative text-left">
               {/* Left Column */}
               <div className="md:col-span-2 space-y-6">
                  <div className="flex justify-between items-end">
                      <div>
                          <h3 className="text-2xl font-bold text-white mb-1">Good morning, Dr. Smith</h3>
                          <p className="text-slate-400 text-sm">You have 4 appointments today.</p>
                      </div>
                  </div>
                  
                  {/* Schedule Cards */}
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                              <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">AJ</div>
                              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded uppercase font-bold">10:00 AM</span>
                          </div>
                          <h4 className="font-bold text-white">Alex Johnson</h4>
                          <p className="text-sm text-slate-400">General Checkup</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">MS</div>
                              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded uppercase font-bold">11:30 AM</span>
                          </div>
                          <h4 className="font-bold text-white">Maria Silva</h4>
                          <p className="text-sm text-slate-400">Cardiology Follow-up</p>
                      </div>
                  </div>
               </div>

               {/* Right Column / AI Panel */}
               <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden float-element">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px]"></div>
                   <div className="flex items-center gap-3 mb-6">
                       <Brain className="text-indigo-400 w-6 h-6" />
                       <h3 className="font-bold text-indigo-50">Gemini AI Insights</h3>
                   </div>
                   <div className="space-y-4 relative z-10">
                       <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                           <p className="text-xs text-indigo-200 leading-relaxed">Patient uploaded new blood work. Glucose levels are slightly elevated.</p>
                       </div>
                       <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                           <p className="text-xs text-indigo-200 leading-relaxed">ECG report analysis complete. Normal sinus rhythm detected.</p>
                       </div>
                       <button className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 text-sm font-bold rounded-xl transition">View Full Report</button>
                   </div>
               </div>
            </div>
          </div>
          
          {/* Floating UI Elements over Mockup */}
          <div className="absolute -left-10 top-20 bg-slate-800 border border-white/10 p-4 rounded-2xl shadow-2xl float-element z-30 flex items-center gap-4 hidden md:flex">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <HeartPulse className="text-green-400 w-5 h-5" />
              </div>
              <div className="text-left">
                  <p className="text-xs text-slate-400">Vitals Sync</p>
                  <p className="font-bold text-white text-sm">Connected</p>
              </div>
          </div>

          <div className="absolute -right-8 bottom-10 bg-slate-800 border border-white/10 p-4 rounded-2xl shadow-2xl float-element z-30 flex items-center gap-4 delay-700 hidden md:flex">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Video className="text-blue-400 w-5 h-5" />
              </div>
              <div className="text-left">
                  <p className="text-xs text-slate-400">Telemedicine</p>
                  <p className="font-bold text-white text-sm">Ready</p>
              </div>
          </div>
        </div>
      </main>

      {/* FEATURES GRID */}
      <section className="relative z-10 bg-slate-950/50 py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
            {/* Decorative Top Line */}
            <div className="flex justify-center mb-12">
                <div className="w-px h-24 bg-gradient-to-b from-transparent via-indigo-500 to-transparent opacity-50"></div>
            </div>

            <div className="text-center mb-24 relative feature-card">
                {/* Glowing Abstract Lines Behind Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] max-w-xl h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent -z-10 blur-sm"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/5 text-slate-300 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-indigo-400" /> Core Features
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Excellence</span></h2>
                
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Everything you need to run a state-of-the-art medical practice, built into one seamless, blazingly fast platform.
                </p>

                {/* Decorative Bottom Line */}
                <div className="mt-12 flex items-center justify-center gap-4">
                    <div className="w-16 h-px bg-gradient-to-r from-transparent to-indigo-500/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                    <div className="w-16 h-px bg-gradient-to-l from-transparent to-indigo-500/50"></div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="feature-card group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:bg-white/5 hover:border-indigo-500/30 transition-all cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Brain className="text-indigo-400 w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">AI Diagnostics</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">Powered by Google Gemini. Instantly extract text and analyze complex medical reports with unparalleled accuracy.</p>
                </div>
                
                <div className="feature-card group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:bg-white/5 hover:border-purple-500/30 transition-all cursor-pointer delay-100">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="text-purple-400 w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Military-Grade Security</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">Your data is safe. End-to-end encryption for all patient records, ensuring full compliance and absolute privacy.</p>
                </div>

                <div className="feature-card group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:bg-white/5 hover:border-blue-500/30 transition-all cursor-pointer delay-200">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Globe className="text-blue-400 w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Native Telehealth</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">High-definition WebRTC video consultations built directly into the platform. No third-party apps needed.</p>
                </div>
            </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="relative z-10 py-32 bg-[#020617] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16 feature-card">
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Get in Touch</h2>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto">Have questions about integrating MediConnect into your clinic or hospital? Our enterprise team is ready to help.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                  {/* Contact Info Cards */}
                  <div className="space-y-6">
                      <div className="feature-card p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-6 hover:bg-white/10 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                              <Mail className="text-blue-400 w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-slate-400 text-sm mb-1">Email Us</p>
                              <p className="text-white font-bold text-lg">enterprise@mediconnect.com</p>
                          </div>
                      </div>
                      
                      <div className="feature-card p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-6 hover:bg-white/10 transition-colors delay-100">
                          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                              <Phone className="text-green-400 w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-slate-400 text-sm mb-1">Call Support (24/7)</p>
                              <p className="text-white font-bold text-lg">+1 (888) 123-4567</p>
                          </div>
                      </div>

                      <div className="feature-card p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-6 hover:bg-white/10 transition-colors delay-200">
                          <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                              <MapPin className="text-purple-400 w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-slate-400 text-sm mb-1">Global Headquarters</p>
                              <p className="text-white font-bold text-lg">100 HealthTech Blvd, Silicon Valley, CA</p>
                          </div>
                      </div>
                  </div>

                  {/* Contact Form Mockup */}
                  <div className="feature-card p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-indigo-500/20 rounded-full blur-[60px]" />
                      <h3 className="text-2xl font-bold text-white mb-6 relative z-10">Send a Message</h3>
                      <form className="space-y-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
                          <div className="grid grid-cols-2 gap-4">
                              <input type="text" placeholder="First Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                              <input type="text" placeholder="Last Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                          </div>
                          <input type="email" placeholder="Work Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                          <textarea placeholder="How can we help you?" rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"></textarea>
                          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2">
                              Send Request <Send className="w-4 h-4" />
                          </button>
                      </form>
                  </div>
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-[#020617] pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-4 gap-12 mb-16">
                  <div className="md:col-span-2">
                      <div className="flex items-center gap-2 font-extrabold text-2xl tracking-tighter mb-4">
                          <Activity className="w-6 h-6 text-indigo-500" />
                          <span className="text-white">MediConnect<span className="text-indigo-500">.</span></span>
                      </div>
                      <p className="text-slate-400 max-w-sm leading-relaxed">
                          Building the intelligent nervous system for modern healthcare. Connecting patients and doctors instantly.
                      </p>
                  </div>
                  <div>
                      <h4 className="text-white font-bold mb-4">Platform</h4>
                      <ul className="space-y-3 text-slate-400 text-sm">
                          <li className="hover:text-indigo-400 cursor-pointer transition-colors">Patient Portal</li>
                          <li className="hover:text-indigo-400 cursor-pointer transition-colors">Doctor Dashboard</li>
                          <li className="hover:text-indigo-400 cursor-pointer transition-colors">AI Diagnostics</li>
                          <li className="hover:text-indigo-400 cursor-pointer transition-colors">Telemedicine</li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="text-white font-bold mb-4">Company</h4>
                      <ul className="space-y-3 text-slate-400 text-sm">
                          <li className="hover:text-indigo-400 cursor-pointer transition-colors">About Us</li>
                          <li className="hover:text-indigo-400 cursor-pointer transition-colors">Careers</li>
                          <li className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</li>
                          <li className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Service</li>
                      </ul>
                  </div>
              </div>
              <div className="text-center text-slate-500 text-sm border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p>© {new Date().getFullYear()} MediConnect Inc. All rights reserved.</p>
                  <div className="flex gap-4">
                      <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer">𝕏</span>
                      <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer">in</span>
                  </div>
              </div>
          </div>
      </footer>
      
      {/* ADD ANIMATION KEYFRAMES */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  );
};

export default LandingPage;
