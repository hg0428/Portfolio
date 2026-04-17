#!/usr/bin/env python3
"""Generate favicon assets for the Hudson Gouge portfolio.

Produces in client/:
    favicon.svg            - vector, text converted to path (no font dependency)
    favicon.ico            - multi-size (16, 32, 48)
    favicon-16.png
    favicon-32.png
    favicon-180.png        - apple-touch-icon alias
    favicon-192.png
    favicon-512.png
    apple-touch-icon.png
    site.webmanifest

Usage:
    pip install pillow fonttools
    python scripts/generate_favicon.py

Tweak the design tokens below to change the look.
"""
from __future__ import annotations

from pathlib import Path
from urllib.request import urlopen

from PIL import Image, ImageDraw, ImageFont
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

# --- Design tokens ---------------------------------------------------------
TEXT = "H"
BG_COLOR = "#0A0A0A"
FG_COLOR = "#FAFAF7"
CORNER_RADIUS_PCT = 0.22  # iOS-style rounded square
PADDING_PCT = 0.10  # inner padding around text

FONT_URL = (
    "https://raw.githubusercontent.com/googlefonts/fraunces/master/"
    "fonts/static/ttf/Fraunces9pt-Black.ttf"
)

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "client"
FONT_CACHE = ROOT / "scripts" / ".cache" / "Fraunces-Black.ttf"


# --- Font ------------------------------------------------------------------
def ensure_font() -> Path:
    if FONT_CACHE.exists():
        return FONT_CACHE
    FONT_CACHE.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading Fraunces Black -> {FONT_CACHE}")
    with urlopen(FONT_URL) as resp:
        FONT_CACHE.write_bytes(resp.read())
    return FONT_CACHE


# --- PNG rendering ---------------------------------------------------------
def render_png(size: int, font_path: Path) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = int(size * CORNER_RADIUS_PCT)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=BG_COLOR)

    target = size * (1 - 2 * PADDING_PCT)
    # Binary search largest font size that fits both dimensions.
    lo, hi, best = 8, size * 2, 8
    while lo <= hi:
        mid = (lo + hi) // 2
        font = ImageFont.truetype(str(font_path), mid)
        l, t, r, b = font.getbbox(TEXT)
        if (r - l) <= target and (b - t) <= target:
            best = mid
            lo = mid + 1
        else:
            hi = mid - 1

    font = ImageFont.truetype(str(font_path), best)
    l, t, r, b = font.getbbox(TEXT)
    w, h = r - l, b - t
    x = (size - w) / 2 - l
    y = (size - h) / 2 - t
    draw.text((x, y), TEXT, font=font, fill=FG_COLOR)
    return img


# --- SVG rendering ---------------------------------------------------------
def build_svg(font_path: Path, size: int = 512) -> str:
    font = TTFont(str(font_path))
    cmap = font.getBestCmap()
    glyph_set = font.getGlyphSet()
    hmtx = font["hmtx"]

    def draw_text(pen) -> None:
        x_adv = 0
        for ch in TEXT:
            gname = cmap[ord(ch)]
            tpen = TransformPen(pen, (1, 0, 0, 1, x_adv, 0))
            glyph_set[gname].draw(tpen)
            x_adv += hmtx[gname][0]

    bounds_pen = BoundsPen(glyph_set)
    draw_text(bounds_pen)
    x_min, y_min, x_max, y_max = bounds_pen.bounds

    svg_pen = SVGPathPen(glyph_set)
    draw_text(svg_pen)
    path_d = svg_pen.getCommands()

    text_w = x_max - x_min
    text_h = y_max - y_min
    padding = size * PADDING_PCT
    avail = size - 2 * padding
    scale = min(avail / text_w, avail / text_h)

    # Transform translate(tx, ty) scale(s, -s) maps (gx, gy) -> (tx + gx*s, ty - gy*s).
    # Center the ink bbox inside the viewBox.
    tx = size / 2 - (x_min + x_max) / 2 * scale
    ty = size / 2 + (y_min + y_max) / 2 * scale

    radius = size * CORNER_RADIUS_PCT
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">\n'
        f'  <rect width="{size}" height="{size}" rx="{radius:.2f}" fill="{BG_COLOR}"/>\n'
        f'  <g transform="translate({tx:.2f} {ty:.2f}) scale({scale:.4f} {-scale:.4f})" fill="{FG_COLOR}">\n'
        f'    <path d="{path_d}"/>\n'
        f"  </g>\n"
        f"</svg>\n"
    )


# --- Webmanifest -----------------------------------------------------------
WEBMANIFEST = f"""{{
  "name": "Hudson Gouge",
  "short_name": "Hudson Gouge",
  "icons": [
    {{ "src": "/favicon-192.png", "sizes": "192x192", "type": "image/png" }},
    {{ "src": "/favicon-512.png", "sizes": "512x512", "type": "image/png" }}
  ],
  "theme_color": "{BG_COLOR}",
  "background_color": "{BG_COLOR}",
  "display": "standalone"
}}
"""


# --- Main ------------------------------------------------------------------
def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    font_path = ensure_font()

    png_sizes = [16, 32, 48, 180, 192, 512]
    pngs: dict[int, Image.Image] = {}
    for s in png_sizes:
        img = render_png(s, font_path)
        pngs[s] = img
        # 48 is only used inside the .ico
        if s != 48:
            out = OUT_DIR / f"favicon-{s}.png"
            img.save(out, format="PNG", optimize=True)
            print(f"wrote {out.relative_to(ROOT)}")

    # apple-touch-icon alias
    apple = OUT_DIR / "apple-touch-icon.png"
    pngs[180].save(apple, format="PNG", optimize=True)
    print(f"wrote {apple.relative_to(ROOT)}")

    # Multi-size ICO
    ico_path = OUT_DIR / "favicon.ico"
    pngs[16].save(
        ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[pngs[32], pngs[48]],
    )
    print(f"wrote {ico_path.relative_to(ROOT)}")

    # SVG
    svg_path = OUT_DIR / "favicon.svg"
    svg_path.write_text(build_svg(font_path))
    print(f"wrote {svg_path.relative_to(ROOT)}")

    # Webmanifest
    manifest_path = OUT_DIR / "site.webmanifest"
    manifest_path.write_text(WEBMANIFEST)
    print(f"wrote {manifest_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
