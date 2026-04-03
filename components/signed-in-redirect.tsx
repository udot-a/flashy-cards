"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** When session becomes active on the client (e.g. after modal sign-in), navigate away. */
export function SignedInRedirect({ href }: { href: string }) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    router.replace(href);
  }, [href, isLoaded, isSignedIn, router]);

  return null;
}
