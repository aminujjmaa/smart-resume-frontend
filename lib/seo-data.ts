export interface JobTitleSEO {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  level: string;
  score: number;
  whyItWorks: string[];
  dummyData: {
    name: string;
    contact: string;
    summary: string;
    experience: { title: string; bullets: string[] }[];
    skills: string;
    education: string;
  };
}

export const SEO_DATA: JobTitleSEO[] = [
  {
    slug: "software-engineer",
    title: "Software Engineer Resume Example & Template | SmartResume AI",
    description: "See a 90+ ATS-scoring Software Engineer resume example. Learn how to write compelling bullets that land tech interviews.",
    keywords: ["Software Engineer Resume", "Tech Resume Example", "Backend Engineer Resume", "ATS Resume Software Engineer"],
    h1: "Software Engineer Resume Example That Passes the ATS",
    level: "Mid-Senior Level",
    score: 92,
    whyItWorks: [
      "Uses strong technical action verbs (Architected, Scaled)",
      "Quantifies impact (e.g. 'reduced latency by 40%')",
      "Clear, parseable technical skills section separated by domain"
    ],
    dummyData: {
      name: "Alex Dev",
      contact: "alex.dev@email.com | (555) 123-4567 | linkedin.com/in/alexdev",
      summary: "Software Engineer with 4+ years of experience building highly scalable microservices. Proven track record of optimizing backend infrastructure and improving database latency.",
      experience: [
        {
          title: "Software Engineer — TechCorp (2021-Present)",
          bullets: [
            "Architected a scalable Go microservice that processed 10M+ daily events, reducing processing time by 40%.",
            "Migrated legacy monolithic database to PostgreSQL, achieving 99.99% uptime.",
            "Mentored 2 junior developers and led weekly system design workshops."
          ]
        }
      ],
      skills: "Languages: Python, TypeScript, Go | Tech: Docker, Kubernetes, AWS, PostgreSQL",
      education: "B.S. in Computer Science — University of Technology (2020)"
    }
  },
  {
    slug: "product-manager",
    title: "Product Manager Resume Example & Template | SmartResume AI",
    description: "View an ATS-optimized Product Manager resume example. Discover how to highlight product impact and leadership metrics.",
    keywords: ["Product Manager Resume", "PM Resume Example", "SaaS PM Resume", "ATS Resume Product Manager"],
    h1: "Product Manager Resume Example That Lands Interviews",
    level: "Senior Level",
    score: 94,
    whyItWorks: [
      "Highlights specific ARR growth and user adoption metrics",
      "Shows cross-functional leadership between engineering and design",
      "Focuses on business outcomes rather than just feature output"
    ],
    dummyData: {
      name: "Sam Product",
      contact: "sam.pm@email.com | (555) 987-6543 | linkedin.com/in/sampm",
      summary: "Data-driven Product Manager with 6+ years of experience in B2B SaaS. Expert in driving product strategy from ideation to launch, focusing on user growth and retention.",
      experience: [
        {
          title: "Senior Product Manager — GrowthSaaS (2019-Present)",
          bullets: [
            "Spearheaded the launch of a new enterprise reporting dashboard, driving $1.2M in new ARR within 6 months.",
            "Led a cross-functional team of 8 engineers and 2 designers using Agile methodologies.",
            "Increased user retention by 25% through targeted onboarding UX improvements."
          ]
        }
      ],
      skills: "Product Strategy, Agile/Scrum, A/B Testing, SQL, Jira, Mixpanel, Wireframing",
      education: "MBA — Business School (2018) | B.S. Economics (2016)"
    }
  },
  {
    slug: "data-scientist",
    title: "Data Scientist Resume Example & Template | SmartResume AI",
    description: "Get inspired by a top-scoring Data Scientist resume example. Learn how to present ML models and data impact effectively.",
    keywords: ["Data Scientist Resume", "ML Engineer Resume", "Data Analyst Resume Example", "ATS Data Science Resume"],
    h1: "Data Scientist Resume Example That Stands Out",
    level: "Entry-Mid Level",
    score: 88,
    whyItWorks: [
      "Details specific libraries and models used (XGBoost, PyTorch)",
      "Emphasizes the business value of models, not just accuracy metrics",
      "Links to a well-maintained GitHub portfolio"
    ],
    dummyData: {
      name: "Jamie Data",
      contact: "jamie.data@email.com | (555) 456-7890 | github.com/jamiedata",
      summary: "Detail-oriented Data Scientist specializing in predictive modeling and natural language processing. Passionate about translating complex datasets into actionable business insights.",
      experience: [
        {
          title: "Data Scientist — Analytics Inc (2022-Present)",
          bullets: [
            "Developed an XGBoost customer churn prediction model with 89% accuracy, saving an estimated $200k annually.",
            "Built automated ETL pipelines in Python/Airflow to process 500GB of daily logs.",
            "Presented quarterly data insights to C-level executives using Tableau dashboards."
          ]
        }
      ],
      skills: "Python, SQL, R, Pandas, PyTorch, Scikit-Learn, Tableau, AWS SageMaker",
      education: "M.S. in Data Science — Tech University (2022)"
    }
  },
  {
    slug: "marketing-manager",
    title: "Marketing Manager Resume Example & Template | SmartResume AI",
    description: "See a highly effective Marketing Manager resume example optimized for ATS. Highlight your campaigns and ROI metrics.",
    keywords: ["Marketing Manager Resume", "Digital Marketing Resume", "Growth Marketing Resume"],
    h1: "Marketing Manager Resume Example Built for Success",
    level: "Mid Level",
    score: 91,
    whyItWorks: [
      "Demonstrates clear ROI on marketing spend (CAC, LTV)",
      "Shows multi-channel campaign experience",
      "Uses strong marketing-specific verbs (Spearheaded, Optimized)"
    ],
    dummyData: {
      name: "Morgan Market",
      contact: "morgan.mkt@email.com | (555) 222-3333 | linkedin.com/in/morganmkt",
      summary: "Creative and analytical Growth Marketing Manager with 5 years of experience managing 7-figure ad budgets and driving B2C acquisition across social and search channels.",
      experience: [
        {
          title: "Growth Marketing Manager — ConsumerCo (2020-Present)",
          bullets: [
            "Managed a $1.5M annual digital ad budget, decreasing Customer Acquisition Cost (CAC) by 22% over two years.",
            "Launched a comprehensive email drip campaign that increased conversion rates by 15%.",
            "Coordinated with influencers and creative agencies to produce high-performing TikTok assets."
          ]
        }
      ],
      skills: "Google Ads, Facebook Ads Manager, SEO/SEM, Google Analytics, Mailchimp, Copywriting",
      education: "B.A. in Marketing and Communications — State University (2019)"
    }
  }
];

export function getJobTitleSEO(slug: string): JobTitleSEO | undefined {
  return SEO_DATA.find((item) => item.slug === slug);
}
