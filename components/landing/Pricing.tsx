import PlanCards from "@/components/pricing/PlanCards";

export default function Pricing() {
  return (
    <section id="pricing" className="section bg-[#070b12]">
      <div className="container-lg mx-auto">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="badge badge-info mb-4">Simple pricing</span>
          <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            Start with a free scan. Upgrade when you&apos;re applying at volume.
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-400">
            The full ATS report is free. Pro adds AI help for tailoring every application.
          </p>
        </div>
        <PlanCards />
      </div>
    </section>
  );
}
