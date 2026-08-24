# Proje: Autogarage & Carrosserie Yönetim Paneli ve Kurumsal Web Sitesi

## Amaç
Müşteriler için modern randevu/hasar bildirim vitrini; garaj sahibi için mobilden tek tıkla öncesi/sonrası araç işleri, satılık araçlar ve randevuları yönetebileceği şifreli Admin Paneli.

---

## Çalışma ve İlerleme Kuralları (ÖNEMLİ)
1. **Adım Adım İlerle:** Tüm projeyi tek seferde yazma. Her büyük adımdan sonra benden onay alarak bir sonraki adıma geç.
2. **Veritabanı & SQL:** Supabase tabloları ve RLS kuralları için gerekli tüm SQL scriptlerini bana ver; ben Supabase SQL Editor'de kendim çalıştıracağım.
3. **Şifreler ve ENV:** Supabase URL/Key, Cloudflare R2, Resend API gibi gizli anahtarları doğrudan dosyaya yazma; benden adım adım iste ve `.env.local` şablonunu oluştur.

---

## Temel Mimari Kurallar
- **Frontend & Backend:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide React, Framer Motion, Server Actions.
- **Dil:** Tek Dil - İsviçre Almancası (DE-CH).
- **Veritabanı & Auth:** Supabase (PostgreSQL, Supabase Auth).
- **Medya / Depolama:** Cloudinary (resimler sunucuda yer kaplamayacak, doğrudan Cloudinary'ye yüklenecek ve URL'leri Supabase'e kaydedilecek).
- **E-posta Bildirimleri:** Resend API + React Email şablonları.
- **Güvenlik:** Formlarda Cloudflare Turnstile spam koruması.
- **Görsel ve Çizim İzni:** İkonlar, inline SVG eskizler/çizimler ve kaliteli placeholder görseller kullanmakta serbestsin.

---

## İzlenecek Adımlar

### 1. Veritabanı Şeması (Bana SQL scripti olarak hazırla):
- **projects** (`id`, `brand`, `model`, `license_plate`, `services_done`, `before_image_urls`, `after_image_urls`, `status`, `entry_date`, `completion_date`, `is_published`, `created_at`)
- **cars_for_sale** (`id`, `title`, `brand`, `model`, `year`, `mileage`, `price`, `fuel_type`, `transmission`, `description`, `image_urls`, `is_active`, `created_at`)
- **appointments** (`id`, `customer_name`, `phone`, `email`, `vehicle_info`, `selected_services`, `preferred_date`, `preferred_time`, `notes`, `image_urls`, `status`, `created_at`)

### 2. Cloudinary Medya Entegrasyonu:
- `lib/cloudinary.ts` (Cloudinary SDK yapılandırması).
- `app/actions/upload.ts` (Mobilden gelen fotoğrafları optimize edip Cloudinary'ye yükleyen ve URL döndüren Server Action).

### 3. Hizmet Kapsamı & Statik Veri Katmanı (`content/services.ts`):
- Karosserie & Spenglerarbeiten (Kaza onarımı, göçük düzeltme / Hagelschaden)
- Autolackierung & Malerei (Fırın boya, lokal rötuş / Spot-Repair)
- Autoservice & Reparatur (Periyodik bakım, yağ/filtre, fren, klima)
- MFK-Vorbereitung & Vorführung (Muayene hazırlığı, alt yıkama, MFK'ya teslim)
- Reifenservice (Yaz/Kış lastik değişimi, balans, rotasyon)
- Scheiben- & Glasschaden (Ön cam/taş çarpması değişimi, sigorta takibi)

### 4. Mobil Uyumlu Şifreli Admin Paneli:
- `/admin/login`: Supabase Auth ile şifreli giriş.
- `/admin/dashboard`: Günlük randevular ve hızlı durum özeti.
- `/admin/projects/new` (Hızlı Mobil Araç Girişi):
  - Mobilden kamera ile anında fotoğraf çekip R2'ye yükleme.
  - Plaka, marka/model, geliş tarihi ile 30 saniyede kayıt.
- `/admin/projects/[id]/complete` (İş Bitirme & Yayına Alma):
  - Bitiş fotoğraflarını yükleme.
  - Yapılan işleri çoklu seçim (Kaporta, Boya, Servis, Cam, MFK).
  - "Tek Tıkla Yayına Al" butonu (`is_published = true`).
- `/admin/cars`: İkinci el satılık araba ekleme, düzenleme, fiyat güncelleme, silme.
- `/admin/appointments`: Gelen randevu taleplerini onaylama/reddetme.

### 5. Müşteri Vitrin Arayüzü (Public Web Sitesi):
- **Logo Bileşeni (`components/ui/logo.tsx`):** Şık tipografi ve modern araba ikonuyla fallback bir logo oluştur. `public/logo.svg` gelince otomatik oradan okusun.
- **Header & Hero:** Sabit hızlı arama, WhatsApp butonu, güven rozetleri (40 Jahre Erfahrung, Garantie).
- **Dienstleistungen (Hizmetler):** Modern kartlar, Lucide ikonları veya özel SVG eskizler, hover animasyonları.
- **Vorher / Nachher Bölümü:** Tamamlanan ve yayına alınan araçların interaktif Before/After vitrini (Kayıt yoksa bölüm kendini gizlesin).
- **Autoverkauf (Occasionen):** Satılık araç listesi, filtreler, detay modalı ve "Interesse melden" butonu.
- **Online Termin & Schadensmeldung Formu:**
  - İstenen hizmet, tarih/saat seçimi, araç bilgisi ve hasar fotoğrafı yükleme (R2).
  - Supabase'e kayıt + Garaj sahibine formatlı e-posta bildirimi.
- İletişim, Konum & Google Maps entegrasyonu, açılış saatleri (Öffnungszeiten).

### 6. Test, Güvenlik ve Optimizasyon:
- Client-side resim sıkıştırma (mobil upload hızlandırma).
- Next.js Metadata, OpenGraph ve yerel SEO için JSON-LD (AutoRepair schema).
- TypeScript tip denetimleri ve npm run build doğrulaması.
