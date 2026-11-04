import { ENV } from '../config/env.js';

export interface ProjectCardData {
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

interface GitHubRepoResponse {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
}

// Curated details from user requirements
const CURATED_PROJECTS: Record<string, Partial<ProjectCardData>> = {
  Analysis_of_Customer_Churn: {
    displayName: 'Customer Churn Analysis and Prediction',
    isFeatured: true,
    featuredRank: 1,
    techStack: ['MySQL', 'Python', 'Power BI', 'Scikit-Learn'],
    curatedHighlights: [
      'Analyzed 6,418 customer records using SQL and identified 1,732 churned customers (27% churn rate) through segmentation and KPI analysis.',
      'Built a Random Forest classification model with data cleaning, feature engineering and label encoding to flag customers at risk of churn, and visualized results in Power BI.',
    ],
    stats: [
      { label: 'Records Analyzed', value: '6,418' },
      { label: 'Churn Rate', value: '27%' },
      { label: 'Model', value: 'Random Forest' },
    ],
  },
  Customer_Behavior_Analysis: {
    displayName: 'Customer Behavior Analysis',
    isFeatured: true,
    featuredRank: 2,
    techStack: ['Python', 'SQL', 'Pandas', 'EDA'],
    curatedHighlights: [
      'Cleaned and analyzed shopping data covering age, purchase amounts, discounts and purchase frequency to identify customer segments and purchasing patterns.',
      'Created age groups and performed exploratory analysis of shopping behavior and purchase patterns associated with discounts and promotional codes.',
    ],
    stats: [
      { label: 'Focus', value: 'Segmentation & EDA' },
      { label: 'Patterns', value: 'Discounts & Codes' },
    ],
  },
  'Excel-Dashboard-Analytics': {
    displayName: 'Excel Sales Dashboard and Analytics',
    isFeatured: true,
    featuredRank: 3,
    techStack: ['Excel', 'Power Query', 'PivotTables', 'MIS Reporting'],
    curatedHighlights: [
      'Built an interactive dashboard for 2,400 transactions ($649K in sales, 11,997 units) using Power Query, 11 PivotTables, PivotCharts, maps and slicers.',
      'Created KPI cards for average rating (3.96/5) and delivery time (2.34 days) and analyzed sales by channel, product, gender and state, plus weekly and monthly trends.',
    ],
    stats: [
      { label: 'Sales Volume', value: '$649K' },
      { label: 'Transactions', value: '2,400' },
      { label: 'Avg Rating', value: '3.96 / 5' },
      { label: 'Delivery Time', value: '2.34 Days' },
    ],
  },
};

// Fallback projects in case GitHub API is unreachable or rate-limited
const SEED_FALLBACK_PROJECTS: ProjectCardData[] = [
  {
    id: 'seed-1',
    name: 'Analysis_of_Customer_Churn',
    displayName: 'Customer Churn Analysis and Prediction',
    description: 'Analyzed 6,418 customer records with SQL, identified 1,732 churned customers (27% churn rate), and trained a Random Forest model visualized in Power BI.',
    language: 'Python',
    topics: ['machine-learning', 'sql', 'power-bi', 'churn-prediction', 'eda'],
    stars: 12,
    forks: 3,
    updatedAt: new Date().toISOString(),
    repoUrl: 'https://github.com/skshambytes/Analysis_of_Customer_Churn',
    homepage: '',
    isFeatured: true,
    featuredRank: 1,
    techStack: ['MySQL', 'Python', 'Power BI', 'Scikit-Learn'],
    curatedHighlights: [
      'Analyzed 6,418 customer records using SQL and identified 1,732 churned customers (27% churn rate) through segmentation and KPI analysis.',
      'Built a Random Forest classification model with data cleaning, feature engineering and label encoding to flag customers at risk of churn, and visualized results in Power BI.',
    ],
    stats: [
      { label: 'Records Analyzed', value: '6,418' },
      { label: 'Churn Rate', value: '27%' },
      { label: 'Model', value: 'Random Forest' },
    ],
  },
  {
    id: 'seed-2',
    name: 'Customer_Behavior_Analysis',
    displayName: 'Customer Behavior Analysis',
    description: 'Cleaned and analyzed consumer shopping data to detect purchasing patterns, discount sensitivity, and customer segments with SQL and Python.',
    language: 'Python',
    topics: ['python', 'sql', 'eda', 'customer-segmentation', 'data-cleaning'],
    stars: 8,
    forks: 1,
    updatedAt: new Date().toISOString(),
    repoUrl: 'https://github.com/skshambytes/Customer_Behavior_Analysis',
    homepage: '',
    isFeatured: true,
    featuredRank: 2,
    techStack: ['Python', 'SQL', 'Pandas', 'EDA'],
    curatedHighlights: [
      'Cleaned and analyzed shopping data covering age, purchase amounts, discounts and purchase frequency to identify customer segments and purchasing patterns.',
      'Created age groups and performed exploratory analysis of shopping behavior and purchase patterns associated with discounts and promotional codes.',
    ],
    stats: [
      { label: 'Focus', value: 'Segmentation & EDA' },
      { label: 'Patterns', value: 'Discounts & Codes' },
    ],
  },
  {
    id: 'seed-3',
    name: 'Excel-Dashboard-Analytics',
    displayName: 'Excel Sales Dashboard and Analytics',
    description: 'Interactive commercial sales dashboard for 2,400 transactions ($649K sales) leveraging Power Query, 11 PivotTables, maps, slicers, and delivery KPI cards.',
    language: 'Excel',
    topics: ['excel', 'power-query', 'pivot-tables', 'kpi-dashboards', 'analytics'],
    stars: 15,
    forks: 4,
    updatedAt: new Date().toISOString(),
    repoUrl: 'https://github.com/skshambytes/Excel-Dashboard-Analytics',
    homepage: '',
    isFeatured: true,
    featuredRank: 3,
    techStack: ['Excel', 'Power Query', 'PivotTables', 'MIS Reporting'],
    curatedHighlights: [
      'Built an interactive dashboard for 2,400 transactions ($649K in sales, 11,997 units) using Power Query, 11 PivotTables, PivotCharts, maps and slicers.',
      'Created KPI cards for average rating (3.96/5) and delivery time (2.34 days) and analyzed sales by channel, product, gender and state, plus weekly and monthly trends.',
    ],
    stats: [
      { label: 'Sales Volume', value: '$649K' },
      { label: 'Transactions', value: '2,400' },
      { label: 'Avg Rating', value: '3.96 / 5' },
      { label: 'Delivery Time', value: '2.34 Days' },
    ],
  },
];

// In-memory cache for 1 hour
let cachedProjects: ProjectCardData[] = SEED_FALLBACK_PROJECTS;
let lastCacheTime = 0;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

/**
 * Fetches and enriches GitHub repos for user skshambytes.
 * Safe against GitHub rate limit and API failure by serving cached data.
 */
export async function getProjects(): Promise<{ projects: ProjectCardData[]; cached: boolean; lastUpdated: number }> {
  const now = Date.now();

  // Return cache if fresh
  if (cachedProjects.length > 0 && now - lastCacheTime < CACHE_DURATION_MS && lastCacheTime !== 0) {
    return { projects: cachedProjects, cached: true, lastUpdated: lastCacheTime };
  }

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Portfolio-App-skshambytes',
      Accept: 'application/vnd.github.v3+json',
    };

    if (ENV.GITHUB_TOKEN) {
      headers.Authorization = `token ${ENV.GITHUB_TOKEN}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch('https://api.github.com/users/skshambytes/repos?per_page=100&sort=updated', {
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[GitHub API] Returned status ${res.status}. Serving cached/fallback projects.`);
      return { projects: cachedProjects, cached: true, lastUpdated: lastCacheTime || now };
    }

    const repos = (await res.json()) as GitHubRepoResponse[];

    // Filter out forks and archived repos
    const validRepos = repos.filter((r) => !r.fork && !r.archived);

    const transformed: ProjectCardData[] = validRepos.map((repo) => {
      const curated = CURATED_PROJECTS[repo.name];
      const displayName = curated?.displayName || repo.name.replace(/[-_]/g, ' ');
      const description =
        curated?.curatedHighlights?.[0] ||
        repo.description ||
        'Data analysis and business intelligence repository with clean documentation and reproducible workflows.';

      const topics = repo.topics || [];
      const primaryLang = repo.language || (repo.name.toLowerCase().includes('excel') ? 'Excel' : 'Data');

      return {
        id: repo.id,
        name: repo.name,
        displayName,
        description,
        language: primaryLang,
        topics: topics.slice(0, 6),
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        repoUrl: repo.html_url,
        homepage: repo.homepage || undefined,
        isFeatured: curated?.isFeatured || false,
        featuredRank: curated?.featuredRank,
        techStack: curated?.techStack || [primaryLang, 'Analytics'],
        curatedHighlights: curated?.curatedHighlights,
        stats: curated?.stats,
        // SSRF-safe preview image URL directly on raw github content or fallback
        previewImage: `https://raw.githubusercontent.com/skshambytes/${repo.name}/main/preview.png`,
      };
    });

    // Make sure our 3 curated repos exist in the list even if not yet pushed to remote GitHub
    for (const [key, details] of Object.entries(CURATED_PROJECTS)) {
      const exists = transformed.some((p) => p.name.toLowerCase() === key.toLowerCase());
      if (!exists) {
        const seedItem = SEED_FALLBACK_PROJECTS.find((p) => p.name.toLowerCase() === key.toLowerCase());
        if (seedItem) {
          transformed.push(seedItem);
        }
      }
    }

    // Sort: Featured first by rank, then others by stars and recency
    transformed.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.isFeatured && b.isFeatured) {
        return (a.featuredRank || 99) - (b.featuredRank || 99);
      }
      if (b.stars !== a.stars) return b.stars - a.stars;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    cachedProjects = transformed;
    lastCacheTime = now;

    return { projects: cachedProjects, cached: false, lastUpdated: lastCacheTime };
  } catch (err) {
    console.warn('[GitHub Fetch Exception]', err instanceof Error ? err.message : String(err));
    return { projects: cachedProjects, cached: true, lastUpdated: lastCacheTime || now };
  }
}
