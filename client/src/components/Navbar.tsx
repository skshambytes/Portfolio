import React, { useState, useEffect } from 'react';
import { Menu, X, FileDown, Database } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education & Certs', href: '#timeline' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-slate-100 hover:text-cyan-400 transition-colors group"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-400 p-0.5 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Database className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight font-sans">
              Saksham <span className="text-cyan-400">Raj</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider -mt-1">
              DATA ANALYST
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Resume Download Button */}
          <a
            href="/resume.pdf"
            download="Saksham_Raj_Resume.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 transition-all duration-200 shadow-sm shadow-cyan-500/20"
          >
            <FileDown className="h-4 w-4" />
            <span>Resume</span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <a
            href="/resume.pdf"
            download="Saksham_Raj_Resume.pdf"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/40"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>CV</span>
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-white/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-200 hover:text-cyan-400"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
