import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "SmartResume AI is a fully online service. Pro access is delivered instantly after payment.",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <LegalLayout
      title="Shipping & Delivery Policy"
      intro={`${SITE.name} is a software service delivered entirely online. Nothing is shipped physically.`}
    >
      <h2>Delivery of Pro</h2>
      <ul>
        <li>Pro features unlock on your account as soon as Razorpay confirms your payment — usually within seconds.</li>
        <li>Monthly renewals keep access running automatically; there is nothing to collect or install.</li>
        <li>Downloads you create (PDF, DOCX) are generated instantly in your browser or by our servers.</li>
      </ul>

      <h2>If access doesn&apos;t appear</h2>
      <p>
        Refresh the Billing page after a minute. If Pro still isn&apos;t active, email{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> with your Razorpay payment ID and we&apos;ll fix it within
        one business day — or refund you under our <Link href="/refund-policy">refund policy</Link>.
      </p>
    </LegalLayout>
  );
}
