import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { mockFaqs } from '@/data/mock-data'
import { ArrowRight, BookOpen, MessageCircle, Search, Shield, Tag } from 'lucide-react'

const topics = [
  {
    title: 'Getting started',
    description: 'Create an account, verify your email, and publish your first classified in minutes.',
    Icon: BookOpen,
  },
  {
    title: 'Posting great ads',
    description: 'Photos, pricing, condition notes, and pickup preferences that attract serious buyers.',
    Icon: MessageCircle,
  },
  {
    title: 'Staying safe locally',
    description: 'Meet in public, keep chat on-platform, and red flags to watch for when selling.',
    Icon: Shield,
  },
]

const quickGuides = [
  { label: 'Search listings', href: '/search', Icon: Search },
  { label: 'Browse all ads', href: '/classifieds', Icon: Tag },
  { label: 'About us', href: '/about', Icon: BookOpen },
]

export default function HelpPage() {
  return (
    <PageShell
      sectionEyebrow="Support"
      title="Help centre"
      description="Guides for posting classifieds, meeting buyers safely, and keeping your inbox organized."
      actions={
        <>
          <Button variant="outline" asChild className="rounded-full border-[#e9e0ff] bg-white">
            <Link href="/about">About</Link>
          </Button>
          <Button asChild className="rounded-full bg-gradient-to-r from-[#A163F7] to-[#EE73B1] text-white shadow-md hover:opacity-95">
            <Link href="/contact">
              Contact support
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </>
      }
    >
      <div className="mb-10 flex flex-wrap gap-2">
        {quickGuides.map(({ label, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-2 rounded-full border border-[#ece6ff] bg-white px-4 py-2 text-sm font-medium text-[#1a1a1a] shadow-sm hover:bg-[#faf7ff]"
          >
            <Icon className="h-4 w-4 text-[#A163F7]" />
            {label}
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">Popular topics</p>
          <h2 className="mt-2 text-xl font-semibold text-[#1a1a1a]">Start with the basics</h2>
          <p className="mt-2 max-w-xl text-sm text-[#5b5568]">Pick a lane below—each card links to ideas you can apply today, before you even open the FAQ.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {topics.map(({ title, description, Icon }) => (
              <Card
                key={title}
                className="border-[#e9e0ff] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#dcc9ff] hover:shadow-md"
              >
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3ecff] text-[#A163F7]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a]">{title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5b5568]">{description}</p>
                  <Link href="/contact" className="mt-4 inline-flex items-center text-sm font-semibold text-[#A163F7] hover:underline">
                    Ask about this
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-[#e9e0ff] bg-gradient-to-b from-white to-[#faf7ff] shadow-md">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Still stuck?</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b5568]">
                Send a note with screenshots or links—we route classifieds questions to the right teammate faster when context is
                clear.
              </p>
              <Button asChild className="mt-5 w-full rounded-full bg-[#1a1a1a] text-white hover:bg-black sm:w-auto">
                <Link href="/contact">Email the team</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[#e9e0ff] bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">FAQ</h3>
              <p className="mt-1 text-sm text-[#5b5568]">Short answers to the questions we see most often.</p>
              <Accordion type="single" collapsible className="mt-4">
                {mockFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-[#ece6ff]">
                    <AccordionTrigger className="text-left text-[#1a1a1a] hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-[#5b5568]">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
