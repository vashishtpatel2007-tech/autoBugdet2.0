"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const signup = async () => {
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/auth/login"); // after signup redirect to login
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-[#0e1118] p-6 rounded-xl border border-gray-700">
        <h1 className="text-2xl mb-6 font-semibold text-center">Sign Up</h1>

        <label>Email</label>
        <input
          type="email"
          className="w-full p-3 rounded bg-gray-800 mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          className="w-full p-3 rounded bg-gray-800 mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p className="text-red-400 mb-3">{errorMsg}</p>}

        <button
          onClick={signup}
          className="w-full py-3 bg-green-500 text-black rounded-xl font-semibold"
        >
          Create Account
        </button>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/auth/login" className="text-green-400 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
