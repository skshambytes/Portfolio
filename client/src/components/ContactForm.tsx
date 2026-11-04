import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, AlertCircle, Loader2, Mail, Phone, MapPin } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Please enter your name').max(100, 'Name must be 100 characters or less'),
  email: z.string().email('Please enter a valid email address').max(255),
  subject: z.string().min(1, 'Please enter a subject').max(150, 'Subject must be 150 characters or less'),
  message: z.string().min(5, 'Message must be at least 5 characters').max(3000, 'Message is too long'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent before submitting',
  }),
  honeypot: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [renderedAt, setRenderedAt] = useState<number>(0);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);

  // Set renderedAt timestamp to detect sub-second bot submissions
  useEffect(() => {
    setRenderedAt(Date.now());
  }, []);

  // Initialize Cloudflare Turnstile widget if site key exists
  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey || !window.turnstile || !turnstileContainerRef.current) return;

    try {
      const widgetId = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        theme: 'dark',
      });

      return () => {
        if (window.turnstile && widgetId) {
          window.turnstile.remove(widgetId);
        }
      };
    } catch {
      // Graceful fallback if Turnstile script is blocked by browser adblock
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      consent: false,
      honeypot: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const endpoint = `${apiUrl}/api/contact`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          renderedAt,
          turnstileToken: turnstileToken || undefined,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to send message. Please try again.');
      }

      setStatus('success');
      reset();

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#0ea5e9', '#38bdf8', '#ffffff'],
        });
      } catch {
        // Confetti optional
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred. Please reach out directly via email.');
    }
  };

  // Client-side obfuscated contact info to prevent scraping
  const contactEmail = 'rajsaksham744@gmail.com';
  const contactPhone = '+91 9625631438';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Info Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6">
          <h3 className="text-2xl font-bold text-slate-100">
            Let's discuss <span className="text-cyan-400">data solutions</span>
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Whether you have an opening for a Data Analyst or Business Intelligence role, need a custom Power BI dashboard, or want to collaborate on predictive analytics, feel free to send a message.
          </p>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 text-slate-200 hover:text-cyan-400 transition-colors group"
            >
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono">Email Directly</div>
                <div className="text-sm font-semibold">{contactEmail}</div>
              </div>
            </a>

            <a
              href={`tel:${contactPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 text-slate-200 hover:text-cyan-400 transition-colors group"
            >
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono">Phone / WhatsApp</div>
                <div className="text-sm font-semibold">{contactPhone}</div>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 text-slate-200">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono">Location & Availability</div>
                <div className="text-sm font-semibold">Delhi NCR, India (Remote & On-site)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="lg:col-span-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-5"
          noValidate
        >
          {/* Honeypot field (hidden from legitimate users, filled by naive bots) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register('honeypot')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-mono font-medium text-slate-300 mb-2">
                Your Name <span className="text-cyan-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                maxLength={100}
                placeholder="Jane Doe"
                className={`w-full rounded-xl bg-slate-950/80 border px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.name
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
                }`}
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-mono font-medium text-slate-300 mb-2">
                Email Address <span className="text-cyan-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                maxLength={255}
                placeholder="jane@company.com"
                className={`w-full rounded-xl bg-slate-950/80 border px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.email
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
                }`}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-xs font-mono font-medium text-slate-300 mb-2">
              Subject <span className="text-cyan-400">*</span>
            </label>
            <input
              id="subject"
              type="text"
              maxLength={150}
              placeholder="Data Analyst Opportunity / Dashboard Inquiry"
              className={`w-full rounded-xl bg-slate-950/80 border px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors.subject
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
              }`}
              {...register('subject')}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-rose-400">{errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-mono font-medium text-slate-300 mb-2">
              Message <span className="text-cyan-400">*</span>
            </label>
            <textarea
              id="message"
              rows={4}
              maxLength={3000}
              placeholder="Tell me about your project, team, or opportunity..."
              className={`w-full rounded-xl bg-slate-950/80 border px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all resize-y ${
                errors.message
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400'
              }`}
              {...register('message')}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-rose-400">{errors.message.message}</p>
            )}
          </div>

          {/* Privacy Consent Checkbox */}
          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-slate-950 cursor-pointer"
              {...register('consent')}
            />
            <label htmlFor="consent" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
              I consent to having this form collect my name, email, and message so Saksham Raj can reply to my inquiry. Stored securely for 90 days. See{' '}
              <a href="/privacy" className="text-cyan-400 hover:underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
          {errors.consent && (
            <p className="text-xs text-rose-400">{errors.consent.message}</p>
          )}

          {/* Turnstile Container */}
          <div ref={turnstileContainerRef} className="my-2" />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Sending Securely...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </>
            )}
          </button>

          {/* Feedback Alerts */}
          {status === 'success' && (
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm animate-fade-in">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Thank you! Your message has been sent successfully. An auto-confirmation has been dispatched to your email.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-sm animate-fade-in">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}
