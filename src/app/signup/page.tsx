import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth/server";
import { SignupForm } from "./SignupForm";

export const metadata = {
  title: "Sign up — Sideout",
  description: "Create your Sideout loyalty account.",
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function SignupPage({ searchParams }: Props) {
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
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/assets/sideout_logo.png"
            alt="Sideout"
            width={140}
            height={42}
            className="h-8 w-auto object-contain"
          />
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-normal tracking-tight">Sign up</h1>
          <p className="mt-2 text-sm text-sideout-green/80">
            Create an account with your username and password. Add an optional email to receive news, events, and promos.
          </p>
          <SignupForm redirectTo={next} errorParam={errorParam} />
          <p className="mt-6 text-sm text-sideout-green/70">
            Already have an account?{" "}
            <Link
              href={next === "/dashboard" ? "/login" : `/login?next=${encodeURIComponent(next)}`}
              className="text-sideout-green font-medium underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
