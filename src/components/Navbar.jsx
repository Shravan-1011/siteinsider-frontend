import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full px-4 sm:px-8 lg:px-16 py-5 flex items-center justify-between relative z-50">

      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/src/assets/siteinsiderlogo.png"
          alt="SiteInsider Logo"
          className="h-15 w-25 sm:h-20 w-35 scale-140"
        />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 text-gray-400">
        <Link to="/products" className="hover:text-white transition">
          Products
        </Link>

        <Link to="/about" className="hover:text-white transition">
          About
        </Link>

        <Link to="/login" className="hover:text-white transition">
          Login
        </Link>

        <Link
          to="/signup"
          className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition font-medium"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col gap-1.5"
      >
        <span className="w-6 h-0.5 bg-white"></span>
        <span className="w-6 h-0.5 bg-white"></span>
        <span className="w-6 h-0.5 bg-white"></span>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-[#0E1628] border-t border-gray-800 md:hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-6 text-gray-300">

              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="hover:text-white transition"
              >
                Products
              </Link>

              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="hover:text-white transition"
              >
                About
              </Link>

              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-center hover:bg-blue-700 transition font-medium"
              >
                Get Started
              </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}