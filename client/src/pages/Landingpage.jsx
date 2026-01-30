import { Link } from 'react-router-dom';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Activity,
  ShieldCheck,
  Brain,
  Users,
  FileText,
  ArrowRight,
  Lock,
  HeartPulse,
  Stethoscope,
  BarChart3,
  Sparkles,
  Globe
} from 'lucide-react';

const LandingPage = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15
      });

      gsap.from('.timeline-step', {
        opacity: 0,
        x: -40,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });

      gsap.to('.float-orb', {
        y: 30,
        repeat: -1,
        yoyo: true,
        duration: 6,
        ease: 'sine.inOut'
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden"
    >
      {/* Floating Orbs */}
      <div className="float-orb absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-3xl" />
      <div className="float-orb absolute top-1/2 -right-40 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-3xl" />

      {/* NAVBAR */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3 font-bold text-xl">
          <span className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
            <Activity className="w-5 h-5" />
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MediConnect
          </span>
        </div>

        <Link
          to="/login"
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:shadow-lg transition"
        >
          Login
        </Link>
      </header>

      {/* HERO */}
      <section className="fade-up relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight">
          Healthcare.
          <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Reimagined for the Digital Age.
          </span>
        </h1>

        <p className="mt-10 text-2xl text-gray-600 max-w-4xl mx-auto">
          MediConnect is an intelligent healthcare platform that unifies medical
          records, clinical workflows, and AI-powered insights into one secure ecosystem.
        </p>

        <div className="mt-14 flex justify-center gap-8">
          <Link
            to="/login"
            className="px-12 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600
            text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition flex items-center gap-2"
          >
            Start Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="px-12 py-5 rounded-xl bg-white/70 backdrop-blur border
            text-gray-700 text-lg font-semibold hover:bg-white transition"
          >
            Doctor Access
          </Link>
        </div>
      </section>

      {/* MISSION */}
      <section className="fade-up max-w-6xl mx-auto px-6 py-28 text-center">
        <Globe className="mx-auto w-14 h-14 text-blue-600 mb-6" />
        <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
        <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
          To make healthcare simpler, smarter, and safer by giving patients ownership
          of their data and empowering doctors with intelligent clinical tools.
        </p>
      </section>

      {/* AI SECTION */}
      <section className="fade-up max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">
            AI That Assists,
            <span className="text-blue-600"> Not Replaces</span>
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            MediConnect uses artificial intelligence to analyze medical reports,
            extract structured insights, and highlight key findings.
          </p>
          <p className="text-gray-600 text-lg">
            Doctors stay in control. AI simply reduces cognitive load and saves time.
          </p>
        </div>

        <div className="glass rounded-3xl p-10">
          <Brain className="w-14 h-14 text-indigo-600 mb-4" />
          <p className="text-gray-700 text-lg">
            ✓ Auto-extracted diagnoses<br/>
            ✓ Highlighted abnormal values<br/>
            ✓ Chronological health summaries<br/>
            ✓ Faster clinical decision-making
          </p>
        </div>
      </section>

      {/* PATIENT JOURNEY */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <h2 className="fade-up text-4xl font-bold text-center mb-16">
          Patient Journey
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            'Register securely',
            'Upload medical reports',
            'Get AI summaries',
            'Connect with doctors'
          ].map((step, i) => (
            <div key={i} className="timeline-step glass rounded-2xl p-6 text-center">
              <HeartPulse className="mx-auto text-blue-600 mb-4" />
              <p className="font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DOCTOR JOURNEY */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <h2 className="fade-up text-4xl font-bold text-center mb-16">
          Doctor Workflow
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            'Search patients instantly',
            'Review AI reports',
            'Add diagnoses',
            'Manage appointments'
          ].map((step, i) => (
            <div key={i} className="timeline-step glass rounded-2xl p-6 text-center">
              <Stethoscope className="mx-auto text-green-600 mb-4" />
              <p className="font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY */}
      <section className="fade-up max-w-6xl mx-auto px-6 py-28 text-center">
        <Lock className="mx-auto w-16 h-16 text-blue-600 mb-6" />
        <h2 className="text-4xl font-bold mb-6">Healthcare-Grade Security</h2>
        <p className="text-xl text-gray-600 leading-relaxed">
          End-to-end encryption, role-based access, audit trails,
          and patient-controlled data sharing ensure complete privacy and compliance.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="fade-up py-32 text-center">
        <div className="glass max-w-4xl mx-auto rounded-3xl p-14 shadow-2xl">
          <Sparkles className="mx-auto text-indigo-600 mb-4" />
          <h2 className="text-5xl font-bold mb-6">
            The Future of Healthcare Starts Now
          </h2>
          <p className="text-gray-600 text-xl mb-12">
            Join thousands of patients and doctors building a smarter healthcare system.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-xl
            bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold
            shadow-xl hover:shadow-2xl transition text-lg"
          >
            Create Free Account <ArrowRight />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-sm text-gray-500">
        © {new Date().getFullYear()} MediConnect. Empowering healthcare digitally.
      </footer>
    </div>
  );
};

export default LandingPage;
