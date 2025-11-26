"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleMagicLink() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: "http://localhost:3000/"
      }
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Magic link sent! Check your email.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-md">

        <h1 className="text-2xl font-bold mb-4 text-center">
          Login with Magic Link
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-slate-700 border border-slate-600 mb-3"
        />

        <button
          onClick={handleMagicLink}
          className="w-full p-3 bg-blue-600 rounded hover:bg-blue-700"
        >
          Send Magic Link
        </button>

        {message && (
          <p className="text-center text-gray-300 mt-3">{message}</p>
        )}
      </div>
    </div>
  );
}
