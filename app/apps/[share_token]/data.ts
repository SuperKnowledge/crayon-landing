import { headers } from "next/headers";

export type PublicApp = {
  app_id: string;
  publication_id: string;
  share_token: string;
  title: string;
  description: string | null;
  author_email?: string;
  author_name: string;
  icon_url: string | null;
  is_forkable: boolean;
  published_at: string;
  version_number: number;
};

const BACKEND_BY_HOST: Record<string, string> = {
  "crayon-ai.com": "https://api.crayon-ai.com",
  "staging.crayon-ai.com": "https://staging.api.crayon-ai.com",
  "dev.crayon-ai.com": "https://dev.api.crayon-ai.com",
};

export function normalizeHost(host: string | null): string | null {
  if (!host) return null;
  return host.trim().toLowerCase().split(":")[0] || null;
}

export function backendForHost(host: string | null): string | null {
  const normalized = normalizeHost(host);
  return normalized ? BACKEND_BY_HOST[normalized] ?? null : null;
}

export async function currentShareHost(): Promise<string | null> {
  const headerList = await headers();
  return normalizeHost(headerList.get("host"));
}

export async function fetchPublicApp(
  shareToken: string,
  host: string | null,
): Promise<{ app: PublicApp | null; status: number }> {
  const backendBaseURL = backendForHost(host);
  if (!backendBaseURL) {
    return { app: null, status: 404 };
  }

  let response: Response;
  try {
    response = await fetch(
      `${backendBaseURL}/api/public/${encodeURIComponent(shareToken)}`,
      {
        // Shared links should reflect publish/unpublish changes quickly.
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(5000),
      },
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return { app: null, status: 504 };
    }
    return { app: null, status: 502 };
  }

  if (!response.ok) {
    return { app: null, status: response.status };
  }

  return { app: (await response.json()) as PublicApp, status: response.status };
}

export function appStoreURL(): string {
  return process.env.NEXT_PUBLIC_APP_STORE_URL || "https://apps.apple.com/";
}

export function appStoreID(): string | null {
  return process.env.NEXT_PUBLIC_APP_STORE_ID || null;
}

export function shareURL(host: string, shareToken: string): string {
  return `https://${host}/apps/${encodeURIComponent(shareToken)}`;
}
