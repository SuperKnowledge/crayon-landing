import { NextResponse } from "next/server";

type BackendAuthResponse = {
  user?: {
    id?: string;
    email?: string;
  };
  tokens?: {
    access_token?: string;
    refresh_token?: string;
  };
  detail?: string;
};

const DEFAULT_ALLOWED_API_BASES = [
  "https://api.crayon-ai.com/api",
  "https://staging.api.crayon-ai.com/api",
  "https://dev.api.crayon-ai.com/api",
  "http://localhost:8000/api",
];

function normalizeApiBase(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function allowedApiBases(): Set<string> {
  const configured = process.env.CLI_LOGIN_ALLOWED_API_BASES;
  const values = configured
    ? configured.split(",").map(normalizeApiBase).filter(Boolean)
    : DEFAULT_ALLOWED_API_BASES;
  return new Set(values);
}

function apiBase(requestedApiBase: string): string {
  const requested = normalizeApiBase(requestedApiBase);
  if (requested) {
    if (!allowedApiBases().has(requested)) {
      throw new Error("CLI login API environment is not allowed");
    }
    return requested;
  }

  const configured = process.env.CRAYON_API_BASE || process.env.NEXT_PUBLIC_CRAYON_API_BASE;
  if (!configured && process.env.NODE_ENV === "production") {
    throw new Error("CRAYON_API_BASE is not configured for CLI login");
  }
  const fallback = normalizeApiBase(configured || "http://localhost:8000/api");
  if (!allowedApiBases().has(fallback)) {
    throw new Error("Configured CLI login API environment is not allowed");
  }
  return fallback;
}

function errorResponse(detail: string, status = 400) {
  return NextResponse.json({ detail }, { status });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const state = typeof body?.state === "string" ? body.state.trim() : "";
  const requestedApiBase = typeof body?.api_base === "string" ? body.api_base : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!state) {
    return errorResponse("Missing CLI login state");
  }
  if (!email) {
    return errorResponse("Email is required");
  }
  if (!password) {
    return errorResponse("Password is required");
  }

  let baseUrl: string;
  try {
    baseUrl = apiBase(requestedApiBase);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "CLI login API is not configured", 500);
  }

  let signinResponse: Response;
  try {
    signinResponse = await fetch(`${baseUrl}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return errorResponse(`Unable to reach Crayon API at ${baseUrl}`, 502);
  }

  const signinData = (await signinResponse.json().catch(() => ({}))) as BackendAuthResponse;
  if (!signinResponse.ok) {
    return errorResponse(
      typeof signinData.detail === "string" ? signinData.detail : "Unable to sign in",
      signinResponse.status,
    );
  }

  const accessToken = signinData.tokens?.access_token;
  const refreshToken = signinData.tokens?.refresh_token;
  if (!accessToken || !refreshToken) {
    return errorResponse("Sign-in response did not include usable tokens", 502);
  }

  let issueResponse: Response;
  try {
    issueResponse = await fetch(`${baseUrl}/auth/cli/issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ state, refresh_token: refreshToken }),
      cache: "no-store",
    });
  } catch {
    return errorResponse(`Unable to reach Crayon API at ${baseUrl}`, 502);
  }

  const issueData = await issueResponse.json().catch(() => ({}));
  if (!issueResponse.ok) {
    return errorResponse(
      typeof issueData.detail === "string" ? issueData.detail : "Unable to issue CLI login code",
      issueResponse.status,
    );
  }

  if (typeof issueData.code !== "string" || typeof issueData.callback_url !== "string") {
    return errorResponse("CLI login issue response was missing code or callback_url", 502);
  }

  return NextResponse.json({
    code: issueData.code,
    callback_url: issueData.callback_url,
    user: signinData.user,
  });
}
