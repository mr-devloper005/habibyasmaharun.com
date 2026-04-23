'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, User, FileText, Building2, LayoutGrid, Tag, Image as ImageIcon, MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { NAVBAR_OVERRIDE_ENABLED, NavbarOverride } from '@/overrides/navbar'

const NavbarAuthControls = dynamic(() => import('@/components/shared/navbar-auth-controls').then((mod) => mod.NavbarAuthControls), {
  ssr: false,
  loading: () => null,
})

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: LayoutGrid,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

const variantClasses = {
  'compact-bar': {
    shell: 'border-b border-slate-200/80 bg-white/88 text-slate-950 backdrop-blur-xl',
    logo: 'rounded-2xl border border-slate-200 bg-white shadow-sm',
    active: 'bg-slate-950 text-white',
    idle: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
    cta: 'rounded-full bg-slate-950 text-white hover:bg-slate-800',
    mobile: 'border-t border-slate-200/70 bg-white/95',
  },
  'editorial-bar': {
    shell: 'border-b border-[#d7c4b3] bg-[#fff7ee]/90 text-[#2f1d16] backdrop-blur-xl',
    logo: 'rounded-full border border-[#dbc6b6] bg-white shadow-sm',
    active: 'bg-[#2f1d16] text-[#fff4e4]',
    idle: 'text-[#72594a] hover:bg-[#f2e5d4] hover:text-[#2f1d16]',
    cta: 'rounded-full bg-[#2f1d16] text-[#fff4e4] hover:bg-[#452920]',
    mobile: 'border-t border-[#dbc6b6] bg-[#fff7ee]',
  },
  'floating-bar': {
    shell: 'border-b border-transparent bg-transparent text-white',
    logo: 'rounded-[1.35rem] border border-white/12 bg-white/8 shadow-[0_16px_48px_rgba(15,23,42,0.22)] backdrop-blur',
    active: 'bg-[#8df0c8] text-[#07111f]',
    idle: 'text-slate-200 hover:bg-white/10 hover:text-white',
    cta: 'rounded-full bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',
    mobile: 'border-t border-white/10 bg-[#09101d]/96',
  },
  'utility-bar': {
    shell: 'border-b border-[#d7deca] bg-[#f4f6ef]/94 text-[#1f2617] backdrop-blur-xl',
    logo: 'rounded-xl border border-[#d7deca] bg-white shadow-sm',
    active: 'bg-[#1f2617] text-[#edf5dc]',
    idle: 'text-[#56604b] hover:bg-[#e7edd9] hover:text-[#1f2617]',
    cta: 'rounded-lg bg-[#1f2617] text-[#edf5dc] hover:bg-[#2f3a24]',
    mobile: 'border-t border-[#d7deca] bg-[#f4f6ef]',
  },
} as const

const directoryPalette = {
  'directory-clean': {
    shell: 'border-b border-[#ece6ff] bg-[#faf8ff]/95 text-[#1a1a1a] shadow-[0_1px_0_rgba(161,99,247,0.06)] backdrop-blur-xl',
    logo: 'rounded-2xl border border-[#e9e0ff] bg-white shadow-sm',
    nav: 'text-[#5b5568] hover:text-[#1a1a1a]',
    search: 'border border-[#e9e0ff] bg-white text-[#5b5568] shadow-sm',
    cta: 'bg-gradient-to-r from-[#A163F7] to-[#EE73B1] text-white hover:opacity-95',
    post: 'border border-[#e9e0ff] bg-white text-[#1a1a1a] hover:bg-[#f6f3ff]',
    mobile: 'border-t border-[#ece6ff] bg-[#faf8ff]',
  },
  'market-utility': {
    shell: 'border-b border-[#ece6ff] bg-[#faf8ff]/95 text-[#1a1a1a] shadow-[0_1px_0_rgba(161,99,247,0.06)] backdrop-blur-xl',
    logo: 'rounded-xl border border-[#e9e0ff] bg-white shadow-sm',
    nav: 'text-[#5b5568] hover:text-[#1a1a1a]',
    search: 'border border-[#e9e0ff] bg-white text-[#5b5568] shadow-sm',
    cta: 'bg-gradient-to-r from-[#A163F7] to-[#EE73B1] text-white hover:opacity-95',
    post: 'border border-[#e9e0ff] bg-white text-[#1a1a1a] hover:bg-[#f6f3ff]',
    mobile: 'border-t border-[#ece6ff] bg-[#faf8ff]',
  },
} as const

export function Navbar() {
  if (NAVBAR_OVERRIDE_ENABLED) {
    return <NavbarOverride />
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const { recipe } = getFactoryState()

  const navigation = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile'), [])
  const primaryNavigation = navigation.slice(0, 5)
  const mobileNavigation = navigation.map((task) => ({
    name: task.label,
    href: task.route,
    icon: taskIcons[task.key] || LayoutGrid,
  }))
  const isDirectoryProduct = recipe.homeLayout === 'listing-home' || recipe.homeLayout === 'classified-home'

  if (isDirectoryProduct) {
    const palette = directoryPalette[(recipe.brandPack === 'market-utility' ? 'market-utility' : 'directory-clean') as keyof typeof directoryPalette]

    return (
      <header className={cn('sticky top-0 z-50 w-full', palette.shell)}>
        <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 sm:px-6 lg:flex-row lg:items-center lg:gap-4 lg:px-8 lg:py-3">
          {/* Row 1 (mobile): brand + menu | Desktop: brand + nav */}
          <div className="flex w-full min-w-0 items-center justify-between gap-3 lg:w-auto lg:max-w-[min(38vw,20rem)] lg:shrink-0 xl:max-w-[24rem]">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden p-1 sm:h-11 sm:w-11', palette.logo)}>
                  <img src="/favicon.png?v=20260422" alt={`${SITE_CONFIG.name} logo`} width="48" height="48" className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0 hidden sm:block">
                  <span className="block truncate text-lg font-semibold leading-tight sm:text-xl">{SITE_CONFIG.name}</span>
                  <span className="mt-0.5 block truncate text-[10px] uppercase tracking-[0.2em] opacity-60">{siteContent.navbar.tagline}</span>
                </div>
              </Link>

              <div className="hidden h-8 w-px shrink-0 bg-[#ece6ff] lg:block" aria-hidden />

              <div className="hidden min-w-0 items-center gap-1 lg:flex lg:gap-1.5">
                {primaryNavigation.slice(0, 5).map((task) => {
                  const isActive = pathname.startsWith(task.route)
                  return (
                    <Link
                      key={task.key}
                      href={task.route}
                      className={cn(
                        'whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-colors',
                        isActive ? 'bg-[#f3ecff] text-[#6b2fc9]' : 'text-[#5b5568] hover:bg-[#f6f3ff] hover:text-[#1a1a1a]',
                      )}
                    >
                      {task.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            <Button variant="ghost" size="icon" className="shrink-0 rounded-full lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-expanded={isMobileMenuOpen}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>

          {/* Search — full width on small screens, grows on desktop */}
          <div className="min-w-0 w-full lg:flex-1 lg:px-2">
            <Link
              href="/search"
              className={cn(
                'flex w-full items-center gap-2 rounded-full px-3 py-2 shadow-sm ring-1 ring-transparent transition-all hover:ring-[#dcc9ff]/80 sm:gap-3 sm:px-4 sm:py-2.5 lg:mx-auto lg:max-w-2xl lg:min-h-[2.75rem]',
                palette.search,
              )}
            >
              <Search className="h-4 w-4 shrink-0 text-[#A163F7]" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-left text-sm text-[#5b5568]">Search classifieds, categories, neighborhoods…</span>
              <span className="hidden shrink-0 items-center gap-1 text-xs text-[#7c6f96] sm:inline-flex">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Local
              </span>
            </Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden shrink-0 items-center justify-end gap-2 md:flex lg:w-auto">
            {isAuthenticated ? (
              <NavbarAuthControls />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="rounded-full px-4 text-[#1a1a1a] hover:bg-[#f6f3ff]">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className={cn('rounded-full shadow-sm', palette.cta)}>
                  <Link href="/dashboard/ads/new" className="flex items-center">
                    <Plus className="mr-1 h-4 w-4" />
                    Post an ad
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className={palette.mobile}>
            <div className="space-y-2 px-4 py-4">
              <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className={cn('mb-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium', palette.search)}>
                <Search className="h-4 w-4" />
                Search classifieds
              </Link>
              {mobileNavigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors', isActive ? 'bg-foreground text-background' : palette.post)}>
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              {!isAuthenticated && (
                <div className="mt-4 flex flex-col gap-2 border-t border-[#ece6ff] pt-4">
                  <Button variant="outline" size="sm" asChild className="w-full rounded-full border-[#e9e0ff] bg-white">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" asChild className={cn('w-full rounded-full shadow-sm', palette.cta)}>
                    <Link href="/dashboard/ads/new" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center">
                      <Plus className="mr-1 h-4 w-4" />
                      Post an ad
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    )
  }

  const style = variantClasses[recipe.navbar]
  const isFloating = recipe.navbar === 'floating-bar'
  const isEditorial = recipe.navbar === 'editorial-bar'
  const isUtility = recipe.navbar === 'utility-bar'

  return (
    <header className={cn('sticky top-0 z-50 w-full', style.shell)}>
      <nav className={cn('mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8', isFloating ? 'h-24 pt-4' : 'h-20')}>
        <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-7">
          <Link href="/" className="flex shrink-0 items-center gap-3 whitespace-nowrap pr-2">
            <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden p-1.5', style.logo)}>
              <img src="/favicon.png?v=20260422" alt={`${SITE_CONFIG.name} logo`} width="48" height="48" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0 hidden sm:block">
              <span className="block truncate text-xl font-semibold">{SITE_CONFIG.name}</span>
              <span className="hidden text-[10px] uppercase tracking-[0.28em] opacity-70 sm:block">{siteContent.navbar.tagline}</span>
            </div>
          </Link>

          {isEditorial ? (
            <div className="hidden min-w-0 flex-1 items-center gap-4 xl:flex">
              <div className="h-px flex-1 bg-[#d8c8bb]" />
              {primaryNavigation.map((task) => {
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('text-sm font-semibold uppercase tracking-[0.18em] transition-colors', isActive ? 'text-[#2f1d16]' : 'text-[#7b6254] hover:text-[#2f1d16]')}>
                    {task.label}
                  </Link>
                )
              })}
              <div className="h-px flex-1 bg-[#d8c8bb]" />
            </div>
          ) : isFloating ? (
            <div className="hidden min-w-0 flex-1 items-center gap-2 xl:flex">
              {primaryNavigation.map((task) => {
                const Icon = taskIcons[task.key] || LayoutGrid
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                    <Icon className="h-4 w-4" />
                    <span>{task.label}</span>
                  </Link>
                )
              })}
            </div>
          ) : isUtility ? (
            <div className="hidden min-w-0 flex-1 items-center gap-2 xl:flex">
              {primaryNavigation.map((task) => {
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('rounded-lg px-3 py-2 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                    {task.label}
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="hidden min-w-0 flex-1 items-center gap-1 overflow-hidden xl:flex">
              {primaryNavigation.map((task) => {
                const Icon = taskIcons[task.key] || LayoutGrid
                const isActive = pathname.startsWith(task.route)
                return (
                  <Link key={task.key} href={task.route} className={cn('flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap', isActive ? style.active : style.idle)}>
                    <Icon className="h-4 w-4" />
                    <span>{task.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" asChild className="hidden rounded-full md:flex">
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          {isAuthenticated ? (
            <NavbarAuthControls />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild className="rounded-full px-4">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className={style.cta}>
                <Link href="/register">{isEditorial ? 'Subscribe' : isUtility ? 'Post Now' : 'Get Started'}</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className={style.mobile}>
          <div className="space-y-2 px-4 py-4">
            <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="mb-3 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-muted-foreground">
              <Search className="h-4 w-4" />
              Search the site
            </Link>
            {mobileNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
