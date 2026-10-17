import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { SITE } from "@/lib/site";
import { PRO_PERIOD, PRO_PRICE, REFUND_WINDOW_DAYS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: `Cancel SmartResume AI Pro anytime. Full refund within ${REFUND_WINDOW_DAYS} days of your first payment.`,
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Refund & Cancellation Policy"
      intro={`Pro is a ${PRO_PRICE}/${PRO_PERIOD} subscription. You can cancel whenever you like, and your first payment is covered by a ${REFUND_WINDOW_DAYS}-day money-back guarantee.`}
    >
      <h2>Cancelling</h2>
      <ul>
        <li>Go to <strong>Dashboard → Billing</strong> and choose <strong>Cancel auto-renewal</strong>.</li>
        <li>No further payments are taken after you cancel.</li>
        <li>You keep Pro until the end of the {PRO_PERIOD} you already paid for.</li>
      </ul>

      <h2>Refunds</h2>
      <ul>
        <li>
          <strong>First payment:</strong> if Pro isn&apos;t right for you, email{" "}
          <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> within {REFUND_WINDOW_DAYS} days of your first payment
          for a full refund. We&apos;ll also cancel the subscription.
        </li>
        <li>
          <strong>Renewals:</strong> monthly renewals are not refunded, except where you were charged in error (for example,
          after you had already cancelled) or charged twice.
        </li>
        <li>Include the email on your account and the Razorpay payment ID (shown on the Billing page) in your request.</li>
      </ul>

      <h2>How refunds are paid</h2>
      <p>
        Approved refunds are issued through Razorpay to the original payment method within 5–7 business days. Your bank or
        UPI app may take a few extra days to show it.
      </p>

      <h2>Questions</h2>
      <p>
        See the <Link href="/terms">terms of service</Link> or <Link href="/contact">contact us</Link>.
      </p>
    </LegalLayout>
  );
}
