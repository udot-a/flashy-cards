import { auth } from "@clerk/nextjs/server";
import { SignedOutRedirect } from "@/components/signed-out-redirect";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <>
      <SignedOutRedirect href="/" />
      {children}
    </>
  );
}
