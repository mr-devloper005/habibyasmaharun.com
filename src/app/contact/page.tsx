import Link from 'next/link'
import {
  ArrowRight,
  Bookmark,
  Clock,
  FileText,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Tag,
} from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { CONTACT_PAGE_OVERRIDE_ENABLED, ContactPageOverride } from '@/overrides/contact-page'

function getTone(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return {
      shell: 'bg-[linear-gradient(180deg,#F3F0FF_0%,#ffffff_55%)] text-[#1a1a1a]',
      panel: 'border border-[#e9e0ff] bg-white shadow-[0_20px_50px_rgba(107,33,168,0.08)]',
      soft: 'border border-[#ece6ff] bg-[#faf7ff]',
      muted: 'text-[#5b5568]',
      action: 'bg-gradient-to-r from-[#A163F7] to-[#EE73B1] text-white hover:opacity-95',
      input: 'h-12 w-full rounded-xl border border-[#e9e0ff] bg-white px-4 text-sm text-[#1a1a1a] outline-none ring-offset-2 placeholder:text-[#a39ab8] focus:ring-2 focus:ring-[#c4a6f5]',
      textarea:
        'min-h-[180px] w-full rounded-2xl border border-[#e9e0ff] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none placeholder:text-[#a39ab8] focus:ring-2 focus:ring-[#c4a6f5]',
    }
  }
  if (kind === 'editorial') {
    return {
      shell: 'bg-[#fbf6ee] text-[#241711]',
      panel: 'border border-[#dcc8b7] bg-[#fffdfa]',
      soft: 'border border-[#e6d6c8] bg-[#fff4e8]',
      muted: 'text-[#6e5547]',
      action: 'bg-[#241711] text-[#fff1e2] hover:bg-[#3a241b]',
      input: 'h-12 w-full rounded-xl border border-[#dbc6b7] bg-white px-4 text-sm',
      textarea: 'min-h-[180px] w-full rounded-2xl border border-[#dbc6b7] bg-white px-4 py-3 text-sm',
    }
  }
  if (kind === 'visual') {
    return {
      shell: 'bg-[#07101f] text-white',
      panel: 'border border-white/10 bg-white/6',
      soft: 'border border-white/10 bg-white/5',
      muted: 'text-slate-300',
      action: 'bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',
      input: 'h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white',
      textarea: 'min-h-[180px] w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white',
    }
  }
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4]',
    soft: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    action: 'bg-[#5b2b3b] text-[#fff0f5] hover:bg-[#74364b]',
    input: 'h-12 w-full rounded-xl border border-[#ddcdbd] bg-white px-4 text-sm',
    textarea: 'min-h-[180px] w-full rounded-2xl border border-[#ddcdbd] bg-white px-4 py-3 text-sm',
  }
}

const footerPills = [
  { name: 'About', href: '/about' },
  { name: 'Help centre', href: '/help' },
  { name: 'Browse ads', href: '/classifieds' },
]

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@example.com'

export default function ContactPage() {
  if (CONTACT_PAGE_OVERRIDE_ENABLED) {
    return <ContactPageOverride />
  }

  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const tone = getTone(productKind)
  const lanes =
    productKind === 'directory'
      ? [
          { icon: Tag, title: 'Classifieds help', body: 'Get unstuck with drafts, photos, renewals, and how to price items fairly for local buyers.' },
          { icon: Phone, title: 'Trust & safety', body: 'Report suspicious activity, learn about safer meetups, and escalate urgent issues.' },
          { icon: MapPin, title: 'Coverage & categories', body: 'Request a new city cluster or category lane so your community can post with confidence.' },
        ]
      : productKind === 'editorial'
        ? [
            { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
            { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
            { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
          ]
        : productKind === 'visual'
          ? [
              { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
              { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
              { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
            ]
          : [
              { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards, and links that deserve a place in the library.' },
              { icon: Mail, title: 'Resource partnerships', body: 'Coordinate curation projects, reference pages, and link programs.' },
              { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves, collections, or profile-connected boards?' },
            ]

  return (
    <div className={`min-h-screen ${tone.shell}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">Contact {SITE_CONFIG.name}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">We read every message—especially about listings, safety, and payouts.</h1>
            <p className={`mt-5 max-w-2xl text-sm leading-8 sm:text-base ${tone.muted}`}>
              Tell us what you are trying to post, fix, or report. The more context you share, the faster we can route you to the right
              answer.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {footerPills.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center rounded-full border border-[#e9e0ff] bg-white px-4 py-2 text-sm font-semibold text-[#1a1a1a] shadow-sm hover:bg-[#faf7ff]"
                >
                  {item.name}
                </Link>
              ))}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#e9e0ff] bg-white px-4 py-2 text-sm font-semibold text-[#1a1a1a] shadow-sm hover:bg-[#faf7ff]"
              >
                <Mail className="h-4 w-4" />
                Email us
              </a>
            </div>
            <div className="mt-8 space-y-4">
              {lanes.map((lane) => (
                <div key={lane.title} className={`rounded-[1.6rem] p-5 ${tone.soft}`}>
                  <lane.icon className="h-5 w-5 text-[#A163F7]" />
                  <h2 className="mt-3 text-xl font-semibold">{lane.title}</h2>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] p-6 sm:p-8 ${tone.panel}`}>
            <div className="flex items-start gap-3 rounded-xl border border-[#ece6ff] bg-[#faf7ff] p-4">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#A163F7]" />
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">Typical reply time</p>
                <p className="mt-1 text-sm text-[#5b5568]">Most classifieds questions receive a first response within one business day.</p>
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-semibold">Send a message</h2>
            <p className={`mt-2 text-sm ${tone.muted}`}>This form is for UI demo—hook it to your support backend when ready.</p>
            <form className="mt-6 grid gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#7c6f96]">Name</label>
                <input className={`mt-1.5 ${tone.input}`} placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#7c6f96]">Email</label>
                <input type="email" className={`mt-1.5 ${tone.input}`} placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#7c6f96]">Topic</label>
                <input className={`mt-1.5 ${tone.input}`} placeholder="e.g. Renewing an ad, reporting a buyer" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#7c6f96]">Details</label>
                <textarea className={`mt-1.5 ${tone.textarea}`} placeholder="Share the full context so we can respond with the right next step." />
              </div>
              <button type="submit" className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold ${tone.action}`}>
                Send message
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
