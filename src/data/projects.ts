export interface Project {
  id: string
  slug: string
  title: string
  code: string
  category: string
  tagline: string
  description: string
  overview: string
  problem: string
  solution: string
  technologies: string[]
  github: string
  demo?: string
  demoLabel?: string
  featured?: boolean
  concept?: boolean
  accent: string
  /** world position hint for the 3D project universe (unit space) */
  position: [number, number, number]
  scale: number
}

export const projects: Project[] = [
  {
    id: 'qogaf',
    slug: 'qogaf',
    title: 'QOGAF',
    code: 'PRJ_01',
    category: 'AI Infrastructure',
    tagline: 'Quantum-Orchestrated Green AI Framework',
    description:
      'An adaptive quantum–classical scheduling framework for energy-aware AI/GPU workload management across distributed clusters.',
    overview:
      'QOGAF is an end-to-end framework that routes GPU scheduling problems to the best solver — quantum (QAOA, VQE), classical metaheuristic (genetic, simulated annealing, tabu) or Kubernetes-style (binpack, spread) — through a MetaOptimizer that learns from historical performance. It runs as a distributed system across machines acting as a mini data centre, and ships a conversational AI layer so operators can manage the cluster in natural language.',
    problem:
      'Modern AI workloads are GPU-hungry and energy-intensive. Data centres juggle performance (SLA deadlines), cost (variable energy pricing) and sustainability (grid carbon intensity). No single scheduling strategy wins on all three axes: quantum solvers excel at complex optimisation but are slow on small problems, while simple heuristics are fast but produce poor energy trade-offs.',
    solution:
      'A meta-optimizer dynamically picks the right solver for each workload, informed by live GPU telemetry, energy price, carbon intensity, thermal state and a growing performance database. The framework also includes a QUBO encoder that turns GPU allocation into quantum-native optimisation problems, distributed node agents with heartbeat telemetry, an on-premise LLM chat assistant, image generation, and a real-time cluster dashboard.',
    technologies: ['Python', 'FastAPI', 'PyTorch', 'QUBO', 'QAOA / VQE', 'Simulated Annealing', 'Genetic', 'Transformers', 'Diffusers', 'Web Dashboard'],
    github: 'https://github.com/Nithyaanathan/QOGAF',
    featured: true,
    accent: '#a78bfa',
    position: [0, 0, 0],
    scale: 1.5,
  },
  {
    id: 'agricultural-fraud-detection',
    slug: 'agricultural-fraud-detection',
    title: 'Agricultural Fraud Detection',
    code: 'PRJ_02',
    category: 'Machine Learning',
    tagline: 'Detecting fraudulent crop insurance claims with ML',
    description:
      'A machine-learning system for detecting fraudulent agricultural crop-insurance claims using classical ensemble models.',
    overview:
      'An end-to-end ML pipeline that detects suspicious crop-insurance claims in a realistic synthetic Indian dataset covering schemes like PMFBY and RWBCIS. It combines dataset generation, feature engineering and an ensemble of classifiers (Random Forest, HistGradientBoosting, Extra Trees, AdaBoost) via stacking/voting, with cross-validation and standard evaluation metrics.',
    problem:
      'Agricultural insurance fraud — inflated damage claims, duplicate claims, falsified geotags and misreported crop loss — costs insurers and governments significant money every year.',
    solution:
      'Flag suspicious claims for review using classical ML. The pipeline handles geolocation, state/district/village, crop type, claim reason and scheme details, then scores claims with a stacked ensemble and reports results with clear evaluation metrics.',
    technologies: ['Python', 'pandas', 'NumPy', 'scikit-learn', 'joblib', 'Data Analysis'],
    github: 'https://github.com/Nithyaanathan/Agricultural-Fraud-Detection',
    accent: '#38bdf8',
    position: [6.5, 1, 0],
    scale: 1.05,
  },
  {
    id: 'business-kpi-analyzer',
    slug: 'business-kpi-analyzer',
    title: 'Business KPI Analyzer',
    code: 'PRJ_03',
    category: 'Data Analytics',
    tagline: 'From raw sales data to meaningful KPIs',
    description:
      'A Python analytics tool built during the Deloitte Data Analytics Virtual Internship — it cleans business sales data and calculates KPIs with visualizations.',
    overview:
      'Developed as part of the Deloitte Data Analytics Virtual Internship (Forage), this tool ingests raw CSV sales data, cleans it (removing duplicates, handling missing values), calculates key performance indicators and generates charts that surface trends across products, regions and time.',
    problem:
      'Raw business sales data is messy and hard to interpret. Organisations need clean, consistent numbers and visual reports to monitor performance and make informed decisions.',
    solution:
      'An automated pipeline that cleans input data, computes KPIs — total revenue, total profit, average sales, profit margin and average month-over-month growth — and exports charts plus reusable CSV summaries.',
    technologies: ['Python', 'pandas', 'NumPy', 'Matplotlib', 'Data Visualization'],
    github: 'https://github.com/Nithyaanathan/business-kpi-analyzer',
    accent: '#22d3ee',
    position: [-5.5, 2.2, 0],
    scale: 1.05,
  },
  {
    id: 'spring-home-stays',
    slug: 'spring-home-stays',
    title: 'Spring Home Stays',
    code: 'PRJ_04',
    category: 'Web Development',
    tagline: 'A polished hospitality website with booking flow',
    description:
      'A premium travel/hospitality website for a homestay — room listings, gallery, WhatsApp booking and location mapping.',
    overview:
      'A complete static website for Spring Home Stays: a clean, premium font-driven design with all room types (AC / Non-AC, 2–5 sharing), a property gallery, a booking enquiry form that opens WhatsApp with the entered details, a Google Maps section and nearby-location information. Built to be edited and extended by non-technical owners.',
    problem:
      'A homestay needed a professional, fast-loading website where guests could see rooms, understand the property and start a booking enquiry without complex payment plumbing.',
    solution:
      'A self-contained HTML/JS website with room cards, an image gallery, a WhatsApp-integrated booking form, an embedded exact location map and clear contact paths — designed for readability and easy updating.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'UI Design'],
    github: 'https://github.com/Nithyaanathan/spring-home-stays-',
    accent: '#f59e0b',
    position: [-5, -2.2, 0],
    scale: 1.0,
  },
  {
    id: 'jarvis-voice-assistant',
    slug: 'jarvis-voice-assistant',
    title: 'JARVIS Voice Assistant',
    code: 'PRJ_05',
    category: 'AI Assistant',
    tagline: 'A desktop voice assistant built with Python',
    description:
      'A minimal Python desktop voice assistant that runs in the terminal — voice or text mode with time, weather, and reminders.',
    overview:
      'A lightweight desktop voice assistant with no GUI, built in Python. It can tell the current time and date, fetch live weather via OpenWeatherMap, set and list timed reminders, and respond to a set of voice commands — with a text mode for testing without a microphone.',
    problem:
      'Many voice assistants are heavy, cloud-dependent products. The goal here was a minimal, runnable assistant you can launch from a terminal and extend yourself.',
    solution:
      'A single-file Python assistant built around speech recognition, text-to-speech and command parsing — voice input or a simple --text mode, with a clean command table and straightforward setup.',
    technologies: ['Python', 'Speech Recognition', 'TTS', 'OpenWeatherMap API', 'CLI'],
    github: 'https://github.com/Nithyaanathan/jarvis-voice-assistant',
    accent: '#818cf8',
    position: [6, -1.6, 0],
    scale: 1.0,
  },
]

export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug)

export const digitalExperiences = [
  {
    title: 'Spring Home Stays',
    kind: 'Live Website',
    description: 'Full hospitality website with booking flow, gallery and maps.',
    link: 'https://github.com/Nithyaanathan/spring-home-stays-',
  },
  {
    title: 'This Portfolio — AI Universe',
    kind: 'Exploration',
    description: 'Immersive 3D web experience built with React, Three.js and motion design.',
    link: '#hero',
  },
  {
    title: 'QOGAF Dashboard',
    kind: 'Exploration',
    description: 'Real-time cluster monitoring dashboard inside the QOGAF framework.',
    link: 'https://github.com/Nithyaanathan/QOGAF',
  },
]