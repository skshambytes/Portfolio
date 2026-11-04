import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, Star, GitFork, Calendar, Award } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  // 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 220 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);

    setGlare({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const formattedDate = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="relative group rounded-2xl border border-white/10 bg-slate-900/60 p-5 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_15px_35px_rgba(0,242,254,0.15)] [perspective:1000px] overflow-hidden"
    >
      {/* Dynamic light reflection glare */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(0, 242, 254, ${glare.opacity}) 0%, transparent 70%)`,
        }}
      />

      <div>
        {/* Top Header: Badge, Stars & Links */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {project.isFeatured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Award className="h-3.5 w-3.5" /> Featured Analysis
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-white/5">
                {project.language}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {project.stars > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                <Star className="h-3.5 w-3.5 fill-amber-400" /> {project.stars}
              </span>
            )}
            {project.forks > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <GitFork className="h-3.5 w-3.5" /> {project.forks}
              </span>
            )}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.displayName} GitHub repository`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            {project.homepage && (
              <a
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View live demo of ${project.displayName}`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
          {project.displayName}
        </h3>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800/80 text-cyan-300/90 border border-white/5"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Curated Highlights or Plain Text Description */}
        {project.curatedHighlights && project.curatedHighlights.length > 0 ? (
          <ul className="space-y-2 my-3 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
            {project.curatedHighlights.map((hl, i) => (
              <li key={i} className="line-clamp-2">
                {hl}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed my-3 line-clamp-3">
            {project.description}
          </p>
        )}

        {/* Key Metrics Cards if Available */}
        {project.stats && project.stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-4">
            {project.stats.map((s) => (
              <div
                key={s.label}
                className="p-2 rounded-lg bg-slate-950/70 border border-white/5 text-center"
              >
                <div className="text-xs font-mono font-bold text-cyan-400">{s.value}</div>
                <div className="text-[10px] text-slate-400 truncate">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info: Topics and Date */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-mono">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>{formattedDate}</span>
        </div>
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 group/link"
        >
          Explore Repo <span className="transition-transform group-hover/link:translate-x-0.5">→</span>
        </a>
      </div>
    </motion.div>
  );
};
