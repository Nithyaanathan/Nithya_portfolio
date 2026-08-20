export interface ExperienceEntry {
  id: string
  company: string
  role: string
  platform?: string
  focus: string[]
  description: string
  /** neutral, no invented dates */
  period?: string
  verified: boolean
}

export const experience: ExperienceEntry[] = [
  {
    id: 'deloitte',
    company: 'Deloitte Australia',
    role: 'Data Analytics Virtual Internship',
    platform: 'Forage',
    focus: ['Data Analytics', 'KPI Analysis', 'Data Visualization', 'Analytical Problem Solving'],
    description:
      'Completed a virtual data analytics internship covering the analytics lifecycle — problem framing, data cleaning, KPI calculation and visual reporting — with the Business KPI Analyzer delivered as the working outcome.',
    verified: true,
  },
  {
    id: 'kashif-infotech',
    company: 'Kashif Infotech',
    role: 'Internship',
    focus: ['Data Analytics', 'Business Analysis', 'Practical Application'],
    description:
      'Internship experience focused on data analytics and business analysis. (Details per resume — verify specifics.)',
    verified: false,
  },
]

export const experienceStages = ['EXPERIENCE', 'LEARNING', 'BUILDING', 'GROWTH']