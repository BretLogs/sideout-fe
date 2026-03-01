import { redirect } from "next/navigation";

export default function LoginPage() {
  redirect("/login?next=/dashboard");
}
