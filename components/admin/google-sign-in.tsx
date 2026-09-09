"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleSignIn() {
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={signIn}
      disabled={loading}
      className="label-caps border border-espresso bg-espresso px-8 py-4 text-[12px] text-canvas transition-colors hover:bg-espresso-deep disabled:opacity-50"
    >
      {loading ? "Redirecionando…" : "Entrar com Google"}
    </button>
  );
}
