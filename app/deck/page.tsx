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
      <DeckRevealShell
        exportHref={deckExportHref}
        clearSessionOnLoad={!shouldPersistDeckSession()}
        showConfidential={!deckExportHref}
      >
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
              <p className="build-cluster-label">To make it real, I need: <em className="time-chip">~4–5 hrs</em></p>
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
              <p className="build-cluster-label">A dozen services to wire up: <em className="time-chip">more hours + $$$</em></p>
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
                <li>web</li>
                <li>screen sizes</li>
                <li>OS versions</li>
                <li>languages</li>
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
            <li><strong>Ship it</strong><span aria-hidden="true">—</span>App Store / Play Store review <em className="time-chip">days to weeks</em></li>
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

        <section className="resolution-slide">
          <SlideTitle eyebrow="Resolution" title="Crayon — an end-to-end platform for mini-apps" />
          <LifecyclePayoff />
          <p className="feature-list-heading">What Crayon gives you:</p>
          <ul className="feature-list">
            <li>
              <strong>Building, by assembly</strong>
              <span aria-hidden="true">—</span>
              pre-built, battle-tested modules: auth, database, storage, payments, notifications, hosting. AI assembles them, so you build only what&apos;s unique to your product.
            </li>
            <li>
              <strong>One integrated platform</strong>
              <span aria-hidden="true">—</span>
              every infrastructure service for running software, in one place: hosting, database, storage, observability, scaling, and more. One platform, one bill.
            </li>
            <li>
              <strong>Agent capability beyond coding</strong>
              <span aria-hidden="true">—</span>
              the whole system is operable through our CLI, and your agent gets that access through our Skills. So your agent doesn&apos;t just write code — it runs the whole product: deploys, ops, monitoring, marketing, monetization, and more.
            </li>
          </ul>
        </section>

        <section className="miniapp-slide">
          <SlideTitle eyebrow="Why Mini-Apps" title="Why mini-apps" />
          <p className="lead miniapp-bridge">All of this only works in one form factor. So why mini-apps?</p>
          <div className="miniapp-grid">
            <div className="miniapp-panel">
              <h3>A mini-app borrows its lifecycle from the platform.</h3>
              <ul className="miniapp-list">
                <li>Not a smaller app. Identity, payments, hosting, distribution — all inherited</li>
                <li>Open by link or QR code — no download, no signup, no onboarding</li>
                <li>Most live on Crayon, but they don&apos;t have to — export to a standalone app any time</li>
              </ul>
            </div>
            <div className="miniapp-panel miniapp-panel-primary">
              <h3>How people consume software is going through a shift — proactive to passive.</h3>
              <ul className="miniapp-list">
                <li>For traditional software, we consume it proactively: search, read reviews, download, sign up, onboard — the whole process, before you get any value.</li>
                <li>For any medium, when supply surges, consumption goes proactive → passive. Movies → YouTube &amp; Netflix → TikTok. AI makes software cheap, so software is entering the same shift.</li>
                <li>So software now arrives as <strong>push</strong> — <strong>social</strong> (a friend in a group chat), <strong>influence</strong> (a creator you follow), <strong>contextual</strong> (a QR code on the table).</li>
                <li>This happens 10–20 times a day. People don&apos;t anticipate searching, signing up, and onboarding each time.</li>
                <li>What makes sense: one tap or scan, straight into the utility — the experience itself, no process in front of it.</li>
              </ul>
            </div>
          </div>
          <p className="closing-line">Mini-apps are where developers meet consumers. Crayon is the infrastructure for that future.</p>
        </section>

        <section className="title-only-slide">
          <h2>Live demo time!</h2>
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
              opens Crayon&apos;s infrastructure to developers: connect and run apps live (init, deploy, validate, observe — more to come)
            </li>
            <li>
              <strong>Crayon Skills</strong>
              <span aria-hidden="true">—</span>
              teach the agent the rules (how to write code for Crayon, how to use the modules) and enable agents to view, run, observe, and improve apps on Crayon; installable to Claude Code, Codex, Cursor, OpenClaw
            </li>
          </ul>
        </section>

        <section>
          <SlideTitle eyebrow="Next" title="What we're building next" />
          <ul className="next-list">
            <li>
              <strong>Multi-platform</strong>
              <span aria-hidden="true">—</span>
              Android, Mac, PC, web; consistent UI and performance across every device (iOS live today)
            </li>
            <li>
              <strong>Whole-lifecycle access for agents</strong>
              <span aria-hidden="true">—</span>
              we build the infrastructure that exposes the entire lifecycle, end to end, so any agent can operate it:
              <ul>
                <li>Build / ship side: deploy, validate, versioning, A/B testing</li>
                <li>Run / operate side: ops, observability, incident response, distribution &amp; marketing, support</li>
              </ul>
            </li>
            <li>
              <strong>Local workspace</strong>
              <span aria-hidden="true">—</span>
              a full local environment for developers and agents: build, test, and a simulator to verify rendering across devices, plus a UI to operate your live apps directly. Our in-platform agent is available inside it.
            </li>
            <li>
              <strong>Automatic review system for publishing</strong>
              <span aria-hidden="true">—</span>
              human + automated review of mini-apps before they go live; fast compared to App Store review
            </li>
            <li>
              <strong>Expand the module library</strong>
              <span aria-hidden="true">—</span>
              today&apos;s modules cover the basics; we&apos;re broadening coverage so Crayon can build the large majority of apps, not just prototypes
            </li>
            <li>
              <strong>More</strong>
              <span aria-hidden="true">—</span>
              internal cross-mini-app distribution, more agent integrations
            </li>
          </ul>
        </section>

        <section className="raise-slide">
          <SlideTitle eyebrow="Raise" title="Raising $8M" />
          <div className="raise-timeline">
            <div className="raise-phases">
              <div className="raise-phase raise-phase-build">
                <span className="raise-phase-tick" aria-label="today">today</span>
                <strong>Build</strong>
                <span className="raise-phase-time">~6 mo</span>
                <span className="raise-phase-detail">infrastructure, modules, product</span>
              </div>
              <div className="raise-phase raise-phase-soft">
                <strong>Soft launch</strong>
                <span className="raise-phase-time">early next year</span>
                <span className="raise-phase-detail">quiet release</span>
              </div>
              <div className="raise-phase raise-phase-watch">
                <strong>Watch &amp; refine</strong>
                <span className="raise-phase-time">2–3 mo</span>
                <span className="raise-phase-detail">learn, validate, tune</span>
              </div>
              <div className="raise-phase raise-phase-public">
                <strong>Public launch</strong>
                <span className="raise-phase-time">expand</span>
                <span className="raise-phase-detail">marketing &amp; collabs</span>
              </div>
              <div className="raise-phase raise-phase-seriesa">
                <span className="raise-phase-tick" aria-label="Series A">Series A</span>
                <strong>Series A</strong>
                <span className="raise-phase-time">milestone</span>
                <span className="raise-phase-detail">raise on validation</span>
              </div>
              <div className="raise-phase raise-phase-enterprise" aria-label="enterprise horizon">
                <strong>then: enterprise</strong>
                <span className="raise-phase-time">horizon</span>
                <span className="raise-phase-detail">after consumer proof</span>
              </div>
            </div>
            <div className="raise-runway-bracket" aria-label="approximately two years of runway">
              ~ two years of runway
            </div>
          </div>
          <p className="feature-list-heading">How we&apos;ll spend it</p>
          <ul className="spend-list">
            <li><strong>Engineering</strong><span aria-hidden="true">—</span>expand the team to 8 engineers (infrastructure, modules, product)</li>
            <li><strong>Design, product, early marketing</strong><span aria-hidden="true">—</span>hiring now</li>
            <li><strong>Infrastructure</strong><span aria-hidden="true">—</span>modest while we build; scales up as the ecosystem grows</li>
            <li><strong>At public launch</strong><span aria-hidden="true">—</span>developer relations, support, sales</li>
            <li><strong>Marketing &amp; distribution</strong><span aria-hidden="true">—</span>budget kicks in at public launch, not before</li>
            <li><strong>Plus the essentials</strong><span aria-hidden="true">—</span>legal, accounting, operations</li>
          </ul>
        </section>

        <section>
          <SlideTitle eyebrow="Appendix A" title="Business model" />
          <p className="lead">We make money across the whole lifecycle of the product — not a one-time tool fee.</p>
          <ul className="business-list">
            <li>
              <strong>Infrastructure</strong>
              <span aria-hidden="true">—</span>
              freemium, grows with scale. Free to start; builders pay as they grow. This isn&apos;t just hosting — it&apos;s the whole running-it layer: database, storage, ops, observability, on-call, marketing services, and more. Shared infrastructure keeps marginal cost low and builder bills predictable.
            </li>
            <li>
              <strong>Payments and ads</strong>
              <span aria-hidden="true">—</span>
              payments inside mini-apps with a transaction fee on every transaction; built-in ads builders can turn on, with Crayon sharing in what they earn.
            </li>
            <li>
              <strong>In-platform agent</strong>
              <span aria-hidden="true">—</span>
              paid tier for builders who don&apos;t bring their own agent to run build and operations.
            </li>
          </ul>
          <p className="quiet-line transition-line">Once we have the ecosystem, revenue compounds with the lifecycle of every product on it.</p>
        </section>

        <section>
          <SlideTitle eyebrow="Appendix B" title="Go-to-market" />
          <p className="lead">It&apos;s not chicken-and-egg. We go after both ends at once.</p>
          <div className="gtm-grid">
            <div className="gtm-column gtm-column-builders">
              <h3>Builders</h3>
              <ul className="tight-list">
                <li>
                  <strong>The best place to build for this era</strong>
                  <span aria-hidden="true">—</span>
                  and here&apos;s why:
                  <ul>
                    <li>Faster to build, cheaper to run, reliable by default — production-ready, not a prototype</li>
                    <li>Comes with everything after the build — you don&apos;t connect to any other services; hosting, ops, distribution, monetization are all here</li>
                    <li>Agent access raises the ceiling — not just a mobile builder UI; your own agent operates it, so complexity and reliability go up</li>
                  </ul>
                </li>
                <li>
                  <strong>Or we build and run it for you</strong>
                  <span aria-hidden="true">—</span>
                  for SMBs and creators; you just manage and distribute it. They bring their own customers — which brings new users to Crayon.
                </li>
              </ul>
            </div>
            <div className="gtm-column">
              <h3>Consumers</h3>
              <ul className="tight-list">
                <li><strong>Download Crayon once</strong><span aria-hidden="true">—</span>whatever app first brings someone in, they never download again; every other mini-app opens inside it</li>
                <li><strong>We seed it ourselves</strong><span aria-hidden="true">—</span>recreate popular small apps and games, free and nostalgic, made to play and interact with your friends</li>
                <li><strong>Anchor on social entertainment</strong><span aria-hidden="true">—</span>things you do with friends, so they carry a built-in network effect: every player pulls in their circle</li>
                <li><strong>We learn what spreads</strong><span aria-hidden="true">—</span>we run our own marketing on these apps, find what works, and hand that distribution playbook to builders</li>
              </ul>
            </div>
            <div className="gtm-example-strip">
              <strong>30-day challenge</strong>
              <span>recreate one popular app/game a day in ~20 min, show how Crayon works, then post “try it here” to Twitter / IG / TikTok — and anyone can try building it themselves.</span>
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

        <section className="qa-slide">
          <SlideTitle eyebrow="Appendix D" title="Q&A" />
          <div className="qa-grid">
            <article>
              <h3>Mini-app vs. web app?</h3>
              <p>Inheritance and retention. A web app starts cold every time; a mini-app inherits identity, payments, and the social graph from the platform — so multiplayer, rankings, and repeat use start warm, not from zero.</p>
            </article>
            <article>
              <h3>Developer lock-in?</h3>
              <p>No lock-in — export to a standalone app any time. The trade-off is losing one-tap access, unified identity, and the aggregated ecosystem. That distribution gravity is the real value.</p>
            </article>
            <article>
              <h3>What about enterprise?</h3>
              <p>Consumer first, enterprise later. Demand is real, but going there first would pull us into slow bespoke work before the core product is proven. We win outward, then sell inward.</p>
            </article>
            <article>
              <h3>Why would capable developers use it?</h3>
              <p>Knowing how to build and being able to run a product are different jobs. Crayon gives builders the whole running-it layer — ops, scaling, distribution, monetization — without becoming a team of one.</p>
            </article>
            <article className="qa-wide">
              <h3>Why will software grow like other media?</h3>
              <p>As building and running software gets cheap, niche tools that never made economic sense become viable. The market expands into the dark matter of specific, small-audience software.</p>
            </article>
          </div>
        </section>
      </DeckRevealShell>
    </main>
  );
}
