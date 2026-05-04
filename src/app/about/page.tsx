import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, ShieldCheck, Sparkles, Tag, Zap } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

const highlights = [
  { label: "Active classified ads", value: "4.2k+" },
  { label: "Neighborhoods covered", value: "120+" },
  { label: "Median reply time", value: "< 6 hrs" },
];

const values = [
  {
    title: "Local-first by design",
    description:
      "Pickup windows, map hints, and plain-language pricing keep exchanges grounded in the real world.",
    Icon: MapPin,
  },
  {
    title: "Seller-friendly flows",
    description: "Posting stays lightweight so you can list tonight and meet buyers tomorrow.",
    Icon: Zap,
  },
  {
    title: "Safety baked in",
    description: "Guided messaging and meetup reminders reduce friction before you ever share personal details.",
    Icon: ShieldCheck,
  },
];

const pillars = [
  {
    title: "Clarity over clutter",
    body: "Every screen is tuned for scanning: bold prices, honest condition labels, and photos that load fast on mobile.",
  },
  {
    title: "Trust you can feel",
    body: "We steer conversations through safer defaults—public meetup suggestions, optional masking, and clear reporting paths.",
  },
  {
    title: "Built for repeat use",
    body: "Saved drafts, quick renewals, and a dashboard that respects your time when you sell often.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      sectionEyebrow="Company"
      title={`About ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is a modern classifieds experience focused on local trust, fast posting, and calmer buyer conversations.`}
      actions={
        <>
          <Button variant="outline" asChild className="rounded-full border-[#e9e0ff] bg-white">
            <Link href="/help">Help centre</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-[#A163F7] to-[#EE73B1] text-white shadow-md hover:opacity-95"
          >
            <Link href="/contact">
              Contact us
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </>
      }
    >
      <div className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/classifieds"
          className="inline-flex items-center gap-2 rounded-full border border-[#ece6ff] bg-[#faf7ff] px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f3ecff]"
        >
          <Tag className="h-4 w-4 text-[#A163F7]" />
          Browse classifieds
        </Link>
        <Link
          href="/help"
          className="inline-flex items-center gap-2 rounded-full border border-[#ece6ff] bg-white px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#faf7ff]"
        >
          <Sparkles className="h-4 w-4 text-[#EE73B1]" />
          Help centre
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-[#e9e0ff] bg-white shadow-md">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <Badge className="border-0 bg-[#f3ecff] text-[#6b3ab5]">Our story</Badge>
            <h2 className="text-2xl font-semibold tracking-tight text-[#1a1a1a]">
              A calmer corner of the internet for local buying and selling.
            </h2>
            <p className="text-sm leading-relaxed text-[#5b5568]">
              {SITE_CONFIG.name} trims the noise so you can list what you no longer need, discover nearby deals, and coordinate
              pickups without juggling a dozen apps.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#ece6ff] bg-[#faf7ff] p-4 text-center sm:text-left">
                  <div className="text-2xl font-bold text-[#1a1a1a]">{item.value}</div>
                  <div className="mt-1 text-xs font-medium text-[#7c6f96]">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {values.map(({ title, description, Icon }) => (
            <Card key={title} className="border-[#e9e0ff] bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3ecff] text-[#A163F7]">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a1a]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5b5568]">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <section className="mt-12 rounded-[1.75rem] border border-[#e9e0ff] bg-gradient-to-br from-[#faf7ff] via-white to-[#fff5fb] p-6 sm:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">How we build</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#1a1a1a] sm:text-3xl">Principles that shape every release</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm">
              <h3 className="font-semibold text-[#1a1a1a]">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b5568]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] border border-[#e9e0ff] bg-[#1a1a1a] px-6 py-8 text-white sm:flex-row sm:items-center sm:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Next step</p>
          <p className="mt-2 text-lg font-semibold">Questions before you post?</p>
          <p className="mt-1 max-w-md text-sm text-white/70">Our help centre covers pricing, photos, and safer meetups—written for real sellers.</p>
        </div>
        <Button asChild variant="secondary" className="shrink-0 rounded-full bg-white text-[#1a1a1a] hover:bg-[#f3ecff]">
          <Link href="/help">
            Open help centre
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      </PageShell>
  );
}
