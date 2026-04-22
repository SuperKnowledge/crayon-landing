import type { Metadata } from "next";
import Link from "next/link";
import {
  appStoreID,
  appStoreURL,
  currentShareHost,
  fetchPublicApp,
  shareURL,
} from "./data";

type PageProps = {
  params: Promise<{ share_token: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { share_token: shareToken } = await params;
  const host = await currentShareHost();
  const { app } = await fetchPublicApp(shareToken, host);

  if (!app || !host) {
    return {
      title: "Shared app not found | Crayon",
      description: "This Crayon app link is unavailable.",
    };
  }

  const title = `${app.title} | Crayon`;
  const description =
    app.description || `Open ${app.title}, a Crayon app by ${app.author_name}.`;
  const url = shareURL(host, shareToken);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${url}/opengraph-image`],
    },
    other: appStoreID()
      ? {
          "apple-itunes-app": `app-id=${appStoreID()}, app-argument=${url}`,
        }
      : undefined,
  };
}

export default async function SharedAppPage({ params }: PageProps) {
  const { share_token: shareToken } = await params;
  const host = await currentShareHost();
  const { app } = await fetchPublicApp(shareToken, host);
  const url = host ? shareURL(host, shareToken) : null;

  if (!app || !host || !url) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
        <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
            ?
          </div>
          <h1 className="font-display text-4xl font-bold">Link not found</h1>
          <p className="mt-4 text-lg text-white/60">
            This Crayon app link is unavailable or belongs to another environment.
          </p>
          <Link
            href="/"
            className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Back to Crayon
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
          {app.icon_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={app.icon_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-display text-4xl font-bold gradient-text">
              {app.title.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
          Crayon app
        </p>
        <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">
          {app.title}
        </h1>
        <p className="mt-4 text-base text-white/50">by {app.author_name}</p>

        {app.description ? (
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70">
            {app.description}
          </p>
        ) : null}

        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            href={appStoreURL()}
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Get the Crayon app
          </Link>
          <p className="max-w-sm text-sm text-white/40">
            Open this link on a device with Crayon installed to launch the app directly.
          </p>
        </div>
      </section>
    </main>
  );
}
