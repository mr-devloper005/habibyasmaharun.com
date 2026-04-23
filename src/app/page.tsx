import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Bookmark, Building2, FileText, Image as ImageIcon, LayoutGrid, MapPin, MessageCircle, Search, ShieldCheck, Sparkles, Tag, User, Zap } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { fetchTaskPosts } from '@/lib/task-data'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import type { SitePost } from '@/lib/site-connector'
import { HOME_PAGE_OVERRIDE_ENABLED, HomePageOverride } from '@/overrides/home-page'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/',
    title: siteContent.home.metadata.title,
    description: siteContent.home.metadata.description,
    openGraphTitle: siteContent.home.metadata.openGraphTitle,
    openGraphDescription: siteContent.home.metadata.openGraphDescription,
    image: SITE_CONFIG.defaultOgImage,
    keywords: [...siteContent.home.metadata.keywords],
  })
}

type EnabledTask = (typeof SITE_CONFIG.tasks)[number]
type TaskFeedItem = { task: EnabledTask; posts: SitePost[] }

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: Bookmark,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

function resolveTaskKey(value: unknown, fallback: TaskKey): TaskKey {
  if (value === 'listing' || value === 'classified' || value === 'article' || value === 'image' || value === 'profile' || value === 'sbm') return value
  return fallback
}

function getTaskHref(task: TaskKey, slug: string) {
  const route = SITE_CONFIG.tasks.find((item) => item.key === task)?.route || `/${task}`
  return `${route}/${slug}`
}

function getPostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImage = typeof post?.content === 'object' && post?.content && Array.isArray((post.content as any).images)
    ? (post.content as any).images.find((url: unknown) => typeof url === 'string' && url)
    : null
  const logo = typeof post?.content === 'object' && post?.content && typeof (post.content as any).logo === 'string'
    ? (post.content as any).logo
    : null
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

function getPostMeta(post?: SitePost | null) {
  if (!post || typeof post.content !== 'object' || !post.content) return { location: '', category: '' }
  const content = post.content as Record<string, unknown>
  return {
    location: typeof content.address === 'string' ? content.address : typeof content.location === 'string' ? content.location : '',
    category: typeof content.category === 'string' ? content.category : typeof post.tags?.[0] === 'string' ? post.tags[0] : '',
  }
}

function getDirectoryTone(_brandPack: string) {
  return {
    shell: 'bg-[#faf8ff] text-[#1a1a1a]',
    hero: 'relative overflow-hidden bg-[linear-gradient(180deg,#F3F0FF_0%,#ffffff_58%)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_18%,rgba(161,99,247,0.14),transparent_36%),radial-gradient(circle_at_82%_8%,rgba(238,115,177,0.12),transparent_34%)]',
    panel: 'rounded-[2rem] border border-[#e9e0ff] bg-white shadow-[0_24px_64px_rgba(107,33,168,0.08)]',
    soft: 'rounded-[1.4rem] border border-[#ece6ff] bg-[#f6f3ff]',
    muted: 'text-[#5b5568]',
    title: 'text-[#1a1a1a]',
    badge: 'bg-[#1a1a1a] text-white',
    action: 'bg-gradient-to-r from-[#A163F7] to-[#EE73B1] text-white shadow-[0_14px_40px_rgba(161,99,247,0.35)] hover:opacity-95',
    actionAlt: 'border border-[#e9e0ff] bg-white text-[#1a1a1a] hover:bg-[#f9f5ff]',
    metricBar: 'rounded-[1.75rem] bg-[#1a1a1a] text-white shadow-[0_24px_60px_rgba(0,0,0,0.22)]',
  }
}

function getEditorialTone() {
  return {
    shell: 'bg-[#fbf6ee] text-[#241711]',
    panel: 'border border-[#dcc8b7] bg-[#fffdfa] shadow-[0_24px_60px_rgba(77,47,27,0.08)]',
    soft: 'border border-[#e6d6c8] bg-[#fff4e8]',
    muted: 'text-[#6e5547]',
    title: 'text-[#241711]',
    badge: 'bg-[#241711] text-[#fff1e2]',
    action: 'bg-[#241711] text-[#fff1e2] hover:bg-[#3a241b]',
    actionAlt: 'border border-[#dcc8b7] bg-transparent text-[#241711] hover:bg-[#f5e7d7]',
  }
}

function getVisualTone() {
  return {
    shell: 'bg-[#07101f] text-white',
    panel: 'border border-white/10 bg-[rgba(11,18,31,0.78)] shadow-[0_28px_80px_rgba(0,0,0,0.35)]',
    soft: 'border border-white/10 bg-white/6',
    muted: 'text-slate-300',
    title: 'text-white',
    badge: 'bg-[#8df0c8] text-[#07111f]',
    action: 'bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',
    actionAlt: 'border border-white/10 bg-white/6 text-white hover:bg-white/10',
  }
}

function getCurationTone() {
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4] shadow-[0_24px_60px_rgba(91,56,37,0.08)]',
    soft: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    title: 'text-[#261811]',
    badge: 'bg-[#5b2b3b] text-[#fff0f5]',
    action: 'bg-[#5b2b3b] text-[#fff0f5] hover:bg-[#74364b]',
    actionAlt: 'border border-[#ddcdbd] bg-transparent text-[#261811] hover:bg-[#efe3d6]',
  }
}

function DirectoryHome({ primaryTask, enabledTasks, listingPosts, classifiedPosts, profilePosts: _profilePosts, brandPack }: {
  primaryTask?: EnabledTask
  enabledTasks: EnabledTask[]
  listingPosts: SitePost[]
  classifiedPosts: SitePost[]
  profilePosts: SitePost[]
  brandPack: string
}) {
  const tone = getDirectoryTone(brandPack)
  const featuredAds = (classifiedPosts.length ? classifiedPosts : listingPosts).slice(0, 3)
  const featuredTaskKey: TaskKey = classifiedPosts.length ? 'classified' : 'listing'
  const browseRoute = primaryTask?.route || '/classifieds'
  const quickRoutes = enabledTasks.slice(0, 4)
  const heroVisual = featuredAds[0] ? getPostImage(featuredAds[0]) : '/placeholder.svg?height=900&width=1400'
  const mosaicPosts = (classifiedPosts.length ? classifiedPosts : listingPosts).slice(0, 4)
  const mosaicKey: TaskKey = classifiedPosts.length ? 'classified' : 'listing'

  const whyCards = [
    { Icon: ShieldCheck, title: 'Safer local meetups', body: 'Guided messaging and safety prompts keep contact details private until you are ready.' },
    { Icon: MessageCircle, title: 'Straightforward pricing', body: 'Post standard ads without surprise platform cuts—just clear buyer conversations.' },
    { Icon: Zap, title: 'Minutes to publish', body: 'Lean forms, fast photo uploads, and smart defaults so your listing goes live quickly.' },
  ] as const

  const steps = [
    { title: 'Create a free account', body: 'Save drafts, edit photos, and reply from one dashboard.' },
    { title: 'Publish with rich detail', body: 'Price, condition, pickup window, and maps help buyers decide faster.' },
    { title: 'Chat, then meet locally', body: 'Agree on timing, share a public spot, and complete the exchange with confidence.' },
    { title: 'Mark as sold', body: 'Close the loop so your inbox stays tidy and search stays fresh.' },
  ] as const

  return (
    <main className="bg-white text-[#1a1a1a]">
      <section className={tone.hero}>
        <div className="relative z-[1] mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 lg:px-8 lg:pb-28 lg:pt-18">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
                <Sparkles className="h-3.5 w-3.5" />
                Smart local classifieds
              </span>
              <h1 className={`mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
                Find deals nearby,{' '}
                <span className="bg-gradient-to-r from-[#A163F7] to-[#EE73B1] bg-clip-text text-transparent">post in minutes</span>, meet with confidence.
              </h1>
              <p className={`mt-6 max-w-2xl text-base leading-8 sm:text-lg ${tone.muted}`}>
                {SITE_CONFIG.name} focuses on real listings—furniture, vehicles, gigs, housing, and neighborhood services—with a layout that keeps buyers and sellers aligned.
              </p>

              <form action="/search" method="get" className={`relative z-[1] mt-10 grid gap-3 rounded-[2rem] p-3 shadow-[0_20px_50px_rgba(97,45,180,0.12)] sm:grid-cols-[1fr_auto] ${tone.panel}`}>
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-full border border-[#ece6ff] bg-[#faf7ff] px-4 py-3">
                  <Search className="h-5 w-5 shrink-0 text-[#A163F7]" />
                  <input name="q" placeholder="Search ads, categories, neighborhoods…" className="w-full bg-transparent text-sm outline-none placeholder:text-[#a39ab8]" />
                </label>
                <button type="submit" className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${tone.action}`}>
                  Search listings
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-8 flex flex-wrap gap-3 text-sm">
                <Link href={browseRoute} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold ${tone.actionAlt}`}>
                  Browse classifieds
                </Link>
                <Link href="/dashboard/ads/new" className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[#1a1a1a] px-5 py-3 font-semibold text-white hover:bg-black">
                  Post an ad
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative pb-16 md:pb-20">
              <div className={`relative overflow-hidden rounded-[2.4rem] p-4 shadow-[0_30px_80px_rgba(80,40,160,0.16)] ${tone.panel}`}>
                <div className="relative h-[300px] w-full overflow-hidden rounded-[2rem] sm:h-[380px]">
                  <ContentImage src={heroVisual} alt="Featured classified visual" fill className="object-cover" sizes="(max-width:1024px) 100vw, 480px" />
                  <div className="absolute left-5 top-5 max-w-[240px] rounded-2xl border border-white/60 bg-white/95 px-4 py-3 text-sm font-semibold text-[#1a1a1a] shadow-lg backdrop-blur">
                    98% of seller replies land within a day
                  </div>
                  <div className="absolute bottom-5 right-5 max-w-[220px] rounded-2xl border border-[#ece6ff] bg-white/95 p-4 text-xs font-medium leading-relaxed text-[#5b5568] shadow-lg backdrop-blur">
                    Photo-first cards, bold pricing, and map hints help buyers skim without guesswork.
                  </div>
                </div>
              </div>
              <div className={`absolute -bottom-6 left-1/2 hidden w-[94%] -translate-x-1/2 grid-cols-3 gap-3 md:grid`}>
                <div className={`${tone.metricBar} px-3 py-5 text-center`}>
                  <p className="text-2xl font-semibold">4.2k+</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Active ads</p>
                </div>
                <div className={`${tone.metricBar} px-3 py-5 text-center`}>
                  <p className="text-2xl font-semibold">36</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Cities covered</p>
                </div>
                <div className={`${tone.metricBar} px-3 py-5 text-center`}>
                  <p className="text-2xl font-semibold">72%</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">Repeat posters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-2 max-w-6xl px-4 pb-10 sm:px-6 md:hidden lg:px-8">
        <div className={`grid grid-cols-3 gap-2 px-2 py-4 ${tone.metricBar}`}>
          <div className="text-center">
            <p className="text-lg font-semibold">4.2k+</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Ads</p>
          </div>
          <div className="border-x border-white/15 text-center">
            <p className="text-lg font-semibold">36</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Cities</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">72%</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Return</p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">Why sellers choose us</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">A calmer way to move what you no longer need</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#5b5568]">Built for real-life exchanges—porches, parking lots, and coffee shops—not endless scrolling.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {whyCards.map(({ Icon, title, body }) => (
            <div key={title} className={`${tone.panel} p-6 text-left`}>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3ecff] text-[#A163F7]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#5b5568]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#ece6ff] pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">Fresh on the board</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Featured classifieds picked for quick wins</h2>
          </div>
          <Link href={browseRoute} className="text-sm font-semibold text-[#A163F7] hover:text-[#8a4fd6]">
            View all ads
          </Link>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featuredAds.map((post) => (
            <TaskPostCard key={post.id} post={post} href={getTaskHref(featuredTaskKey, post.slug)} taskKey={featuredTaskKey} />
          ))}
        </div>
      </section>

      <section className={`${tone.shell}`}>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
          <div className={`overflow-hidden rounded-[2.2rem] ${tone.panel}`}>
            <div className="relative h-[320px] w-full">
              <ContentImage src={mosaicPosts[0] ? getPostImage(mosaicPosts[0]) : heroVisual} alt="Classified spotlight" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">Premium-ready layout</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Give every ad room to breathe</h2>
            <p className={`mt-4 text-sm leading-7 ${tone.muted}`}>
              Cards stretch wide for photography, show condition chips, and surface pickup preferences so serious buyers can act without endless back-and-forth.
            </p>
            <Link href="/dashboard/ads/new" className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${tone.action}`}>
              Start a new listing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">From idea to sold in four calm steps</h2>
            <p className={`mt-4 max-w-xl text-sm leading-7 ${tone.muted}`}>We removed the clutter so you can focus on describing the item, setting a fair price, and coordinating a safe pickup.</p>
            <Link href="/help" className={`mt-8 inline-flex items-center gap-2 rounded-full border border-[#e9e0ff] bg-white px-5 py-3 text-sm font-semibold text-[#1a1a1a] hover:bg-[#f9f5ff]`}>
              Read safety tips
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className={`flex gap-4 rounded-[1.6rem] p-5 ${tone.soft}`}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A163F7] to-[#EE73B1] text-lg font-bold text-white" aria-hidden>
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7c6f96]">Step {index + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#5b5568]">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#ece6ff] bg-[#faf8ff] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 text-center md:grid-cols-3">
            <div className="rounded-[2rem] border border-[#e9e0ff] bg-white p-8 shadow-sm">
              <p className="text-4xl font-semibold text-[#A163F7]">+38%</p>
              <p className="mt-2 text-sm font-semibold text-[#1a1a1a]">More qualified replies</p>
              <p className="mt-2 text-xs text-[#5b5568]">Compared to generic marketplaces in our pilot cities.</p>
            </div>
            <div className="rounded-[2rem] border border-[#e9e0ff] bg-white p-8 shadow-sm">
              <p className="text-4xl font-semibold text-[#EE73B1]">3×</p>
              <p className="mt-2 text-sm font-semibold text-[#1a1a1a]">Faster median sale</p>
              <p className="mt-2 text-xs text-[#5b5568]">When listings include photos, maps, and pickup windows.</p>
            </div>
            <div className="rounded-[2rem] border border-[#e9e0ff] bg-white p-8 shadow-sm">
              <p className="text-4xl font-semibold text-[#7c5cff]">92</p>
              <p className="mt-2 text-sm font-semibold text-[#1a1a1a]">Trust & safety score</p>
              <p className="mt-2 text-xs text-[#5b5568]">Community-reported satisfaction with meetup experiences.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${tone.shell} pb-16 pt-10`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">Jump back in</p>
              <h2 className="mt-2 text-2xl font-semibold">Keep exploring</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickRoutes.map((task) => {
              const Icon = taskIcons[task.key as TaskKey] || LayoutGrid
              return (
                <Link key={task.key} href={task.route} className={`rounded-[1.6rem] p-5 ${tone.soft}`}>
                  <Icon className="h-5 w-5 text-[#A163F7]" />
                  <h3 className="mt-4 text-lg font-semibold">{task.label}</h3>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{task.description}</p>
                </Link>
              )
            })}
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {mosaicPosts.map((post) => {
              const meta = getPostMeta(post)
              return (
                <Link key={post.id} href={getTaskHref(mosaicKey, post.slug)} className={`overflow-hidden rounded-[1.8rem] ${tone.panel}`}>
                  <div className="relative h-44 overflow-hidden">
                    <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">{meta.category || 'Classified'}</p>
                    <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
                    <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Local pickup friendly listing with clear pricing and photos.'}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

function EditorialHome({ primaryTask, articlePosts, supportTasks }: { primaryTask?: EnabledTask; articlePosts: SitePost[]; supportTasks: EnabledTask[] }) {
  const tone = getEditorialTone()
  const lead = articlePosts[0]
  const side = articlePosts.slice(1, 5)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <FileText className="h-3.5 w-3.5" />
              Reading-first publication
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Essays, analysis, and slower reading designed like a publication, not a dashboard.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/articles'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Start reading
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                About the publication
              </Link>
            </div>
          </div>

          <aside className={`rounded-[2rem] p-6 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Inside this issue</p>
            <div className="mt-5 space-y-5">
              {side.map((post) => (
                <Link key={post.id} href={`/articles/${post.slug}`} className="block border-b border-black/10 pb-5 last:border-b-0 last:pb-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-60">Feature</p>
                  <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Long-form perspective with a calmer reading rhythm.'}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        {lead ? (
          <div className={`mt-12 overflow-hidden rounded-[2.5rem] ${tone.panel}`}>
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[360px] overflow-hidden">
                <ContentImage src={getPostImage(lead)} alt={lead.title} fill className="object-cover" />
              </div>
              <div className="p-8 lg:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Lead story</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">{lead.title}</h2>
                <p className={`mt-4 text-sm leading-8 ${tone.muted}`}>{lead.summary || 'A more deliberate lead story surface with room for a proper narrative setup.'}</p>
                <Link href={`/articles/${lead.slug}`} className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                  Read article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {supportTasks.slice(0, 3).map((task) => (
            <Link key={task.key} href={task.route} className={`rounded-[1.8rem] p-6 ${tone.soft}`}>
              <h3 className="text-xl font-semibold">{task.label}</h3>
              <p className={`mt-3 text-sm leading-7 ${tone.muted}`}>{task.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function VisualHome({ primaryTask, imagePosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; imagePosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getVisualTone()
  const gallery = imagePosts.length ? imagePosts.slice(0, 5) : articlePosts.slice(0, 5)
  const creators = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <ImageIcon className="h-3.5 w-3.5" />
              Visual publishing system
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Image-led discovery with creator profiles and a more gallery-like browsing rhythm.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/images'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Meet creators
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.slice(0, 5).map((post, index) => (
              <Link
                key={post.id}
                href={getTaskHref(resolveTaskKey((post as { task?: unknown }).task, 'image'), post.slug)}
                className={index === 0 ? `col-span-2 row-span-2 overflow-hidden rounded-[2.4rem] ${tone.panel}` : `overflow-hidden rounded-[1.8rem] ${tone.soft}`}
              >
                <div className={index === 0 ? 'relative h-[360px]' : 'relative h-[170px]'}>
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Visual notes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Larger media surfaces, fewer boxes, stronger pacing.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>This product avoids business-directory density and publication framing. The homepage behaves more like a visual board, with profile surfaces and imagery leading the experience.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {creators.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="relative h-40 overflow-hidden rounded-[1.2rem]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Creator profile and visual identity surface.'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function CurationHome({ primaryTask, bookmarkPosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; bookmarkPosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getCurationTone()
  const collections = bookmarkPosts.length ? bookmarkPosts.slice(0, 4) : articlePosts.slice(0, 4)
  const people = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <Bookmark className="h-3.5 w-3.5" />
              Curated collections
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Save, organize, and revisit resources through shelves, boards, and curated collections.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/sbm'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open collections
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Explore curators
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {collections.map((post) => (
              <Link key={post.id} href={getTaskHref(resolveTaskKey((post as { task?: unknown }).task, 'sbm'), post.slug)} className={`rounded-[1.8rem] p-6 ${tone.panel}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Collection</p>
                <h3 className="mt-3 text-2xl font-semibold">{post.title}</h3>
                <p className={`mt-3 text-sm leading-8 ${tone.muted}`}>{post.summary || 'A calmer bookmark surface with room for context and grouping.'}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Why this feels different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">More like saved boards and reading shelves than a generic post feed.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>The structure is calmer, the cards are less noisy, and the page encourages collecting and returning instead of forcing everything into a fast-scrolling list.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="relative h-32 overflow-hidden rounded-[1.2rem]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>Curator profile, saved resources, and collection notes.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default async function HomePage() {
  if (HOME_PAGE_OVERRIDE_ENABLED) {
    return <HomePageOverride />
  }

  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const taskFeed: TaskFeedItem[] = (
    await Promise.all(
      enabledTasks.map(async (task) => ({
        task,
        posts: await fetchTaskPosts(task.key, 8, { allowMockFallback: false, fresh: true }),
      }))
    )
  ).filter(({ posts }) => posts.length)

  const primaryTask = enabledTasks.find((task) => task.key === recipe.primaryTask) || enabledTasks[0]
  const supportTasks = enabledTasks.filter((task) => task.key !== primaryTask?.key)
  const listingPosts = taskFeed.find(({ task }) => task.key === 'listing')?.posts || []
  const classifiedPosts = taskFeed.find(({ task }) => task.key === 'classified')?.posts || []
  const articlePosts = taskFeed.find(({ task }) => task.key === 'article')?.posts || []
  const imagePosts = taskFeed.find(({ task }) => task.key === 'image')?.posts || []
  const profilePosts = taskFeed.find(({ task }) => task.key === 'profile')?.posts || []
  const bookmarkPosts = taskFeed.find(({ task }) => task.key === 'sbm')?.posts || []

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavbarShell />
      <SchemaJsonLd data={schemaData} />
      {productKind === 'directory' ? (
        <DirectoryHome
          primaryTask={primaryTask}
          enabledTasks={enabledTasks}
          listingPosts={listingPosts}
          classifiedPosts={classifiedPosts}
          profilePosts={profilePosts}
          brandPack={recipe.brandPack}
        />
      ) : null}
      {productKind === 'editorial' ? (
        <EditorialHome primaryTask={primaryTask} articlePosts={articlePosts} supportTasks={supportTasks} />
      ) : null}
      {productKind === 'visual' ? (
        <VisualHome primaryTask={primaryTask} imagePosts={imagePosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      {productKind === 'curation' ? (
        <CurationHome primaryTask={primaryTask} bookmarkPosts={bookmarkPosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      <Footer />
    </div>
  )
}
