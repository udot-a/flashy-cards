import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignedInRedirect } from "@/components/signed-in-redirect";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4">
      <SignedInRedirect href="/dashboard" />
      <main className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          FlashyCardy
        </h1>
        <p className="mt-3 max-w-md text-lg text-muted-foreground">
          Your personal flashcard platform
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button variant="outline" size="default">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="default">Sign up</Button>
          </SignUpButton>
        </div>
      </main>
    </div>
  );
}
