import { apiRequest } from "@/lib/api/client";

export const STAPPL_URL = "https://stapplinc.com/";

export async function recordStapplClick(
  path: string,
  token: string | null,
): Promise<void> {
  try {
    await apiRequest<Record<string, never>>("/events/outbound-link", {
      method: "POST",
      body: { path, destination: STAPPL_URL },
      token,
      keepalive: true,
    });
  } catch {
    // A failed log must not block the link.
  }
}
