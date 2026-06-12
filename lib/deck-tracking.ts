export type DeckEventName = "page_view";

export type DeckTrackingEvent = {
  event: DeckEventName;
  email: string;
  path?: string;
  userAgent?: string;
  referrer?: string;
  ip?: string;
};

export async function logDeckEvent(event: DeckTrackingEvent): Promise<void> {
  const googleScriptUrl = process.env.DECK_GOOGLE_SCRIPT_URL;
  const payload = {
    timestamp: new Date().toISOString(),
    ...event,
  };

  if (!googleScriptUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Deck tracking event:", payload);
    }
    return;
  }

  try {
    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("Deck tracking request failed", {
        status: response.status,
        statusText: response.statusText,
        body: body.slice(0, 1000),
      });
    }
  } catch (error) {
    console.error("Deck tracking error:", error);
  }
}

export function clientIpFromHeaders(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",", 1)[0]?.trim() || "";
  }

  return headers.get("x-real-ip") || "";
}
