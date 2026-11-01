import { describe, it, expect, beforeEach } from 'vitest';
import worker, {
  Env,
  QUOTA_EXCEEDED_MESSAGE_TR,
  resetRateLimitBucketsForTest,
} from '../../worker/src/index';

const SAMPLE_CARDS = [
  {
    cardId: 'major-00',
    nameTr: 'Deli (Aptal)',
    nameEn: 'The Fool',
    positionTitle: 'Geçmiş',
    isReversed: false,
    isExtra: false,
    uprightMeaning: 'Yeni bir başlangıç ve saf potansiyel.',
    reversedMeaning: 'Düşüncesizce alınan riskler.',
    symbolicDescription: 'Uçurum kenarında yürüyen gezgin.',
  },
  {
    cardId: 'major-01',
    nameTr: 'Büyücü',
    nameEn: 'The Magician',
    positionTitle: 'Şimdi',
    isReversed: false,
    isExtra: false,
    uprightMeaning: 'İrade gücü ve yaratıcı ustalık.',
    reversedMeaning: 'Yeteneklerin boşa harcanması.',
    symbolicDescription: 'Dört elementi önünde bulunduran büyücü.',
  },
  {
    cardId: 'major-17',
    nameTr: 'Yıldız',
    nameEn: 'The Star',
    positionTitle: 'Gelecek',
    isReversed: true,
    isExtra: false,
    uprightMeaning: 'Umut, ilham ve ruhsal yenilenme.',
    reversedMeaning: 'Geçici umutsuzluk ve içsel şifa ihtiyacı.',
    symbolicDescription: 'Sekiz köşeli yıldız altında suya testi döken figür.',
  },
];

describe('9, 10 & 15. Cloudflare Worker Güvenlik, Kota ve Hata Kontrolleri', () => {
  beforeEach(() => {
    resetRateLimitBucketsForTest();
  });

  it('CORS allowlist dışında kalan Origin isteklerini 403 ile reddetmelidir', async () => {
    const env: Env = {
      ALLOWED_ORIGINS: 'https://taylanmert.github.io',
      GEMINI_API_KEY: 'test-key',
    };
    const req = new Request('https://worker.local/api/interpret', {
      method: 'POST',
      headers: {
        Origin: 'https://malicious-site.example.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ spreadType: 'past-present-future', cards: SAMPLE_CARDS }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(403);
    const data = (await res.json()) as { code: string };
    expect(data.code).toBe('CORS_FORBIDDEN');
  });

  it('maksimum istek boyutunu (24 KB) aşan gövdeleri 413 ile reddetmelidir', async () => {
    const env: Env = {
      ALLOWED_ORIGINS: 'http://localhost:5173',
      GEMINI_API_KEY: 'test-key',
    };
    const hugeNote = 'x'.repeat(30_000);
    const req = new Request('https://worker.local/api/interpret', {
      method: 'POST',
      headers: {
        Origin: 'http://localhost:5173',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spreadType: 'past-present-future',
        cards: SAMPLE_CARDS,
        generalNotes: hugeNote,
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(413);
    const data = (await res.json()) as { code: string };
    expect(data.code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('eksik kart veya hatalı girdi gönderildiğinde 400 VALIDATION_ERROR dönmelidir', async () => {
    const env: Env = {
      ALLOWED_ORIGINS: 'http://localhost:5173',
      GEMINI_API_KEY: 'test-key',
    };
    const req = new Request('https://worker.local/api/interpret', {
      method: 'POST',
      headers: {
        Origin: 'http://localhost:5173',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spreadType: 'past-present-future',
        cards: [SAMPLE_CARDS[0]], // 3 karttan az
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(400);
    const data = (await res.json()) as { code: string };
    expect(data.code).toBe('VALIDATION_ERROR');
  });

  it('Turnstile doğrulaması başarısız olduğunda 403 TURNSTILE_FAILED dönmelidir', async () => {
    const env: Env = {
      ALLOWED_ORIGINS: 'http://localhost:5173',
      GEMINI_API_KEY: 'test-key',
    };
    const req = new Request('https://worker.local/api/interpret', {
      method: 'POST',
      headers: {
        Origin: 'http://localhost:5173',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spreadType: 'past-present-future',
        cards: SAMPLE_CARDS,
        turnstileToken: 'INVALID_TURNSTILE_TOKEN',
      }),
    });

    const res = await worker.fetch(req, env);
    expect(res.status).toBe(403);
    const data = (await res.json()) as { code: string };
    expect(data.code).toBe('TURNSTILE_FAILED');
  });

  it('rate limit (kota) aşıldığında 429 ve zorunlu Türkçe kota mesajını dönmelidir', async () => {
    const env: Env = {
      ALLOWED_ORIGINS: 'http://localhost:5173',
      GEMINI_API_KEY: 'test-key',
      RATE_LIMIT_PER_MINUTE: '2',
    };

    const makeReq = () =>
      new Request('https://worker.local/api/interpret', {
        method: 'POST',
        headers: {
          Origin: 'http://localhost:5173',
          'CF-Connecting-IP': '203.0.113.10',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadType: 'past-present-future',
          cards: SAMPLE_CARDS,
          turnstileToken: 'INVALID_TURNSTILE_TOKEN', // İlk 2 istek rate limiter'dan geçer
        }),
      });

    await worker.fetch(makeReq(), env);
    await worker.fetch(makeReq(), env);

    // 3. istek dakikadaki limiti aşar -> 429 QUOTA_EXCEEDED
    const res3 = await worker.fetch(makeReq(), env);
    expect(res3.status).toBe(429);
    const data = (await res3.json()) as { code: string; error: string };
    expect(data.code).toBe('QUOTA_EXCEEDED');
    expect(data.error).toBe(QUOTA_EXCEEDED_MESSAGE_TR);
  });

  it('hatalı API anahtarı senaryosunda 401 INVALID_API_KEY dönmeli ve çökmemelidir', async () => {
    const env: Env = {
      ALLOWED_ORIGINS: 'http://localhost:5173',
      GEMINI_API_KEY: 'AIzaSy_INVALID_KEY_FOR_TESTING_12345',
    };

    const req = new Request('https://worker.local/api/interpret', {
      method: 'POST',
      headers: {
        Origin: 'http://localhost:5173',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spreadType: 'past-present-future',
        spreadNameTr: 'Geçmiş / Şimdi / Gelecek',
        cards: SAMPLE_CARDS,
        turnstileToken: 'valid-dev-token',
      }),
    });

    const res = await worker.fetch(req, env);
    expect([401, 502]).toContain(res.status);
    const data = (await res.json()) as { ok: boolean; error: string };
    expect(data.ok).toBe(false);
    expect(data.error).toContain('Klasik tarot anlamlarını incelemeye devam edebilirsiniz');
  });

  it('ücretli bir model (gemini-4-argon) yapılandırılsa bile ücretsiz katman modeline (gemini-3.8-flash) geri dönmelidir', async () => {
    const env: Env = {
      ALLOWED_ORIGINS: 'http://localhost:5173',
      GEMINI_MODEL: 'gemini-4-argon',
    };
    const req = new Request('https://worker.local/api/health', {
      method: 'GET',
      headers: { Origin: 'http://localhost:5173' },
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(200);
    const data = (await res.json()) as { model: string };
    expect(data.model).toBe('gemini-3.8-flash');
  });
});
