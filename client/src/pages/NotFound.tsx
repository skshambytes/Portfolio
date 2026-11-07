import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Saksham Raj</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-50 dark:bg-[#090d16] transition-colors duration-300">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-white/10 text-center max-w-lg w-full space-y-6 relative z-10">
          <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
            <AlertTriangle className="h-10 w-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-500 dark:from-cyan-400 dark:to-sky-400 font-mono">
              404
            </h1>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dataset Not Found</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The query path you requested returned null. The page may have moved, expired, or never existed in the database.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-lg shadow-cyan-500/25 transition-all duration-200"
          >
            <Home className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </>
  );
};
