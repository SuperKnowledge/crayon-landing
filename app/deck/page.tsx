import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Image from "next/image";
import DeckLoginForm from "@/components/DeckLoginForm";
import DeckRevealShell from "@/components/DeckRevealShell";
import {
  canExportDeck,
  createDeckExportToken,
  DECK_AUTH_COOKIE,
  shouldPersistDeckSession,
  verifyDeckExportToken,
  verifyDeckSession,
} from "@/lib/deck-auth";
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

function LifecyclePayoff() {
  return (
    <figure className="lifecycle-payoff">
      <figcaption>The whole software lifecycle</figcaption>
      <div className="lifecycle-track">
        <div className="lifecycle-segment prototype">
          <strong>Prototype</strong>
          <span>1%</span>
        </div>
        <div className="lifecycle-segment build">
          <strong>Production-ready</strong>
          <span>9%</span>
        </div>
        <div className="lifecycle-segment run">
          <strong>Running the product</strong>
          <span>90%</span>
        </div>
      </div>
      <div className="coverage-overlay">
        <span className="coverage-other">Other AI tools: prototype only</span>
        <span className="coverage-crayon">Crayon: whole lifecycle</span>
      </div>
    </figure>
  );
}

function PokerCard() {
  return (
    <div className="mockup-card poker-card">
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
      <div className="mockup-row">
        <span>Sam</span>
        <strong>$0</strong>
      </div>
      <div className="payout-plan">
        <span>Payout</span>
        <strong>Maya -&gt; Tony $40</strong>
        <strong>Alex -&gt; Tony $80</strong>
      </div>
    </div>
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

type PageProps = {
  searchParams: Promise<{
    export?: string;
  }>;
};

export default async function DeckPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const { export: exportToken } = await searchParams;
  const cookieSession = verifyDeckSession(cookieStore.get(DECK_AUTH_COOKIE)?.value);
  const exportSession = verifyDeckExportToken(exportToken);
  const session = cookieSession || exportSession;

  if (!session) {
    return <DeckLoginForm />;
  }

  const headerList = await headers();
  if (cookieSession) {
    await logDeckEvent({
      event: "page_view",
      email: session.email,
      path: "/deck",
      resource: "deck",
      userAgent: headerList.get("user-agent") || "",
      referrer: headerList.get("referer") || "",
      ip: clientIpFromHeaders(headerList),
    });
  }
  const deckExportHref = canExportDeck(session.email)
    ? `/deck?print-pdf&export=${encodeURIComponent(createDeckExportToken(session.email))}`
    : null;

  return (
    <main className="deck-page">
      <DeckRevealShell exportHref={deckExportHref} clearSessionOnLoad={!shouldPersistDeckSession()}>
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

        <section className="story-slide">
          <SlideTitle eyebrow="Setup" title="Let's make an app" />
          <div className="split-layout">
            <div>
              <ul className="story-beats">
                <li>I host poker nights.</li>
                <li>Track buy-ins and cash-outs. Settle up at the end.</li>
                <li>The fewest payments that settle the whole table.</li>
                <li>Claude Code -&gt; working prototype in 20 minutes.</li>
              </ul>
              <p className="hook">What&apos;s next?</p>
            </div>
            <PokerCard />
          </div>
        </section>

        <section className="problem-slide">
          <SlideTitle eyebrow="Building" title="Get ready for production" />
          <div className="build-clusters">
            <div className="build-cluster build-cluster-modules">
              <p className="build-cluster-label">To make it real, I need:</p>
              <ul className="build-card-grid">
                <li>Login &amp; auth</li>
                <li>Database</li>
                <li>Storage</li>
                <li>Payments</li>
                <li>Hosting</li>
                <li>Notifications</li>
                <li>User management</li>
                <li>Dashboards</li>
              </ul>
            </div>
            <div className="build-cluster">
              <p className="build-cluster-label">A dozen services to wire up:</p>
              <ul className="build-card-grid build-card-grid-services">
                <li>AWS</li>
                <li>Supabase</li>
                <li>Auth0</li>
                <li>Stripe</li>
                <li>…</li>
              </ul>
            </div>
            <div className="build-cluster">
              <p className="build-cluster-label">And it has to work everywhere:</p>
              <ul className="build-card-grid build-card-grid-platforms">
                <li>iOS</li>
                <li>Android</li>
                <li>Mac</li>
                <li>PC</li>
                <li>web</li>
                <li>every screen size</li>
              </ul>
            </div>
          </div>
          <div className="turn-pair">
            <p className="turn-line">None of this is unique to my app.</p>
            <p className="quiet-line">We&apos;re wasting time and tokens on every new app.</p>
          </div>
          <div className="turn-pair">
            <p className="turn-line">Is any of it even safe?</p>
            <p className="quiet-line">Gambling on the model&apos;s intelligence — with reliability and security on the line.</p>
          </div>
        </section>

        <section className="problem-slide">
          <SlideTitle eyebrow="Running It" title="Go live, stay live" />
          <p className="lead">AI wrote the code. It can&apos;t run any of this:</p>
          <ul className="running-list">
            <li><strong>Ship it</strong><span aria-hidden="true">—</span>App Store / Play Store review</li>
            <li><strong>Market it</strong><span aria-hidden="true">—</span>channels, attribution</li>
            <li><strong>Keep it alive</strong><span aria-hidden="true">—</span>on-call, incident response</li>
            <li><strong>See how it&apos;s used</strong><span aria-hidden="true">—</span>observability, drop-off, bug reports</li>
            <li><strong>Scale it</strong><span aria-hidden="true">—</span>capacity, load, failover</li>
            <li><strong>Keep improving it</strong><span aria-hidden="true">—</span>bug fixes, A/B tests, versioning</li>
            <li><strong>Make money</strong><span aria-hidden="true">—</span>ad networks, find advertisers, billing</li>
          </ul>
          <p className="thesis-line">AI democratized coding. Not software.</p>
          <p className="quiet-line">and the bills are already bleeding — opaque, priced for peak.</p>
        </section>

        <section>
          <SlideTitle eyebrow="Resolution" title="This is why we're building Crayon" />
          <p className="lead">A platform for mini-apps, and a system that makes the whole lifecycle effortless.</p>
          <LifecyclePayoff />
          <ul className="claim-card-grid">
            <li>
              <p>Building gets easy — assemble, don&apos;t rebuild.</p>
            </li>
            <li>
              <p>Running it disappears — it&apos;s one integrated platform.</p>
            </li>
            <li>
              <p>Agents go beyond coding — the whole lifecycle is agent-operable.</p>
            </li>
          </ul>
          <p className="quiet-line transition-line">All of this only works in one form factor.</p>
        </section>

        <section className="miniapp-slide">
          <SlideTitle eyebrow="Why Mini-Apps" title="Why mini-apps" />
          <div className="miniapp-flow">
            <div>
              <h3>First, what is a mini-app?</h3>
              <p>
                A mini-app borrows its lifecycle from the platform. Not a smaller app — identity,
                payments, hosting, distribution are all inherited. Open by link or QR code; no
                download, no signup.
              </p>
            </div>
            <div>
              <h3>It&apos;s how people will consume software now.</h3>
              <p>
                Film → YouTube → TikTok: every cheap-to-produce medium has shifted from active
                search to passive arrival. Software is next — instant, contextual, often used once.
              </p>
            </div>
            <div>
              <h3>It unlocks the dark matter of software.</h3>
              <p>
                A whole category that never made sense to build before — too small. When the
                platform absorbs the lifecycle and monetization, it can finally exist.
              </p>
            </div>
          </div>
          <p className="closing-line">Mini-apps are where developers meet consumers. Crayon is the infrastructure for that future.</p>
        </section>

        <section className="title-only-slide">
          <h2>Demo</h2>
        </section>

        <section>
          <SlideTitle eyebrow="Today" title="What we've built" />
          <ul className="proof-list">
            <li>
              <strong>Pre-built backend modules</strong>
              <span aria-hidden="true">—</span>
              auth, database, storage, payments, notifications, file handling, hosting, WebSockets
            </li>
            <li>
              <strong>Frontend modules</strong>
              <span aria-hidden="true">—</span>
              predefined themes, automatic validation; render into a native SwiftUI iOS app
            </li>
            <li className="metric-proof">
              <strong>Shared-infrastructure runtime</strong>
              <span aria-hidden="true">—</span>
              built on Go + WasmEdge; currently running 1,000+ mini-apps on a single server at the same time
            </li>
            <li>
              <strong>Developer CLI</strong>
              <span aria-hidden="true">—</span>
              opens Crayon&apos;s infrastructure to developers: connect and run apps live
            </li>
            <li>
              <strong>Crayon Skills</strong>
              <span aria-hidden="true">—</span>
              teach agents the rules, and enable them to view, run, observe, and improve apps
            </li>
          </ul>
        </section>

        <section>
          <SlideTitle eyebrow="Next" title="What we're building next" />
          <ul className="next-list">
            <li>
              <strong>Multi-platform</strong>
              <span aria-hidden="true">—</span>
              Android, Mac, PC, web; consistent UI and performance across every device
            </li>
            <li>
              <strong>Whole-lifecycle access for agents</strong>
              <span aria-hidden="true">—</span>
              deploy, validate, version, A/B test, observe, respond, distribute, support
            </li>
            <li>
              <strong>Local dev environment</strong>
              <span aria-hidden="true">—</span>
              developers and agents can run, test, and verify rendering across devices
            </li>
            <li>
              <strong>Automatic review system</strong>
              <span aria-hidden="true">—</span>
              human + automated review before mini-apps go live
            </li>
            <li>
              <strong>In-platform agent</strong>
              <span aria-hidden="true">—</span>
              for people who don&apos;t bring their own
            </li>
            <li>
              <strong>More</strong>
              <span aria-hidden="true">—</span>
              modules, internal cross-mini-app distribution, more agent integrations
            </li>
          </ul>
        </section>

        <section className="raise-slide">
          <SlideTitle eyebrow="Raise" title="Raising $10M seed" />
          <div className="raise-timeline">
            <div className="raise-phases">
              <div className="raise-phase raise-phase-build">
                <span className="raise-phase-tick" aria-label="today">today</span>
                <strong>Build</strong>
                <span className="raise-phase-time">now → +6 mo</span>
                <span className="raise-phase-detail">infrastructure, modules, product</span>
              </div>
              <div className="raise-phase raise-phase-soft">
                <strong>Soft launch</strong>
                <span className="raise-phase-time">~+6 mo</span>
                <span className="raise-phase-detail">quiet release; 2–3 mo to learn &amp; refine</span>
              </div>
              <div className="raise-phase raise-phase-public">
                <strong>Public launch</strong>
                <span className="raise-phase-time">~+9 mo</span>
                <span className="raise-phase-detail">marketing &amp; collaborations, distribution, expansion</span>
              </div>
              <div className="raise-phase raise-phase-seriesa">
                <span className="raise-phase-tick" aria-label="Series A">Series A</span>
                <strong>Series A</strong>
                <span className="raise-phase-time">~+12 mo</span>
                <span className="raise-phase-detail">scale on validated metrics</span>
              </div>
            </div>
            <div className="raise-runway-bracket" aria-label="approximately two years of runway">
              ~ two years of runway
            </div>
          </div>
          <ul className="spend-list">
            <li><strong>Engineering</strong><span aria-hidden="true">—</span>expand to 8 engineers across infrastructure, modules, and product</li>
            <li><strong>Design, product, early marketing</strong><span aria-hidden="true">—</span>hiring now</li>
            <li><strong>Infrastructure</strong><span aria-hidden="true">—</span>modest while we build; scales as the ecosystem grows</li>
            <li><strong>Public launch</strong><span aria-hidden="true">—</span>developer relations, support, sales, marketing, distribution</li>
            <li><strong>Essentials</strong><span aria-hidden="true">—</span>legal, accounting, operations</li>
          </ul>
        </section>

        <section>
          <SlideTitle eyebrow="Appendix A" title="Business model" />
          <p className="lead">We make money across the whole lifecycle of the product — not a one-time tool fee.</p>
          <ul className="business-list">
            <li>
              <strong>Infrastructure</strong>
              <span aria-hidden="true">—</span>
              freemium, grows with scale; database, storage, ops, observability, on-call, marketing services, and more
            </li>
            <li>
              <strong>Payments</strong>
              <span aria-hidden="true">—</span>
              payments for builders plus our own built-in ad system
            </li>
            <li>
              <strong>In-platform agent</strong>
              <span aria-hidden="true">—</span>
              paid tier for builders who don&apos;t bring their own agent
            </li>
          </ul>
          <p className="quiet-line transition-line">Revenue compounds with the ecosystem.</p>
        </section>

        <section>
          <SlideTitle eyebrow="Appendix B" title="Go-to-market" />
          <p className="lead">Not chicken-and-egg — we go after both ends at once.</p>
          <div className="gtm-grid">
            <div>
              <h3>Builders</h3>
              <ul className="tight-list">
                <li>Vibe-coders who want a real product, not just a prototype</li>
                <li>Agent access raises the ceiling on complexity and reliability</li>
                <li>SMBs — restaurants, coffee shops, salons — we can build it for them with our agents</li>
                <li>Influencers / creators — personal-brand apps to engage and monetize fans</li>
              </ul>
            </div>
            <div>
              <h3>Consumers</h3>
              <ul className="tight-list">
                <li>Recreate popular small apps and games — free, instant, nostalgic</li>
                <li>Use these to experiment with distribution and learn what drives virality</li>
                <li>The loop: what works on our own apps becomes the playbook we hand to builders</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <SlideTitle eyebrow="Appendix C" title="Team" />
          <div className="team-card">
            <h3>Tony Zhang, founder</h3>
            <p>MSML, CMU &apos;22; previously ML researcher at Scale AI and Microsoft, and worked on SuperKnowledge.</p>
          </div>
          <div className="dense-grid">
            <p>Engineering team from Midjourney, MIT, Stacked; part-time designer</p>
            <p>Backed by Afore Capital</p>
          </div>
        </section>
      </DeckRevealShell>
    </main>
  );
}
