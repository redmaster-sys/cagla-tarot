# Çağla Tarot — Dijital Tarot Masası (`cagla-tarot`)

**Çağla Tarot — Dijital Tarot Masası**, tarot okumaları yapan Çağla için özel olarak geliştirilmiş; 1909 Pamela Colman Smith çizimli **78 kartlık klasik Rider–Waite–Smith** destesini kriptografik karıştırma, gerçekçi 3D kart açılımı, ek kart çekimi, çevrimdışı yerel kütüphane ve **Google Gemini API** destekli sembolik yorumlama ile birleştiren mobil öncelikli (Mobile-First) Türkçe bir PWA web uygulamasıdır.

---

## 1. Mimari ve Teknoloji Yığını

### Frontend (İstemci — GitHub Pages)
- **Framework:** React 18 + TypeScript + Vite 6
- **Stil & Tasarım:** Tailwind CSS + Özel Kadife Masa (`#17141F` Gece Siyahı, `#302139` Koyu Mürdüm, `#622F48` Bordo, `#C6A66A` Altın, `#F3E7D1` Krem)
- **Animasyon:** Framer Motion (Karıştırma animasyonu, 78 kartlık kapalı deste seçimi ve gerçekçi 3D `preserve-3d` kart çevirme)
- **Depolama:** `IndexedDB` (`cagla-tarot-db`) + `localStorage` anlık oturum koruma + JSON yedek dışa/içe aktarma
- **PWA:** `manifest.webmanifest`, `sw.js` (78 kart görseli için çevrimdışı önbellekleme), iOS Safari `apple-mobile-web-app-capable` ve `viewport-fit=cover` safe-area desteği

### Backend (Sunucu — Cloudflare Workers)
- **Çalışma Ortamı:** Cloudflare Workers (`worker/src/index.ts`)
- **Yapay Zekâ SDK:** `@google/genai` (`>= 2.29.1`) — Güncel **Interactions API** (`client.interactions.create`)
- **Model Yapılandırması (`GEMINI_MODEL`):**
  - Resmî Google Gemini API dokümantasyonuna göre `gemini-2.5-flash-lite` eski (legacy/kısıtlı) statüde olduğundan ve yeni projelerde güncel ücretsiz katman (Free Tier) modelleri önerildiğinden, varsayılan model **`gemini-3.8-flash`** (veya `wrangler.toml` üzerinden değiştirilebilir biçimde **`gemini-3.5-flash-lite`**) olarak yapılandırılmıştır.
  - Ücretli katmana özel modellere (`gemini-4-argon` vb.) otomatik geçiş **kesinlikle engellenmiştir**.
- **Güvenlik Katmanları:**
  - `GEMINI_API_KEY` yalnızca Cloudflare Worker secret ortamında tutulur; istemci koduna asla sızmaz.
  - `ALLOWED_ORIGINS` ile sıkı CORS kontrolü.
  - Cloudflare Turnstile (`siteverify`) bot doğrulaması.
  - IP başına dakikada istek sınırı (`RATE_LIMIT_PER_MINUTE`) ve saatlik genel uygulama sınırı (`GLOBAL_LIMIT_PER_HOUR`).
  - Maksimum 24 KB istek boyutu (`413 Payload Too Large`) ve 25 saniye zaman aşımı kontrolü.

---

## 2. Kurulum ve Yerel Geliştirme

### Gereksinimler
- Node.js `>= 20` ve `npm`

### 1. Bağımlılıkları Yükleyin
```bash
npm install
npm --prefix worker install
```

### 2. Ortam Değişkenlerini Hazırlayın
İstemci için `.env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp .env.example .env
```
> **Önemli:** `.env` dosyasına hiçbir zaman `GEMINI_API_KEY` yazmayın!

Worker yerel geliştirme ortamı için `worker/.dev.vars` dosyası oluşturun (bu dosya `.gitignore` içindedir):
```ini
GEMINI_API_KEY="AIzaSy..."
TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA"
```

### 3. Uygulamayı Çalıştırın
```bash
# Frontend geliştirme sunucusu (http://localhost:5173)
npm run dev

# Cloudflare Worker yerel sunucusu (ayrı terminalde)
npm run worker:dev
```

---

## 3. Cloudflare Worker Kurulum ve Secret Adımları

1. Cloudflare hesabınıza giriş yapın:
   ```bash
   cd worker
   npx wrangler login
   ```
2. `worker/wrangler.toml` içindeki `ALLOWED_ORIGINS` değerine kendi GitHub Pages adresinizi ekleyin:
   ```toml
   [vars]
   GEMINI_MODEL = "gemini-3.8-flash"
   ALLOWED_ORIGINS = "https://<kullanici-adiniz>.github.io,http://localhost:5173"
   ```
3. Gizli anahtarları (`GEMINI_API_KEY` ve `TURNSTILE_SECRET_KEY`) Cloudflare Secrets olarak tanımlayın:
   ```bash
   npx wrangler secret put GEMINI_API_KEY
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```
4. Worker'ı yayınlayın:
   ```bash
   npx wrangler deploy
   ```

---

## 4. GitHub Pages Yayınlama Rehberi (`cagla-tarot`)

1. GitHub üzerinde **`cagla-tarot`** adında yeni bir repository oluşturun ve kodu gönderin:
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "feat: Çağla Tarot - Dijital Tarot Masası v1.0.0"
   git remote add origin https://github.com/<kullanici-adiniz>/cagla-tarot.git
   git push -u origin main
   ```
2. GitHub deponuzda **Settings → Pages** bölümüne gidin ve **Build and deployment → Source** olarak **GitHub Actions** seçin.
3. **Settings → Secrets and variables → Actions → Variables** sekmesinde aşağıdaki Repository Variable değerlerini tanımlayın:
   - `VITE_WORKER_API_URL`: `https://cagla-tarot-worker.<alt-alan-adiniz>.workers.dev/api/interpret`
   - `VITE_TURNSTILE_SITE_KEY`: Cloudflare Turnstile Site Key değeriniz
4. `.github/workflows/deploy-pages.yml` iş akışı her `main` push işleminde birim testlerini çalıştırır, `VITE_BASE_PATH=/cagla-tarot/` ile üretim paketini derler ve GitHub Pages'e otomatik olarak yayınlar.

---

## 5. Testleri Çalıştırma ve Doğrulanan Senaryolar

```bash
# Birim ve Worker güvenlik testleri (Vitest)
npm run test:unit

# Mobil görünüm ve uçtan uca kullanıcı senaryosu testleri (Playwright)
npm run test:e2e

# Tüm testleri birlikte çalıştır
npm test
```

### Doğrulanan 15 Test Senaryosu Özeti
1. **Toplam 78 benzersiz kart:** 22 Büyük Arkana + 56 Küçük Arkana (14 Değnek, 14 Kupa, 14 Kılıç, 14 Tılsım) — benzersiz ID, Türkçe/İngilizce ad, düz/ters anlam ve sembolizm doğrulandı (`tests/unit/tarot.test.ts`).
2. **Doğru kart görseli eşleşmeleri:** `public/cards/` altında 78 adet orijinal 1909 Pamela Colman Smith (Wikimedia Commons kamu malı) görselinin tamamı yerel olarak doğrulandı (`tests/unit/tarot.test.ts`).
3. **Üç kapalı kart seçimi:** Kriptografik Fisher–Yates karıştırma sonrası 3 kapalı kart seçimi doğrulandı (`tests/unit/tarot.test.ts`, `tests/e2e/cagla-tarot.spec.ts`).
4. **Her kartın bağımsız açılması:** 1., 2. ve 3. kartların birbirinden bağımsız olarak 3D flip ile açıldığı ve kimliklerinin sabit kaldığı doğrulandı.
5. **Ek kartlarda tekrar olmaması:** Kalan 75 kartın tamamı çekildiğinde dahi hiçbir kartın tekrar etmediği, ilk 3 kartın değişmediği ve 78 kart bitince çekimin durduğu doğrulandı.
6. **Ters kart desteği:** Ters/düz yönünün seçim anında sabitlendiği ve ters kart modu kapatıldığında tüm kartların düz geldiği doğrulandı.
7. **Sayfa yenilendiğinde oturumun korunması:** `page.reload()` sonrasında soru, kalan deste sayısı, açılan kartlar, ek kartlar ve notların eksiksiz korunduğu doğrulandı.
8. **Gemini API ile başarılı istek:** `POST /api/interpret` üzerinden 5 bölümlü Türkçe sembolik yorum ve devam sohbeti doğrulandı.
9. **Hatalı API anahtarı senaryosu:** `401 INVALID_API_KEY` durumunda uygulamanın çökmediği ve klasik anlamlara geçiş sunduğu doğrulandı.
10. **Gemini kota aşımı senaryosu:** `429 QUOTA_EXCEEDED` durumunda *"Yapay zekâ kullanım limitine ulaşıldı. Kartları açmaya ve klasik anlamları incelemeye devam edebilirsiniz."* mesajının gösterildiği doğrulandı.
11. **Bağlantısız kullanım:** Çevrimdışı modda 78 kartın tamamının, açılımın ve yerel klasik sentezin Gemini bağlantısı olmadan çalıştığı doğrulandı.
12. **Mobil ekranlarda yatay taşma olmaması:** `320px`, `360px`, `375px`, `390px`, `402px`, `430px`, `768px`, `1024px` ve `1280px` ekran genişliklerinin tamamında `scrollWidth <= innerWidth` olduğu ve üç kartın tek satırda yan yana dizildiği Playwright ile doğrulandı.
13. **PWA kurulumu:** `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png` ve mobil meta etiketleri doğrulandı.
14. **GitHub Pages üretim dağıtımı:** `VITE_BASE_PATH=/cagla-tarot/` ile üretim derlemesi ve GitHub Actions workflow dosyaları doğrulandı.
15. **Cloudflare Workers güvenlik kontrolleri:** CORS allowlist (`403`), maksimum istek boyutu (`413`), girdi doğrulama (`400`), Turnstile kontrolü (`403`), rate limiting (`429`) ve ücretli modele geçiş engeli doğrulandı (`tests/unit/worker.test.ts`).
