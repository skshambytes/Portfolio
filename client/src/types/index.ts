export interface Project {
  id: number | string;
  name: string;
  displayName: string;
  description: string;
  language: string;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  repoUrl: string;
  homepage?: string;
  isFeatured: boolean;
  featuredRank?: number;
  techStack: string[];
  curatedHighlights?: string[];
  stats?: { label: string; value: string }[];
  previewImage?: string;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: { name: string; level: number; tags?: string[] }[];
}

export interface TimelineItem {
  id: string;
  type: 'education' | 'certification';
  title: string;
  institution: string;
  period: string;
  scoreOrRank?: string;
  rankBadge?: string;
  description: string;
  highlights?: string[];
}
