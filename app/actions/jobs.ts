'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
console.log('API_URL:', API_URL);
// helper for auth
async function getAuthHeaders() {
  // If you're using cookies (recommended in App Router)
  // you can replace this with next/headers cookies()
  return {
    'Content-Type': 'application/json',
  };
}

// =========================
// CREATE JOB
// =========================
export async function createJob(data: any) {
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
        message: "Create a company profile before posting jobs"
      };
    }

    return {
      success: true,
      data: body,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
    };
  }
}
// =========================
// GET ALL JOBS (PUBLIC)
// =========================
export async function getJobs(params?: {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  location?: string;
  type?: string;
}) {
  const query = new URLSearchParams();

  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));
  if (params?.q) query.append('q', params.q);
  if (params?.category) query.append('category', params.category);
  if (params?.location) query.append('location', params.location);
  if (params?.type) query.append('type', params.type);

  const res = await fetch(`${API_URL}/jobs?${query.toString()}`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch jobs');
  }

  return res.json();
}

// =========================
// GET SINGLE JOB
// =========================
export async function getJobById(id: string) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Job not found');
  }

  return res.json();
}

// =========================
// UPDATE JOB
// =========================
export async function updateJob(id: string, data: any) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'PATCH',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to update job');
  }

  return res.json();
}

// =========================
// DELETE / ARCHIVE JOB
// =========================
export async function deleteJob(id: string) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to delete job');
  }

  return res.json();
}

// =========================
// GET COMPANY JOBS
// =========================
export async function getMyJobs() {
  const res = await fetch(`${API_URL}/jobs/company/my-jobs`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch company jobs');
  }

  return res.json();
}

// =========================
// GET CATEGORIES
// =========================
export async function getJobCategories() {
  const res = await fetch(`${API_URL}/jobs/categories`, {
    method: 'GET',
    cache: 'force-cache',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}