import { NextResponse } from "next/server";
import {
  createDeckSession,
  deckSessionMaxAgeSeconds,
  DECK_AUTH_COOKIE,
  isValidDeckPassword,
} from "@/lib/deck-auth";
import { clientIpFromHeaders } from "@/lib/deck-tracking";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const attemptsByIp = new Map<string, number[]>();

function errorResponse(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

function checkRateLimit(request: Request): NextResponse | null {
  const key = clientIpFromHeaders(request.headers) || "unknown";
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const attempts = (attemptsByIp.get(key) || []).filter((timestamp) => timestamp > cutoff);

  if (attempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
    attemptsByIp.set(key, attempts);
    return errorResponse("Too many attempts. Please retry in a minute.", 429);
  }

  attempts.push(now);
  attemptsByIp.set(key, attempts);
  return null;
}

export async function POST(request: Request) {
  try {
    const limited = checkRateLimit(request);
    if (limited) {
      return limited;
    }

    if (!process.env.DECK_PASSWORD) {
      return errorResponse("Investor access code is not configured.", 503);
    }

    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return errorResponse("Please enter a valid email address.");
    }

    if (!password) {
      return errorResponse("Please enter the access code.");
    }

    if (!isValidDeckPassword(password)) {
      return errorResponse("Incorrect access code.", 401);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: DECK_AUTH_COOKIE,
      value: createDeckSession(email),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: deckSessionMaxAgeSeconds(),
    });

    return response;
  } catch (error) {
    console.error("Investor material login error:", error);
    return errorResponse("Investor access is temporarily unavailable.", 500);
  }
}
