export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface SessionClaims {
  sub: string;
  email?: string;
  tenantId?: string;
  groups?: string[];
  tenantStatus?: "ACTIVE" | "BLOCKED" | "SUSPENDED";
}

export function generateVerifier(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export async function generateChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function buildCognitoAuthUrl(
  domain: string,
  clientId: string,
  redirectUri: string,
  codeChallenge: string,
): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid email profile",
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });
  return `https://${domain}/oauth2/authorize?${params}`;
}

export function getStoredToken(): string | null {
  try { return sessionStorage.getItem("portal_access_token"); } catch { return null; }
}

export function clearStoredSession(): void {
  try {
    sessionStorage.removeItem("portal_access_token");
    sessionStorage.removeItem("portal_id_token");
    sessionStorage.removeItem("pkce_verifier");
  } catch { /* ignore */ }
}
