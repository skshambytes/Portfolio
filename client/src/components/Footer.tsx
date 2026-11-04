import React from 'react';
import { Mail, Phone, Linkedin, Instagram, Github, ArrowUp, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/skshambytes',
      icon: Github,
      label: 'GitHub profile',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/sakshamraj294',
      icon: Linkedin,
      label: 'LinkedIn profile',
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/saksham294_/?hl=en',
      icon: Instagram,
      label: 'Instagram profile',
    },
    {
      name: 'Email',
      href: 'mailto:rajsaksham744@gmail.com',
      icon: Mail,
      label: 'Send email to Saksham',
    },
    {
      name: 'Phone',
      href: 'tel:+919625631438',
      icon: Phone,
      label: 'Call or WhatsApp Saksham',
    },
  ];

  return (
    <footer className="relative bg-slate-950 border-t border-white/5 pt-12 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          {/* Brand info */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-slate-100 font-sans">
              Saksham <span className="text-cyan-400">Raj</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Data Analyst & Business Intelligence | Turning raw data into decisions.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={item.label}
                  className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:scale-105 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-slate-300 bg-slate-900 border border-white/5 hover:border-cyan-500/30 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Saksham Raj. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="/privacy"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Privacy Policy</span>
            </a>
            <span>•</span>
            <span>Built with MERN Stack & 3D Three.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
