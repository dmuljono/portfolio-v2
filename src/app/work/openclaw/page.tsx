import type { Metadata } from 'next'
import Reveal from '@/components/ui/Reveal'
import CaseStudyBack from '@/components/work/CaseStudyBack'
import OpenClawArchitecture from '@/components/work/OpenClawArchitecture'
import CostChart from '@/components/work/CostChart'
import LightboxImage from '@/components/work/LightboxImage'
import CaseStudyNav from '@/components/work/CaseStudyNav'

const SECTIONS = [
  { id: 'hero',             label: 'Case Study · Personal' },
  { id: 'benefit',          label: 'The Benefit' },
  { id: 'problem',          label: 'The Problem' },
  { id: 'architecture',     label: 'Architecture' },
  { id: 'build',            label: 'Build Highlights' },
  { id: 'hard-parts',       label: 'The Hard Parts' },
  { id: 'lessons',          label: 'What I Learned' },
  { id: 'where-this-goes',  label: 'Where This Goes' },
]

export const metadata: Metadata = {
  title: 'OpenClaw — Daniel Muljono',
  description:
    'Self-hosted AI operations gateway on a Hetzner VPS — IBKR portfolio intelligence, scheduled briefings, and controlled WhatsApp messaging.',
}

export default function OpenClawCaseStudy() {
  return (
    <main>
      <CaseStudyNav sections={SECTIONS} />

      <article className="case-study">

      {/* ─── 1 · Hero ───────────────────────────────────────────── */}
      <Reveal as="header" id="hero" className="case-study-hero">
        <span className="label-pill">
          <span className="ldot" style={{ background: 'var(--turq)' }} />
          Case Study · Personal
        </span>
        <h1>
          <span className="brand-openclaw">OpenClaw</span>
          <span className="brand-plus"> + </span>
          <span className="brand-whatsapp">WhatsApp</span>
          <br />
          <span className="case-study-subtitle">All the leverage of an AI assistant — none of the access risk.</span>
        </h1>
        <p className="case-study-lede">
          A persistent AI orchestration layer running on a Hetzner VPS. OpenClaw
          reads a deterministic Python pipeline that pulls my IBKR portfolio
          context, turns it into structured JSON, and produces scheduled portfolio
          reviews and WhatsApp briefings — without ever touching the brokerage
          directly. Every outbound action passes through an explicit confirmation
          gate.
        </p>

        <div className="case-study-meta">
          <div className="cell">
            <div className="l">Year</div>
            <div className="v">2026</div>
          </div>
          <div className="cell">
            <div className="l">Role</div>
            <div className="v">Solo · design + build</div>
          </div>
          <div className="cell">
            <div className="l">Stack</div>
            <div className="v">OpenClaw · Python · IBKR · Hetzner</div>
          </div>
          <div className="cell">
            <div className="l">Status</div>
            <div className="v" style={{ color: 'var(--gold)' }}>Personal · in development</div>
          </div>
        </div>

        <div className="case-study-wip">
          <span className="case-study-wip-dot" aria-hidden />
          <span>
            <strong>Still building.</strong> This case study is a living
            document — the cost-discipline sprint, the IBKR auth automation,
            and a v2 of the WhatsApp sender skill are all in flight. Check
            back as the architecture matures.
          </span>
        </div>
      </Reveal>

      {/* ─── 2 · The Benefit ────────────────────────────────────── */}
      <Reveal as="section" id="benefit" className="case-study-section">
        <span className="label-pill">
          <span className="ldot" style={{ background: 'var(--green)' }} />
          The Benefit
        </span>
        <h2>What I get out of it.</h2>

        <div className="case-study-prose">
          <p>
            Before the architecture — here&apos;s what OpenClaw earns its keep
            with. Quiet, scheduled, delivered to the channel I already check
            first thing.
          </p>

          <ul className="case-study-list">
            <li>
              <strong>Morning briefing.</strong> World headlines, Indonesian
              politics, market open and macro context — one WhatsApp message,
              every day, before 7am.
            </li>
            <li>
              <strong>Weekly portfolio review.</strong> Every Monday, a
              written breakdown of each IBKR position: directional exposure,
              days-to-expiry, break-even, moneyness, and a one-line risk read.
            </li>
            <li>
              <strong>Ad-hoc questions, where I already chat.</strong>{' '}
              &ldquo;What&apos;s my IBIT 36P delta sitting at?&rdquo; — reply
              lands in the same thread as the rest of my life, not a separate
              app.
            </li>
            <li>
              <strong>Voice in, not thumbs.</strong> A ChatGPT-4o
              transcription skill cleans up my WhatsApp voice notes before
              OpenClaw reads them — faster than typing, especially when the
              question runs more than a sentence.
            </li>
            <li>
              <strong>Reminders that actually land.</strong> iOS Reminders
              quietly forgets to fire half the time. WhatsApp is the app I
              open by reflex — scheduled nudges from OpenClaw show up in a
              thread I can&apos;t help but check.
            </li>
            <li>
              <strong>Cost predictable by design.</strong> Scheduled jobs with
              per-job token budgets — no surprise bill from a 2am rabbit hole,
              no runaway model spend.
            </li>
          </ul>
        </div>

        {/* Real WhatsApp output — proof of work (click to expand) */}
        <div className="case-study-screenshots">
          <LightboxImage
            src="/openclaw/whatsapp-briefing.png"
            alt="OpenClaw morning briefing in WhatsApp — geopolitics, markets, technology"
            caption="Daily morning briefing — geopolitics, markets, tech."
          />
          <LightboxImage
            src="/openclaw/whatsapp-portfolio.png"
            alt="OpenClaw portfolio analysis in WhatsApp — strikes, targets, gaps"
            caption="Portfolio analysis — institutional targets vs current, mapped to my strikes."
          />
        </div>
      </Reveal>

      {/* ─── 3 · The Problem ────────────────────────────────────── */}
      <Reveal as="section" id="problem" className="case-study-section">
        <span className="label-pill">
          <span className="ldot" style={{ background: 'var(--turq)' }} />
          The Problem
        </span>
        <h2>Trusted AI automation — without uncontrolled access.</h2>
        <div className="case-study-prose">
          <p>
            The real question was never <em>build an AI bot</em>. It was: how do
            I run a controlled, self-hosted AI automation layer that touches my
            portfolio data and messaging channels — without exposing sensitive
            systems or letting the model take uncontrolled actions?
          </p>
          <p>That framing came with five non-negotiables:</p>
          <ul className="case-study-list">
            <li>Run outside my laptop — no overheating, no dependency on my personal machine.</li>
            <li>Support recurring jobs — daily news, weekly portfolio reviews.</li>
            <li>Deliver through WhatsApp — the channel I actually use.</li>
            <li>Connect to IBKR for analysis only — never for trading.</li>
            <li>Stay cheap enough to run forever.</li>
          </ul>
          <p>
            Each constraint sounds simple in isolation. Together they ruled out
            most off-the-shelf chatbot patterns. Hosting on Vercel or Railway
            leaks brokerage credentials. Running locally requires the laptop to
            stay on. Letting an LLM call IBKR directly puts trade execution one
            prompt-injection away. The interesting design work was making all
            five constraints true at once.
          </p>
        </div>
      </Reveal>

      {/* ─── 4 · Architecture ───────────────────────────────────── */}
      <Reveal as="section" id="architecture" className="case-study-section">
        <span className="label-pill">
          <span className="ldot" style={{ background: 'var(--turq)' }} />
          Architecture
        </span>
        <h2>Six layers, one rule.</h2>
        <div className="case-study-prose">
          <p>
            <strong>The AI never touches raw infrastructure directly.</strong>{' '}
            That single principle drove every layer of the system.
          </p>
        </div>

        <OpenClawArchitecture />

        <div className="case-study-prose">
          <p>
            The user reaches OpenClaw through WhatsApp, a local portal, or CLI.
            OpenClaw — the gateway — runs persistently on a Hetzner VPS as the
            orchestration layer. It reads prepared data, runs approved skills,
            and produces narrative output.
          </p>
          <p>
            Behind OpenClaw sits a shared data layer of static JSON files:{' '}
            <code>latest_portfolio_context.json</code> and{' '}
            <code>openclaw_review_input.json</code>. These files are the
            interface contract between the deterministic and probabilistic halves
            of the system.
          </p>
          <p>
            A Python pipeline writes those files. <code>snapshot.py</code> pulls
            positions from the IBKR API. <code>enrich_prices.py</code> overlays
            bid, ask, last, mark, and option model prices.{' '}
            <code>build_portfolio_context.py</code> derives expiry, strike,
            moneyness, break-even, and directional exposure. Each script is dumb
            and predictable — easy to log, easy to retry, easy to read at 2am.
          </p>
          <p>
            IB Gateway runs locally on the VPS, headless, with the IBKR API
            enabled on <code>127.0.0.1:4001</code>. Brokerage credentials never
            leave the box. <strong>OpenClaw consumes JSON, not API access.</strong>{' '}
            It doesn&apos;t have an IBKR token. It can&apos;t execute trades. It
            can only summarize, narrate, and message. When something breaks, the
            deterministic layer is debuggable on its own — and the AI can be
            swapped or unplugged without touching the pipeline.
          </p>
        </div>
      </Reveal>

      {/* ─── 5 · Build Highlights ───────────────────────────────── */}
      <Reveal as="section" id="build" className="case-study-section">
        <span className="label-pill">
          <span className="ldot" style={{ background: 'var(--turq)' }} />
          Build Highlights
        </span>
        <h2>Four moments worth keeping.</h2>

        <div className="case-study-highlights">
          <div className="case-highlight">
            <div className="case-highlight-num">01</div>
            <h3>VPS + IBKR pipeline, end-to-end</h3>
            <p>
              First milestone: get OpenClaw and IB Gateway running together on a
              Hetzner Ubuntu box. SSH key login, port 4001 enabled, IB Gateway
              running headless under Xvfb + openbox + x11vnc so it could be
              logged in once and left running. The first successful Python call
              to <code>reqAccountSummary</code> returning real account data felt
              like the moment the project went from idea to system.
            </p>
          </div>

          <div className="case-highlight">
            <div className="case-highlight-num">02</div>
            <h3>Snapshot → enrich → context</h3>
            <p>
              The pipeline matured in three layers. <code>snapshot.py</code>{' '}
              captured positions plus the IBKR-specific fields that matter for
              options — <code>conId</code>, <code>strike</code>,{' '}
              <code>right</code>, <code>multiplier</code>.{' '}
              <code>enrich_prices.py</code> requested delayed market data and
              stitched it in. <code>build_portfolio_context.py</code> interpreted
              the result, deriving days-to-expiry, premium per share, break-even,
              moneyness, and a one-line directional read for each position. The
              output became something an LLM could actually reason over without
              hallucinating the strike.
            </p>
          </div>

          <div className="case-highlight">
            <div className="case-highlight-num">03</div>
            <h3>Cron-driven recurring intelligence</h3>
            <p>
              Once the pipeline produced clean JSON, recurring intelligence
              became a scheduling problem. A wrapper script runs the three Python
              steps in order, then triggers OpenClaw to produce a portfolio
              review on top of the freshly-built context. World news and
              Indonesian political updates run as separate scheduled briefings —
              each with its own model tier, token budget, and output length.
            </p>
          </div>

          <div className="case-highlight">
            <div className="case-highlight-num">04</div>
            <h3>WhatsApp as a controlled sender skill</h3>
            <p>
              Sending through WhatsApp turned out to be the hardest design
              problem. OpenClaw&apos;s default <code>allowFrom</code> policy
              conflated <em>who can command the bot</em> with{' '}
              <em>who the bot can message</em>. The fix was a dedicated sender
              skill: a contact resolver against a <code>contacts.json</code>{' '}
              allowlist, E.164 phone normalization, a confirmation preview, and a
              single sender script. Inbound stays locked to me. Outbound is
              explicit, auditable, per-message.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ─── 6 · The Hard Parts ─────────────────────────────────── */}
      <Reveal as="section" id="hard-parts" className="case-study-section">
        <span className="label-pill">
          <span className="ldot" style={{ background: 'var(--bill-warm)' }} />
          The Hard Parts
        </span>
        <h2>Where the system pushed back.</h2>

        <div className="case-study-hardparts">
          <div className="hardpart">
            <h3>IBKR auth is a state machine, not an endpoint</h3>
            <p>
              The IBKR API isn&apos;t really REST. Client Portal Gateway needed
              a browser session before any curl would succeed. IB Gateway needed
              a real GUI session before the Python socket connection would
              authenticate. The fix was Xvfb + openbox + x11vnc, manually logging
              in once via VNC and letting the session live as long as IBKR
              allowed. Fully unattended login was possible, but a manual gate
              was a fair operational trade-off for a personal system.
            </p>
          </div>

          <div className="hardpart">
            <h3>WhatsApp replies through your personal number — a real risk</h3>
            <p>
              The biggest architectural surprise. By default, OpenClaw replied
              through my <em>personal WhatsApp number</em> — which meant any
              contact who messaged me could trigger the AI, and the AI could
              fire off replies to anyone in my contact book. Combined with its
              read access to my IBKR positions, options exposure, and option
              metadata, that profile was uncomfortable: a misbehaving or
              jailbroken model could leak personal financial data to my entire
              contact list.
            </p>
            <p>
              A strict allowlist solved inbound but broke outbound — one policy
              couldn&apos;t honor both <em>only I can DM the bot</em> and{' '}
              <em>the bot can DM anyone I explicitly tell it to</em>. The fix
              was to split the two: API access restricted to my personal chat
              only on the inbound side, and outbound flowing through a
              confirmation-gated sender skill with a per-message preview. The
              AI gets to be useful; my contacts never see a message I
              didn&apos;t consciously send.
            </p>
          </div>

          <div className="hardpart">
            <h3>Duplicate runtimes cause cost ambiguity</h3>
            <p>
              At one point OpenClaw was running on both my laptop and the VPS,
              each with its own cron jobs, each consuming tokens. There was no
              central inventory. Disabling one didn&apos;t immediately reveal
              which scripts had been running where. The fix was tactical — kill
              local autostart, standardize on the VPS, write a single runbook
              listing active services, cron entries, ports, and expected costs.
              The fix was also a lesson.
            </p>
          </div>

          <div className="hardpart">
            <h3>$18.88 in a single day forced a pause</h3>
            <p>
              Two recurring jobs — daily news + Monday portfolio briefing —
              ramped from <strong>$0.16/day to $18.88/day in seven days</strong>.
              No length limits, no cheap-model fallback for simple
              summarization, full context windows on every call. I paused both
              jobs on day 15 to audit, and the spend went to zero overnight.
            </p>
            <p>
              The rebuild — per-job token budgets, model tiering for cheap
              subtasks, summarization caches, hard output-length caps — is the
              next sprint, not a finished story. The lesson I&apos;m taking
              from this isn&apos;t that I optimized brilliantly; it&apos;s that
              pausing first was the right call, and every scheduled AI job
              needs the same cost discipline as any other piece of cloud
              infrastructure: observability, budget, ownership.
            </p>

            <CostChart />
          </div>
        </div>
      </Reveal>

      {/* ─── 7 · What I Learned ─────────────────────────────────── */}
      <Reveal as="section" id="lessons" className="case-study-section">
        <span className="label-pill">
          <span className="ldot" style={{ background: 'var(--gold)' }} />
          What I Learned
        </span>
        <h2>Four takeaways I&apos;ll carry forward.</h2>

        <ol className="case-study-lessons">
          <li>
            <strong>Separate the policy of who commands the AI from who the AI can act on.</strong>{' '}
            One allowlist can&apos;t do both — splitting them is the difference
            between a hobby bot and an auditable system.
          </li>
          <li>
            <strong>A data product beats a naked prompt.</strong> The strongest
            LLM workflow wasn&apos;t a longer prompt — it was a structured JSON
            file that pre-computed expiry, strike, moneyness, and break-even.
            The model didn&apos;t have to guess. It had to summarize. Both layers
            got easier.
          </li>
          <li>
            <strong>Cron is easy. Reliable scheduled automation is hard.</strong>{' '}
            Logs, dependency checks, retry semantics, env-var plumbing, and
            budget caps make the difference between a script that runs once and
            a system that runs every Monday at 7am for a year.
          </li>
          <li>
            <strong>AI as reasoning layer, deterministic code as execution layer.</strong>{' '}
            Read-only access, JSON contracts between the two halves, and
            confirmation gates on every outbound action. The AI gets to be
            smart. The pipeline gets to be predictable. I stay in control of
            what actually happens to the brokerage account.
          </li>
          <li>
            <strong>Design every permission for the worst-case prompt.</strong>{' '}
            An AI assistant with read access to your brokerage <em>and</em>{' '}
            outbound access to your personal WhatsApp is a profile worth
            re-thinking — a single hallucination or jailbreak could leak
            financial data to your entire contact list. The architecture
            restricts the API to my personal chat only, splits inbound and
            outbound trust, and treats every new permission like a blast
            radius to bound.
          </li>
        </ol>
      </Reveal>

      {/* ─── 8 · Where this goes ────────────────────────────────── */}
      <Reveal as="section" id="where-this-goes" className="case-study-section">
        <span className="label-pill">
          <span className="ldot" style={{ background: 'var(--violet)' }} />
          Where This Goes
        </span>
        <h2>From luxury to leverage.</h2>
        <div className="case-study-prose">
          <p>
            In private banking, a dedicated research analyst is a six-figure
            cost most clients can&apos;t justify. OpenClaw is the personal
            version — an analyst that reads my brokerage every morning,
            summarizes what changed, and surfaces what matters before I open
            the markets app.
          </p>
          <p>
            The economics flip the moment the same pipeline fans out. A
            scheduled portfolio briefing costs cents to generate; routing the
            same JSON pipeline and same reasoning model to a hundred
            subscribers turns one personal experiment into one of the cheapest
            research operations imaginable.{' '}
            <strong>
              One deterministic pipeline, one reasoning model, many recipients.
            </strong>{' '}
            The interesting next step isn&apos;t more features — it&apos;s more
            readers.
          </p>
        </div>

        <div className="case-study-footer">
          <CaseStudyBack />
        </div>
      </Reveal>
      </article>
    </main>
  )
}
