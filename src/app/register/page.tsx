import { ListChecks, Tag } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { REGISTER_PAGE_OVERRIDE_ENABLED, RegisterPageOverride } from '@/overrides/register-page'
import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  if (REGISTER_PAGE_OVERRIDE_ENABLED) {
    return <RegisterPageOverride />
  }

  const shell = 'bg-[linear-gradient(180deg,#F3F0FF_0%,#ffffff_55%)] text-[#1a1a1a]'
  const panel = 'border border-[#e9e0ff] bg-white shadow-[0_24px_64px_rgba(107,33,168,0.08)]'
  const side = 'border border-[#ece6ff] bg-[#faf7ff]'
  const muted = 'text-[#5b5568]'
  const action = 'border-0 bg-gradient-to-r from-[#A163F7] to-[#EE73B1] text-white hover:opacity-95'

  return (
    <div className={`min-h-screen ${shell}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className={`rounded-[2rem] p-8 ${side}`}>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#e9e0ff]">
              <Tag className="h-6 w-6 text-[#A163F7]" />
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em]">Create your free classifieds account</h1>
            <p className={`mt-5 text-sm leading-8 ${muted}`}>
              Publish ads in minutes, upload photos, and chat with local buyers. We keep the experience lightweight so you can move fast.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                { title: 'Guided posting', body: 'Step-by-step flows so your ad reads clearly and converts.' },
                { title: 'Local-first reach', body: 'Designed for neighborhood pickups and nearby buyers.' },
                { title: 'Transparent pricing', body: 'No surprise platform fees on standard listings.' },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-[#e9e0ff] bg-white px-4 py-4 text-sm shadow-sm">
                  <div className="flex items-center gap-2 font-semibold text-[#1a1a1a]">
                    <ListChecks className="h-4 w-4 text-[#A163F7]" />
                    {item.title}
                  </div>
                  <p className={`mt-2 ${muted}`}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] p-8 ${panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">Create account</p>
            <RegisterForm submitClassName={action} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
