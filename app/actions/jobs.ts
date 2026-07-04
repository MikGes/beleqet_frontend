"use server";

import { getAuthHeaders } from "@/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export async function createJob(data: {
  title: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  location: FormDataEntryValue | null;
  type: FormDataEntryValue | null;
  categoryId: FormDataEntryValue | null;
}) {
  try {
    const res = await fetch(`${API_URL}/jobs`, {
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
            : "Create a company profile before posting jobs",
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

export async function getJobs(params?: {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  location?: string;
  type?: string;
}) {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.q) query.append("q", params.q);
  if (params?.category) query.append("category", params.category);
  if (params?.location) query.append("location", params.location);
  if (params?.type) query.append("type", params.type);

  const res = await fetch(`${API_URL}/jobs?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

export async function getJobById(id: string) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Job not found");
  }

  return res.json();
}

export async function updateJob(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to update job");
  }

  return res.json();
}

export async function deleteJob(id: string) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to delete job");
  }

  return res.json();
}

export async function getMyJobs() {
  const res = await fetch(`${API_URL}/jobs/my`, {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch company jobs");
  }

  return res.json();
}

export async function getJobCategories() {
  const res = await fetch(`${API_URL}/jobs/categories`, {
    method: "GET",
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}
