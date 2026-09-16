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
      title="Entrar no painel com uma conta Google autorizada"
      aria-label="Entrar com Google"
      className="btn btn-primary disabled:opacity-50"
    >
      {loading ? "Redirecionando…" : "Entrar com Google"}
    </button>
  );
}
