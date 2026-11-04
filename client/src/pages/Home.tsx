import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  FileText,
  Mail,
  ArrowRight,
  GraduationCap,
  Award,
  Sparkles,
  TrendingUp,
  Filter,
  RefreshCw,
  Languages,
} from 'lucide-react';
import { Hero3DCanvas } from '../components/Hero3DCanvas';
import { ProfileTiltCard } from '../components/ProfileTiltCard';
import { CountUpStat } from '../components/CountUpStat';
import { SkillCloud3D } from '../components/SkillCloud3D';
import { ProjectCard } from '../components/ProjectCard';
import { ContactForm } from '../components/ContactForm';
import { Project, TimelineItem } from '../types';

export const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // Fetch GitHub-driven projects from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/projects`);
        if (!res.ok) {
          throw new Error(`Failed to load projects: ${res.statusText}`);
        }
        const json = await res.json();
        if (isMounted) {
          setProjects(json.data || []);
          setFilteredProjects(json.data || []);
          setProjectsError(null);
        }
      } catch (err) {
        if (isMounted) {
          setProjectsError('Could not retrieve live GitHub feed. Displaying cached highlights.');
        }
      } finally {
        if (isMounted) {
          setLoadingProjects(false);
        }
      }
    };

    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter projects by language / domain
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === 'All') {
      setFilteredProjects(projects);
    } else if (filter === 'Featured') {
      setFilteredProjects(projects.filter((p) => p.isFeatured));
    } else {
      setFilteredProjects(
        projects.filter(
          (p) =>
            p.language?.toLowerCase() === filter.toLowerCase() ||
            p.techStack?.some((t) => t.toLowerCase().includes(filter.toLowerCase())) ||
            p.topics?.some((tp) => tp.toLowerCase().includes(filter.toLowerCase()))
        )
      );
    }
  };

  // Education & Certifications Data
  const timelineItems: TimelineItem[] = [
    {
      id: 'cert-1',
      type: 'certification',
      title: 'MS Excel - 1st Rank Holder',
      institution: 'IICS (Indian Institute of Computer Science)',
      period: 'Certification Award',
      scoreOrRank: '1st Rank',
      rankBadge: '🏆 1st Rank',
      description: 'Awarded 1st Rank for outstanding proficiency in Advanced Excel, Power Query, automated PivotTables, complex statistical formulas, and MIS reporting.',
      highlights: ['Advanced Power Query ETL', 'PivotTables & Dynamic Slicers', 'Formula Mastery (XLOOKUP, INDEX-MATCH)'],
    },
    {
      id: 'cert-2',
      type: 'certification',
      title: 'HTML - 1st Rank Holder',
      institution: 'IICS (Indian Institute of Computer Science)',
      period: 'Certification Award',
      scoreOrRank: '1st Rank',
      rankBadge: '🏆 1st Rank',
      description: 'Awarded 1st Rank for front-end structure, semantic HTML5 standards, web layout accessibility, and responsive structuring.',
      highlights: ['Semantic Standards', 'Clean Markup Structure', 'Cross-browser compatibility'],
    },
    {
      id: 'cert-3',
      type: 'certification',
      title: 'MS Word - 2nd Rank Holder',
      institution: 'IICS (Indian Institute of Computer Science)',
      period: 'Certification Award',
      scoreOrRank: '2nd Rank',
      rankBadge: '🥈 2nd Rank',
      description: 'Awarded 2nd Rank in professional document architecture, executive layout design, formatting standards, and typography.',
      highlights: ['Executive Reporting Layouts', 'Structured Documentation'],
    },
    {
      id: 'edu-1',
      type: 'education',
      title: 'Bachelor of Computer Applications (BCA)',
      institution: 'Indira Gandhi National Open University (IGNOU)',
      period: 'Expected Graduation: 2026',
      description: 'Undergraduate degree focusing on database management systems, Python programming, algorithms, data structures, and computer applications.',
      highlights: ['Relational Database Systems (RDBMS)', 'Python & Software Engineering', 'Data Analytics Foundation'],
    },
    {
      id: 'edu-2',
      type: 'education',
      title: 'Class XII (Senior Secondary)',
      institution: 'CBSE Board',
      period: 'Completed 2023',
      scoreOrRank: '82%',
      description: 'Graduated with 82% aggregate score with core emphasis on analytical problem-solving and mathematics.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Saksham Raj | Data Analyst | Business Intelligence</title>
        <meta
          name="description"
          content="Saksham Raj - Data Analyst & Business Intelligence specialist. Turning raw data into decisions with SQL, Python, Power BI, and Excel."
        />
      </Helmet>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Full-screen 3D Scene */}
        <Hero3DCanvas />

        {/* Ambient Gradient Highlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:col-span-7 text-center lg:text-left space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wide">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>DATA ANALYST & BUSINESS INTELLIGENCE</span>
              </div>

              {/* Tagline before greetings */}
              <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-cyan-300 tracking-wide">
                Turning raw data into decisions.
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">Saksham Raj</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                BCA student with hands-on project experience in SQL, Python, Power BI and Excel. Skilled in data cleaning, exploratory data analysis, dashboard development and KPI reporting, with projects covering customer churn, shopping behavior and sales performance.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02]"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="/resume.pdf"
                  download="Saksham_Raj_Resume.pdf"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold font-mono text-cyan-300 bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800 transition-all duration-200"
                >
                  <FileText className="h-4 w-4" />
                  <span>Download Resume</span>
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Get in Touch</span>
                </a>
              </div>
            </motion.div>

            {/* Right Profile 3D Tilt Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center"
            >
              <ProfileTiltCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT & ANIMATED COUNT-UP STATS SECTION */}
      <section id="about" className="py-20 relative bg-slate-950/60 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>MEASURABLE IMPACT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
              Transforming Complex Datasets into Actionable Insights
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Every project bridges the gap between raw database entries and executive decision-making.
            </p>
          </div>

          {/* 4 Animated Count-up Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <CountUpStat
              endValue={6418}
              label="Records Analyzed"
              description="SQL segmentation and behavioral modeling in Customer Churn project"
            />
            <CountUpStat
              endValue={27}
              suffix="%"
              label="Churn Rate Identified"
              description="1,732 at-risk customer accounts flagged for retention strategies"
            />
            <CountUpStat
              endValue={649}
              prefix="$"
              suffix="K"
              label="Sales Dashboarded"
              description="Revenue tracking across 11,997 units and multiple channels in Excel"
            />
            <CountUpStat
              endValue={2400}
              label="Transactions Analyzed"
              description="Power Query ETL pipeline with rating and delivery KPI monitoring"
            />
          </div>

          {/* About Bio & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-8">
            <div className="md:col-span-8 glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-xl font-bold text-slate-100">About Saksham</h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                I am a data analyst focused on building intuitive, reliable analytics solutions. My core skill set centers on translating ambiguous business problems into structured SQL queries, Python data workflows, and interactive Power BI and Excel dashboards.
              </p>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Whether diagnosing reasons for customer churn, modeling customer purchase tendencies through discount codes, or building automated financial reporting templates in Excel, I pride myself on rigor, clean data hygiene, and presentation clarity.
              </p>
            </div>

            <div className="md:col-span-4 glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">
                <Languages className="h-5 w-5" />
                <span>Languages</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                  <span className="font-medium text-slate-200">English</span>
                  <span className="text-xs font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">Professional</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                  <span className="font-medium text-slate-200">Hindi</span>
                  <span className="text-xs font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">Native / Fluent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SKILLS SECTION */}
      <section id="skills" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <span>TOOLKIT & COMPETENCIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
            Analytics, Engineering & Business Intelligence
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Hands-on technical stack spanning relational databases, statistical modeling, BI visualization, and automated spreadsheets.
          </p>
        </div>

        {/* 3D Cloud + Grouped Bars Component */}
        <SkillCloud3D />
      </section>

      {/* 4. GITHUB-DRIVEN PROJECTS SECTION */}
      <section id="projects" className="py-24 bg-slate-950/70 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
                <span>PORTFOLIO SHOWCASE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
                Featured Data Analytics Projects
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
                Enriched with live GitHub repository synchronization, KPIs, and reproducible analysis workflows.
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2 font-mono">
                <Filter className="h-3.5 w-3.5" /> Filter:
              </div>
              {['All', 'Featured', 'Python', 'SQL', 'Excel', 'Power BI'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-colors cursor-pointer ${
                    selectedFilter === filter
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm shadow-cyan-500/30'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Cold Start Notice / Error handling */}
          {projectsError && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
              <span>{projectsError}</span>
              <span className="font-mono text-slate-400">Offline Cache Active</span>
            </div>
          )}

          {/* Projects Grid */}
          {loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-96 rounded-2xl bg-slate-900/40 border border-white/5 animate-pulse p-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="h-4 w-24 bg-slate-800 rounded" />
                    <div className="h-6 w-3/4 bg-slate-800 rounded" />
                    <div className="h-16 w-full bg-slate-800/60 rounded" />
                  </div>
                  <div className="h-8 w-full bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-white/5">
              <p className="text-slate-400">No projects found matching the "{selectedFilter}" filter.</p>
              <button
                onClick={() => handleFilterChange('All')}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. EDUCATION & CERTIFICATIONS TIMELINE */}
      <section id="timeline" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Award className="h-3.5 w-3.5" />
            <span>CREDENTIALS & HONORS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
            Education & Competitive Achievements
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Proven academic record and verified institute ranks in Microsoft Excel, HTML, and Word.
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-cyan-500/30 ml-4 md:ml-32 space-y-8 pl-6 md:pl-10">
          {timelineItems.map((item, idx) => {
            const isCert = item.type === 'certification';
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Node Dot */}
                <div
                  className={`absolute -left-[31px] md:-left-[47px] top-1.5 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCert
                      ? 'border-cyan-400 bg-slate-950 text-cyan-400 group-hover:scale-125 group-hover:shadow-[0_0_15px_#00f2fe]'
                      : 'border-blue-500 bg-slate-950 text-blue-400'
                  }`}
                >
                  {isCert ? <Award className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                </div>

                {/* Card Container */}
                <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                      {item.rankBadge && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-mono">
                          {item.rankBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-cyan-400/90">{item.period}</span>
                  </div>

                  <div className="text-sm font-medium text-slate-300">
                    {item.institution}{' '}
                    {item.scoreOrRank && !item.rankBadge && (
                      <span className="text-cyan-400 font-mono">({item.scoreOrRank})</span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  {item.highlights && item.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.highlights.map((hl) => (
                        <span
                          key={hl}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 text-slate-300 border border-white/5"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-24 bg-slate-950/80 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
              <Mail className="h-3.5 w-3.5" />
              <span>GET IN TOUCH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
              Start a Conversation
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Have a question or looking to collaborate? Send a message directly to my inbox.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
};
