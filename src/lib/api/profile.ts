import { apiRequest } from "@/lib/api/client";

export type CustomerProfile = {
  username: string | null;
  display_name: string | null;
  email: string | null;
};

export async function updateProfile(
  username: string,
  token: string,
): Promise<CustomerProfile> {
  return apiRequest<CustomerProfile>("/me/profile", {
    method: "PATCH",
    body: { username },
    token,
  });
}
