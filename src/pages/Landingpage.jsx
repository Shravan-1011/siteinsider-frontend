import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import  Navbar from "../components/Navbar";

export default function Landing() {
  return (
    <div className="bg-gradient-to-b from-[#0B1120] via-[#0E1628] to-[#0B1120] text-white min-h-screen overflow-hidden">
      
      {/* ================= NAVBAR ================= */}
     <Navbar />

      {/* ================= HERO ================= */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-20 py-16 sm:py-20 lg:py-28 gap-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_60%)] pointer-events-none"></div>  
        {/* LEFT SIDE */}
        <div className="max-w-xl text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-500 text-sm uppercase tracking-widest mb-4"
          >
            Real-Time Monitoring
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
          >
            Monitor Your Website.
            <br />
            Prevent Downtime.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 mt-6 text-base sm:text-lg max-w-lg mx-auto lg:mx-0"
          >
            Get instant alerts, performance insights, and uptime tracking —
            all in one clean dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              to="/signup"
              className="border border-gray-700 px-6 py-3 rounded-xl hover:bg-gray-800 transition text-gray-300"
            >
              Start Free
            </Link>
            <Link
              to="/demo"
              className="border border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              View Demo
            </Link>
            
          </motion.div>
        </div>

        {/* RIGHT SIDE - DASHBOARD MOCK */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="mt-16 md:mt-0 relative"
        >
          {/* Glow */}
          <div className="absolute -inset-6 bg-blue-600/30 blur-3xl rounded-3xl opacity-30"></div>

          {/* Mock Card */}
          <div className="relative bg-[#111827] border border-gray-800 rounded-2xl p-6 w-[320px] md:w-[400px] shadow-2xl">
            
           <h3 className="text-lg font-semibold mb-6 tracking-wide">
  siteinsider.app
</h3>

<div className="space-y-4">
  <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm font-medium">
    ● Status: Operational
  </div>

  <div className="bg-gray-800 p-4 rounded-xl">
    <p className="text-gray-400 text-sm">Response Time</p>
    <p className="text-2xl font-bold mt-1">238ms</p>
  </div>

  <div className="bg-gray-800 p-4 rounded-xl">
    <p className="text-gray-400 text-sm">Uptime (30d)</p>
    <p className="text-2xl font-bold mt-1">99.98%</p>
  </div>
</div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}