import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { TAROT_DECK, getCardById } from '../../src/data/tarotDeck';
import {
  createInitialSession,
  shuffleSessionDeck,
  selectInitialCardFromDeck,
  revealCardInSession,
  drawExtraCardFromDeck,
  updateSessionSpreadType,
  computeReadingSignature,
} from '../../src/utils/tarotEngine';
import { anonymizeTextForAi } from '../../src/utils/storage';

describe('1 & 2. Tarot Destesi (78 Benzersiz Kart ve Yerel Görsel Doğrulaması)', () => {
  it('tam olarak 78 benzersiz karta sahip olmalıdır (22 Büyük Arkana + 56 Küçük Arkana)', () => {
    expect(TAROT_DECK.length).toBe(78);

    const uniqueIds = new Set(TAROT_DECK.map((c) => c.id));
    expect(uniqueIds.size).toBe(78);

    const uniqueNamesTr = new Set(TAROT_DECK.map((c) => c.nameTr));
    expect(uniqueNamesTr.size).toBe(78);

    const uniqueNamesEn = new Set(TAROT_DECK.map((c) => c.nameEn));
    expect(uniqueNamesEn.size).toBe(78);

    const majorCards = TAROT_DECK.filter((c) => c.arcana === 'major');
    const minorCards = TAROT_DECK.filter((c) => c.arcana === 'minor');
    expect(majorCards.length).toBe(22);
    expect(minorCards.length).toBe(56);

    const wands = TAROT_DECK.filter((c) => c.suit === 'wands');
    const cups = TAROT_DECK.filter((c) => c.suit === 'cups');
    const swords = TAROT_DECK.filter((c) => c.suit === 'swords');
    const pentacles = TAROT_DECK.filter((c) => c.suit === 'pentacles');

    expect(wands.length).toBe(14);
    expect(cups.length).toBe(14);
    expect(swords.length).toBe(14);
    expect(pentacles.length).toBe(14);
  });

  it('78 kartın tamamının yerel görsel dosyası public/cards/ klasöründe mevcut ve geçerli olmalıdır', () => {
    const publicDir = path.resolve(__dirname, '../../public');
    const uniqueImagePaths = new Set(TAROT_DECK.map((c) => c.image));
    expect(uniqueImagePaths.size).toBe(78);

    for (const card of TAROT_DECK) {
      expect(card.id).toBeTruthy();
      expect(card.nameTr.length).toBeGreaterThanOrEqual(2);
      expect(card.nameEn.length).toBeGreaterThan(2);
      expect(card.uprightMeaning.length).toBeGreaterThan(30);
      expect(card.reversedMeaning.length).toBeGreaterThan(30);
      expect(card.symbolicDescription.length).toBeGreaterThan(30);
      expect(card.keywords.length).toBeGreaterThanOrEqual(4);

      const fullImagePath = path.join(publicDir, card.image);
      expect(fs.existsSync(fullImagePath)).toBe(true);
      const stat = fs.statSync(fullImagePath);
      expect(stat.size).toBeGreaterThan(10_000); // Gerçek 1909 RWS görseli (>10 KB)
    }
  });
});

describe('3, 4, 5 & 6. Üç Kart Açılımı, Bağımsız Açılış, Ek Kartlar ve Ters Kart Sistemi', () => {
  it('kriptografik Fisher–Yates karıştırma sonrası 78 kartı eksiksiz korumalıdır', () => {
    const initial = createInitialSession('past-present-future', true, false);
    const shuffled = shuffleSessionDeck(initial);

    expect(shuffled.phase).toBe('selecting');
    expect(shuffled.shuffledDeckIds.length).toBe(78);
    expect(new Set(shuffled.shuffledDeckIds).size).toBe(78);
  });

  it('üç kapalı kart seçilmeli ve her kart birbirinden bağımsız olarak açılabilmelidir', () => {
    let session = shuffleSessionDeck(createInitialSession('past-present-future', true, false));

    // 1., 2. ve 3. kapalı kartları seç
    session = selectInitialCardFromDeck(session, 5);
    expect(session.initialCards.length).toBe(1);
    expect(session.initialCards[0].isRevealed).toBe(false);
    expect(session.phase).toBe('selecting');

    session = selectInitialCardFromDeck(session, 12);
    expect(session.initialCards.length).toBe(2);
    expect(session.initialCards[1].isRevealed).toBe(false);

    session = selectInitialCardFromDeck(session, 20);
    expect(session.initialCards.length).toBe(3);
    expect(session.phase).toBe('reading');
    expect(session.shuffledDeckIds.length).toBe(75);

    // Başlangıçta üç kartın da yüzü kapalıdır
    expect(session.initialCards.every((c) => !c.isRevealed)).toBe(true);

    const lockedIds = session.initialCards.map((c) => c.cardId);
    const lockedOrientations = session.initialCards.map((c) => c.isReversed);

    // Sadece 1. kartı aç
    session = revealCardInSession(session, session.initialCards[0].instanceId);
    expect(session.initialCards[0].isRevealed).toBe(true);
    expect(session.initialCards[1].isRevealed).toBe(false);
    expect(session.initialCards[2].isRevealed).toBe(false);

    // Sadece 2. kartı aç
    session = revealCardInSession(session, session.initialCards[1].instanceId);
    expect(session.initialCards[0].isRevealed).toBe(true);
    expect(session.initialCards[1].isRevealed).toBe(true);
    expect(session.initialCards[2].isRevealed).toBe(false);

    // 3. kartı aç
    session = revealCardInSession(session, session.initialCards[2].instanceId);
    expect(session.initialCards.every((c) => c.isRevealed)).toBe(true);

    // Kart kimlikleri ve düz/ters yönleri açılış sırasında kesinlikle değişmemelidir
    expect(session.initialCards.map((c) => c.cardId)).toEqual(lockedIds);
    expect(session.initialCards.map((c) => c.isReversed)).toEqual(lockedOrientations);
  });

  it('ek kart çekildiğinde ilk üç kart değişmemeli, hiçbir kart tekrar etmemeli ve 78 kart bitince durmalıdır', () => {
    let session = shuffleSessionDeck(createInitialSession('situation-obstacle-advice', true, false));
    session = selectInitialCardFromDeck(session, 0);
    session = selectInitialCardFromDeck(session, 0);
    session = selectInitialCardFromDeck(session, 0);

    const firstThreeSnapshot = session.initialCards.map((c) => ({
      cardId: c.cardId,
      isReversed: c.isReversed,
    }));

    // Kalan 75 kartın tamamını art arda ek kart olarak çek
    for (let i = 0; i < 75; i++) {
      session = drawExtraCardFromDeck(session);
    }

    expect(session.extraCards.length).toBe(75);
    expect(session.shuffledDeckIds.length).toBe(0);

    // 79. kartı çekmeye çalıştığında çekme işlemi durdurulmalı
    const afterEmpty = drawExtraCardFromDeck(session);
    expect(afterEmpty.extraCards.length).toBe(75);

    // İlk üç kart kesinlikle değişmemiş olmalı
    expect(
      afterEmpty.initialCards.map((c) => ({
        cardId: c.cardId,
        isReversed: c.isReversed,
      }))
    ).toEqual(firstThreeSnapshot);

    // Toplam 78 çekilen kartın tamamı benzersiz olmalı (hiç tekrar olmamalı)
    const allDrawnIds = [
      ...afterEmpty.initialCards.map((c) => c.cardId),
      ...afterEmpty.extraCards.map((c) => c.cardId),
    ];
    expect(allDrawnIds.length).toBe(78);
    expect(new Set(allDrawnIds).size).toBe(78);
  });

  it('ters kart modu kapalıyken tüm kartlar düz (isReversed = false) gelmelidir', () => {
    let session = shuffleSessionDeck(createInitialSession('free', false, false));
    session = selectInitialCardFromDeck(session, 0);
    session = selectInitialCardFromDeck(session, 0);
    session = selectInitialCardFromDeck(session, 0);
    session = drawExtraCardFromDeck(session);

    for (const c of [...session.initialCards, ...session.extraCards]) {
      expect(c.isReversed).toBe(false);
    }
  });

  it('açılım pozisyonları değiştirildiğinde kart kimlikleri korunmalı, sadece pozisyon başlıkları güncellenmelidir', () => {
    let session = shuffleSessionDeck(createInitialSession('past-present-future', true, false));
    session = selectInitialCardFromDeck(session, 1);
    session = selectInitialCardFromDeck(session, 2);
    session = selectInitialCardFromDeck(session, 3);

    const idsBefore = session.initialCards.map((c) => c.cardId);
    session = updateSessionSpreadType(session, 'situation-obstacle-advice');

    expect(session.initialCards.map((c) => c.cardId)).toEqual(idsBefore);
    expect(session.initialCards.map((c) => c.positionTitle)).toEqual([
      'Mevcut Durum',
      'Karşılaşılan Engel',
      'Sembolik Tavsiye',
    ]);
  });

  it('kişisel verileri (e-posta, telefon, danışan adı) Gemini öncesi anonimleştirmelidir', () => {
    const raw =
      'Danışan Adı: Ayşe Yılmaz, tel: 0532 123 45 67 ve mail ayse@example.com için kariyer açılımı.';
    const cleaned = anonymizeTextForAi(raw);
    expect(cleaned).not.toContain('Ayşe Yılmaz');
    expect(cleaned).not.toContain('0532 123 45 67');
    expect(cleaned).not.toContain('ayse@example.com');
    expect(cleaned).toContain('[ANONİM]');
    expect(cleaned).toContain('[TELEFON GİZLENDİ]');
    expect(cleaned).toContain('[E-POSTA GİZLENDİ]');
  });

  it('aynı açılım durumu için deterministik imza (signatureKey) üretmelidir', () => {
    let session = shuffleSessionDeck(createInitialSession('past-present-future', false, true));
    session = selectInitialCardFromDeck(session, 0);
    session = selectInitialCardFromDeck(session, 0);
    session = selectInitialCardFromDeck(session, 0);
    const sig1 = computeReadingSignature(session);
    const sig2 = computeReadingSignature(session);
    expect(sig1).toBe(sig2);
    expect(getCardById('major-00')?.nameTr).toContain('Deli');
  });
});
