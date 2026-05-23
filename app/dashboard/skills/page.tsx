import { Target } from "lucide-react";

export default function SkillsPage() {
  const roles = [
    {
      title: "Software Engineer (Backend)",
      skills: ["Python", "Go", "Java", "Node.js", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes", "AWS", "Microservices", "REST APIs", "gRPC", "CI/CD"]
    },
    {
      title: "Software Engineer (Frontend)",
      skills: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Redux", "GraphQL", "Jest", "Cypress", "WebPack", "Vite", "Accessibility (a11y)"]
    },
    {
      title: "Data Scientist / ML Engineer",
      skills: ["Python", "SQL", "Pandas", "Scikit-Learn", "TensorFlow", "PyTorch", "Spark", "Airflow", "MLflow", "AWS SageMaker", "Data Visualization"]
    },
    {
      title: "Product Manager",
      skills: ["Product Strategy", "Agile/Scrum", "Jira", "A/B Testing", "User Research", "Data Analysis", "SQL", "Wireframing", "Roadmapping", "Stakeholder Management"]
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <Target className="text-emerald-500" /> Skills & Keywords Database
        </h1>
        <p className="text-slate-400">
          The most in-demand technical and hard skills across different roles. Ensure these appear in your resume to pass ATS filters.
        </p>
      </div>

      <div className="space-y-6">
        {roles.map((role, idx) => (
          <div key={idx} className="card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 border-b border-white/5 pb-2">{role.title}</h2>
            <div className="flex flex-wrap gap-2">
              {role.skills.map((skill, sIdx) => (
                <span key={sIdx} className="px-3 py-1 bg-surface-800 border border-white/10 rounded-md text-sm text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
