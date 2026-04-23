"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { buildPostUrl } from "@/lib/task-data";
import { normalizeCategory, isValidCategory } from "@/lib/categories";
import type { TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { getLocalPostsForTask } from "@/lib/local-posts";

type Props = {
  task: TaskKey;
  initialPosts: SitePost[];
  category?: string;
};

export function TaskListClient({ task, initialPosts, category }: Props) {
  const localPosts = getLocalPostsForTask(task);

  const merged = useMemo(() => {
    const bySlug = new Set<string>();
    const combined: Array<SitePost & { localOnly?: boolean; task?: TaskKey }> = [];

    localPosts.forEach((post) => {
      if (post.slug) {
        bySlug.add(post.slug);
      }
      combined.push(post);
    });

    initialPosts.forEach((post) => {
      if (post.slug && bySlug.has(post.slug)) return;
      combined.push(post);
    });

    const normalizedCategory = category ? normalizeCategory(category) : "all";
    if (normalizedCategory === "all") {
      return combined.filter((post) => {
        const content = post.content && typeof post.content === "object" ? post.content : {};
        const value = typeof (content as any).category === "string" ? (content as any).category : "";
        return !value || isValidCategory(value);
      });
    }

    return combined.filter((post) => {
      const content = post.content && typeof post.content === "object" ? post.content : {};
      const value =
        typeof (content as any).category === "string"
          ? normalizeCategory((content as any).category)
          : "";
      return value === normalizedCategory;
    });
  }, [category, initialPosts, localPosts]);

  if (!merged.length) {
    if (task === "classified") {
      return (
        <div className="rounded-[2rem] border border-dashed border-[#e9e0ff] bg-gradient-to-b from-[#faf7ff] to-white px-6 py-14 text-center sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7c6f96]">Nothing here yet</p>
          <h3 className="mt-3 text-2xl font-semibold text-[#1a1a1a]">No classifieds match this view</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#5b5568]">
            Try another category, clear filters, or be the first to post in this lane—buyers check this board every day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/classifieds"
              className="inline-flex items-center justify-center rounded-full border border-[#e9e0ff] bg-white px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] shadow-sm hover:bg-[#faf7ff]"
            >
              View all categories
            </Link>
            <Link
              href="/dashboard/ads/new"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#A163F7] to-[#EE73B1] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
            >
              Post an ad
            </Link>
            <Link href="/help" className="inline-flex items-center justify-center text-sm font-semibold text-[#A163F7] hover:underline">
              Help centre
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
        No posts yet for this section.
      </div>
    );
  }

  return (
    <div className={task === "classified" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-4"}>
      {merged.map((post) => {
        const localOnly = (post as any).localOnly;
        const href = localOnly
          ? `/local/${task}/${post.slug}`
          : buildPostUrl(task, post.slug);
        return <TaskPostCard key={post.id} post={post} href={href} taskKey={task} />;
      })}
    </div>
  );
}
