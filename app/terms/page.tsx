import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { SITE } from "@/lib/site";
import { PRO_PERIOD, PRO_PRICE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using SmartResume AI, including Pro subscriptions, cancellations and acceptable use.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      intro={`These terms are an agreement between you and ${SITE.legalName}, which operates ${SITE.name} at ${SITE.url}. By using the service you agree to them.`}
    >
      <h2>The service</h2>
      <p>
        {SITE.name} analyses resumes against job descriptions and suggests improvements. Scores and suggestions are guidance
        based on automated checks; they are not a guarantee of interviews, job offers or how any particular employer&apos;s
        applicant tracking system will treat your application.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You must be at least 18 and give accurate information.</li>
        <li>Keep your login secure; you are responsible for activity on your account.</li>
        <li>You keep ownership of the resumes and content you submit. You give us permission to process them only to provide the service to you.</li>
      </ul>

      <h2>Acceptable use</h2>
      <ul>
        <li>Don&apos;t submit content you have no right to use, or content that is unlawful.</li>
        <li>Don&apos;t attempt to break, overload, scrape or reverse-engineer the service, or get around usage limits.</li>
        <li>Don&apos;t use generated content to misrepresent your qualifications — always check suggestions are true for you.</li>
      </ul>

      <h2>Pro subscription</h2>
      <ul>
        <li>Pro costs {PRO_PRICE} per {PRO_PERIOD}, billed through Razorpay, and renews automatically each {PRO_PERIOD} until cancelled.</li>
        <li>You can cancel anytime from the Billing page. Cancelling stops future renewals; Pro stays active until the end of the period already paid for.</li>
        <li>If a renewal payment fails, Razorpay retries it. If it still fails, Pro access ends until payment succeeds.</li>
        <li>We may change the price for future billing periods with at least 30 days&apos; notice by email.</li>
        <li>Refunds are covered by our <Link href="/refund-policy">refund policy</Link>.</li>
        <li>Fair-use limits apply to AI features to keep the service fast and affordable for everyone.</li>
      </ul>

      <h2>Availability and changes</h2>
      <p>
        We work to keep the service available but don&apos;t guarantee it will be uninterrupted or error-free. We may change or
        discontinue features; if we discontinue Pro we will refund the unused part of any paid period.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent permitted by law, the service is provided “as is”, and our total liability for any claim is limited to the
        amount you paid us in the 3 months before the claim. We are not liable for indirect or consequential losses, including
        lost job opportunities.
      </p>

      <h2>Termination</h2>
      <p>
        You can stop using the service and ask us to delete your account at any time. We may suspend accounts that break these
        terms.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India, and courts in {SITE.jurisdiction} have jurisdiction.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>. See also our{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>
    </LegalLayout>
  );
}
