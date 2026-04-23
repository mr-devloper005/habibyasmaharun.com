'use client'

import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'

export function PageShell({
  title,
  description,
  actions,
  children,
  sectionEyebrow = 'Classifieds',
}: {
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
  /** Small label above the title (e.g. Company, Support) */
  sectionEyebrow?: string
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F3F0FF_0%,#ffffff_42%)] text-[#1a1a1a]">
      <NavbarShell />
      <main>
        <section className="border-b border-[#ece6ff] bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">{sectionEyebrow}</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl">{title}</h1>
                {description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5b5568] sm:text-base">{description}</p>}
              </div>
              {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">{children}</section>
      </main>
      <Footer />
    </div>
  )
}
