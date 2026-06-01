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

function apiBase(): string {
  return (
    process.env.CRAYON_API_BASE ||
    process.env.NEXT_PUBLIC_CRAYON_API_BASE ||
    "http://localhost:8000/api"
  ).replace(/\/+$/, "");
}

function errorResponse(detail: string, status = 400) {
  return NextResponse.json({ detail }, { status });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const state = typeof body?.state === "string" ? body.state.trim() : "";
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

  const signinResponse = await fetch(`${apiBase()}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

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

  const issueResponse = await fetch(`${apiBase()}/auth/cli/issue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ state, refresh_token: refreshToken }),
    cache: "no-store",
  });

  const issueData = await issueResponse.json().catch(() => ({}));
  if (!issueResponse.ok) {
    return errorResponse(
      typeof issueData.detail === "string" ? issueData.detail : "Unable to issue CLI login code",
      issueResponse.status,
    );
  }

  return NextResponse.json({
    code: issueData.code,
    callback_url: issueData.callback_url,
    user: signinData.user,
  });
}
