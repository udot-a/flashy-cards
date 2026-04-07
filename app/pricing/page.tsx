import { PricingTable } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Plans and features for Flashy Cards',
};

export default function PricingPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Pricing
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choose the plan that fits your study goals.
          </p>
        </header>
        <PricingTable
          ctaPosition="bottom"
          newSubscriptionRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
