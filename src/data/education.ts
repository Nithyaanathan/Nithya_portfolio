export interface EducationEntry {
  id: string
  institution: string
  degree: string
  year: string
  cgpa: string
  graduation: string
  highlights: string[]
}

export const education: EducationEntry = {
  id: 'apce',
  institution: 'Adhiparasakthi College of Engineering',
  degree: 'B.Tech — Artificial Intelligence & Data Science',
  year: '3rd Year',
  cgpa: '8.8 / 10',
  graduation: '2028',
  highlights: [
    '8.8 CGPA',
    'Hands-on AI/ML project development',
    'Practical experience across Python, SQL, data analysis and web technologies',
    'Active exploration of AI, machine learning and digital product development',
    'Project-oriented learning and experimentation',
  ],
}

export const educationOrbits = [
  { label: 'AI & ML', radius: 1.0, speed: 0.3 },
  { label: 'DATA', radius: 1.35, speed: -0.22 },
  { label: 'PYTHON', radius: 1.7, speed: 0.18 },
  { label: 'SOFTWARE', radius: 2.05, speed: -0.14 },
  { label: 'CREATIVE', radius: 2.4, speed: 0.11 },
]