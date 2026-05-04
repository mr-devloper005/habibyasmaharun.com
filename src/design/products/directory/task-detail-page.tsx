'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Globe, Mail, MapPin, Phone, Tag } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { formatRichHtml } from '@/components/shared/rich-content'
import { ImageModal } from '@/components/shared/image-modal'

export function DirectoryTaskDetailPage({
  task,
  taskLabel,
  taskRoute,
  post,
  description,
  category,
  images,
  mapEmbedUrl,
  related,
}: {
  task: TaskKey
  taskLabel: string
  taskRoute: string
  post: SitePost
  description: string
  category: string
  images: string[]
  mapEmbedUrl: string | null
  related: SitePost[]
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  const content = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const location = typeof content.address === 'string' ? content.address : typeof content.location === 'string' ? content.location : ''
  const website = typeof content.website === 'string' ? content.website : ''
  const phone = typeof content.phone === 'string' ? content.phone : ''
  const email = typeof content.email === 'string' ? content.email : ''
  const highlights = Array.isArray(content.highlights) ? content.highlights.filter((item): item is string => typeof item === 'string') : []

  const openModal = (imageUrl: string) => {
    setCurrentImage(imageUrl)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentImage(null)
  }

  const schemaPayload = {
    '@context': 'https://schema.org',
    '@type': task === 'profile' ? 'Organization' : 'LocalBusiness',
    name: post.title,
    description,
    image: images[0],
    url: `${taskRoute}/${post.slug}`,
    address: location || undefined,
    telephone: phone || undefined,
    email: email || undefined,
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-950">
      <SchemaJsonLd data={schemaPayload} />
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={currentImage || images[0]}
        alt={post.title}
        onClose={closeModal}
      />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href={taskRoute} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950">
          ← Back to {taskLabel}
        </Link>

        <header className="grid gap-6 border-b border-slate-200 pb-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{category || taskLabel}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
              {location ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="font-semibold text-slate-950">Location:</span> {location}
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
            <p className="text-lg font-semibold text-slate-950">Check with seller</p>
            <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Mark as...
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400">
                <option value="">Select</option>
                <option value="interested">Interested</option>
                <option value="contacted">Contacted</option>
                <option value="saved">Saved</option>
              </select>
            </label>
            <div className="mt-4 grid gap-2 text-sm">
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 hover:bg-slate-100"
                >
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-600" />
                    Call
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                </a>
              ) : null}
              {email ? (
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent(`Enquiry: ${post.title}`)}`}
                  className="inline-flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 hover:bg-slate-100"
                >
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-600" />
                    Email
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                </a>
              ) : null}
              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 hover:bg-slate-100"
                >
                  <span className="inline-flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-600" />
                    Website
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                </a>
              ) : null}
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <div className="relative h-[420px] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => openModal(images[0])}>
                <ContentImage src={images[0]} alt={post.title} fill className="object-cover" />
              </div>
              {images.length > 1 ? (
                <div className="grid grid-cols-4 gap-3 border-t border-slate-200 p-4">
                  {images.slice(1, 5).map((image) => (
                    <div key={image} className="relative h-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 cursor-pointer" onClick={() => openModal(image)}>
                      <ContentImage src={image} alt={post.title} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Details</p>
              <div
                className="mt-4 text-sm leading-8 text-slate-600 prose prose-slate max-w-none prose-p:my-2 prose-a:text-slate-950 prose-a:underline prose-a:underline-offset-4"
                dangerouslySetInnerHTML={{ __html: formatRichHtml(description, "Details coming soon.") }}
              />
              {highlights.length ? (
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {highlights.slice(0, 6).map((item) => (
                    <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              ) : null}
              {email || phone || website ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {email ? (
                    <a
                      href={`mailto:${email}?subject=${encodeURIComponent(`Enquiry: ${post.title}`)}`}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Contact seller <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : website ? (
                    <a
                      href={website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Contact seller <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : null}
                  <Link href={taskRoute} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                    Browse more
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
              <p className="text-base font-semibold text-slate-950">Other useful links</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>
                  <Link href={taskRoute} className="inline-flex items-center gap-2 hover:underline">
                    <ArrowRight className="h-4 w-4 text-slate-500" /> Browse all {taskLabel}
                  </Link>
                </li>
                {related.slice(0, 5).map((item) => (
                  <li key={`sidebar-related-${item.id}`}>
                    <Link href={`${taskRoute}/${item.slug}`} className="inline-flex items-center gap-2 hover:underline">
                      <ArrowRight className="h-4 w-4 text-slate-500" /> {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
              <p className="text-base font-semibold text-slate-950">Contact publisher</p>
              <div className="mt-4 flex items-start gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                  <span className="text-xl font-semibold">{post.title.slice(0, 1).toUpperCase()}</span>
                </div>
                <div className="min-w-0 text-sm text-slate-700">
                  <p className="font-semibold text-slate-950">{post.authorName || 'Publisher'}</p>
                  {email ? (
                    <p className="mt-1 break-all">
                      E-mail:{' '}
                      <a className="text-slate-950 hover:underline" href={`mailto:${email}`}>
                        {email}
                      </a>
                    </p>
                  ) : null}
                  {phone ? <p className="mt-1">Phone: {phone}</p> : null}
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                <label className="grid gap-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Your name</span>
                  <input className="h-10 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-slate-400" />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Your email address</span>
                  <input type="email" className="h-10 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-slate-400" />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Message</span>
                  <textarea className="min-h-24 rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:border-slate-400" />
                </label>
                {email ? (
                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent(`Enquiry: ${post.title}`)}`}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Send message
                  </a>
                ) : website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Open website
                  </a>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Contact details coming soon.
                  </div>
                )}
              </div>
            </div>

            {mapEmbedUrl ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
                <div className="border-b border-slate-200 px-6 py-4">
                  <p className="text-sm font-semibold text-slate-950">Location</p>
                </div>
                <iframe
                  src={mapEmbedUrl}
                  title={`${post.title} map`}
                  className="h-[260px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
          </aside>
        </section>

        {related.length ? (
          <section className="mt-14">
            <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Related surfaces</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Keep browsing nearby matches.</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                <Tag className="h-3.5 w-3.5" /> {taskLabel}
              </span>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {related.map((item) => (
                <TaskPostCard key={item.id} post={item} href={`${taskRoute}/${item.slug}`} taskKey={task} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
