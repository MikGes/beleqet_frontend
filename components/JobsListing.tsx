"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { getJobs, getJobCategories } from "@/app/actions/jobs";
import JobCard from "@/components/JobCard";

const jobTypes = [
  "FULL_TIME",
  "PART_TIME",
  "REMOTE",
  "HYBRID",
  "ON_SITE",
  "CONTRACT",
];

export default function JobsListing() {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("loc") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? ""
  );
  const [type, setType] = useState<string>("");

  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // NORMALIZERS
  // =========================
  function normalizeJobs(data: any): any[] {
    if (!data) return [];
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.jobs)) return data.jobs;
    if (Array.isArray(data)) return data;
    return [];
  }

  function normalizeCategories(data: any): any[] {
    if (!data) return [];
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }

  // =========================
  // LOAD JOBS
  // =========================
  async function loadJobs() {
    setLoading(true);

    try {
      const data = await getJobs({
        q: query,
        location,
        category,
        type,
      });

      setJobs(normalizeJobs(data));
    } catch (err) {
      console.error("Failed to load jobs", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // LOAD CATEGORIES
  // =========================
  async function loadCategories() {
    try {
      const data = await getJobCategories();
      setCategories(normalizeCategories(data));
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadJobs();
  }, [query, location, category, type]);

  const safeJobs = Array.isArray(jobs) ? jobs : [];

  return (
    <div className="container-page py-10">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-pageH1">
          Search verified jobs from trusted employers.
        </h1>
        <p className="text-muted text-sm mt-2">
          {loading ? "Loading..." : `${safeJobs.length} jobs found`}
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-border p-2 flex flex-col sm:flex-row gap-2 mb-8">
        <div className="flex items-center flex-1 gap-2 px-3 py-2.5">
          <Search className="h-4 w-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job title, keyword or company"
            className="w-full text-sm outline-none"
          />
        </div>

        <div className="hidden sm:block w-px bg-border my-1" />

        <div className="flex items-center flex-1 gap-2 px-3 py-2.5">
          <MapPin className="h-4 w-4 text-muted" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full text-sm outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* FILTERS */}
        <aside className="space-y-6">
          {/* CATEGORY */}
          <div className="rounded-xl border bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-4">
              <SlidersHorizontal className="h-4 w-4" />
              Category
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setCategory("")}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg ${
                  category === ""
                    ? "bg-green-100 text-green-700 font-semibold"
                    : ""
                }`}
              >
                All Categories
              </button>

              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg ${
                    category === cat.id
                      ? "bg-green-100 text-green-700 font-semibold"
                      : ""
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* TYPE */}
          <div className="rounded-xl border bg-white p-5">
            <h3 className="text-sm font-semibold mb-4">Job Type</h3>

            <div className="space-y-2">
              <button
                onClick={() => setType("")}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg ${
                  type === "" ? "bg-green-100 text-green-700 font-semibold" : ""
                }`}
              >
                All Types
              </button>

              {jobTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg ${
                    type === t ? "bg-green-100 text-green-700 font-semibold" : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* JOB LIST */}
        <div>
          {safeJobs.length === 0 ? (
            <div className="p-12 text-center border rounded-xl">
              <p className="font-semibold">No jobs match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safeJobs.map((job: any) => (
                <JobCard
                  key={job.id}
                  job={{
                    ...job,

                    // 🔥 FIX OBJECT RENDER BUG HERE
                    company: job.company?.name || "Unknown Company",

                    category: job.category?.label || "",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}