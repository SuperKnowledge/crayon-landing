import fs from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import ClearDeckSessionOnLoad from "@/components/ClearDeckSessionOnLoad";
import DeckLoginForm from "@/components/DeckLoginForm";
import DisableContextMenu from "@/components/DisableContextMenu";
import {
  DECK_AUTH_COOKIE,
  shouldPersistDeckSession,
  verifyDeckSession,
} from "@/lib/deck-auth";
import { clientIpFromHeaders, logDeckEvent } from "@/lib/deck-tracking";
import { renderSimpleMarkdown } from "@/lib/simple-markdown";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Crayon One-Pager",
  robots: {
    index: false,
    follow: false,
  },
};

async function readOnePagerMarkdown(): Promise<string> {
  const filePath = path.join(process.cwd(), "content", "one-pager.md");
  return fs.readFile(filePath, "utf8");
}

export default async function OnePagerPage() {
  const cookieStore = await cookies();
  const session = verifyDeckSession(cookieStore.get(DECK_AUTH_COOKIE)?.value);

  if (!session) {
    return (
      <DeckLoginForm
        buttonLabel="View one-pager"
        resourceLabel="the one-pager"
        title="Investor One-Pager"
      />
    );
  }

  const headerList = await headers();
  await logDeckEvent({
    event: "page_view",
    email: session.email,
    path: "/one-pager",
    resource: "one_pager",
    userAgent: headerList.get("user-agent") || "",
    referrer: headerList.get("referer") || "",
    ip: clientIpFromHeaders(headerList),
  });

  const markdown = await readOnePagerMarkdown();

  return (
    <main className="one-pager-page">
      <ClearDeckSessionOnLoad enabled={!shouldPersistDeckSession()} />
      <DisableContextMenu />
      <article className="one-pager-document">
        <p className="one-pager-confidential">Confidential · Do not distribute</p>
        {renderSimpleMarkdown(markdown)}
      </article>
    </main>
  );
}
