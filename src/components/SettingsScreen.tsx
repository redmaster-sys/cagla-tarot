import React, { useState, useRef } from 'react';
import {
  Settings,
  Download,
  Upload,
  ShieldCheck,
  Sparkles,
  Check,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import {
  AppSettings,
  SpreadType,
  SPREAD_DEFINITIONS,
} from '../types/tarot';
import { LocalApiKeyBanner } from './LocalApiKeyBanner';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (next: AppSettings) => void;
  onExportJson: () => Promise<void>;
  onImportJson: (jsonText: string) => Promise<{ importedCount: number }>;
  onClearHistory: () => Promise<void>;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onExportJson,
  onImportJson,
  onClearHistory,
}) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const text = await file.text();
      const result = await onImportJson(text);
      setStatusMessage(
        `${result.importedCount} adet açılım başarıyla içe aktarıldı.`
      );
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'JSON dosyası içe aktarılamadı.'
      );
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className="w-full max-w-3xl mx-auto space-y-4 min-w-0"
      data-testid="settings-screen"
    >
      {/* Header */}
      <section className="rounded-2xl bg-[#302139]/75 border border-[#C6A66A]/40 p-4 sm:p-5">
        <h2 className="text-lg sm:text-xl font-serif font-bold text-[#F3E7D1] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#C6A66A]" />
          Uygulama Ayarları, Gizlilik ve Yedekleme
        </h2>
        <p className="text-xs text-[#C6A66A]/90 mt-0.5">
          Ters kart tercihini, animasyon hızını, gizlilik korumasını ve JSON veri yedeklemelerini yönetin.
        </p>
      </section>

      {/* Reading Preferences */}
      <section className="rounded-2xl bg-[#302139]/65 border border-[#C6A66A]/35 p-4 sm:p-5 space-y-4">
        <h3 className="text-sm sm:text-base font-serif font-bold text-[#C6A66A]">
          Okuma ve Masa Tercihleri
        </h3>

        <div className="space-y-3">
          {/* Allow Reversed Cards */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#17141F]/80 border border-[#C6A66A]/25">
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-[#F3E7D1]">
                Ters Kart Modu (Varsayılan)
              </div>
              <div className="text-[11px] text-[#F3E7D1]/70">
                Kart karıştırılırken ters/düz yönü kriptografik olarak sabitlenir.
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.allowReversed}
              data-testid="settings-toggle-reversed"
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  allowReversed: !settings.allowReversed,
                })
              }
              className={`min-h-[44px] px-4 py-2 rounded-xl font-semibold text-xs transition-colors shrink-0 ${
                settings.allowReversed
                  ? 'bg-[#C6A66A] text-[#17141F]'
                  : 'bg-[#302139] text-[#F3E7D1]/80 border border-[#C6A66A]/40'
              }`}
            >
              {settings.allowReversed ? 'Açık' : 'Kapalı'}
            </button>
          </div>

          {/* Animations Preference */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#17141F]/80 border border-[#C6A66A]/25">
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-[#F3E7D1]">
                3D Kart Çevirme ve Karıştırma Animasyonları
              </div>
              <div className="text-[11px] text-[#F3E7D1]/70">
                Düşük güç modunda veya hızlı okumalarda animasyonları kapatabilirsiniz.
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.animationsEnabled}
              data-testid="settings-toggle-animations"
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  animationsEnabled: !settings.animationsEnabled,
                })
              }
              className={`min-h-[44px] px-4 py-2 rounded-xl font-semibold text-xs transition-colors shrink-0 ${
                settings.animationsEnabled
                  ? 'bg-[#C6A66A] text-[#17141F]'
                  : 'bg-[#302139] text-[#F3E7D1]/80 border border-[#C6A66A]/40'
              }`}
            >
              {settings.animationsEnabled ? 'Aktif' : 'Azaltılmış'}
            </button>
          </div>

          {/* Default Spread Type */}
          <div className="p-3 rounded-xl bg-[#17141F]/80 border border-[#C6A66A]/25 space-y-2">
            <label
              htmlFor="default-spread-select"
              className="text-xs sm:text-sm font-semibold text-[#F3E7D1] block"
            >
              Varsayılan Üç Kart Açılım Türü
            </label>
            <select
              id="default-spread-select"
              value={settings.defaultSpreadType}
              data-testid="settings-spread-select"
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  defaultSpreadType: e.target.value as SpreadType,
                })
              }
              className="w-full min-h-[44px] rounded-xl bg-[#302139] border border-[#C6A66A]/45 px-3 py-2 text-xs sm:text-sm text-[#F3E7D1] focus:outline-none focus:border-[#C6A66A]"
            >
              {(Object.keys(SPREAD_DEFINITIONS) as SpreadType[]).map((key) => (
                <option key={key} value={key}>
                  {SPREAD_DEFINITIONS[key].nameTr} (
                  {SPREAD_DEFINITIONS[key].positions.join(' / ')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Privacy & Backend Endpoint */}
      <section className="rounded-2xl bg-[#302139]/65 border border-[#C6A66A]/35 p-4 sm:p-5 space-y-4">
        <h3 className="text-sm sm:text-base font-serif font-bold text-[#C6A66A] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Gizlilik ve Cloudflare Worker Bağlantısı
        </h3>

        <div className="rounded-xl bg-[#17141F]/85 border border-[#C6A66A]/30 p-3.5 text-xs text-[#F3E7D1]/85 space-y-1.5 leading-relaxed safe-text-wrap">
          <p>
            • <strong>API Anahtarı Güvenliği:</strong> <code>GEMINI_API_KEY</code> yalnızca
            Cloudflare Worker sunucu ortamında (Secrets) tutulur; tarayıcıya veya istemci
            koduna hiçbir zaman eklenmez.
          </p>
          <p>
            • <strong>Kişisel Veri Koruması:</strong> Danışan soruları varsayılan olarak
            yapay zekâya gönderilmez. İzin verdiğinizde dahi telefon ve e-posta gibi
            veriler maskelenir.
          </p>
          <p>
            • <strong>Ücretsiz Katman Bilgilendirmesi:</strong> Ücretsiz Gemini API
            katmanında gönderilen veriler Google tarafından hizmet kalitesini geliştirmek
            amacıyla kullanılabilir.
          </p>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="worker-api-url-input"
            className="text-xs font-semibold text-[#F3E7D1] flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C6A66A]" />
            Cloudflare Worker API Uç Noktası (<code>POST /api/interpret</code>)
          </label>
          <input
            id="worker-api-url-input"
            type="text"
            value={settings.workerApiUrl}
            data-testid="settings-worker-url-input"
            onChange={(e) =>
              onUpdateSettings({
                ...settings,
                workerApiUrl: e.target.value,
              })
            }
            placeholder="/api/interpret veya https://cagla-tarot-worker.<hesap>.workers.dev/api/interpret"
            className="w-full min-h-[44px] rounded-xl bg-[#17141F] border border-[#C6A66A]/40 px-3.5 py-2 text-xs sm:text-sm text-[#F3E7D1] focus:outline-none focus:border-[#C6A66A]"
          />
        </div>

        <LocalApiKeyBanner compact />
      </section>

      {/* Data Export / Import */}
      <section className="rounded-2xl bg-[#302139]/65 border border-[#C6A66A]/35 p-4 sm:p-5 space-y-4">
        <h3 className="text-sm sm:text-base font-serif font-bold text-[#C6A66A]">
          Veri Yedekleme (JSON Dışa / İçe Aktarma)
        </h3>

        {statusMessage && (
          <div
            className="rounded-xl bg-[#17141F] border border-[#C6A66A] p-3 text-xs text-[#C6A66A] flex items-center gap-2"
            data-testid="settings-status-msg"
          >
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            className="rounded-xl bg-[#622F48]/60 border border-[#C6A66A] p-3 text-xs text-[#F3E7D1] flex items-center gap-2"
            data-testid="settings-error-msg"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-[#C6A66A]" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              await onExportJson();
              setStatusMessage('JSON yedek dosyası indirildi.');
            }}
            data-testid="export-json-btn"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#C6A66A] hover:bg-[#d5b77d] text-[#17141F] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Açılımları JSON Olarak Dışa Aktar</span>
          </button>

          <label
            htmlFor="import-json-file"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#17141F] hover:bg-[#622F48]/70 border border-[#C6A66A]/50 text-[#F3E7D1] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 text-[#C6A66A]" />
            <span>JSON Yedeği İçe Aktar</span>
            <input
              ref={fileInputRef}
              id="import-json-file"
              type="file"
              accept="application/json,.json"
              onChange={handleFileUpload}
              data-testid="import-json-input"
              className="sr-only"
            />
          </label>

          <button
            type="button"
            onClick={async () => {
              await onClearHistory();
              setStatusMessage('Kaydedilmiş geçmiş açılımlar temizlendi.');
            }}
            data-testid="clear-history-btn"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#17141F] hover:bg-[#622F48] border border-[#C6A66A]/30 text-[#F3E7D1]/80 text-xs sm:text-sm inline-flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-[#C6A66A]" />
            <span>Geçmişi Temizle</span>
          </button>
        </div>
      </section>
    </div>
  );
};
