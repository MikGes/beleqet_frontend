"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const result = await login({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    setLoading(false);
    if (!result?.success) {
      setError(result?.message || "Invalid credentials");
      return;
    }
    router.refresh();
    router.push("/jobs");
  };

  return (
    <div className="container-page py-20">
      <h1 className="text-center text-3xl font-bold">Login</h1>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 max-w-md space-y-4"
      >
        {/* ERROR MESSAGE */}
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            type="email"
            name="email"
            id="email"
            required
            className="mt-1 h-10 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            type="password"
            name="password"
            id="password"
            required
            className="mt-1 h-10 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-green-600 py-2 px-4 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}