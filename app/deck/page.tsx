import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import DeckLoginForm from "@/components/DeckLoginForm";
import DeckRevealShell from "@/components/DeckRevealShell";
import { DECK_AUTH_COOKIE, verifyDeckSession } from "@/lib/deck-auth";
import { clientIpFromHeaders, logDeckEvent } from "@/lib/deck-tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Crayon Investor Deck",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

function LifecycleBar({ mode }: { mode: "build" | "run" | "coverage" }) {
  const label =
    mode === "build"
      ? "Zooming into the 10% it takes to get built"
      : mode === "run"
        ? "Zooming into the 90% it takes to keep running"
        : "Coverage across the whole lifecycle";

  return (
    <figure className={`lifecycle-bar lifecycle-bar-${mode}`}>
      <figcaption>{label}</figcaption>
      <div className="lifecycle-track">
        <div className="lifecycle-segment prototype" />
        <div className="lifecycle-segment build" />
        <div className="lifecycle-segment run" />
      </div>
      <div className="lifecycle-labels">
        <span className="prototype">1% prototype</span>
        <span className="build">9% app plumbing</span>
        <span className="run">90% running forever</span>
      </div>
      {mode === "build" ? (
        <div className="lifecycle-zoom">
          <p>Built: 10%</p>
          <div>
            <span className="prototype">1% AI prototype</span>
            <span className="build">9% auth, data, deploy, integrations, testing</span>
          </div>
        </div>
      ) : null}
      {mode === "run" ? (
        <div className="run-breakdown">
          <span>Operations</span>
          <span>Distribution</span>
          <span>Observability</span>
          <span>Monetization</span>
          <span>Support</span>
        </div>
      ) : null}
      {mode === "coverage" ? (
        <div className="coverage-overlay">
          <span className="coverage-other">Other AI tools: prototype only</span>
          <span className="coverage-crayon">Crayon agent: whole lifecycle</span>
        </div>
      ) : null}
    </figure>
  );
}

function SlideTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <>
      {eyebrow ? <p className="slide-eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
    </>
  );
}

export default async function DeckPage() {
  const cookieStore = await cookies();
  const session = verifyDeckSession(cookieStore.get(DECK_AUTH_COOKIE)?.value);

  if (!session) {
    return <DeckLoginForm />;
  }

  const headerList = await headers();
  await logDeckEvent({
    event: "page_view",
    email: session.email,
    path: "/deck",
    userAgent: headerList.get("user-agent") || "",
    referrer: headerList.get("referer") || "",
    ip: clientIpFromHeaders(headerList),
  });

  return (
    <main className="deck-page">
      <DeckRevealShell>
        <section className="cover-slide">
          <Image
            className="cover-logo"
            src="/crayon_logo.png"
            alt="Crayon"
            width={72}
            height={72}
            priority
          />
          <h1>The infrastructure for software in the AI era</h1>
        </section>

        <section>
          <SlideTitle eyebrow="Setup" title="Let's build and run a real app in production" />
          <div className="split-layout">
            <div>
              <p className="lead">The example: a poker app.</p>
              <ul className="text-list">
                <li>Track buy-ins and cash-outs</li>
                <li>Calculate optimized payout at the end of a session</li>
                <li>20 minutes later: a working prototype</li>
              </ul>
            </div>
            <div className="mockup-card">
              <div className="mockup-header">Friday Poker</div>
              <div className="mockup-row">
                <span>Tony</span>
                <strong>+$120</strong>
              </div>
              <div className="mockup-row">
                <span>Maya</span>
                <strong>-$40</strong>
              </div>
              <div className="mockup-row">
                <span>Alex</span>
                <strong>-$80</strong>
              </div>
            </div>
          </div>
          <p className="hook">What&apos;s next?</p>
        </section>

        <section>
          <SlideTitle eyebrow="Building" title="The prototype is only the first 1%" />
          <LifecycleBar mode="build" />
          <ul className="inline-list">
            <li>Login</li>
            <li>Database</li>
            <li>Storage</li>
            <li>Payments</li>
            <li>Hosting</li>
            <li>Notifications</li>
            <li>Dashboards</li>
            <li>Compatibility</li>
          </ul>
          <p className="slide-callout">
            None of this is unique to the poker app, but every app rebuilds it.
          </p>
        </section>

        <section>
          <SlideTitle eyebrow="Running It" title="Shipping is the start of the second job" />
          <LifecycleBar mode="run" />
          <div className="dense-grid">
            <p>App Store and Play Store review</p>
            <p>Marketing and attribution</p>
            <p>On-call and incident response</p>
            <p>Observability and bug reports</p>
            <p>Monetization and ad networks</p>
            <p>Opaque provider bills</p>
          </div>
        </section>

        <section>
          <SlideTitle eyebrow="Resolution" title="This is why we're building Crayon" />
          <LifecycleBar mode="coverage" />
          <ul className="tight-list">
            <li>Pre-built, battle-tested modules that AI assembles instead of rebuilding</li>
            <li>One platform, one bill, shared infrastructure managed by the agent</li>
            <li>Agents do the whole lifecycle: deploy, validate, observe, and operate</li>
            <li>Built-in monetization from day one</li>
          </ul>
        </section>

        <section>
          <SlideTitle eyebrow="Why Now" title="Mini-apps borrow their lifecycle from the platform" />
          <div className="arc-visual">
            <div>Film</div>
            <div>YouTube</div>
            <div>TikTok</div>
            <div>Software</div>
          </div>
          <p className="lead">
            Accessed by a link or QR code. No download, no signup, no onboarding.
          </p>
          <p>
            Every medium that got cheap to produce shifted from active search to passive arrival.
            Software is next.
          </p>
        </section>

        <section className="title-only-slide">
          <h2>Demo</h2>
        </section>

        <section>
          <SlideTitle eyebrow="Today" title="What we've built" />
          <ul className="check-list">
            <li>Developer CLI: init, deploy, validate, observe</li>
            <li>Usage stats, last-accessed, and function runtime logs</li>
            <li>Crayon Skills installable in Claude Code, Codex, Cursor, OpenCode</li>
            <li>iOS consumer app surface</li>
            <li>Runtime for many mini-apps on shared infrastructure</li>
          </ul>
        </section>

        <section>
          <SlideTitle eyebrow="Next" title="What we're building next" />
          <div className="roadmap-band">
            <div>
              <strong>Cross-platform</strong>
              <span>Android, Mac, PC, web</span>
            </div>
            <div>
              <strong>Agent capability</strong>
              <span>Ops, support, marketing integrations</span>
            </div>
            <div>
              <strong>Compatibility simulator</strong>
              <span>Developer UI and agent CLI</span>
            </div>
          </div>
        </section>

        <section>
          <SlideTitle eyebrow="Go-to-market" title="Distribution starts with builders and agents" />
          <ul className="tight-list">
            <li>Developer-side distribution: agent marketplaces, GitHub, word of mouth</li>
            <li>Consumer-side distribution: founder networks, influencers, flagship mini-apps</li>
            <li>Launch content mode: viral experiments and polished flagships</li>
          </ul>
        </section>

        <section>
          <SlideTitle eyebrow="Raise" title="Raising $10M" />
          <div className="timeline-band">
            <span>Now</span>
            <span>Launch</span>
            <span>Expansion</span>
            <span>Series A</span>
          </div>
          <p className="lead">
            Funding cross-platform engineering, agent capability, infrastructure, design, product,
            ops, and GTM.
          </p>
        </section>

        <section>
          <SlideTitle eyebrow="Appendix" title="Team" />
          <div className="team-card">
            <h3>Tony Zhang, founder</h3>
            <p>MSML, CMU &apos;22; previously ML researcher at Scale AI and Microsoft.</p>
          </div>
          <div className="dense-grid">
            <p>Engineering team from Midjourney, MIT, Stacked</p>
            <p>Part-time designer</p>
            <p>Backed by Afore Capital</p>
          </div>
        </section>
      </DeckRevealShell>
    </main>
  );
}
