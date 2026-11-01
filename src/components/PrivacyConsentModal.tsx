import React from 'react';
import { ShieldAlert, Sparkles, X } from 'lucide-react';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  includeQuestion: boolean;
  hasQuestionText: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PrivacyConsentModal: React.FC<PrivacyConsentModalProps> = ({
  isOpen,
  includeQuestion,
  hasQuestionText,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      data-testid="privacy-consent-modal"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#17141F] border-2 border-[#C6A66A] shadow-2xl p-5 text-[#F3E7D1] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#622F48]/70 border border-[#C6A66A]/50 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-[#C6A66A]" />
            </div>
            <div>
              <h2
                id="privacy-modal-title"
                className="text-lg font-serif font-bold text-[#F3E7D1]"
              >
                Yapay Zekâ ve Gizlilik Bilgilendirmesi
              </h2>
              <p className="text-xs text-[#C6A66A]">Google Gemini API Kullanımı</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Kapat"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-[#302139] hover:bg-[#622F48] text-[#F3E7D1]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-[#F3E7D1]/90 bg-[#302139]/60 border border-[#C6A66A]/30 rounded-xl p-3.5 safe-text-wrap">
          <p>
            • <strong>Kişisel Verilerin Korunması:</strong> Gerçek danışan isimleri, telefon
            numaraları veya özel kimlik bilgileri varsayılan olarak Gemini API&apos;ye
            gönderilmez. Metinleriniz gönderim öncesinde otomatik olarak anonimleştirilir.
          </p>
          <p>
            • <strong>Ücretsiz Katman Bildirimi:</strong> Google Gemini API&apos;nin ücretsiz
            katmanı (Free Tier) kullanıldığında, gönderilen soru ve kart bağlamı Google
            tarafından ürün ve hizmetleri geliştirmek amacıyla işlenebilir. Lütfen gerçek
            kişi adları veya hassas kişisel bilgiler yazmaktan kaçının.
          </p>
          {includeQuestion && hasQuestionText ? (
            <p className="text-[#C6A66A] font-medium">
              • Seçiminiz doğrultusunda yazdığınız soru metni (anonimleştirilerek) yoruma
              dahil edilecektir.
            </p>
          ) : (
            <p className="text-[#C6A66A]/90">
              • Danışan sorusu paylaşımı kapalıdır; yalnızca açılan kartlar, pozisyonları ve
              anonim notlar gönderilecektir.
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCancel}
            data-testid="privacy-cancel-btn"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#302139] hover:bg-[#622F48]/70 border border-[#C6A66A]/35 text-xs sm:text-sm font-medium text-[#F3E7D1] transition-colors"
          >
            Vazgeç (Klasik Anlamlarla Devam Et)
          </button>
          <button
            type="button"
            onClick={onConfirm}
            data-testid="privacy-confirm-btn"
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#C6A66A] hover:bg-[#d6b87e] text-[#17141F] font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-colors shadow-gold"
          >
            <Sparkles className="w-4 h-4" />
            Onayla ve Gemini ile Yorumla
          </button>
        </div>
      </div>
    </div>
  );
};
