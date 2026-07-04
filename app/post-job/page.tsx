"use client";

import { useEffect, useState } from "react";
import { createJob, getJobCategories } from "../actions/jobs";

const jobTypes = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "CONTRACT", label: "Contract" },
];

export default function PostJobPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getJobCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = await createJob({
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location"),
      type: formData.get("type"),
      categoryId: formData.get("categoryId"),
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message!);
      return;
    }

    setSuccess("Job posted successfully!");
    form.reset();
  }

  return (
    <div className="container-page py-16 max-w-2xl">
      <h1 className="text-pageH1">Post a Job</h1>

      <p className="text-muted mt-4 leading-relaxed">
        Reach thousands of verified job seekers across Ethiopia. Fill out the
        form below to publish your listing.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-border bg-white p-7 space-y-4"
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div>
          <label htmlFor="title" className="text-xs font-semibold text-ink">
            Job Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Senior Frontend Developer"
            className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="text-xs font-semibold text-ink">
              Job Type
            </label>

            <select
              id="type"
              name="type"
              required
              defaultValue="FULL_TIME"
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
            >
              {jobTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="text-xs font-semibold text-ink"
            >
              Category
            </label>

            <select
              id="categoryId"
              name="categoryId"
              required
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="location" className="text-xs font-semibold text-ink">
            Location
          </label>

          <input
            id="location"
            name="location"
            type="text"
            required
            placeholder="Addis Ababa"
            className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-xs font-semibold text-ink"
          >
            Job Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={5}
            required
            placeholder="Describe the job responsibilities, requirements, and qualifications..."
            className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brandGreen py-3 text-sm font-semibold text-white transition-colors hover:bg-darkGreen disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Publishing..." : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}
