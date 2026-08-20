export interface SkillNode {
  label: string
  description: string
}

export interface SkillCluster {
  id: string
  name: string
  code: string
  nodes: SkillNode[]
}

export const skillClusters: SkillCluster[] = [
  {
    id: 'programming',
    name: 'Programming',
    code: 'PRG',
    nodes: [
      { label: 'Python', description: 'Primary language — used across ML, data and tooling.' },
      { label: 'JavaScript', description: 'Frontend interactivity and web applications.' },
      { label: 'Java', description: 'Object-oriented programming foundations.' },
      { label: 'C', description: 'Systems programming fundamentals.' },
      { label: 'C++', description: 'Performance-oriented programming basics.' },
    ],
  },
  {
    id: 'data',
    name: 'Data',
    code: 'DAT',
    nodes: [
      { label: 'SQL', description: 'Querying and managing relational data.' },
      { label: 'Pandas', description: 'Data cleaning, manipulation and analysis.' },
      { label: 'NumPy', description: 'Numerical computation and array processing.' },
      { label: 'Excel', description: 'Data organisation, reporting and analysis.' },
    ],
  },
  {
    id: 'aiml',
    name: 'AI / ML',
    code: 'AIM',
    nodes: [
      { label: 'Machine Learning', description: 'Classical models, ensembles and pipelines.' },
      { label: 'Deep Learning', description: 'Neural networks and learning systems.' },
      { label: 'AI Concepts', description: 'Core principles and modern AI methods.' },
      { label: 'Data Analysis', description: 'Extracting insight from structured data.' },
      { label: 'Predictive Analytics', description: 'Forecasting from historical patterns.' },
    ],
  },
  {
    id: 'tools',
    name: 'Tools',
    code: 'TLS',
    nodes: [
      { label: 'Git', description: 'Version control for collaborative development.' },
      { label: 'GitHub', description: 'Remote repositories and open-source workflow.' },
      { label: 'Jupyter Notebook', description: 'Interactive notebooks for experiments.' },
      { label: 'VS Code', description: 'Primary editor for day-to-day development.' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative / Other',
    code: 'CRT',
    nodes: [
      { label: 'Graphic Design', description: 'Visual identity and creative assets.' },
      { label: 'UI Design', description: 'Interfaces built with user experience in mind.' },
      { label: 'Web Development', description: 'Building polished, responsive websites.' },
      { label: 'Creative Problem Solving', description: 'Turning constraints into practical ideas.' },
    ],
  },
]