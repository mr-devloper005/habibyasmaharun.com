"use client";

import { useState } from "react";
import { ContentImage } from "@/components/shared/content-image";
import { ImageModal } from "@/components/shared/image-modal";
import { RichContent } from "@/components/shared/rich-content";
import { ArticleComments } from "@/components/tasks/article-comments";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleSectionProps {
  title: string;
  articleAuthor: string;
  articleDate: string;
  category: string;
  postTags: string[];
  articleSummary: string;
  images: string[];
  articleHtml: string;
  slug: string;
}

export function ArticleSection({
  title,
  articleAuthor,
  articleDate,
  category,
  postTags,
  articleSummary,
  images,
  articleHtml,
  slug,
}: ArticleSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const openModal = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImage(null);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-4xl font-semibold leading-tight text-foreground">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span>By {articleAuthor}</span>
        {articleDate ? <span>{articleDate}</span> : null}
        <Badge variant="secondary" className="inline-flex items-center gap-1">
          <Tag className="h-3.5 w-3.5" />
          {category}
        </Badge>
      </div>
      {postTags.length ? (
        <div className="flex flex-wrap gap-2">
          {postTags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
      {articleSummary ? (
        <p className="text-base leading-7 text-muted-foreground">{articleSummary}</p>
      ) : null}
      {images[0] ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-muted cursor-pointer" onClick={() => openModal(images[0])}>
          <ContentImage
            src={images[0]}
            alt={`${title} featured image`}
            fill
            className="object-cover"
            intrinsicWidth={1600}
            intrinsicHeight={900}
          />
        </div>
      ) : null}
      <RichContent html={articleHtml} className="leading-8 prose-p:my-6 prose-h2:my-8 prose-h3:my-6 prose-ul:my-6" />
      <ArticleComments slug={slug} />
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={currentImage || images[0]}
        alt={title}
        onClose={closeModal}
      />
    </div>
  );
}
