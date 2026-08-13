from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "assets" / "hacker-mascot.png"
TARGET = ROOT / "public" / "assets" / "hacker-mascot-transparent.png"

image = Image.open(SOURCE).convert("RGBA")
width, height = image.size
pixels = image.load()

# Remove only the bright lime chroma range. Darker greens in the hoodie remain.
foreground = Image.new("L", image.size, 0)
fg = foreground.load()
for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        bright_lime = g > 105 and g - r > 34 and g - b > 42 and a > 0
        if not bright_lime:
            fg[x, y] = 255

# Keep the largest connected non-chroma region (the mascot), dropping background text/sparkles.
visited = bytearray(width * height)
largest: list[tuple[int, int]] = []
for sy in range(height):
    for sx in range(width):
        index = sy * width + sx
        if visited[index] or fg[sx, sy] == 0:
            continue
        queue = deque([(sx, sy)])
        visited[index] = 1
        component: list[tuple[int, int]] = []
        while queue:
            x, y = queue.popleft()
            component.append((x, y))
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if nx < 0 or ny < 0 or nx >= width or ny >= height:
                    continue
                ni = ny * width + nx
                if visited[ni] or fg[nx, ny] == 0:
                    continue
                visited[ni] = 1
                queue.append((nx, ny))
        if len(component) > len(largest):
            largest = component

mask = Image.new("L", image.size, 0)
mask_pixels = mask.load()
for x, y in largest:
    mask_pixels[x, y] = 255

# Restore green regions enclosed by the mascot's dark outline (hoodie/headphone details),
# while preserving open gaps between arms/body as transparent.
outside = bytearray(width * height)
queue: deque[tuple[int, int]] = deque()
for x in range(width):
    for y in (0, height - 1):
        if mask_pixels[x, y] == 0:
            outside[y * width + x] = 1
            queue.append((x, y))
for y in range(height):
    for x in (0, width - 1):
        if mask_pixels[x, y] == 0 and not outside[y * width + x]:
            outside[y * width + x] = 1
            queue.append((x, y))
while queue:
    x, y = queue.popleft()
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if nx < 0 or ny < 0 or nx >= width or ny >= height:
            continue
        ni = ny * width + nx
        if outside[ni] or mask_pixels[nx, ny] != 0:
            continue
        outside[ni] = 1
        queue.append((nx, ny))
for y in range(height):
    for x in range(width):
        if mask_pixels[x, y] == 0 and not outside[y * width + x]:
            mask_pixels[x, y] = 255

# Close tiny edge gaps and gently soften the silhouette.
mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.55))
original_alpha = image.getchannel("A")
image.putalpha(ImageChops.multiply(original_alpha, mask))

bbox = image.getbbox()
if bbox:
    left, top, right, bottom = bbox
    padding = 18
    box = (
        max(0, left - padding),
        max(0, top - padding),
        min(width, right + padding),
        min(height, bottom + padding),
    )
    image = image.crop(box)

image.save(TARGET, optimize=True)
print(f"Saved {TARGET} ({image.width}x{image.height})")
