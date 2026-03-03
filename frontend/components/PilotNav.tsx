"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function PilotNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-blue-600">
              RetentionHealth
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("economic-impact")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Economic Impact
            </button>
            <button
              onClick={() => scrollToSection("founder-terms")}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Founder Terms
            </button>
            <button
              onClick={() => scrollToSection("apply")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply for Pilot
            </button>
            <Link
              href="/clinic"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clinic Login
            </Link>
            <Link
              href="/patient"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Patient Portal
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("economic-impact")}
              className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              Economic Impact
            </button>
            <button
              onClick={() => scrollToSection("founder-terms")}
              className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium py-2"
            >
              Founder Terms
            </button>
            <button
              onClick={() => scrollToSection("apply")}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Apply for Pilot
            </button>
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <Link
                href="/clinic"
                className="block text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Clinic Login
              </Link>
              <Link
                href="/patient"
                className="block text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Patient Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
