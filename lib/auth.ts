import { cookies } from "next/headers";

export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_TOKEN)?.value;
}

export async function getAuthHeaders() {
  const token = await getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
