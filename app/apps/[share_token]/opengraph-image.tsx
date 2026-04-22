import { ImageResponse } from "next/og";
import { currentShareHost, fetchPublicApp } from "./data";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ share_token: string }>;
};

function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

async function imageDataURL(url: string): Promise<string | null> {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;

    const response = await fetch(parsed, {
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return null;

    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (let index = 0; index < bytes.length; index += 1) {
      binary += String.fromCharCode(bytes[index]);
    }
    return `data:${contentType};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: ImageProps) {
  const { share_token: shareToken } = await params;
  const host = await currentShareHost();
  const { app } = await fetchPublicApp(shareToken, host);

  const title = truncate(app?.title || "Crayon", 60);
  const author = app?.author_name ? `by ${app.author_name}` : "Shared app";
  const description = truncate(app?.description || "Create your own apps", 120);
  const iconSrc = app?.icon_url ? await imageDataURL(app.icon_url) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
          color: "white",
          padding: 72,
          position: "relative",
          overflow: "hidden",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: 520,
            background: "rgba(255, 98, 87, 0.22)",
            filter: "blur(90px)",
            top: -180,
            left: -120,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 540,
            height: 540,
            borderRadius: 540,
            background: "rgba(120, 119, 255, 0.25)",
            filter: "blur(100px)",
            right: -140,
            bottom: -180,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                width: 132,
                height: 132,
                borderRadius: 32,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                fontSize: 64,
                fontWeight: 800,
              }}
            >
              {iconSrc ? (
                <img
                  src={iconSrc}
                  alt=""
                  width={132}
                  height={132}
                  style={{ width: 132, height: 132, objectFit: "cover" }}
                />
              ) : (
                title.slice(0, 1).toUpperCase()
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 30,
                  color: "rgba(255,255,255,0.52)",
                  letterSpacing: 6,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Crayon app
              </div>
              <div style={{ marginTop: 10, fontSize: 32, color: "rgba(255,255,255,0.7)" }}>
                {author}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                fontSize: title.length > 28 ? 70 : 86,
                fontWeight: 900,
                lineHeight: 1.03,
                maxWidth: 980,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 32,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.68)",
                maxWidth: 980,
              }}
            >
              {description}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
