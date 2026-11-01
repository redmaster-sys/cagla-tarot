import os
import zlib
import struct
import math

PUBLIC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")

def write_png(filepath, width, height, rgba_bytes):
    def make_chunk(chunk_type, data):
        chunk = struct.pack(">I", len(data)) + chunk_type + data
        crc = zlib.crc32(chunk_type + data) & 0xFFFFFFFF
        return chunk + struct.pack(">I", crc)

    raw_data = bytearray()
    stride = width * 4
    for y in range(height):
        raw_data.append(0)  # Filter type 0 (None)
        raw_data.extend(rgba_bytes[y * stride : (y + 1) * stride])

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    compressed = zlib.compress(bytes(raw_data), 9)

    with open(filepath, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(make_chunk(b"IHDR", ihdr))
        f.write(make_chunk(b"IDAT", compressed))
        f.write(make_chunk(b"IEND", b""))

def render_tarot_icon(size):
    buf = bytearray(size * size * 4)
    cx = size / 2.0
    cy = size / 2.0
    r_outer = size * 0.42
    r_inner = size * 0.30
    r_core = size * 0.12

    for y in range(size):
        for x in range(size):
            dx = x - cx
            dy = y - cy
            dist = math.hypot(dx, dy)
            idx = (y * size + x) * 4

            # Base night black #17141F
            r, g, b, a = 23, 20, 31, 255

            # Inner plum card frame
            margin = size * 0.08
            if margin <= x < size - margin and margin <= y < size - margin:
                r, g, b = 48, 33, 57  # #302139

            # Gold border around card frame
            border_w = max(2.0, size * 0.018)
            if (margin <= x < size - margin and margin <= y < size - margin) and (
                abs(x - margin) < border_w or abs(x - (size - margin)) < border_w or
                abs(y - margin) < border_w or abs(y - (size - margin)) < border_w
            ):
                r, g, b = 198, 166, 106  # #C6A66A

            # Mystic circle
            if dist < r_outer:
                if abs(dist - r_outer) < border_w:
                    r, g, b = 198, 166, 106
                elif dist < r_inner:
                    r, g, b = 98, 47, 72  # #622F48 burgundy
                    if abs(dist - r_inner) < border_w:
                        r, g, b = 198, 166, 106
                    elif dist < r_core:
                        r, g, b = 243, 231, 209  # #F3E7D1 cream moon/star core
                else:
                    r, g, b = 23, 20, 31

            buf[idx] = r
            buf[idx + 1] = g
            buf[idx + 2] = b
            buf[idx + 3] = a
    return buf

def main():
    for sz in (192, 512):
        out = os.path.join(PUBLIC_DIR, f"icon-{sz}.png")
        write_png(out, sz, sz, render_tarot_icon(sz))
        print(f"Generated {out} ({os.path.getsize(out)} bytes)")

if __name__ == "__main__":
    main()
