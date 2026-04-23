import Link from 'next/link'
import { ShieldCheck, Sparkles, Tag } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { LOGIN_PAGE_OVERRIDE_ENABLED, LoginPageOverride } from '@/overrides/login-page'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  if (LOGIN_PAGE_OVERRIDE_ENABLED) {
    return <LoginPageOverride />
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
        <section className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
          <div className={`rounded-[2rem] p-8 ${side}`}>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#e9e0ff]">
              <Tag className="h-6 w-6 text-[#A163F7]" />
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em]">Welcome back to your classifieds hub</h1>
            <p className={`mt-5 text-sm leading-8 ${muted}`}>
              Post new ads, reply to buyers, and keep your conversations organized. Your session stays on this device after you sign in.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                { title: 'Saved session', body: 'Stay signed in locally so returning feels instant.' },
                { title: 'Seller-safe tools', body: 'Keep contact details private until you are ready to reply.' },
                { title: 'Focused inbox', body: 'See interest on your ads without wading through noise.' },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-[#e9e0ff] bg-white px-4 py-4 text-sm shadow-sm">
                  <div className="flex items-center gap-2 font-semibold text-[#1a1a1a]">
                    <ShieldCheck className="h-4 w-4 text-[#A163F7]" />
                    {item.title}
                  </div>
                  <p className={`mt-2 ${muted}`}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] p-8 ${panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">Welcome back</p>
            <LoginForm submitClassName={action} />
            <div className={`mt-6 flex flex-wrap items-center justify-between gap-3 text-sm ${muted}`}>
              <Link href="/forgot-password" className="font-medium hover:underline">
                Forgot password?
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 font-semibold text-[#1a1a1a] hover:underline">
                <Sparkles className="h-4 w-4 text-[#A163F7]" />
                Create account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
