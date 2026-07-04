"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/app/actions/auth";

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = await register({
      email: formData.get("email"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      password: formData.get("password"),
      // role: formData.get("role") || "JOB_SEEKER",
    });

    setLoading(false);
    if (!result?.success) {
      setError(result.message || "Registration failed");
      return;
    }

    setSuccess("Account created successfully!");

    form.reset();
    router.refresh();
    setTimeout(() => {
      router.push("/jobs");
    }, 800);
  }

  return (
    <div className="container-page py-20">
      <h1 className="text-center text-3xl font-bold">Signup</h1>

      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md space-y-4">
        {/* ERROR */}
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 h-10 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* FIRST NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            required
            className="mt-1 h-10 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* LAST NAME */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            required
            className="mt-1 h-10 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="mt-1 h-10 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* ROLE
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            name="role"
            className="mt-1 h-10 px-3 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="JOB_SEEKER">Job Seeker</option>
            <option value="EMPLOYER">Employer</option>
          </select>
        </div> */}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-green-600 py-2 px-4 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      {/* LOGIN LINK */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}