"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

function setAuthCookies(data: {
  accessToken: string;
  refreshToken: string;
}) {
  const store = cookies();
  store.set(ACCESS_TOKEN, data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60,
    path: "/",
  });
  store.set(REFRESH_TOKEN, data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

function clearAuthCookies() {
  const store = cookies();
  store.delete(ACCESS_TOKEN);
  store.delete(REFRESH_TOKEN);
}

async function post(url: string, body?: any, token?: string) {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: normalizeError(data),
        status: res.status,
      };
    }

    return { success: true, data };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
      status: 0,
    };
  }
}

async function get(url: string, token?: string) {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: normalizeError(data),
        status: res.status,
      };
    }

    return { success: true, data };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
      status: 0,
    };
  }
}

function normalizeError(body: any): string {
  if (!body) return "Something went wrong";
  if (typeof body.message === "string") return body.message;
  if (Array.isArray(body.message)) return body.message.join(", ");
  return body.error || "Request failed";
}

export async function register(data: {
  email: FormDataEntryValue | null;
  firstName: FormDataEntryValue | null;
  lastName: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  role?: FormDataEntryValue | null;
}) {
  const result = await post("/auth/register", {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    password: data.password,
    role: data.role || "JOB_SEEKER",
  });

  if (result.success && result.data?.accessToken) {
    setAuthCookies(result.data);
  }

  return result;
}

export async function login(data: {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}) {
  const result = await post("/auth/login", {
    email: data.email,
    password: data.password,
  });

  if (result.success && result.data?.accessToken) {
    setAuthCookies(result.data);
  }

  return result;
}

export async function logoutAction() {
  const token = cookies().get(ACCESS_TOKEN)?.value;
  if (token) {
    await post("/auth/logout", undefined, token);
  }
  clearAuthCookies();
  redirect("/");
}

export async function getSession() {
  const token = cookies().get(ACCESS_TOKEN)?.value;
  if (!token) return null;

  const result = await get("/auth/me", token);
  if (!result.success) return null;

  return result.data;
}

export async function refreshToken(data: { refreshToken: string }) {
  return post("/auth/refresh", data);
}

export async function getMe(token: string) {
  return get("/auth/me", token);
}

export async function verifyEmail(data: { token: string }) {
  return post("/auth/verify-email", data);
}

export async function forgotPassword(data: { email: string }) {
  return post("/auth/forgot-password", data);
}

export async function resetPassword(data: {
  token: string;
  newPassword: string;
}) {
  return post("/auth/reset-password", data);
}
