import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What SmartResume AI collects, why, who processes it, how long it is kept, and how to delete it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      intro={`${SITE.name} (“we”) is operated by ${SITE.legalName}. This policy explains what we collect when you use ${SITE.url}, why we collect it, and the choices you have. We process personal data in line with India's Digital Personal Data Protection Act, 2023.`}
    >
      <h2>What we collect</h2>
      <ul>
        <li><strong>Resumes and job descriptions</strong> you paste or upload, and the analysis we produce from them.</li>
        <li><strong>Account details</strong> if you sign up: email address, name, and a securely hashed password — or your name and email from Google if you use Google sign-in.</li>
        <li><strong>Payment records</strong> for Pro: payment and subscription IDs, amount, status and payment method type. Card, UPI and bank details are handled by Razorpay and never reach our servers.</li>
        <li><strong>Technical data</strong>: your IP address, used briefly to enforce daily free-scan and abuse limits, and basic server logs.</li>
        <li><strong>Usage analytics</strong>: privacy-friendly, cookie-less page and event counts (Vercel Analytics). We never attach your resume or email to analytics events.</li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To score your resume and show suggestions — the core service you request.</li>
        <li>To run your account, save your scan history and provide Pro features you pay for.</li>
        <li>To send emails you ask for, such as password resets or your report.</li>
        <li>To prevent abuse, keep the service secure and fix problems.</li>
      </ul>
      <p>We do not sell your data, and we do not use your resume to train AI models.</p>

      <h2>Who processes it for us</h2>
      <ul>
        <li><strong>AI providers (OpenAI, Groq)</strong> — when AI features run, the relevant resume and job description text is sent to them to generate suggestions. Their API terms do not allow them to train on this data.</li>
        <li><strong>Razorpay</strong> — payments and subscriptions.</li>
        <li><strong>Resend</strong> — transactional email.</li>
        <li><strong>Hosting, database and analytics providers</strong> (such as Vercel, Render and Neon) that run our website and store data on our behalf.</li>
      </ul>

      <h2>How long we keep it</h2>
      <ul>
        <li>Scans run without an account are deleted automatically after 7 days.</li>
        <li>Scans in your account are kept until you delete them or your account.</li>
        <li>Payment records are kept as long as the law requires for tax and accounting.</li>
        <li>Rate-limit counters tied to your IP address expire within 24 hours.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use a small number of strictly necessary cookies: one that keeps you signed in, one that protects Google sign-in
        from forgery, and one that lets you reopen scans you ran before signing up. We do not use advertising cookies.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us to access, correct or delete your personal data, or withdraw consent, by emailing{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>. We respond within 30 days. If you are not satisfied
        with our response you can contact our grievance officer, {SITE.grievanceOfficer}, at the same address.
      </p>

      <h2>Security</h2>
      <p>
        Data is encrypted in transit (HTTPS), passwords are hashed, sign-in tokens live in secure http-only cookies, and access
        to production systems is restricted. No system is perfectly secure, so please don&apos;t include information in your
        resume that you would not share with an employer.
      </p>

      <h2>Children</h2>
      <p>The service is meant for job seekers aged 18 and above.</p>

      <h2>Changes and contact</h2>
      <p>
        We will post any changes on this page and update the date above. Questions? See our{" "}
        <Link href="/contact">contact page</Link>.
      </p>
    </LegalLayout>
  );
}
