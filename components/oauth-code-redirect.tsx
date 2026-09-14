"use client";

import { useEffect } from "react";

/** Google's OAuth redirect sometimes lands on whatever Site URL is configured
    in Supabase instead of our /auth/callback route (a dashboard-config
    quirk, not something the app controls) — landing here with `?code=`
    still in the URL means the PKCE exchange never ran. Forward it to the
    real handler so login still completes and lands on /admin. */
export function OAuthCodeRedirect() {
  useEffect(() => {
    if (window.location.pathname === "/auth/callback") return;
    if (new URLSearchParams(window.location.search).has("code")) {
      window.location.replace(`/auth/callback${window.location.search}`);
    }
  }, []);

  return null;
}
