"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { ContentImage } from "@/components/shared/content-image";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

export function ImageModal({ isOpen, imageUrl, alt, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-12 -top-12 z-10 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={onClose}
          aria-label="Close image"
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="relative">
          <ContentImage
            src={imageUrl}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            intrinsicWidth={1920}
            intrinsicHeight={1080}
          />
        </div>
      </div>
    </div>
  );
}
