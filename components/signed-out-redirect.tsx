"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** When session ends on the client (sign-out, other tab, etc.), leave protected UI. */
export function SignedOutRedirect({ href }: { href: string }) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || isSignedIn) return;
    router.replace(href);
  }, [href, isLoaded, isSignedIn, router]);

  return null;
}
