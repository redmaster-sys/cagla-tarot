import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const devVarsPath = path.join(__dirname, '.dev.vars');
const bundleOutPath = path.join(__dirname, '.wrangler', 'local-worker-bundle.mjs');

fs.mkdirSync(path.dirname(bundleOutPath), { recursive: true });

await build({
  entryPoints: [path.join(__dirname, 'src', 'index.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: bundleOutPath,
  external: ['@google/genai'],
});

const workerModule = await import(`file://${bundleOutPath.replace(/\\/g, '/')}`);
const worker = workerModule.default;

function loadDevVars() {
  const env = {
    GEMINI_MODEL: 'gemini-3.5-flash-lite',
    ALLOWED_ORIGINS: '*',
    RATE_LIMIT_PER_MINUTE: '20',
    GLOBAL_LIMIT_PER_HOUR: '300',
    GEMINI_TIMEOUT_MS: '25000',
  };

  if (fs.existsSync(devVarsPath)) {
    const content = fs.readFileSync(devVarsPath, 'utf-8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx > 0) {
        const key = line.slice(0, eqIdx).trim();
        const val = line
          .slice(eqIdx + 1)
          .trim()
          .replace(/^['"]|['"]$/g, '');
        if (val && val !== 'BURAYA_API_ANAHTARINIZI_YAPISTIRIN') {
          env[key] = val;
        }
      }
    }
  }
  return env;
}

const PORT = 8787;

function extractCleanApiKey(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return '';
  const match = rawInput.match(/AIza[0-9A-Za-z\-_]{20,80}/);
  if (match && match[0]) {
    return match[0].trim();
  }
  const cleaned = rawInput
    .replace(/^GEMINI_API_KEY\s*=\s*/im, '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
  if (!cleaned || cleaned === 'BURAYA_API_ANAHTARINIZI_YAPISTIRIN') {
    return '';
  }
  return cleaned;
}

const server = http.createServer(async (req, res) => {
  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    if (req.method === 'POST' && req.url === '/api/dev-save-key') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      let parsed = {};
      try {
        parsed = JSON.parse(bodyBuffer.toString('utf-8'));
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ ok: false, error: 'Geçersiz JSON verisi.' }));
        return;
      }

      const cleanKey = extractCleanApiKey(parsed.apiKey);
      if (!cleanKey || cleanKey.length < 15) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            ok: false,
            error:
              'Geçerli bir Gemini API anahtarı bulunamadı. Lütfen AIza... ile başlayan anahtarınızı yapıştırın veya kaydettiğiniz dosyayı seçin.',
          })
        );
        return;
      }

      const fileContent = [
        '# Yerel gelistirme icin Gemini API anahtarinizi asagiya yazip dosyayi kaydedin:',
        '# Ornek: GEMINI_API_KEY=AIzaSy...',
        `GEMINI_API_KEY=${cleanKey}`,
        'GEMINI_MODEL=gemini-3.5-flash-lite',
        '',
      ].join('\n');

      fs.writeFileSync(devVarsPath, fileContent, 'utf-8');
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, hasApiKey: true }));
      return;
    }

    const url = `http://127.0.0.1:${PORT}${req.url || '/'}`;
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (Array.isArray(v)) {
        headers.set(k, v.join(', '));
      } else if (typeof v === 'string') {
        headers.set(k, v);
      }
    }

    const fetchReq = new Request(url, {
      method: req.method || 'GET',
      headers,
      body:
        req.method !== 'GET' && req.method !== 'HEAD' && bodyBuffer.length > 0
          ? bodyBuffer
          : undefined,
    });

    const env = loadDevVars();
    const fetchRes = await worker.fetch(fetchReq, env);

    res.statusCode = fetchRes.status;
    fetchRes.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    const resBuffer = Buffer.from(await fetchRes.arrayBuffer());
    res.end(resBuffer);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        ok: false,
        error: 'Yerel Worker sunucu hatası oluştu.',
      })
    );
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Local Cloudflare Worker running on http://127.0.0.1:${PORT}`);
});
