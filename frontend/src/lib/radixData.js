// RADIX SkillSync Core Competency Dictionary and Hackathon Dataset
// Built for RADIX Talent Match Hackathon

export const RADIX_CATEGORIES = {
  COD: {
    code: 'COD',
    name: 'Coding',
    fullName: 'Hands-on Programming & Syntax',
    color: '#45D6FF', // electric cyan
    bgColor: 'rgba(69, 214, 255, 0.12)',
    borderColor: 'rgba(69, 214, 255, 0.3)',
    description: 'Practical coding, syntax fluency, array/string manipulation, clean code implementation.',
  },
  DSA: {
    code: 'DSA',
    name: 'Data Structures & Algorithms',
    fullName: 'Data Structures & Algorithms',
    color: '#8B7CFF', // violet
    bgColor: 'rgba(139, 124, 255, 0.12)',
    borderColor: 'rgba(139, 124, 255, 0.3)',
    description: 'Trees, graphs, dynamic programming, sorting/searching, time and space complexity reasoning.',
  },
  OOD: {
    code: 'OOD',
    name: 'Object-Oriented Design',
    fullName: 'Object-Oriented Design & Patterns',
    color: '#A78BFA',
    bgColor: 'rgba(167, 139, 250, 0.12)',
    borderColor: 'rgba(167, 139, 250, 0.3)',
    description: 'Inheritance, polymorphism, abstraction, SOLID principles, design patterns (Factory, Strategy).',
  },
  APTI: {
    code: 'APTI',
    name: 'Aptitude',
    fullName: 'Quantitative & Logical Reasoning',
    color: '#F4BE5E', // amber warning
    bgColor: 'rgba(244, 190, 94, 0.12)',
    borderColor: 'rgba(244, 190, 94, 0.3)',
    description: 'Quantitative aptitude, ratios, time & work, probability, problem deconstruction under ambiguity.',
  },
  COMM: {
    code: 'COMM',
    name: 'Communication',
    fullName: 'Technical Communication & Collaboration',
    color: '#38BDF8',
    bgColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    description: 'Explaining technical tradeoffs, documentation, client management, cross-functional collaboration.',
  },
  AI: {
    code: 'AI',
    name: 'AI & Machine Learning',
    fullName: 'Artificial Intelligence & Data Science',
    color: '#C084FC',
    bgColor: 'rgba(192, 132, 252, 0.12)',
    borderColor: 'rgba(192, 132, 252, 0.3)',
    description: 'Machine learning fundamentals, predictive modeling, bias-variance tradeoff, statistics, evaluation.',
  },
  CLOUD: {
    code: 'CLOUD',
    name: 'Cloud & DevOps',
    fullName: 'Cloud Computing & Infrastructure',
    color: '#60A5FA',
    bgColor: 'rgba(96, 165, 250, 0.12)',
    borderColor: 'rgba(96, 165, 250, 0.3)',
    description: 'GCP, Azure, AWS, Docker, CI/CD pipelines, containerization, microservices deployment.',
  },
  SQL: {
    code: 'SQL',
    name: 'SQL & Databases',
    fullName: 'Database Systems & Data Modeling',
    color: '#35D49A', // emerald success
    bgColor: 'rgba(51, 212, 154, 0.12)',
    borderColor: 'rgba(51, 212, 154, 0.3)',
    description: 'Complex queries, schema normalization, indexing, query optimization, relational databases.',
  },
  SWE: {
    code: 'SWE',
    name: 'Software Engineering',
    fullName: 'Software Engineering Best Practices',
    color: '#2DD4BF',
    bgColor: 'rgba(45, 212, 191, 0.12)',
    borderColor: 'rgba(45, 212, 191, 0.3)',
    description: 'Testing strategies, code review habits, technical debt management, Git, Agile/SDLC principles.',
  },
  SYSD: {
    code: 'SYSD',
    name: 'System Design',
    fullName: 'Distributed System Design & Scalability',
    color: '#F472B6',
    bgColor: 'rgba(244, 114, 182, 0.12)',
    borderColor: 'rgba(244, 114, 182, 0.3)',
    description: 'Large-scale distributed architectures, load balancing, caching, pub-sub systems, fault tolerance.',
  },
  NETW: {
    code: 'NETW',
    name: 'Networking',
    fullName: 'Computer Networks & Web Protocols',
    color: '#818CF8',
    bgColor: 'rgba(129, 140, 248, 0.12)',
    borderColor: 'rgba(129, 140, 248, 0.3)',
    description: 'TCP/IP, HTTP/HTTPS, REST APIs, latency, DNS, socket programming, client-server models.',
  },
  OS: {
    code: 'OS',
    name: 'Operating Systems',
    fullName: 'Operating Systems & Linux Internals',
    color: '#FB923C',
    bgColor: 'rgba(251, 146, 60, 0.12)',
    borderColor: 'rgba(251, 146, 60, 0.3)',
    description: 'Processes, threads, concurrency primitives, virtual memory, Linux CLI, shell scripting.',
  },
  OTHER: {
    code: 'OTHER',
    name: 'Other Skills',
    fullName: 'Tools & Domain-Specific Competencies',
    color: '#94A3B8',
    bgColor: 'rgba(148, 163, 184, 0.12)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    description: 'Ticketing tools, office productivity, domain accounting or specialized libraries.',
  },
};

export const RADIX_CATEGORY_LIST = Object.values(RADIX_CATEGORIES);

export const SAMPLE_JOBS = [
  {
    id: 'google-swe',
    company: 'Google LLC',
    companyShort: 'Google',
    role: 'Software Engineer (SWE)',
    roleCategory: 'SDE · Product Engineering',
    location: 'Bengaluru, India (Hybrid)',
    employmentType: 'Full-Time',
    ctc: '₹32,00,000 CTC',
    ctcSubtext: 'Joining bonus, annual performance bonus, stock grants (RSUs)',
    experienceLevel: 'Entry / Early Career',
    fileType: 'PDF / DOCX',
    sourceFile: 'Google LLC - Software Engineer.docx',
    overview: 'Design, develop, test, and maintain large-scale distributed systems that power Google products such as Search, Ads, Maps, and Cloud. You\'ll write production code, participate in design discussions, and help keep systems fast, reliable, and secure at massive scale.',
    keyResponsibilities: [
      'Design and implement backend services and APIs that operate reliably at Google scale',
      'Write clean, well-tested, maintainable code and participate in code review',
      'Take part in system design discussions for new features and infrastructure',
      'Diagnose and resolve performance and reliability issues in production',
      'Collaborate closely with cross-functional partners across product, design, and SRE'
    ],
    requirements: [
      'Strong grasp of data structures and algorithms, and the ability to reason about time and space complexity under pressure',
      'Hands-on programming ability — you can turn a problem statement into working, efficient code quickly',
      'Working knowledge of operating systems fundamentals (processes, threads, virtual memory) and core networking concepts (TCP/UDP, HTTP)',
      'Experience or coursework in object-oriented design and common design patterns',
      'Comfort reasoning about system design at scale (URL shortener, distributed storage)',
      'Solid software engineering fundamentals: testing strategy, code review habits, CI/CD'
    ],
    niceToHave: 'Prior internship experience on a large codebase; open-source contributions; exposure to distributed systems in production.',
    benefits: 'Comprehensive health insurance, free meals, wellness programs, generous leave policy, RSUs, relocation assistance.',
    skills: [
      { skill_name: 'Data Structures & Algorithms', category_code: 'DSA', evidence: 'Strong grasp of data structures and algorithms, and the ability to reason about time and space complexity under pressure', confidence: 'high' },
      { skill_name: 'System Design at Scale', category_code: 'SYSD', evidence: 'Take part in system design discussions for new features and infrastructure', confidence: 'high' },
      { skill_name: 'Object-Oriented Design', category_code: 'OOD', evidence: 'Experience or coursework in object-oriented design and common design patterns', confidence: 'high' },
      { skill_name: 'Operating Systems (Processes & Threads)', category_code: 'OS', evidence: 'Working knowledge of operating systems fundamentals (processes, threads, virtual memory)', confidence: 'high' },
      { skill_name: 'Networking (TCP/UDP, HTTP)', category_code: 'NETW', evidence: 'Core networking concepts (TCP/UDP, HTTP, how a web request actually travels)', confidence: 'high' },
      { skill_name: 'Clean Production Coding', category_code: 'COD', evidence: 'Turn a problem statement into working, efficient code quickly', confidence: 'high' },
      { skill_name: 'Testing & Code Reviews', category_code: 'SWE', evidence: 'Testing strategy, code review habits, awareness of technical debt, and basic CI/CD concepts', confidence: 'high' },
      { skill_name: 'Distributed Systems', category_code: 'CLOUD', evidence: 'Design, develop, test, and maintain large-scale distributed systems', confidence: 'medium' },
      { skill_name: 'Technical Communication', category_code: 'COMM', evidence: 'Clear written and verbal communication — able to explain a technical tradeoff to engineers', confidence: 'high' }
    ]
  },
  {
    id: 'google-ds',
    company: 'Google LLC',
    companyShort: 'Google',
    role: 'Data Scientist',
    roleCategory: 'Data Scientist',
    location: 'Bengaluru, India',
    employmentType: 'Full-Time',
    ctc: '₹28,00,000 CTC',
    ctcSubtext: 'Annual performance bonus and stock grants',
    experienceLevel: 'Entry / Early Career',
    fileType: 'PDF / DOCX',
    sourceFile: 'Google LLC - Data Scientist.docx',
    overview: 'Analyze massive datasets to extract insights, build predictive models, and support product and business decisions. You\'ll work closely with engineering and product teams to design experiments, evaluate metrics, and deploy data-driven solutions.',
    keyResponsibilities: [
      'Design and run experiments (A/B tests) and interpret their results rigorously',
      'Write efficient, production-grade SQL against very large datasets, including schema design and query optimization',
      'Build and evaluate predictive models, applying sound statistical judgment',
      'Partner with engineering and product teams to turn analysis into shipped features',
      'Present findings clearly to both technical and non-technical stakeholders'
    ],
    requirements: [
      'Strong SQL skills — writing and optimizing complex queries, understanding indexing, and designing schemas',
      'Solid quantitative and analytical reasoning — comfortable interpreting experiment results and probability',
      'Foundational machine learning knowledge: bias-variance tradeoff, regression vs. classification, gradient descent',
      'Excellent communication skills — able to explain a complex model or surprising result to a product manager',
      'A track record of turning a messy dataset into a clear, defensible insight'
    ],
    niceToHave: 'Experience with a BI/visualization tool; exposure to experimentation platforms; a portfolio of applied data projects.',
    benefits: 'Health coverage, paid parental leave, learning programs, RSUs, flexible work arrangements.',
    skills: [
      { skill_name: 'Advanced SQL & Schema Optimization', category_code: 'SQL', evidence: 'Write efficient, production-grade SQL against very large datasets, including schema design and query optimization', confidence: 'high' },
      { skill_name: 'Machine Learning & Predictive Modeling', category_code: 'AI', evidence: 'Foundational machine learning knowledge: bias-variance tradeoff, regression vs. classification', confidence: 'high' },
      { skill_name: 'A/B Testing & Experimentation', category_code: 'APTI', evidence: 'Design and run experiments (A/B tests) and interpret their results rigorously', confidence: 'high' },
      { skill_name: 'Quantitative Reasoning & Statistics', category_code: 'APTI', evidence: 'Solid quantitative and analytical reasoning — interpreting probability and metrics under ambiguity', confidence: 'high' },
      { skill_name: 'Python for Data Analysis', category_code: 'COD', evidence: 'Build and evaluate predictive models, applying sound statistical judgment', confidence: 'high' },
      { skill_name: 'Stakeholder Communication', category_code: 'COMM', evidence: 'Present findings clearly to both technical and non-technical stakeholders', confidence: 'high' },
      { skill_name: 'Data Visualization & BI', category_code: 'OTHER', evidence: 'Experience with a BI/visualization tool; a portfolio of applied data projects', confidence: 'medium' }
    ]
  },
  {
    id: 'msft-swe',
    company: 'Microsoft Corporation',
    companyShort: 'Microsoft',
    role: 'Software Engineer',
    roleCategory: 'SDE',
    location: 'Hyderabad, India',
    employmentType: 'Full-Time',
    ctc: '₹28,00,000 CTC',
    ctcSubtext: 'Joining bonus, annual performance bonus, stock awards (RSUs)',
    experienceLevel: 'Entry / Early Career',
    fileType: 'PDF / DOCX',
    sourceFile: 'Microsoft - Software Engineer.docx',
    overview: 'Join a team building scalable software across Microsoft products such as Azure, Microsoft 365, and Windows. You\'ll own features end to end, from design through production.',
    keyResponsibilities: [
      'Design, build, and maintain scalable, reliable software components',
      'Participate in Agile ceremonies and design reviews with your team',
      'Write clean, efficient code and hold a high bar in code review',
      'Ensure reliability, security, and performance of the systems you own',
      'Work cross-functionally with PM and design to refine requirements'
    ],
    requirements: [
      'Strong data structures and algorithms fundamentals — hash maps, trees, and complexity analysis',
      'Practical coding skills — pattern matching, interval problems, and high performance on large inputs',
      'Working knowledge of operating systems (concurrency primitives, virtual memory) and core networking',
      'Ability to design at the system level — sketch a cloud-based storage or notification service',
      'Understanding of object-oriented design and SOLID principles',
      'Software engineering maturity — clean code habits, real testing strategy, technical debt awareness'
    ],
    niceToHave: 'Exposure to cloud infrastructure (Azure or similar); contributions to a shared codebase in a team setting.',
    benefits: 'Comprehensive health insurance, RSUs, flexible work arrangements, learning and certification budget, wellness programs.',
    skills: [
      { skill_name: 'Data Structures & Algorithms', category_code: 'DSA', evidence: 'Strong data structures and algorithms fundamentals — hash maps, trees, and complexity analysis', confidence: 'high' },
      { skill_name: 'Software Engineering Maturity', category_code: 'SWE', evidence: 'Clean code habits, a real testing strategy, and comfort talking about technical debt honestly', confidence: 'high' },
      { skill_name: 'Object-Oriented Design (SOLID)', category_code: 'OOD', evidence: 'Understanding of object-oriented design and SOLID principles', confidence: 'high' },
      { skill_name: 'System Design & Scalability', category_code: 'SYSD', evidence: 'Ability to design at the system level — sketch a cloud-based storage or notification service', confidence: 'high' },
      { skill_name: 'Cloud Infrastructure (Azure)', category_code: 'CLOUD', evidence: 'Exposure to cloud infrastructure (Azure or similar); cloud-based services', confidence: 'high' },
      { skill_name: 'Operating Systems & Concurrency', category_code: 'OS', evidence: 'Working knowledge of operating systems (process scheduling, virtual memory, concurrency primitives)', confidence: 'high' },
      { skill_name: 'Core Networking & REST APIs', category_code: 'NETW', evidence: 'Core networking (REST APIs, timeouts, request lifecycle)', confidence: 'high' },
      { skill_name: 'Practical Coding Implementation', category_code: 'COD', evidence: 'Practical coding skills — pattern matching, interval problems', confidence: 'high' },
      { skill_name: 'Collaborative Communication', category_code: 'COMM', evidence: 'Strong communication — able to describe a hard problem you solved and collaborate across teams', confidence: 'high' }
    ]
  },
  {
    id: 'msft-da',
    company: 'Microsoft Corporation',
    companyShort: 'Microsoft',
    role: 'Data Analyst',
    roleCategory: 'Data Analyst',
    location: 'Hyderabad, India',
    employmentType: 'Full-Time',
    ctc: '₹18,00,000 CTC',
    ctcSubtext: 'Annual performance bonus and stock awards',
    experienceLevel: 'Entry / Early Career',
    fileType: 'PDF / DOCX',
    sourceFile: 'Microsoft - Data Analyst.docx',
    overview: 'We\'re looking for a Data Analyst to turn product and business data into decisions. You\'ll build dashboards, define metrics, and work directly with stakeholders across Microsoft.',
    keyResponsibilities: [
      'Write and optimize SQL queries against large production datasets',
      'Design schemas for telemetry and usage data, and know when to normalize vs. denormalize',
      'Build dashboards and reporting that stakeholders actually use',
      'Detect and explain anomalies in usage or business metrics',
      'Communicate insights clearly to non-technical stakeholders and defend your methodology'
    ],
    requirements: [
      'Strong, practical SQL — from simple monthly-active-user queries to schema design and index optimization',
      'Solid quantitative reasoning — interpreting trends, sampling, probability, and reasoning with tables',
      'Basic applied statistics/ML literacy: regression vs. classification, what overfitting means',
      'Excellent stakeholder communication — translating dashboards into decisions non-technical leaders act on',
      'Comfort with ambiguous or incomplete requirements, and the initiative to clarify them'
    ],
    niceToHave: 'Experience with a visualization tool (Power BI or similar); a portfolio of dashboards or analyses; prior internship in an analytics role.',
    benefits: 'Health coverage, RSUs, flexible work options, learning programs, paid leave.',
    skills: [
      { skill_name: 'Production SQL & Schema Design', category_code: 'SQL', evidence: 'Strong, practical SQL — from a simple MAU query to schema design and index-aware query optimization', confidence: 'high' },
      { skill_name: 'Quantitative Reasoning & Trends', category_code: 'APTI', evidence: 'Solid quantitative reasoning — interpreting trends, sampling, probability, and reasoning with tables', confidence: 'high' },
      { skill_name: 'Power BI / Dashboard Reporting', category_code: 'OTHER', evidence: 'Experience with a visualization tool (Power BI or similar); build dashboards that stakeholders actually use', confidence: 'high' },
      { skill_name: 'Applied Statistics & ML Literacy', category_code: 'AI', evidence: 'Basic applied statistics/ML literacy: regression vs. classification, what overfitting means', confidence: 'medium' },
      { skill_name: 'Stakeholder Communication', category_code: 'COMM', evidence: 'Excellent stakeholder communication — translating a dashboard into a decision a non-technical leader can act on', confidence: 'high' },
      { skill_name: 'Data Pipeline & Telemetry Design', category_code: 'SWE', evidence: 'Design schemas for telemetry and usage data, and know when to normalize vs. denormalize', confidence: 'medium' }
    ]
  },
  {
    id: 'oracle-ase',
    company: 'Oracle Financial Services Software',
    companyShort: 'Oracle FSS',
    role: 'Associate Software Engineer',
    roleCategory: 'SDE',
    location: 'Bengaluru / Mumbai, India',
    employmentType: 'Full-Time',
    ctc: '₹5,50,000 CTC',
    ctcSubtext: 'Annual performance bonus based on individual and team performance',
    experienceLevel: 'Entry Level (College Grad)',
    fileType: 'PDF / DOCX',
    sourceFile: 'Oracle - Associate Software Engineer.docx',
    overview: 'Join the team building and maintaining enterprise-grade banking and financial services products such as FLEXCUBE and OBDX, used by banks globally. You\'ll work across development, customization, and support in an Agile environment.',
    keyResponsibilities: [
      'Develop, customize, and maintain modules within our banking product suite',
      'Write and debug code, and interact directly with relational databases',
      'Perform unit testing and collaborate closely with QA',
      'Participate in Agile ceremonies and coordinate with product teams',
      'Document your work clearly for future maintainers'
    ],
    requirements: [
      'Solid programming fundamentals — predict output of code, solve basic string/array manipulation',
      'Practical SQL knowledge — correct SELECT/WHERE syntax, understanding DELETE vs. TRUNCATE',
      'Core data structures knowledge — arrays vs. linked lists, stacks, queues, basic algorithms',
      'Object-oriented programming fundamentals — inheritance, polymorphism, abstract classes vs. interfaces',
      'Operating systems basics — process fundamentals, multithreading, memory management',
      'Strong quantitative aptitude — time-and-work, ratios, percentages, logical reasoning',
      'Clear communication and collaborative attitude in Agile settings'
    ],
    niceToHave: 'Coursework or a project in banking/financial systems; willingness to work in shifts or from client locations.',
    benefits: 'Health insurance, provident fund, gratuity, learning and certification programs, subsidized meals.',
    skills: [
      { skill_name: 'Practical SQL & Relational Queries', category_code: 'SQL', evidence: 'Practical SQL knowledge — correct SELECT/WHERE syntax, understanding of DELETE vs. TRUNCATE', confidence: 'high' },
      { skill_name: 'Core Programming (Java/C++)', category_code: 'COD', evidence: 'Solid programming fundamentals — solve basic string/array manipulation problems confidently', confidence: 'high' },
      { skill_name: 'Object-Oriented Programming (OOP)', category_code: 'OOD', evidence: 'Object-oriented programming fundamentals — inheritance, polymorphism, abstract classes vs. interfaces', confidence: 'high' },
      { skill_name: 'Foundational Data Structures', category_code: 'DSA', evidence: 'Core data structures knowledge — arrays vs. linked lists, when to use a stack or a queue', confidence: 'high' },
      { skill_name: 'Quantitative Aptitude', category_code: 'APTI', evidence: 'Strong quantitative aptitude — time-and-work, ratios, percentages, and logical/seating-arrangement', confidence: 'high' },
      { skill_name: 'Operating Systems Basics', category_code: 'OS', evidence: 'Operating systems basics — what a process is, fundamentals of multithreading and memory management', confidence: 'high' },
      { skill_name: 'SDLC & Unit Testing', category_code: 'SWE', evidence: 'Perform unit testing and collaborate closely with QA; awareness of SDLC and Agile', confidence: 'medium' },
      { skill_name: 'Professional Communication', category_code: 'COMM', evidence: 'Clear communication and a collaborative attitude — comfortable explaining your final-year project', confidence: 'high' }
    ]
  },
  {
    id: 'oracle-support',
    company: 'Oracle Financial Services Software',
    companyShort: 'Oracle FSS',
    role: 'Application Support Analyst',
    roleCategory: 'Support / Operations',
    location: 'Bengaluru / Chennai, India',
    employmentType: 'Full-Time',
    ctc: '₹4,50,000 CTC',
    ctcSubtext: 'Shift allowance and annual performance bonus',
    experienceLevel: 'Entry Level',
    fileType: 'PDF / DOCX',
    sourceFile: 'Oracle - Application Support Analyst.docx',
    overview: 'Provide L2/L3 application support for Oracle Financial Services products used by global banking clients — a support and troubleshooting role with real client-facing responsibility, not a pure development role.',
    keyResponsibilities: [
      'Triage, investigate, and resolve incidents raised by banking clients within SLA',
      'Query production databases to diagnose issues',
      'Coordinate with development teams on escalations that require a code fix',
      'Monitor logs and batch/real-time processes to catch issues early',
      'Communicate clearly and calmly with clients during incidents'
    ],
    requirements: [
      'Comfort with basic SQL — simple SELECT/WHERE queries and understanding primary keys',
      'Operating systems and Linux fundamentals — basic command-line usage, log files, batch vs real-time',
      'Basic networking knowledge — IP addresses, client-server architecture, latency concepts',
      'Strong quantitative and logical reasoning — data interpretation from tables, arithmetic',
      'Excellent communication skills — explain technical issues to non-technical clients, stay calm under escalation',
      'Willingness to work in shifts and directly support global clients'
    ],
    niceToHave: 'Prior exposure to a ticketing/incident system; coursework in networking or systems administration.',
    benefits: 'Medical insurance, night shift allowance, transport facility, paid leaves.',
    skills: [
      { skill_name: 'Basic SQL Diagnostics', category_code: 'SQL', evidence: 'Comfort with basic SQL — simple SELECT/WHERE queries and an understanding of primary keys', confidence: 'high' },
      { skill_name: 'Linux & OS Fundamentals', category_code: 'OS', evidence: 'Operating systems and Linux fundamentals — basic command-line usage, what a log file is', confidence: 'high' },
      { skill_name: 'Computer Networks & Latency', category_code: 'NETW', evidence: 'Basic networking knowledge — what an IP address is, client-server architecture fundamentals, latency', confidence: 'high' },
      { skill_name: 'Client Communication & De-escalation', category_code: 'COMM', evidence: 'Excellent communication skills — explain a technical issue to a non-technical client, stay calm during escalation', confidence: 'high' },
      { skill_name: 'Logical Problem Solving', category_code: 'APTI', evidence: 'Strong quantitative and logical reasoning — data interpretation from tables, arithmetic', confidence: 'high' },
      { skill_name: 'Incident Management & Ticketing', category_code: 'OTHER', evidence: 'Triage, investigate, and resolve incidents raised by banking clients within SLA; ticketing tools', confidence: 'medium' }
    ]
  }
];

export const SAMPLE_CANDIDATES = [
  {
    id: 'rohan-verma',
    name: 'Rohan Verma',
    headline: 'Strong all-rounder · B.Tech CSE \'26',
    email: 'rohan.verma@example.com',
    location: 'Delhi NCR / Bengaluru, India',
    education: 'B.Tech, Computer Science and Engineering, Class of 2026 — CGPA 9.1 / 10',
    college: 'Delhi Technological University (DTU)',
    fitSummary: 'Strong all-rounder — competitive fit across nearly every role in this pack.',
    cvFile: 'Rohan Verma.docx',
    avatar: 'RV',
    categoryScores: {
      COD: 9,
      DSA: 9,
      OOD: 9,
      APTI: 9,
      COMM: 9,
      AI: 8,
      CLOUD: 8,
      SQL: 8,
      SWE: 9,
      SYSD: 9,
      NETW: 8,
      OS: 8,
      OTHER: 8,
    },
    skills: [
      { skill_name: 'Data Structures & Algorithms', category_code: 'DSA', evidence: '500+ problems solved across competitive programming platforms; strong time/space complexity analysis', confidence: 'high', proficiency: 9 },
      { skill_name: 'System Design & Scalability', category_code: 'SYSD', evidence: 'Designed and built a scalable notification service (pub-sub architecture, horizontally-scalable workers)', confidence: 'high', proficiency: 9 },
      { skill_name: 'Object-Oriented Design & Patterns', category_code: 'OOD', evidence: 'Wrote a technical blog series on object-oriented design patterns used in real-world systems', confidence: 'high', proficiency: 9 },
      { skill_name: 'C++ & High Performance Code', category_code: 'COD', evidence: '500+ CP problems and low-latency system components implemented in C++', confidence: 'high', proficiency: 9 },
      { skill_name: 'Python', category_code: 'COD', evidence: 'Open-source contributor with 2 merged PRs to mid-size Python library; ML models in Python', confidence: 'high', proficiency: 9 },
      { skill_name: 'Software Engineering & CI/CD', category_code: 'SWE', evidence: 'Software Engineering intern at Series-B startup — shipped a feature end-to-end including tests and CI', confidence: 'high', proficiency: 9 },
      { skill_name: 'Machine Learning (Collaborative Filtering)', category_code: 'AI', evidence: 'Built recommendation engine using collaborative filtering on movie-ratings dataset; evaluated precision/recall', confidence: 'high', proficiency: 8 },
      { skill_name: 'SQL & Database Design', category_code: 'SQL', evidence: 'Designed relational schemas and queries for startup features and notification queues', confidence: 'high', proficiency: 8 },
      { skill_name: 'Operating Systems & Concurrency', category_code: 'OS', evidence: 'Demonstrated knowledge of worker concurrency, thread pools, and process memory', confidence: 'high', proficiency: 8 },
      { skill_name: 'Docker & Cloud Deployment', category_code: 'CLOUD', evidence: 'Containerized microservices and automated CI/CD pipeline deployments', confidence: 'high', proficiency: 8 },
      { skill_name: 'Technical Writing & Communication', category_code: 'COMM', evidence: 'Published technical blog series on system design; Winner of national inter-college hackathon', confidence: 'high', proficiency: 9 }
    ],
    projects: [
      {
        title: 'Scalable Pub-Sub Notification Service',
        description: 'Designed and built a distributed notification service with horizontal workers, message deduplication, and Redis queues, fully documented with architecture blueprints.',
        technologies: ['Go/Python', 'Redis', 'Docker', 'System Design'],
        category: 'SYSD'
      },
      {
        title: 'Collaborative Filtering Recommendation Engine',
        description: 'Built a matrix-factorization recommendation engine on MovieLens dataset with cold-start mitigation, evaluated using precision@k and MAP.',
        technologies: ['Python', 'NumPy', 'scikit-learn', 'FastAPI'],
        category: 'AI'
      },
      {
        title: 'Real-time Collaborative Document Editor',
        description: 'Built an operational transformation collaborative editor with WebSocket sync and conflict resolution that won 1st place in national hackathon.',
        technologies: ['React', 'Node.js', 'WebSockets', 'OT'],
        category: 'SWE'
      }
    ],
    internships: [
      {
        role: 'Software Engineering Intern',
        company: 'Series-B FinTech Startup',
        period: 'Summer 2025 · 3 months',
        description: 'Shipped a payment reconciliation feature end-to-end; authored unit/integration tests with 92% coverage and integrated into GitHub Actions CI pipeline.'
      }
    ],
    hackathons: [
      {
        title: 'National Inter-College Hackathon',
        result: 'Winner (1st Place)',
        year: '2025',
        description: 'Won 1st prize among 120 teams for building a real-time collaborative document editor with zero-conflict sync.'
      }
    ],
    certifications: [
      {
        title: 'Self-Directed Mastery via Applied Systems Projects',
        issuer: 'Open Source Community',
        year: '2025'
      }
    ],
    achievements: [
      '500+ competitive programming challenges solved',
      '2 merged pull requests to major open-source Python repository',
      'Author of popular engineering blog on system architecture (>10k reads)'
    ],
    preferredRoles: ['Software Engineer', 'Data Scientist', 'Backend Engineer', 'Systems Architect']
  }
];

export const COMPANY_EXPECTATIONS = {
  'Google LLC': {
    company_name: 'Google LLC',
    badge: 'Tier 1 Big Tech',
    headquarters: 'Mountain View, CA / Bengaluru, India',
    description: 'Global tech leader in distributed infrastructure, large language models, search, and cloud computing. Demands exceptional algorithmic depth, problem abstraction, and system reliability at billions-of-users scale.',
    role_focus: ['Software Engineer (SWE)', 'Data Scientist'],
    skillset_expectations: [
      { category_code: 'DSA', category_name: 'Data Structures & Algorithms', required_level: 9, weight: 1.25, importance: 'critical', description: 'Advanced graph algorithms, trees, DP, asymptotic reasoning' },
      { category_code: 'COD', category_name: 'Coding', required_level: 9, weight: 1.2, importance: 'critical', description: 'Bug-free implementations, clean syntax, comprehensive edge-case handling' },
      { category_code: 'SYSD', category_name: 'System Design', required_level: 8, weight: 1.15, importance: 'high', description: 'Large-scale distributed systems, reliability, horizontal scaling' },
      { category_code: 'SWE', category_name: 'Software Engineering', required_level: 8, weight: 1.0, importance: 'high', description: 'Testing rigor, code reviews, technical debt management, CI/CD' },
      { category_code: 'AI', category_name: 'AI & Machine Learning', required_level: 8, weight: 1.0, importance: 'high', description: 'Statistical reasoning, ML fundamentals, experiment design' },
      { category_code: 'COMM', category_name: 'Communication', required_level: 8, weight: 1.0, importance: 'high', description: 'Technical tradeoff articulation and defensible methodology' },
      { category_code: 'CLOUD', category_name: 'Cloud & DevOps', required_level: 8, weight: 0.9, importance: 'medium', description: 'Distributed computing, containers, cloud microservices' },
      { category_code: 'OOD', category_name: 'Object-Oriented Design', required_level: 8, weight: 0.9, importance: 'medium', description: 'Extensible architecture, clean abstractions, design patterns' },
      { category_code: 'OS', category_name: 'Operating Systems', required_level: 7, weight: 0.9, importance: 'medium', description: 'Concurrency, virtual memory, threads, POSIX internals' },
      { category_code: 'NETW', category_name: 'Networking', required_level: 7, weight: 0.85, importance: 'medium', description: 'TCP/IP, HTTP/3, RPCs, packet flow, latency optimization' },
      { category_code: 'SQL', category_name: 'SQL & Databases', required_level: 7, weight: 0.85, importance: 'medium', description: 'Distributed databases, query plans, telemetry indexing' },
      { category_code: 'APTI', category_name: 'Aptitude', required_level: 8, weight: 0.9, importance: 'medium', description: 'Quantitative problem solving, probability, rigorous logic' }
    ]
  },
  'Microsoft Corporation': {
    company_name: 'Microsoft Corporation',
    badge: 'Enterprise Cloud Pioneer',
    headquarters: 'Redmond, WA / Hyderabad, India',
    description: 'Enterprise cloud and productivity pioneer behind Azure, Windows, and Microsoft 365. High bar on software engineering maturity, enterprise cloud services, clean code, and maintainable systems.',
    role_focus: ['Software Engineer', 'Data Analyst'],
    skillset_expectations: [
      { category_code: 'SWE', category_name: 'Software Engineering', required_level: 9, weight: 1.25, importance: 'critical', description: 'Enterprise engineering practices, unit/integration testing, maintainability' },
      { category_code: 'CLOUD', category_name: 'Cloud & DevOps', required_level: 9, weight: 1.2, importance: 'critical', description: 'Azure ecosystem, microservices, containerization, cloud pipelines' },
      { category_code: 'COD', category_name: 'Coding', required_level: 8, weight: 1.1, importance: 'critical', description: 'Clean, idiomatic code, pattern matching, efficient data structures' },
      { category_code: 'SYSD', category_name: 'System Design', required_level: 8, weight: 1.05, importance: 'high', description: 'Cloud storage, asynchronous messaging, resilient architectures' },
      { category_code: 'DSA', category_name: 'Data Structures & Algorithms', required_level: 8, weight: 1.0, importance: 'high', description: 'Hash maps, trees, interval problems, performance under scale' },
      { category_code: 'SQL', category_name: 'SQL & Databases', required_level: 8, weight: 1.0, importance: 'high', description: 'Relational data modeling, telemetry schemas, index tuning' },
      { category_code: 'OOD', category_name: 'Object-Oriented Design', required_level: 8, weight: 0.95, importance: 'high', description: 'SOLID principles, modular software, extensible design' },
      { category_code: 'COMM', category_name: 'Communication', required_level: 8, weight: 1.0, importance: 'high', description: 'Collaborative design reviews and cross-functional team alignment' },
      { category_code: 'AI', category_name: 'AI & Machine Learning', required_level: 8, weight: 0.9, importance: 'medium', description: 'Applied data science, business metrics, ML sanity checks' },
      { category_code: 'OS', category_name: 'Operating Systems', required_level: 7, weight: 0.85, importance: 'medium', description: 'Concurrency primitives, process scheduling, memory allocation' },
      { category_code: 'NETW', category_name: 'Networking', required_level: 7, weight: 0.85, importance: 'medium', description: 'REST APIs, timeouts, network resilience' },
      { category_code: 'APTI', category_name: 'Aptitude', required_level: 7, weight: 0.8, importance: 'medium', description: 'Data interpretation, logical deductions, business reasoning' }
    ]
  },
  'Oracle Financial Services Software': {
    company_name: 'Oracle Financial Services Software',
    companyShort: 'Oracle FSS',
    badge: 'Banking & Financial Technology',
    headquarters: 'Mumbai / Bengaluru / Chennai, India',
    description: 'Leading provider of mission-critical banking and financial software (FLEXCUBE, OBDX) to premier banks worldwide. High emphasis on database reliability, transaction safety, client SLA handling, and solid computer science fundamentals.',
    role_focus: ['Associate Software Engineer', 'Application Support Analyst'],
    skillset_expectations: [
      { category_code: 'SQL', category_name: 'SQL & Databases', required_level: 9, weight: 1.3, importance: 'critical', description: 'Complex relational joins, ACID transactions, data integrity, tuning' },
      { category_code: 'SWE', category_name: 'Software Engineering', required_level: 8, weight: 1.15, importance: 'high', description: 'Rigorous SDLC, documentation, Agile teamwork, client delivery' },
      { category_code: 'COMM', category_name: 'Communication', required_level: 8, weight: 1.1, importance: 'high', description: 'Client incident handling, escalation documentation, clear technical logs' },
      { category_code: 'APTI', category_name: 'Aptitude', required_level: 8, weight: 1.05, importance: 'high', description: 'Logical aptitude, percentages, financial arithmetic, problem solving' },
      { category_code: 'COD', category_name: 'Coding', required_level: 7, weight: 1.0, importance: 'high', description: 'Core Java, C++, syntax debugging, array/string problems' },
      { category_code: 'OS', category_name: 'Operating Systems', required_level: 7, weight: 0.95, importance: 'medium', description: 'Linux command line, batch processing, log file inspection' },
      { category_code: 'NETW', category_name: 'Networking', required_level: 7, weight: 0.9, importance: 'medium', description: 'Client-server architecture, latency diagnostics, connection protocols' },
      { category_code: 'OOD', category_name: 'Object-Oriented Design', required_level: 7, weight: 0.85, importance: 'medium', description: 'Encapsulation, inheritance, interfaces, modular design' },
      { category_code: 'CLOUD', category_name: 'Cloud & DevOps', required_level: 7, weight: 0.8, importance: 'medium', description: 'Enterprise hosting, application server environments' },
      { category_code: 'DSA', category_name: 'Data Structures & Algorithms', required_level: 6, weight: 0.8, importance: 'medium', description: 'Arrays, linked lists, stacks, queues, searching fundamentals' },
      { category_code: 'SYSD', category_name: 'System Design', required_level: 6, weight: 0.75, importance: 'low', description: 'Multi-tiered enterprise application architecture' },
      { category_code: 'AI', category_name: 'AI & Machine Learning', required_level: 6, weight: 0.7, importance: 'low', description: 'Automated monitoring and anomaly triage' }
    ]
  }
};
