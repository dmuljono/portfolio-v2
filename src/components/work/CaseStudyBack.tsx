'use client'

import Link from 'next/link'

export default function CaseStudyBack() {
  return (
    <Link href="/#work" className="case-study-back">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      <span>Back to portfolio</span>
    </Link>
  )
}
