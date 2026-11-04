import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Database, BarChart3, FileSpreadsheet, Code2, Wrench } from 'lucide-react';

// Flat list of skills for the 3D Sphere Cloud
const SKILL_WORDS = [
  'Python', 'SQL', 'MySQL', 'Power BI', 'Excel', 'Pandas', 'NumPy',
  'Scikit-learn', 'EDA', 'Data Cleaning', 'Power Query', 'KPI Reporting',
  'Dashboards', 'PivotTables', 'Matplotlib', 'Customer Churn', 'Segmentation',
  'Git', 'GitHub', 'VS Code', 'MIS Reporting', 'XLOOKUP', 'Feature Eng.',
  'Target vs Actual', 'Jupyter', 'Data Wrangling'
];

function Word({ children, position }: { children: string; position: [number, number, number] }) {
  const textRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame(({ camera }) => {
    if (textRef.current) {
      // Look at camera for 3D billboard effect
      textRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <Float floatIntensity={1.5} rotationIntensity={1}>
      <Text
        ref={textRef}
        position={position}
        fontSize={0.32}
        color={hovered ? '#00f2fe' : '#94a3b8'}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_ad5b15.woff"
      >
        {children}
      </Text>
    </Float>
  );
}

function Cloud({ count = 4 }: { count?: number }) {
  const words = useMemo(() => {
    const temp: [string, [number, number, number]][] = [];
    const phiSpan = Math.PI * (3 - Math.sqrt(5)); // Golden ratio spiral
    const radius = 3.2;

    for (let i = 0; i < SKILL_WORDS.length; i++) {
      const y = 1 - (i / (SKILL_WORDS.length - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phiSpan * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      temp.push([SKILL_WORDS[i], [x * radius, y * radius, z * radius]]);
    }
    return temp;
  }, []);

  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {words.map(([word, pos], index) => (
        <Word key={index} position={pos}>
          {word}
        </Word>
      ))}
    </group>
  );
}

export const SkillCloud3D: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bars' | '3d'>('bars');

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
      {/* View Switcher Controls */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-white/10">
          <button
            onClick={() => setActiveTab('bars')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'bars'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Structured Categories
          </button>
          <button
            onClick={() => setActiveTab('3d')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === '3d'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D Interactive Sphere
          </button>
        </div>
      </div>

      {activeTab === '3d' ? (
        <div className="h-[480px] w-full rounded-2xl border border-white/5 bg-slate-950/60 overflow-hidden relative">
          <div className="absolute top-4 left-4 z-10 text-xs text-slate-400 font-mono">
            Interactive 3D Skill Galaxy • Drag or hover to explore
          </div>
          <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} />
            <Cloud />
          </Canvas>
        </div>
      ) : (
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
      )}
    </div>
  );
};
