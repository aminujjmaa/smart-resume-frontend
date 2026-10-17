import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get help with SmartResume AI — billing, refunds, account and privacy requests.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us" intro="We're a small team and read every message. We usually reply within one business day.">
      <h2>Email</h2>
      <p>
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> — for billing, refunds, account help, privacy and data
        deletion requests.
      </p>

      <h2>Business details</h2>
      <ul>
        <li><strong>Operated by:</strong> {SITE.legalName}</li>
        <li><strong>Address:</strong> {SITE.address}</li>
        <li><strong>Phone:</strong> {SITE.phone}</li>
        <li><strong>Grievance officer:</strong> {SITE.grievanceOfficer}</li>
      </ul>

      <h2>Helpful links</h2>
      <ul>
        <li><Link href="/refund-policy">Refund & cancellation policy</Link></li>
        <li><Link href="/privacy">Privacy policy</Link></li>
        <li><Link href="/terms">Terms of service</Link></li>
      </ul>
    </LegalLayout>
  );
}
