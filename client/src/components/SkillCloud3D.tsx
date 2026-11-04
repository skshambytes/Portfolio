import React from 'react';
import { motion } from 'framer-motion';
import { Database, BarChart3, FileSpreadsheet, Code2, Wrench } from 'lucide-react';

export const SkillCloud3D: React.FC = () => {
  const categories = [
    {
      title: 'Programming & Databases',
      icon: Database,
      accent: 'from-cyan-500 to-blue-500',
      items: [
        { name: 'Python', level: 90, desc: 'Pandas, NumPy, Matplotlib, Scikit-learn' },
        { name: 'SQL', level: 92, desc: 'Complex Joins, Window Functions, Aggregations, CTEs' },
        { name: 'MySQL', level: 88, desc: 'Schema Design, Indexing, Relational Modeling' },
      ],
      tags: ['Python', 'SQL', 'MySQL', 'Relational DBs'],
    },
    {
      title: 'Data Analysis & Modeling',
      icon: BarChart3,
      accent: 'from-blue-500 to-indigo-500',
      items: [
        { name: 'Exploratory Data Analysis (EDA)', level: 92, desc: 'Data cleaning, outlier detection, distributions' },
        { name: 'Customer Segmentation', level: 88, desc: 'RFM analysis, shopping behavior patterns' },
        { name: 'Feature Engineering', level: 85, desc: 'Encoding, scaling, churn predictive modeling' },
      ],
      tags: ['Data Cleaning', 'Data Wrangling', 'Statistical Analysis', 'Feature Engineering'],
    },
    {
      title: 'Business Intelligence',
      icon: Code2,
      accent: 'from-teal-500 to-cyan-500',
      items: [
        { name: 'Power BI', level: 90, desc: 'Interactive dashboards, DAX measures, data models' },
        { name: 'KPI & MIS Reporting', level: 92, desc: 'Executive summaries, automated monthly reports' },
        { name: 'Targets vs. Actuals', level: 90, desc: 'Variance analysis, performance indicators' },
      ],
      tags: ['Power BI', 'KPI Reporting', 'MIS Dashboards', 'Targets vs Actuals'],
    },
    {
      title: 'Microsoft Excel Mastery',
      icon: FileSpreadsheet,
      accent: 'from-emerald-500 to-teal-500',
      items: [
        { name: 'Power Query & Data Transformation', level: 95, desc: 'Automated folder ingestion, merging, ETL' },
        { name: 'PivotTables & PivotCharts', level: 95, desc: 'Dynamic slicers, timelines, nested hierarchies' },
        { name: 'Advanced Formulas', level: 92, desc: 'XLOOKUP, INDEX-MATCH, SUMIFS, COUNTIFS, IFERROR' },
      ],
      tags: ['Power Query', 'PivotTables', 'XLOOKUP', 'INDEX-MATCH', 'SUMIFS', 'Data Validation', 'Slicers'],
    },
    {
      title: 'Libraries & Tools',
      icon: Wrench,
      accent: 'from-sky-500 to-cyan-600',
      items: [
        { name: 'Data Science Libraries', level: 88, desc: 'Pandas, NumPy, Matplotlib, Scikit-learn' },
        { name: 'Workflow Tools', level: 90, desc: 'Git, GitHub, Jupyter Notebook, VS Code' },
      ],
      tags: ['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'Git', 'GitHub', 'Jupyter', 'VS Code'],
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-100">{cat.title}</h3>
                </div>

                {/* Skills with Progress Bars */}
                <div className="space-y-4 mb-6">
                  {cat.items.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-200">{skill.name}</span>
                        <span className="font-mono text-cyan-400">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-r ${cat.accent}`}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{skill.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Pill Cloud */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                {cat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-800/80 text-cyan-300 border border-white/5 hover:border-cyan-500/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
