import Link from "next/link";
import JobCard from "./JobCard";
import { getJobs } from "@/app/actions/jobs";

export default async function FeaturedJobs() {
  const data = await getJobs({ limit: 20 });
  const items = data.items ?? [];
  const featured = items.filter((j: { featured?: boolean }) => j.featured);
  const jobs = featured.length > 0 ? featured.slice(0, 5) : items.slice(0, 5);

  return (
    <section className="bg-white border-y border-border">
      <div className="container-page py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-sectionH2">Featured Jobs</h2>
            <p className="text-muted text-sm mt-1">
              Fresh opportunities from companies hiring right now.
            </p>
          </div>

          <Link
            href="/jobs"
            className="hidden sm:inline-block text-sm font-semibold text-brandGreen hover:underline shrink-0"
          >
            View all jobs →
          </Link>
        </div>

        {jobs.length === 0 ? (
          <p className="text-muted text-sm">No jobs available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {jobs.map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
