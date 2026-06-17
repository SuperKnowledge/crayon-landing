import crypto from "crypto";

export const DECK_AUTH_COOKIE = "crayon_deck_auth";
export const DECK_COOKIE_MAX_AGE_SECONDS = 60;
const DECK_PERSISTENT_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const DECK_EXPORT_TOKEN_MAX_AGE_SECONDS = 5 * 60;
const DECK_EXPORT_ALLOWED_EMAIL = "tonyhmzhang@gmail.com";

export type DeckSession = {
  email: string;
  iat: number;
  exp: number;
  purpose?: "session" | "export";
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

export function shouldPersistDeckSession(): boolean {
  return process.env.DECK_PERSIST_SESSION_COOKIE === "true";
}

export function deckSessionMaxAgeSeconds(): number {
  return shouldPersistDeckSession()
    ? DECK_PERSISTENT_COOKIE_MAX_AGE_SECONDS
    : DECK_COOKIE_MAX_AGE_SECONDS;
}

export function canExportDeck(email: string): boolean {
  return email.trim().toLowerCase() === DECK_EXPORT_ALLOWED_EMAIL;
}

function createDeckToken(email: string, maxAgeSeconds: number, purpose: DeckSession["purpose"]): string {
  const now = Math.floor(Date.now() / 1000);
  const session: DeckSession = {
    email: email.trim().toLowerCase(),
    iat: now,
    exp: now + maxAgeSeconds,
    purpose,
  };
  const payload = encodeBase64Url(JSON.stringify(session));

  return `${payload}.${sign(payload)}`;
}

export function createDeckSession(email: string): string {
  return createDeckToken(email, deckSessionMaxAgeSeconds(), "session");
}

export function createDeckExportToken(email: string): string {
  return createDeckToken(email, DECK_EXPORT_TOKEN_MAX_AGE_SECONDS, "export");
}

function verifyDeckToken(
  value: string | undefined,
  expectedPurpose: DeckSession["purpose"],
): DeckSession | null {
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
    if (session.purpose && session.purpose !== expectedPurpose) {
      return null;
    }
    if (!session.purpose && expectedPurpose !== "session") {
      return null;
    }
    if (session.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      email: session.email,
      iat: session.iat,
      exp: session.exp,
      purpose: session.purpose,
    };
  } catch {
    return null;
  }
}

export function verifyDeckSession(value: string | undefined): DeckSession | null {
  return verifyDeckToken(value, "session");
}

export function verifyDeckExportToken(value: string | undefined): DeckSession | null {
  return verifyDeckToken(value, "export");
}
