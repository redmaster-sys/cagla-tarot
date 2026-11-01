import { test, expect } from '@playwright/test';

const REQUIRED_VIEWPORTS = [
  { name: 'Mobile-320', width: 320, height: 640 },
  { name: 'Mobile-360', width: 360, height: 740 },
  { name: 'Mobile-375-iPhoneSE', width: 375, height: 667 },
  { name: 'Mobile-390-iPhone14', width: 390, height: 844 },
  { name: 'Mobile-402-iPhone16Pro', width: 402, height: 874 },
  { name: 'Mobile-430-iPhoneProMax', width: 430, height: 932 },
  { name: 'Tablet-768', width: 768, height: 1024 },
  { name: 'Laptop-1024', width: 1024, height: 768 },
  { name: 'Desktop-1280', width: 1280, height: 800 },
];

test.describe('Çağla Tarot — E2E ve Mobil Görünüm Testleri', () => {
  test('12. Tüm zorunlu ekran genişliklerinde (320px - Masaüstü) yatay taşma olmamalı ve üç kart tek satırda hizalanmalıdır', async ({
    page,
  }) => {
    await page.goto('/');

    // Animasyonları hızlandırmak için Ayarlar'dan azaltılmış moda alalım veya doğrudan test edelim
    for (const vp of REQUIRED_VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(100);

      const overflowCheck = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        };
      });

      expect(
        overflowCheck.scrollWidth,
        `${vp.name} (${vp.width}px) ekranında yatay taşma tespit edildi`
      ).toBeLessThanOrEqual(overflowCheck.innerWidth);

      // Üç kart yuvasının tek satırda (aynı Y ekseninde) olduğunu doğrula
      const spreadRow = page.getByTestId('three-card-spread-row');
      await expect(spreadRow).toBeVisible();

      const slot0Box = await spreadRow.locator('> div').nth(0).boundingBox();
      const slot1Box = await spreadRow.locator('> div').nth(1).boundingBox();
      const slot2Box = await spreadRow.locator('> div').nth(2).boundingBox();

      expect(slot0Box).not.toBeNull();
      expect(slot1Box).not.toBeNull();
      expect(slot2Box).not.toBeNull();

      if (slot0Box && slot1Box && slot2Box) {
        // Üç kart aynı satırda olmalı (üst kenar Y koordinatları eşit)
        expect(Math.abs(slot0Box.y - slot1Box.y)).toBeLessThan(4);
        expect(Math.abs(slot1Box.y - slot2Box.y)).toBeLessThan(4);
        // Sağ kenar ekran dışına taşmamalı
        expect(slot2Box.x + slot2Box.width).toBeLessThanOrEqual(vp.width + 1);
      }
    }
  });

  test('3, 4, 5, 6 & 7. Gerçekçi üç kart açılımı, bağımsız açılış, ek kart çekimi ve sayfa yenilendiğinde oturumun korunması', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Soru yaz
    const questionInput = page.getByTestId('question-input');
    await questionInput.fill('Kariyer yolculuğumda dikkat etmem gereken semboller neler?');

    // Destede 78 kart olduğunu doğrula
    await expect(page.getByTestId('deck-remaining-count')).toContainText('78 / 78');

    // Desteyi Karıştır butonuna bas
    await page.getByTestId('shuffle-deck-btn').click();

    // Karıştırma animasyonu sonrası seçim aşaması aktif olmalı
    await expect(page.getByTestId('quick-pick-card-btn')).toBeVisible({ timeout: 5000 });

    // 3 kapalı kart seç
    await page.getByTestId('deck-card-0').click();
    await page.getByTestId('deck-card-2').click();
    await page.getByTestId('deck-card-4').click();

    // Kalan deste 75 olmalı
    await expect(page.getByTestId('deck-remaining-count')).toContainText('75 / 78');

    const card0Btn = page.getByTestId('initial-card-button-0');
    const card1Btn = page.getByTestId('initial-card-button-1');
    const card2Btn = page.getByTestId('initial-card-button-2');

    // Başlangıçta üç kart da kapalı olmalı
    await expect(card0Btn).toHaveAttribute('data-revealed', 'false');
    await expect(card1Btn).toHaveAttribute('data-revealed', 'false');
    await expect(card2Btn).toHaveAttribute('data-revealed', 'false');

    // Seçim anında sabitlenen kart ID'lerini kaydet
    const id0 = await card0Btn.getAttribute('data-card-id');
    const id1 = await card1Btn.getAttribute('data-card-id');
    const id2 = await card2Btn.getAttribute('data-card-id');
    expect(id0).toBeTruthy();
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(new Set([id0, id1, id2]).size).toBe(3);

    // 1. karta dokun -> sadece 1. kart açılmalı
    await card0Btn.click();
    await expect(card0Btn).toHaveAttribute('data-revealed', 'true');
    await expect(card1Btn).toHaveAttribute('data-revealed', 'false');
    await expect(card2Btn).toHaveAttribute('data-revealed', 'false');

    // 2. ve 3. kartları ayrı ayrı aç
    await card1Btn.click();
    await expect(card1Btn).toHaveAttribute('data-revealed', 'true');
    await expect(card2Btn).toHaveAttribute('data-revealed', 'false');

    await card2Btn.click();
    await expect(card2Btn).toHaveAttribute('data-revealed', 'true');

    // Klasik anlamlar paneli görünür olmalı
    await expect(page.getByTestId('classical-meanings-panel')).toBeVisible();

    // Bir Kart Daha Çek (Ek Kart #1)
    const drawExtraBtn = page.getByTestId('draw-extra-card-btn');
    await drawExtraBtn.click();
    await expect(page.getByTestId('deck-remaining-count')).toContainText('74 / 78');

    const extraCardBtn = page.getByTestId('extra-card-button-3');
    await expect(extraCardBtn).toHaveAttribute('data-revealed', 'false');

    // Ek kartı aç ve not yaz
    await extraCardBtn.click();
    await expect(extraCardBtn).toHaveAttribute('data-revealed', 'true');
    const extraId = await extraCardBtn.getAttribute('data-card-id');
    expect([id0, id1, id2]).not.toContain(extraId);

    const extraNoteInput = page.getByTestId('extra-card-note-input-0');
    await extraNoteInput.fill('Ek kartın getirdiği içsel denge mesajı');

    // İlk üç kartın değişmediğini doğrula
    expect(await card0Btn.getAttribute('data-card-id')).toBe(id0);
    expect(await card1Btn.getAttribute('data-card-id')).toBe(id1);
    expect(await card2Btn.getAttribute('data-card-id')).toBe(id2);

    // TEST 7: Sayfa yenilendiğinde oturumun korunması
    await page.reload();
    await expect(page.getByTestId('question-input')).toHaveValue(
      'Kariyer yolculuğumda dikkat etmem gereken semboller neler?'
    );
    await expect(page.getByTestId('deck-remaining-count')).toContainText('74 / 78');
    await expect(page.getByTestId('initial-card-button-0')).toHaveAttribute('data-card-id', id0!);
    await expect(page.getByTestId('initial-card-button-1')).toHaveAttribute('data-card-id', id1!);
    await expect(page.getByTestId('initial-card-button-2')).toHaveAttribute('data-card-id', id2!);
    await expect(page.getByTestId('extra-card-button-3')).toHaveAttribute('data-card-id', extraId!);
    await expect(page.getByTestId('extra-card-note-input-0')).toHaveValue(
      'Ek kartın getirdiği içsel denge mesajı'
    );
  });

  test('8, 9 & 10. Gemini API ile yorumlama, devam sohbeti, kota aşımı ve hatalı API anahtarı senaryoları', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Desteyi karıştır, 3 kart seç ve üçünü de aç
    await page.getByTestId('shuffle-deck-btn').click();
    await expect(page.getByTestId('quick-pick-card-btn')).toBeVisible({ timeout: 5000 });
    await page.getByTestId('quick-pick-card-btn').click();
    await page.getByTestId('quick-pick-card-btn').click();
    await page.getByTestId('quick-pick-card-btn').click();

    await page.getByTestId('initial-card-button-0').click();
    await page.getByTestId('initial-card-button-1').click();
    await page.getByTestId('initial-card-button-2').click();

    // SENARYO 8: Başarılı Gemini API Yorumu ve Devam Sohbeti
    let apiCallCount = 0;
    await page.route('**/api/interpret', async (route) => {
      apiCallCount++;
      const reqBody = route.request().postDataJSON();
      if (reqBody.mode === 'chat') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ok: true,
            mode: 'chat',
            modelUsed: 'gemini-3.8-flash',
            reply:
              'Bu açılımda ikinci kart, mevcut süreçte sezgilerinizi ve iradenizi dengede tutmanız gerektiğini sembolize ediyor.',
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          mode: 'interpret',
          modelUsed: 'gemini-3.8-flash',
          interpretation: {
            individualCards: reqBody.cards.map((c: { cardId: string; nameTr: string; positionTitle: string; isReversed: boolean }) => ({
              cardId: c.cardId,
              cardNameTr: c.nameTr,
              positionTitle: c.positionTitle,
              isReversed: c.isReversed,
              interpretation: `${c.positionTitle} konumundaki ${c.nameTr} kartı içsel farkındalık ve dönüşümü simgeliyor.`,
            })),
            combinedMessage:
              'Üç kart birlikte değerlendirildiğinde geçmiş deneyimlerden alınan güçle dengeli bir geleceğe adım atıldığı görülüyor.',
            prominentSymbols:
              '1909 Pamela Colman Smith çizimlerindeki altın ışık, dağ zirveleri ve su akışı duygusal ve zihinsel berraklığı vurgular.',
            notableThemes:
              'Yenilenme, özdenetim ve içsel rehberliğe güven temaları açılımın ana eksenini oluşturuyor.',
            extraCardsImpact:
              'Açılımın mevcut üçlü yapısı kendi içinde bütünlüklü bir rehberlik sunmaktadır.',
          },
        }),
      });
    });

    // "Gemini ile Yorumla" butonuna dokun -> Gizlilik onayı penceresi açılmalı
    await page.getByTestId('interpret-with-gemini-btn').click();
    await expect(page.getByTestId('privacy-consent-modal')).toBeVisible();
    await page.getByTestId('privacy-confirm-btn').click();

    // 5 bölümün tamamı ekranda görünmeli
    await expect(page.getByTestId('section-individual-cards')).toBeVisible();
    await expect(page.getByTestId('section-combined-message')).toBeVisible();
    await expect(page.getByTestId('section-prominent-symbols')).toBeVisible();
    await expect(page.getByTestId('section-notable-themes')).toBeVisible();
    await expect(page.getByTestId('section-extra-cards-impact')).toBeVisible();
    expect(apiCallCount).toBe(1);

    // Masaya dönüp tekrar "Gemini ile Yorumla" butonuna basıldığında gereksiz yeni API isteği gönderilmemeli!
    await page.getByTestId('nav-tab-table').click();
    await page.getByTestId('interpret-with-gemini-btn').click();
    await expect(page.getByTestId('section-combined-message')).toBeVisible();
    expect(apiCallCount).toBe(1);

    // Devam sohbeti mesajı gönder
    await page.getByTestId('chat-input').fill('İkinci kartın etkisini biraz daha açıkla.');
    await page.getByTestId('chat-send-btn').click();
    await expect(page.getByTestId('chat-messages-list')).toContainText(
      'sezgilerinizi ve iradenizi dengede tutmanız gerektiğini sembolize ediyor'
    );
    expect(apiCallCount).toBe(2);

    // SENARYO 10: Kota Aşımı (429) Senaryosu
    await page.unroute('**/api/interpret');
    await page.route('**/api/interpret', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: false,
          code: 'QUOTA_EXCEEDED',
          error:
            'Yapay zekâ kullanım limitine ulaşıldı. Kartları açmaya ve klasik anlamları incelemeye devam edebilirsiniz.',
        }),
      });
    });

    // Masaya dönüp bir ek kart çekip açalım ki yorum güncelleme isteği tetiklenebilsin
    await page.getByTestId('nav-tab-table').click();
    await page.getByTestId('draw-extra-card-btn').click();
    await page.getByTestId('extra-card-button-3').click();
    await page.getByTestId('interpret-with-gemini-btn').click();

    await expect(page.getByTestId('gemini-error-banner')).toBeVisible();
    await expect(page.getByTestId('gemini-error-message')).toHaveText(
      'Yapay zekâ kullanım limitine ulaşıldı. Kartları açmaya ve klasik anlamları incelemeye devam edebilirsiniz.'
    );

    // Kota aşıldığında klasik tarot anlamlarına / sentezine geçilebilmeli
    await page.getByTestId('use-classical-fallback-btn').click();
    await expect(page.getByTestId('section-combined-message')).toBeVisible();

    // SENARYO 9: Hatalı API Anahtarı (401 INVALID_API_KEY) Senaryosu
    await page.unroute('**/api/interpret');
    await page.route('**/api/interpret', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: false,
          code: 'INVALID_API_KEY',
          error:
            'Gemini API anahtarı geçersiz veya yetkilendirme hatası oluştu. Klasik tarot anlamlarını incelemeye devam edebilirsiniz.',
        }),
      });
    });

    await page.getByTestId('nav-tab-table').click();
    await page.getByTestId('draw-extra-card-btn').click();
    await page.getByTestId('extra-card-button-4').click();
    await page.getByTestId('interpret-with-gemini-btn').click();

    await expect(page.getByTestId('gemini-error-banner')).toBeVisible();
    await expect(page.getByTestId('gemini-error-message')).toContainText(
      'Gemini API anahtarı geçersiz'
    );
  });

  test('1, 2, 11 & 13. Kart Kütüphanesi (78 Kart), Geçmiş Açılımlar ve PWA Doğrulaması', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Bir açılım yap ve Geçmişe Kaydet
    await page.getByTestId('shuffle-deck-btn').click();
    await expect(page.getByTestId('quick-pick-card-btn')).toBeVisible({ timeout: 5000 });
    await page.getByTestId('quick-pick-card-btn').click();
    await page.getByTestId('quick-pick-card-btn').click();
    await page.getByTestId('quick-pick-card-btn').click();
    await page.getByTestId('save-reading-btn').click();

    // Geçmiş Açılımlar sekmesinde kaydın göründüğünü doğrula
    await page.getByTestId('nav-tab-history').click();
    await expect(page.getByTestId('history-count-badge')).toContainText('1 Açılım');

    // Kart Kütüphanesi sekmesine geç
    await page.getByTestId('nav-tab-library').click();
    await expect(page.getByTestId('library-card-count')).toContainText('78 / 78');

    // Büyük Arkana filtresi (22 kart)
    await page.getByTestId('library-filter-major').click();
    await expect(page.getByTestId('library-card-count')).toContainText('22 / 78');

    // Kart detay modalını aç
    await page.getByTestId('library-card-major-00').click();
    await expect(page.getByTestId('card-detail-modal')).toBeVisible();
    await page.getByTestId('close-card-modal-btn').click();

    // PWA manifest kontrolü
    const manifestHref = await page
      .locator('link[rel="manifest"]')
      .getAttribute('href');
    expect(manifestHref).toContain('manifest.webmanifest');
  });
});
