import Reveal from '@/components/ui/Reveal'

function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

interface CaseStudy {
  id: string
  cv: string
  blobColor: string
  tag: string
  tagColor: string
  title: string
  description: string
  href: string
  image?: string   // optional foreground imagery for the canvas
}

const CASES: CaseStudy[] = [
  {
    id: 'open-claw',
    cv: 'cv-1',
    blobColor: 'var(--turq)',
    tag: 'Personal · WhatsApp News · 2026',
    tagColor: 'var(--turq)',
    title: 'OpenClaw',
    description:
      'A multi-functional personal assistant for knowledge and finance — delivered through WhatsApp.',
    href: '/work/openclaw',
    image: '/openclaw.png',
  },
  {
    id: 'glean-ai-workflow',
    cv: 'cv-2',
    blobColor: 'var(--bill-warm)',
    tag: 'DBS · NDA Sanitized · 2025',
    tagColor: 'var(--bill-warm)',
    title: 'Glean AI Workflow',
    description:
      'Experience and curriculum for building reliable AI workflows at work — structured prompting, grounding, and maker-checker patterns.',
    href: '#',
    image: '/ai_workflow.png',
  },
]

export default function WorkSection() {
  return (
    <section className="section" id="work">

      {/* ── Section header ──────────────────────────────────────── */}
      <div className="section-head">
        <Reveal>
          <span className="label-pill">
            <span className="ldot" style={{ background: 'var(--bill-warm)' }} />
            Work
          </span>
          <h2>
            A few things I&apos;ve built —{' '}
            <br />
            <span className="serif">case studies inside.</span>
          </h2>
        </Reveal>

      </div>

      {/* ── Case study grid ─────────────────────────────────────── */}
      <div className="work-grid">
        {CASES.map((c, i) => (
          <Reveal key={c.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
            <a className={`case ${c.cv}`} href={c.href}>
              <div className="canvas">
                <div className="cv-blob" />
                {c.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="cv-image" src={c.image} alt="" aria-hidden />
                )}
              </div>

              <div className="arrow-tile">
                <ArrowUpRight />
              </div>

              <div className="meta">
                <span className="ctag">
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.tagColor, flexShrink: 0 }} />
                  {c.tag}
                </span>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

    </section>
  )
}
