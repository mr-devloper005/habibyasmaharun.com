"""
Generate favicon.png, favico.png, and favicon.ico from a square logo source.
Trims near-white padding, then scales so the logo fills the output square (center crop).
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

from PIL import Image, ImageChops

# Default: logo committed next to this script (regenerate after replacing brand-logo-source.png)
DEFAULT_SOURCE = Path(__file__).resolve().parent / "brand-logo-source.png"

PNG_OUT_SIZE = 512


def tight_bbox_rgb(im: Image.Image) -> tuple[int, int, int, int]:
    """Bounding box of pixels that differ from pure white background."""
    rgb = im.convert("RGB")
    white = Image.new("RGB", rgb.size, (255, 255, 255))
    diff = ImageChops.difference(rgb, white)
    # Anything not white in diff; getbbox on grayscale of diff
    gray = diff.convert("L")
    bbox = gray.point(lambda p: 255 if p > 8 else 0).getbbox()
    if bbox is None:
        return (0, 0, rgb.width, rgb.height)
    return bbox


def pad_bbox(bbox: tuple[int, int, int, int], w: int, h: int, pad_px: int) -> tuple[int, int, int, int]:
    l, u, r, d = bbox
    l = max(0, l - pad_px)
    u = max(0, u - pad_px)
    r = min(w, r + pad_px)
    d = min(h, d + pad_px)
    return (l, u, r, d)


def square_fill(im: Image.Image, out_size: int) -> Image.Image:
    """Scale image so the shorter side equals out_size, then center-crop square (logo zoomed)."""
    w, h = im.size
    if w == 0 or h == 0:
        return Image.new("RGBA", (out_size, out_size), (255, 255, 255, 255))
    scale = out_size / min(w, h)
    nw = max(1, int(round(w * scale)))
    nh = max(1, int(round(h * scale)))
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    # Center crop to square out_size
    left = (nw - out_size) // 2
    top = (nh - out_size) // 2
    cropped = resized.crop((left, top, left + out_size, top + out_size))
    return cropped


def write_ico(square_rgba: Image.Image, path: Path) -> None:
    sizes = (16, 32, 48)
    imgs = []
    for s in sizes:
        imgs.append(square_rgba.resize((s, s), Image.Resampling.LANCZOS).convert("RGBA"))
    imgs[0].save(
        path,
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=imgs[1:],
    )


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    public = root / "public"
    public.mkdir(parents=True, exist_ok=True)

    src = Path(os.environ.get("FAVICON_SOURCE", str(DEFAULT_SOURCE)))
    if len(sys.argv) > 1:
        src = Path(sys.argv[1])
    if not src.is_file():
        print(f"Source not found: {src}", file=sys.stderr)
        return 1

    im = Image.open(src).convert("RGBA")
    bbox = tight_bbox_rgb(im)
    bbox = pad_bbox(bbox, im.width, im.height, pad_px=2)
    cropped = im.crop(bbox)
    square = square_fill(cropped, PNG_OUT_SIZE)
    # Flatten to white background for favicon consistency in tabs
    bg = Image.new("RGB", square.size, (255, 255, 255))
    bg.paste(square, mask=square.split()[3])
    square_rgb = Image.merge("RGB", bg.split())

    favicon_png = public / "favicon.png"
    favico_png = public / "favico.png"
    favicon_ico = public / "favicon.ico"

    square_rgb.save(favicon_png, "PNG", optimize=True, compress_level=9)
    square_rgb.save(favico_png, "PNG", optimize=True, compress_level=9)
    write_ico(square.convert("RGBA"), favicon_ico)

    print(f"Wrote {favicon_png}, {favico_png}, {favicon_ico} ({PNG_OUT_SIZE}px PNG, multi-size ICO)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
