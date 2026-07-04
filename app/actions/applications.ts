"use server";

import { getAuthHeaders } from "@/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export async function submitApplication(data: {
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
}) {
  try {
    const res = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message:
          typeof body?.message === "string"
            ? body.message
            : Array.isArray(body?.message)
              ? body.message.join(", ")
              : "Failed to submit application",
      };
    }

    return { success: true, data: body };
  } catch {
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
    };
  }
}
