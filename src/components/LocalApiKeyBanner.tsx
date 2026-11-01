import React, { useState, useRef } from 'react';
import { KeyRound, Upload, Check, AlertCircle, Sparkles, Trash2 } from 'lucide-react';
import {
  saveDeviceApiKey,
  getSavedDeviceApiKey,
  clearDeviceApiKey,
} from '../services/geminiClient';

interface LocalApiKeyBannerProps {
  onKeySaved?: () => void;
  compact?: boolean;
}

export const LocalApiKeyBanner: React.FC<LocalApiKeyBannerProps> = ({
  onKeySaved,
  compact = false,
}) => {
  const [keyInput, setKeyInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(() => Boolean(getSavedDeviceApiKey()));
  const [errorText, setErrorText] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const submitKey = async (rawText: string) => {
    setErrorText(null);
    setSavedSuccess(false);
    setIsSaving(true);

    try {
      const cleaned = saveDeviceApiKey(rawText);
      if (!cleaned) {
        setErrorText(
          'Geçerli bir Gemini API anahtarı bulunamadı. Lütfen AIza... ile başlayan anahtarınızı yapıştırın veya kaydettiğiniz dosyayı seçin.'
        );
        return;
      }

      // Also attempt saving to local dev server if running on localhost
      try {
        await fetch('/api/dev-save-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: cleaned }),
        });
      } catch {
        // Ignore on static GitHub Pages / mobile
      }

      setKeyInput('');
      setHasExistingKey(true);
      setSavedSuccess(true);
      if (onKeySaved) {
        onKeySaved();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim() || isSaving) return;
    await submitKey(keyInput.trim());
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await file.text();
      await submitKey(content);
    } catch {
      setErrorText('Seçilen dosya okunamadı.');
    } finally {
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    }
  };

  const handleClearKey = () => {
    clearDeviceApiKey();
    setHasExistingKey(false);
    setSavedSuccess(false);
  };

  return (
    <div
      className={`rounded-2xl bg-[#302139]/90 border-2 border-[#C6A66A] ${
        compact ? 'p-3.5 sm:p-4' : 'p-4 sm:p-5'
      } space-y-3 shadow-gold`}
      data-testid="local-api-key-banner"
    >
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#C6A66A] shrink-0" />
          <h3 className="text-sm sm:text-base font-serif font-bold text-[#F3E7D1]">
            Gemini API Anahtarını Bağla (Telefon &amp; Bilgisayar)
          </h3>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#17141F] border border-[#C6A66A]/40 text-[#C6A66A]">
          {hasExistingKey ? '✓ Bu Cihazda Kayıtlı' : 'Yalnızca Bu Cihaza Kaydedilir'}
        </span>
      </div>

      <p className="text-xs text-[#F3E7D1]/85 leading-relaxed">
        GitHub güvenlik kuralları gereği API anahtarınız GitHub koduna eklenmez.{' '}
        <strong>AIza...</strong> ile başlayan Gemini API anahtarınızı bu cihazda (telefonunuzda
        veya bilgisayarınızda) bir kez aşağıya yapıştırıp{' '}
        <strong>&ldquo;Anahtarı Kaydet&rdquo;</strong> butonuna basın.
      </p>

      {savedSuccess && (
        <div
          className="rounded-xl bg-[#17141F] border border-[#C6A66A] p-3 text-xs text-[#C6A66A] flex items-center gap-2 font-semibold"
          data-testid="api-key-saved-msg"
        >
          <Check className="w-4 h-4 shrink-0" />
          <span>
            API anahtarınız bu cihaza başarıyla kaydedildi! Şimdi Gemini ile yorumlama
            yapabilirsiniz.
          </span>
        </div>
      )}

      {errorText && (
        <div className="rounded-xl bg-[#622F48]/70 border border-[#C6A66A] p-3 text-xs text-[#F3E7D1] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#C6A66A]" />
          <span>{errorText}</span>
        </div>
      )}

      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
      >
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="AIzaSy... ile başlayan Gemini API anahtarınızı buraya yapıştırın"
          data-testid="local-api-key-input"
          className="flex-1 min-w-0 min-h-[44px] rounded-xl bg-[#17141F] border border-[#C6A66A]/50 px-3.5 py-2 text-xs sm:text-sm text-[#F3E7D1] placeholder-[#F3E7D1]/45 focus:outline-none focus:border-[#C6A66A]"
        />

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={!keyInput.trim() || isSaving}
            data-testid="local-api-key-save-btn"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#C6A66A] hover:bg-[#d8b97f] disabled:opacity-40 text-[#17141F] font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSaving ? 'Kaydediliyor...' : 'Anahtarı Kaydet'}</span>
          </button>

          <label className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#17141F] hover:bg-[#622F48]/70 border border-[#C6A66A]/50 text-[#F3E7D1] font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0">
            <Upload className="w-4 h-4 text-[#C6A66A]" />
            <span>Dosyadan Seç</span>
            <input
              ref={fileRef}
              type="file"
              onChange={handleFileSelect}
              className="sr-only"
            />
          </label>

          {hasExistingKey && (
            <button
              type="button"
              onClick={handleClearKey}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-[#17141F] hover:bg-[#622F48] border border-[#C6A66A]/35 text-xs text-[#F3E7D1]/80 inline-flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#C6A66A]" />
              <span>Sil</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
