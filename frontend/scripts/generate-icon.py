#!/usr/bin/env python3
"""
Tone Reply app icon - warm retro-modern aesthetic
"""
from PIL import Image, ImageDraw, ImageFont
import math

SIZE = 1024

# Colors
CREAM = (253, 246, 236)
FOREST_GREEN = (61, 107, 79)
BLUSH_PINK = (232, 196, 184)
BURGUNDY = (139, 45, 45)

RAINBOW = [
    (123, 107, 141),
    (232, 120, 152),
    (212, 132, 90),
    (232, 168, 64),
    (74, 155, 168),
]

FONT_PATH = "/tmp/tone-reply/frontend/assets/fonts/PlayfairDisplay_900Black.ttf"


def create_icon():
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Cream rounded background
    draw.rounded_rectangle([0, 0, SIZE - 1, SIZE - 1], radius=220, fill=CREAM)

    # Speech bubble - large and centered
    bx, by, brx, bry = SIZE // 2, SIZE // 2 - 30, 380, 310
    draw.ellipse([bx - brx, by - bry, bx + brx, by + bry], fill=FOREST_GREEN)

    # Bubble tail
    tail = [
        (bx - 120, by + bry - 40),
        (bx - 240, by + bry + 120),
        (bx - 20, by + bry - 10),
    ]
    draw.polygon(tail, fill=FOREST_GREEN)

    # Rainbow stripe clipped to bubble
    sh = 24
    sy = by + bry - sh * 5 - 60
    for i, color in enumerate(RAINBOW):
        y0 = sy + i * sh
        for x in range(bx - 180, bx + 180):
            dx = (x - bx) / brx
            dy = (y0 - by) / bry
            if dx * dx + dy * dy <= 1.0:
                for dy2 in range(sh):
                    if dy2 == 0 and i == 0:
                        continue
                    yy = y0 + dy2
                    dy2c = (yy - by) / bry
                    if dx * dx + dy2c * dy2c <= 1.0:
                        img.putpixel((x, yy), color + (255,))

    # "T" letter - large, cream color, centered
    font = ImageFont.truetype(FONT_PATH, 520)
    bbox = draw.textbbox((0, 0), "T", font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = bx - tw // 2 - bbox[0]
    ty = by - th // 2 - bbox[1] - 40
    draw.text((tx, ty), "T", fill=CREAM, font=font)

    # Decorative ring
    for deg in range(360):
        a = math.radians(deg)
        x = int(SIZE / 2 + 480 * math.cos(a))
        y = int(SIZE / 2 + 480 * math.sin(a))
        if 165 < deg < 195:
            continue
        draw.ellipse([x - 3, y - 3, x + 3, y + 3], fill=FOREST_GREEN + (50,))

    # Small pink sparkles
    for sx, sy, sr in [(180, 180, 8), (840, 200, 10), (160, 820, 6), (860, 800, 9), (500, 120, 5), (520, 900, 7)]:
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=BLUSH_PINK + (200,))

    return img


def create_adaptive():
    img = Image.new("RGBA", (SIZE, SIZE), FOREST_GREEN)
    draw = ImageDraw.Draw(img)

    bx, by, brx, bry = SIZE // 2, SIZE // 2 - 30, 380, 310
    draw.ellipse([bx - brx, by - bry, bx + brx, by + bry], fill=CREAM)

    tail = [(bx - 120, by + bry - 40), (bx - 240, by + bry + 120), (bx - 20, by + bry - 10)]
    draw.polygon(tail, fill=CREAM)

    sh = 24
    sy = by + bry - sh * 5 - 60
    for i, color in enumerate(RAINBOW):
        y0 = sy + i * sh
        for x in range(bx - 180, bx + 180):
            dx = (x - bx) / brx
            dy = (y0 - by) / bry
            if dx * dx + dy * dy <= 1.0:
                for dy2 in range(sh):
                    yy = y0 + dy2
                    dy2c = (yy - by) / bry
                    if dx * dx + dy2c * dy2c <= 1.0:
                        img.putpixel((x, yy), color + (255,))

    font = ImageFont.truetype(FONT_PATH, 520)
    bbox = draw.textbbox((0, 0), "T", font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = bx - tw // 2 - bbox[0]
    ty = by - th // 2 - bbox[1] - 40
    draw.text((tx, ty), "T", fill=FOREST_GREEN, font=font)

    return img


if __name__ == "__main__":
    icon = create_icon()
    icon.save("/tmp/tone-reply/frontend/assets/icon.png")
    print("icon.png")

    adaptive = create_adaptive()
    adaptive.save("/tmp/tone-reply/frontend/assets/adaptive-icon.png")
    print("adaptive-icon.png")

    icon.resize((48, 48), Image.LANCZOS).save("/tmp/tone-reply/frontend/assets/favicon.png")
    print("favicon.png")

    print("Done!")
