# Kalan isler

- **Promo düzenleme geçmisi / audit log** — kim ne zaman ne degistirdi kaydi yok.
- **iOS durum cubugu beyaz** — normal Safari sekmesinde OS kontrolünde, boyanamaz.
  Sadece "Ana Ekrana Ekle" (standalone/PWA) modunda calisir; `apple-mobile-web-app-capable`
  ve `apple-mobile-web-app-status-bar-style` meta etiketleri henüz `layout.tsx`'e eklenmedi.

## Bitenler (bugün)
- Promo siralama (sort_order + admin ok butonlari)
- Promo opsiyonel görsel yükleme (Cloudinary)
- "AKTION" → "Zeitlich begrenztes Angebot" etiket degisikligi + kücültme
- CarsShowcaseClient hydration mismatch fix (`toLocaleString('de-CH')`)
