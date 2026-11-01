import os
import json
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "cards")
os.makedirs(OUTPUT_DIR, exist_ok=True)

MAJOR_FILES = [
    ("major-00.jpg", "File:RWS1909 - 00 Fool.jpeg"),
    ("major-01.jpg", "File:RWS1909 - 01 Magician.jpeg"),
    ("major-02.jpg", "File:RWS1909 - 02 High Priestess.jpeg"),
    ("major-03.jpg", "File:RWS1909 - 03 Empress.jpeg"),
    ("major-04.jpg", "File:RWS1909 - 04 Emperor.jpeg"),
    ("major-05.jpg", "File:RWS1909 - 05 Hierophant.jpeg"),
    ("major-06.jpg", "File:RWS1909 - 06 Lovers.jpeg"),
    ("major-07.jpg", "File:RWS1909 - 07 Chariot.jpeg"),
    ("major-08.jpg", "File:RWS1909 - 08 Strength.jpeg"),
    ("major-09.jpg", "File:RWS1909 - 09 Hermit.jpeg"),
    ("major-10.jpg", "File:RWS1909 - 10 Wheel of Fortune.jpeg"),
    ("major-11.jpg", "File:RWS1909 - 11 Justice.jpeg"),
    ("major-12.jpg", "File:RWS1909 - 12 Hanged Man.jpeg"),
    ("major-13.jpg", "File:RWS1909 - 13 Death.jpeg"),
    ("major-14.jpg", "File:RWS1909 - 14 Temperance.jpeg"),
    ("major-15.jpg", "File:RWS1909 - 15 Devil.jpeg"),
    ("major-16.jpg", "File:RWS1909 - 16 Tower.jpeg"),
    ("major-17.jpg", "File:RWS1909 - 17 Star.jpeg"),
    ("major-18.jpg", "File:RWS1909 - 18 Moon.jpeg"),
    ("major-19.jpg", "File:RWS1909 - 19 Sun.jpeg"),
    ("major-20.jpg", "File:RWS1909 - 20 Judgement.jpeg"),
    ("major-21.jpg", "File:RWS1909 - 21 World.jpeg"),
]

SUITS = [
    ("wands", "Wands"),
    ("cups", "Cups"),
    ("swords", "Swords"),
    ("pentacles", "Pentacles"),
]

ALL_CARDS = list(MAJOR_FILES)
for suit_slug, suit_wiki in SUITS:
    for num in range(1, 15):
        ALL_CARDS.append((f"{suit_slug}-{num:02d}.jpg", f"File:RWS1909 - {suit_wiki} {num:02d}.jpeg"))

HEADERS = {
    "User-Agent": "CaglaTarotApp/1.0 (https://github.com/cagla-tarot; contact@caglatarot.local) Python-urllib/3.12"
}

def get_image_urls(wiki_titles):
    url_map = {}
    batch_size = 40
    for i in range(0, len(wiki_titles), batch_size):
        batch = wiki_titles[i:i+batch_size]
        params = urllib.parse.urlencode({
            "action": "query",
            "titles": "|".join(batch),
            "prop": "imageinfo",
            "iiprop": "url",
            "iiurlwidth": "420",
            "format": "json"
        })
        api_url = f"https://commons.wikimedia.org/w/api.php?{params}"
        req = urllib.request.Request(api_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            for page in pages.values():
                title = page.get("title")
                ii = page.get("imageinfo", [])
                if title and ii:
                    thumb = ii[0].get("thumburl") or ii[0].get("url")
                    url_map[title] = thumb
    return url_map

def download_one(local_name, img_url):
    target_path = os.path.join(OUTPUT_DIR, local_name)
    if os.path.exists(target_path) and os.path.getsize(target_path) > 5000:
        return local_name, True, os.path.getsize(target_path)
    for attempt in range(4):
        try:
            req = urllib.request.Request(img_url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=25) as resp:
                content = resp.read()
                if len(content) > 5000:
                    with open(target_path, "wb") as f:
                        f.write(content)
                    return local_name, True, len(content)
        except Exception as e:
            time.sleep(1.2 * (attempt + 1))
    return local_name, False, 0

def main():
    print(f"Resolving {len(ALL_CARDS)} Wikimedia Commons 1909 Pamela Colman Smith URLs...")
    titles = [t for _, t in ALL_CARDS]
    url_map = get_image_urls(titles)
    print(f"Resolved {len(url_map)} URLs.")

    tasks = []
    for local_name, wiki_title in ALL_CARDS:
        img_url = url_map.get(wiki_title)
        if not img_url:
            print(f"ERROR: Missing URL for {wiki_title}")
            continue
        tasks.append((local_name, img_url))

    success_count = 0
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(download_one, ln, u) for ln, u in tasks]
        for fut in as_completed(futures):
            ln, ok, sz = fut.result()
            if ok:
                success_count += 1
            else:
                print(f"FAILED: {ln}")

    print(f"Downloaded {success_count}/{len(ALL_CARDS)} cards to {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
