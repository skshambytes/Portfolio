import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, ArrowLeft, Lock, Trash2, Clock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Saksham Raj</title>
        <meta
          name="description"
          content="Privacy Policy for Saksham Raj's portfolio website. Details about data collection, storage, 90-day automatic retention policy, and deletion requests."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-8 p-2 rounded-lg bg-slate-900 border border-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 space-y-8">
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Privacy Policy</h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Last updated: November 2026 • Effective immediately
              </p>
            </div>
          </div>

          {/* Section 1: Introduction */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-200">1. Commitment to Privacy</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              This portfolio website is operated by <strong>Saksham Raj</strong> ("I", "me"). I value your privacy and do not use intrusive tracking, commercial advertising cookies, or data-brokering third-party scripts. This policy transparently explains what minimal information is collected, how it is processed, and your data rights.
            </p>
          </div>

          {/* Section 2: Information Collected via the Contact Form */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              <Lock className="h-5 w-5 text-cyan-400" />
              <span>2. What Information is Collected and Why</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              When you voluntarily reach out using the contact form, the following details are submitted to my secure backend:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-2 pl-2">
              <li>
                <strong>Name:</strong> Used to address you respectfully in my response.
              </li>
              <li>
                <strong>Email Address:</strong> Used solely to reply to your inquiry and send an automated receipt confirmation.
              </li>
              <li>
                <strong>Subject & Message Content:</strong> To review your question, project requirements, or opportunity.
              </li>
              <li>
                <strong>Anonymized IP Hash:</strong> Your IP address is immediately hashed using an HMAC-SHA256 algorithm with a private secret salt before storage. Your raw, identifiable IP address is never stored in the database.
              </li>
            </ul>
          </div>

          {/* Section 3: Data Retention & Automatic 90-Day Deletion */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-400" />
              <span>3. Automatic 90-Day Deletion (TTL Index)</span>
            </h2>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-sm text-slate-300 space-y-2">
              <p>
                All submitted contact messages are stored in an encrypted MongoDB Atlas cluster with an automatic <strong>90-day Time-To-Live (TTL) index</strong> (<code className="text-cyan-400 font-mono">expireAfterSeconds: 7776000</code>).
              </p>
              <p>
                Once 90 days have elapsed from the exact timestamp of submission, the database server permanently and automatically deletes the record.
              </p>
            </div>
          </div>

          {/* Section 4: Cookies and Analytics */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-200">4. Cookies and Analytics</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              This portfolio is strictly cookieless. No tracking cookies, marketing pixels, or third-party behavioral trackers are loaded. Any performance analytics utilized are completely privacy-first, cookieless, and aggregated without collecting personal identifiers.
            </p>
          </div>

          {/* Section 5: Spam & Bot Prevention */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-200">5. Bot & Abuse Prevention</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              To defend the server against automated credential stuffing, distributed denial of service, and spam, Cloudflare Turnstile bot verification and server-side rate limits are implemented. These mechanisms protect infrastructure stability without reading cross-site browser history.
            </p>
          </div>

          {/* Section 6: How to Request Deletion */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-cyan-400" />
              <span>6. Requesting Immediate Data Erasure</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              You have the right to request immediate deletion of any message sent through this site prior to the 90-day automatic expiration. To request deletion, please contact me directly:
            </p>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-white/5">
              <Mail className="h-5 w-5 text-cyan-400 shrink-0" />
              <div className="text-sm">
                <span className="text-slate-400">Email: </span>
                <a href="mailto:rajsaksham744@gmail.com" className="text-cyan-400 font-semibold hover:underline">
                  rajsaksham744@gmail.com
                </a>
                <span className="text-slate-400"> (Subject: "Data Deletion Request")</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
