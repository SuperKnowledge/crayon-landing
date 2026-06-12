import crypto from "crypto";

export const DECK_AUTH_COOKIE = "crayon_deck_auth";
export const DECK_COOKIE_MAX_AGE_SECONDS = 60;

export type DeckSession = {
  email: string;
  iat: number;
  exp: number;
};

function cookieSecret(): string {
  return process.env.DECK_COOKIE_SECRET || process.env.DECK_PASSWORD || "";
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string): string {
  const secret = cookieSecret();
  if (!secret) {
    throw new Error("Deck cookie secret is not configured");
  }

  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function isValidDeckPassword(candidate: string): boolean {
  const configured = process.env.DECK_PASSWORD || "";
  if (!configured) {
    return false;
  }

  return safeEqual(candidate, configured);
}

export function createDeckSession(email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const session: DeckSession = {
    email: email.trim().toLowerCase(),
    iat: now,
    exp: now + DECK_COOKIE_MAX_AGE_SECONDS,
  };
  const payload = encodeBase64Url(JSON.stringify(session));

  return `${payload}.${sign(payload)}`;
}

export function verifyDeckSession(value: string | undefined): DeckSession | null {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");
  if (!payload || !signature) {
    return null;
  }

  let expectedSignature: string;
  try {
    expectedSignature = sign(payload);
  } catch {
    return null;
  }

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const session = JSON.parse(decodeBase64Url(payload)) as Partial<DeckSession>;
    if (
      typeof session.email !== "string" ||
      typeof session.iat !== "number" ||
      typeof session.exp !== "number"
    ) {
      return null;
    }
    if (session.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      email: session.email,
      iat: session.iat,
      exp: session.exp,
    };
  } catch {
    return null;
  }
}
