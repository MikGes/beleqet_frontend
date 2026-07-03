"use server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// ========================
// SAFE POST (NO THROW)
// ========================
async function post(url: string, body: any) {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
      status: 0,
    };
  }
}

// ========================
// SAFE GET
// ========================
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

    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      message: "Network error. Please try again.",
      status: 0,
    };
  }
}

// ========================
// ERROR NORMALIZER
// ========================
function normalizeError(body: any): string {
  if (!body) return "Something went wrong";

  // NestJS string error
  if (typeof body.message === "string") {
    return body.message;
  }

  // NestJS validation array
  if (Array.isArray(body.message)) {
    return body.message.join(", ");
  }

  return body.error || "Request failed";
}

// ========================
// AUTH ACTIONS
// ========================
export const register = (data: any) => post("/auth/register", data);

export const login = (data: any) => post("/auth/login", data);

export const refreshToken = (data: any) =>
  post("/auth/refresh", data);

export const logout = (userId: string) =>
  post("/auth/logout", { userId });

export const getMe = (token: string) =>
  get("/auth/me", token);

export const verifyEmail = (data: any) =>
  post("/auth/verify-email", data);

export const forgotPassword = (data: any) =>
  post("/auth/forgot-password", data);

export const resetPassword = (data: any) =>
  post("/auth/reset-password", data);