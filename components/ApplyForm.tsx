"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitApplication } from "@/app/actions/applications";

export default function ApplyForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const result = await submitApplication({
      jobId,
      coverLetter: formData.get("coverLetter") as string,
      resumeUrl: (formData.get("resumeUrl") as string) || undefined,
    });

    setLoading(false);

    if (!result.success) {
      if (result.message?.toLowerCase().includes("unauthorized")) {
        router.push("/login");
        return;
      }
      setError(result.message || "Failed to apply");
      return;
    }

    setSuccess("Application submitted successfully!");
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-full bg-brandGreen text-white text-sm font-semibold py-3 hover:bg-darkGreen transition-colors"
      >
        Apply Now
      </button>

      {success && (
        <p className="mt-2 text-sm text-green-700 text-center">{success}</p>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-bold text-ink">Apply for this job</h3>

            {error && (
              <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error.includes("Unauthorized") ? (
                  <>
                    Please{" "}
                    <Link href="/login" className="underline">
                      login
                    </Link>{" "}
                    to apply.
                  </>
                ) : (
                  error
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink">
                  Cover Letter
                </label>
                <textarea
                  name="coverLetter"
                  rows={5}
                  required
                  minLength={50}
                  placeholder="Tell the employer why you're a great fit..."
                  className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink">
                  Resume URL (optional)
                </label>
                <input
                  name="resumeUrl"
                  type="url"
                  placeholder="https://example.com/resume.pdf"
                  className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brandGreen"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full bg-brandGreen py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
