import HeroSection from '@/components/hero/HeroSection'
import AiSection from '@/components/ai/AiSection'
import WorkSection from '@/components/work/WorkSection'
import ArchiveSection from '@/components/archive/ArchiveSection'
import AboutSection from '@/components/about/AboutSection'
import ContactSection from '@/components/contact/ContactSection'

export default function Home() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── AI / Navi ─────────────────────────────────────────────── */}
      <AiSection />

      {/* ── Work ──────────────────────────────────────────────────── */}
      <WorkSection />

      {/* ── About ─────────────────────────────────────────────────── */}
      <AboutSection />

      {/* ── Contact ───────────────────────────────────────────────── */}
      <ContactSection />

      {/* ── Archive ───────────────────────────────────────────────── */}
      <ArchiveSection />
    </main>
  )
}
