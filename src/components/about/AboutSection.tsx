import Reveal from '@/components/ui/Reveal'
import StackRail from './StackRail'

const QUOTES = [
  {
    text: 'If you can get 1 percent better each day for one year, you’ll end up thirty-seven times better by the time you’re done.',
    author: 'James Clear, Atomic Habits',
  },
  {
    text: 'Master the best that other people have already figured out.',
    author: 'Charlie Munger',
  },
]

export default function AboutSection() {
  return (
    <section className="section" id="about">

      {/* ── Section header ──────────────────────────────────────── */}
      <div className="section-head">
        <Reveal>
          <span className="label-pill">
            <span className="ldot" style={{ background: 'var(--turq)' }} />
            About
          </span>
          <h2>
            In the messy <span className="serif">middle</span> —{' '}
            <br />
            where business, systems and risk collide.
          </h2>
        </Reveal>
      </div>

      {/* ── Two-col grid ────────────────────────────────────────── */}
      <div className="about-grid">

        {/* Left — bio + skills */}
        <Reveal delay={1} className="glass about-card">
          <div className="bio-head">
            <div className="label">Bio</div>
            <div className="portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/portrait/danielM.png" alt="Daniel Muljono" />
            </div>
          </div>
          <p>
            I&apos;m a Jakarta-based technologist working at the intersection of
            banking technology, governance, automation and AI workflows. My
            day-to-day sits where business teams, systems, regulations and
            internal controls collide — and where translating cleanly between
            them matters most.
          </p>
          <p>
            I stay close to what&apos;s emerging across industries, especially in
            technology. That curiosity shows up in side projects — testing new
            tools and building small systems that find the balance between
            control and efficiency, instead of trading one for the other.
          </p>

          <div className="quotes">
            {QUOTES.map(q => (
              <blockquote key={q.author} className="quote">
                <p>&ldquo;{q.text}&rdquo;</p>
                <cite>— {q.author}</cite>
              </blockquote>
            ))}
          </div>
        </Reveal>

        {/* Right — animated stack rail */}
        <StackRail />

      </div>
    </section>
  )
}
