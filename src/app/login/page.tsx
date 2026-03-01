import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/server";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Sign in — Sideout",
  description: "Sign in to your Sideout loyalty account.",
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = params.next ?? "/dashboard";
  const errorParam = params.error;

  const session = await getSession();
  if (session) {
    redirect(next);
  }

  return (
    <div className="min-h-screen bg-sideout-beige text-sideout-green flex flex-col">
      <header className="px-6 py-6 md:px-12 lg:px-24">
        <Link href="/" className="text-xl font-normal tracking-tight">
          Sideout
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-normal tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-sideout-green/80">
            Use your username or email and password to access your loyalty card.
          </p>
          <LoginForm redirectTo={next} errorParam={errorParam} />
          <p className="mt-6 text-sm text-sideout-green/70">
            Don&apos;t have an account?{" "}
            <Link
              href={next === "/dashboard" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`}
              className="text-sideout-green font-medium underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
