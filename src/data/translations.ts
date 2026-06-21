export type Language = 'de' | 'tr' | 'en';

export interface TranslationSchema {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    services: string;
    cars: string;
    gallery: string;
    estimate: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaEstimate: string;
    ctaServices: string;
    badge: string;
  };
  services: {
    title: string;
    subtitle: string;
    bodyworkTitle: string;
    bodyworkDesc: string;
    paintingTitle: string;
    paintingDesc: string;
    repairTitle: string;
    repairDesc: string;
    tiresTitle: string;
    tiresDesc: string;
    mfkTitle: string;
    mfkDesc: string;
    glassTitle: string;
    glassDesc: string;
    autokaufTitle: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    sliderInstruction: string;
    beforeLabel: string;
    afterLabel: string;
  };
  estimate: {
    title: string;
    subtitle: string;
    fieldName: string;
    fieldEmail: string;
    fieldPhone: string;
    fieldCar: string;
    fieldServiceType: string;
    fieldMessage: string;
    fieldPhotos: string;
    fieldPhotosHint: string;
    fieldDate: string;
    btnSubmit: string;
    sending: string;
    success: string;
    error: string;
    captchaTitle: string;
    captchaPlaceholder: string;
    captchaError: string;
    btnSelectPhoto: string;
  };
  admin: {
    title: string;
    passcodeLabel: string;
    btnLogin: string;
    loginError: string;
    fieldTitleDe: string;
    fieldTitleTr: string;
    fieldTitleEn: string;
    fieldBeforeImg: string;
    fieldAfterImg: string;
    btnAddJob: string;
    successAdd: string;
    errorAdd: string;
    btnSelectPhoto: string;
  };
  contact: {
    title: string;
    subtitle: string;
    addressLabel: string;
    phoneLabel: string;
    whatsappLabel: string;
    emailLabel: string;
    hoursLabel: string;
    directionsBtn: string;
  };
  footer: {
    hoursTitle: string;
    hoursWeekdays: string;
    hoursSaturday: string;
    hoursSunday: string;
    contactTitle: string;
    address: string;
    rights: string;
  };
  carSpecs: {
    year: string;
    mileage: string;
    power: string;
    transmission: string;
    fuelType: string;
    mfk: string;
    manual: string;
    automatic: string;
    petrol: string;
    diesel: string;
    hybrid: string;
    electric: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  de: {
    meta: {
      title: "SazCar Garage | Karosserie, Malerei & Autoservice in Schöfflisdorf, Zürich",
      description: "Professionelle Autoreparatur, Spenglerarbeiten, Lackierung, Reifenservice und MFK-Vorbereitung bei SazCar Garage in Schöfflisdorf, Zürich."
    },
    nav: {
      home: "Startseite",
      services: "Dienstleistungen",
      cars: "Autoverkauf",
      gallery: "Vor/Nach",
      estimate: "Kostenvorschlag",
      contact: "Kontakt"
    },
    hero: {
      title: "SazCar Garage",
      subtitle: "Ihr zuverlässiger Partner für Karosserie, Lackierung, Reifenservice und MFK-Vorbereitung in Zürich. Mit über 40 Jahren Erfahrung stehen wir voll und ganz hinter unserer Arbeit, um Ihre Sicherheit und Zufriedenheit zu garantieren.",
      ctaEstimate: "Kostenvorschlag einholen",
      ctaServices: "Unsere Dienste",
      badge: "Premium Autoservice & Reparatur"
    },
    services: {
      title: "Unsere Dienstleistungen",
      subtitle: "Umfassender Service rund um Ihr Fahrzeug – professionell, schnell und zuverlässig.",
      bodyworkTitle: "Karosserie & Spenglerarbeiten",
      bodyworkDesc: "Professionelle Unfallreparatur, Dellenentfernung und Blechschadenbehebung nach höchsten Qualitätsstandards.",
      paintingTitle: "Autolackierung & Malerei",
      paintingDesc: "Kratzerentfernung, Teil- und Komplettlackierungen mit moderner Farbmischanlage für perfekte Farbergebnisse.",
      repairTitle: "Autoservice & Reparatur",
      repairDesc: "Regelmässiger Service, Ölwechsel, Bremsenservice, Diagnose und Reparaturen für alle Automarken.",
      tiresTitle: "Reifenservice",
      tiresDesc: "Reifenwechsel (Sommer/Winter), Auswuchten, Reifenmontage und fachgerechte Reifeneinlagerung.",
      mfkTitle: "MFK-Vorbereitung (Vorführen)",
      mfkDesc: "Kompletter Check und Reparatur aller MFK-relevanten Mängel sowie Vorführen des Fahrzeugs beim Strassenverkehrsamt.",
      glassTitle: "Scheiben- & Glasschaden",
      glassDesc: "Austausch und Reparatur von Front-, Heck- und Seitenscheiben bei Steinschlägen oder Rissen, inklusive direkter Versicherungsabwicklung.",
      autokaufTitle: "Autokauf / Autoverkauf"
    },
    gallery: {
      title: "Unsere Arbeit im Vergleich",
      subtitle: "Sehen Sie selbst, wie wir Unfallfahrzeuge und Lackschäden wieder in den Neuzustand versetzen.",
      sliderInstruction: "Ziehen Sie den Schieberegler nach links oder rechts, um Vorher/Nachher zu vergleichen.",
      beforeLabel: "Vorher",
      afterLabel: "Nachher"
    },
    estimate: {
      title: "Kostenvorschlag & Termin anfordern",
      subtitle: "Beschreiben Sie Ihren Schaden, laden Sie 3-4 Fotos hoch und erhalten Sie eine schnelle Offerte oder einen Wunschtermin.",
      fieldName: "Name / Vorname",
      fieldEmail: "E-Mail-Adresse",
      fieldPhone: "Telefonnummer",
      fieldCar: "Fahrzeug (Marke, Modell, Jahr)",
      fieldServiceType: "Gewünschte Dienstleistung",
      fieldMessage: "Schadensbeschreibung / Details",
      fieldPhotos: "Schadensbilder (max. 4 Bilder)",
      fieldPhotosHint: "Ziehen Sie Bilder hierher oder klicken Sie zum Auswählen",
      fieldDate: "Wunschtermin (optional)",
      btnSubmit: "Anfrage senden",
      sending: "Wird gesendet...",
      success: "Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns umgehend mit einer Offerte bei Ihnen.",
      error: "Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.",
      captchaTitle: "Sicherheitsfrage",
      captchaPlaceholder: "Ergebnis",
      captchaError: "Ungültiges Captcha-Ergebnis",
      btnSelectPhoto: "BILD AUSWÄHLEN"
    },
    admin: {
      title: "SazCar Admin Panel",
      passcodeLabel: "Admin-Passcode eingeben",
      btnLogin: "Einloggen",
      loginError: "Falscher Passcode!",
      fieldTitleDe: "Titel (Deutsch)",
      fieldTitleTr: "Titel (Türkisch)",
      fieldTitleEn: "Titel (Englisch)",
      fieldBeforeImg: "Bild VORHER",
      fieldAfterImg: "Bild NACHHER",
      btnAddJob: "Projekt veröffentlichen",
      successAdd: "Projekt erfolgreich hinzugefügt!",
      errorAdd: "Fehler beim Hinzufügen des Projekts.",
      btnSelectPhoto: "BILD AUSWÄHLEN"
    },
    contact: {
      title: "Kontakt & Anfahrt",
      subtitle: "Besuchen Sie uns in Schöfflisdorf oder kontaktieren Sie uns direkt.",
      addressLabel: "Adresse",
      phoneLabel: "Telefon",
      whatsappLabel: "WhatsApp",
      emailLabel: "E-Mail",
      hoursLabel: "Öffnungszeiten",
      directionsBtn: "Route planen (Google Maps)"
    },
    footer: {
      hoursTitle: "Öffnungszeiten",
      hoursWeekdays: "Montag - Freitag: 07:30 - 12:00, 13:15 - 18:00",
      hoursSaturday: "Samstag: 09:00 - 14:00",
      hoursSunday: "Sonntag: Geschlossen",
      contactTitle: "Kontakt & Adresse",
      address: "SAZCAR GMBH,\nUnterdorfstrasse 14,\n8165 Schöfflisdorf ZH",
      rights: "Alle Rechte vorbehalten."
    },
    carSpecs: {
      year: "Erstzulassung",
      mileage: "Kilometerstand",
      power: "Leistung",
      transmission: "Getriebe",
      fuelType: "Treibstoff",
      mfk: "MFK",
      manual: "Schaltgetriebe",
      automatic: "Automatik",
      petrol: "Benzin",
      diesel: "Diesel",
      hybrid: "Hybrid",
      electric: "Elektro"
    }
  },
  tr: {
    meta: {
      title: "SazCar Garaj | Schöfflisdorf Zürih'te Kaporta, Oto Boya & Servis",
      description: "Schöfflisdorf Zürih'teki SazCar Garaj'da profesyonel araba tamiri, kaporta düzeltme, oto boyama, lastik değişimi ve MFK muayene hazırlığı."
    },
    nav: {
      home: "Anasayfa",
      services: "Hizmetlerimiz",
      cars: "Araç Satışı",
      gallery: "Öncesi/Sonrası",
      estimate: "Teklif Al",
      contact: "İletişim"
    },
    hero: {
      title: "SazCar Garaj",
      subtitle: "Zürih'te kaporta, oto boyama, lastik servisi ve MFK hazırlığı alanında güvenilir ortağınız. 40 yılı aşkın tecrübemizle, yaptığımız işin arkasında durarak güvenliğiniz ve memnuniyetiniz için çalışıyoruz.",
      ctaEstimate: "Kostenvorschlag (Teklif) Al",
      ctaServices: "Hizmetlerimiz",
      badge: "Premium Oto Servis & Tamir"
    },
    services: {
      title: "Hizmetlerimiz",
      subtitle: "Aracınız için kapsamlı servis – profesyonel, hızlı ve güvenilir.",
      bodyworkTitle: "Kaporta & Şase Onarımı",
      bodyworkDesc: "Kaza sonrası onarım, göçük düzeltme ve sac hasarı giderimi en yüksek kalite standartlarında yapılır.",
      paintingTitle: "Oto Boyama & Çizik Giderme",
      paintingDesc: "Kusursuz renk eşleşmesi sağlayan modern boya mikserimizle lokal, parça veya komple oto boyama.",
      repairTitle: "Oto Servis & Periyodik Bakım",
      repairDesc: "Tüm araç markaları için yağ değişimi, fren servisi, bilgisayarlı arıza teşhisi ve mekanik onarım.",
      tiresTitle: "Lastik Servisi",
      tiresDesc: "Yazlık/kışlık lastik değişimi, balans ayarı, sökme-takma ve profesyonel lastik depolama (otel) hizmeti.",
      mfkTitle: "MFK (Muayene) Hazırlığı",
      mfkDesc: "İsviçre MFK muayenesi öncesi araç kontrolü, eksiklerin giderilmesi ve aracın muayeneye götürülmesi.",
      glassTitle: "Oto Cam Hasarları & Değişimi",
      glassDesc: "Çatlak veya taş çarpması sonucu hasar gören ön, arka ve yan camların değişimi ve tamiri, kasko ve sigorta işlemleri dahil.",
      autokaufTitle: "Araç Alım / Satım"
    },
    gallery: {
      title: "Öncesi ve Sonrası Karşılaştırma",
      subtitle: "Kaza hasarlı araçları nasıl sıfır kondisyona getirdiğimizi kendi gözlerinizle görün.",
      sliderInstruction: "Öncesi/sonrası halini karşılaştırmak için ortadaki çizgiyi sağa veya sola kaydırın.",
      beforeLabel: "Öncesi",
      afterLabel: "Sonrası"
    },
    estimate: {
      title: "Fiyat Teklifi (Kostenvorschlag) & Randevu",
      subtitle: "Hasarınızı tarif edin, 3-4 fotoğraf yükleyin ve hızlıca fiyat teklifi veya uygun randevu tarihi alın.",
      fieldName: "Adınız / Soyadınız",
      fieldEmail: "E-posta Adresiniz",
      fieldPhone: "Telefon Numaranız",
      fieldCar: "Araç Bilgisi (Marka, Model, Yıl)",
      fieldServiceType: "İstediğiniz Hizmet",
      fieldMessage: "Hasar Açıklaması / Detaylar",
      fieldPhotos: "Hasar Fotoğrafları (En fazla 4 adet)",
      fieldPhotosHint: "Resimleri buraya sürükleyin veya seçmek için tıklayın",
      fieldDate: "İstenen Randevu Tarihi (İsteğe bağlı)",
      btnSubmit: "Teklif İsteğini Gönder",
      sending: "Gönderiliyor...",
      success: "Teşekkürler! Talebiniz başarıyla gönderildi. En kısa sürede fiyat teklifimizle size dönüş yapacağız.",
      error: "Talep gönderilirken hata oluştu. Lütfen tekrar deneyin.",
      captchaTitle: "Güvenlik Sorusu",
      captchaPlaceholder: "Sonuç",
      captchaError: "Hatalı captcha sonucu",
      btnSelectPhoto: "FOTOĞRAF SEÇ"
    },
    admin: {
      title: "SazCar Yönetici Paneli",
      passcodeLabel: "Yönetici şifresini girin",
      btnLogin: "Giriş Yap",
      loginError: "Hatalı Şifre!",
      fieldTitleDe: "Başlık (Almanca)",
      fieldTitleTr: "Başlık (Türkçe)",
      fieldTitleEn: "Başlık (İngilizce)",
      fieldBeforeImg: "ÖNCESİ Fotoğrafı",
      fieldAfterImg: "SONRASI Fotoğrafı",
      btnAddJob: "Projeyi Yayınla",
      successAdd: "Proje başarıyla eklendi!",
      errorAdd: "Proje eklenirken hata oluştu.",
      btnSelectPhoto: "FOTOĞRAF SEÇ"
    },
    contact: {
      title: "İletişim & Ulaşım",
      subtitle: "Bizi Schöfflisdorf'ta ziyaret edin veya doğrudan iletişime geçin.",
      addressLabel: "Adres",
      phoneLabel: "Telefon",
      whatsappLabel: "WhatsApp",
      emailLabel: "E-posta",
      hoursLabel: "Çalışma Saatleri",
      directionsBtn: "Yol Tarifi Al (Google Maps)"
    },
    footer: {
      hoursTitle: "Çalışma Saatleri",
      hoursWeekdays: "Pazartesi - Cuma: 07:30 - 12:00, 13:15 - 18:00",
      hoursSaturday: "Cumartesi: 09:00 - 14:00",
      hoursSunday: "Pazar: Kapalı",
      contactTitle: "İletişim & Adres",
      address: "SAZCAR GMBH,\nUnterdorfstrasse 14,\n8165 Schöfflisdorf ZH",
      rights: "Tüm hakları saklıdır."
    },
    carSpecs: {
      year: "İlk Tescil",
      mileage: "Kilometre",
      power: "Güç",
      transmission: "Şanzıman",
      fuelType: "Yakıt Tipi",
      mfk: "MFK Durumu",
      manual: "Manuel",
      automatic: "Otomatik",
      petrol: "Benzin",
      diesel: "Dizel",
      hybrid: "Hibrit",
      electric: "Elektrikli"
    }
  },
  en: {
    meta: {
      title: "SazCar Garage | Bodywork, Painting & Auto Service in Schöfflisdorf, Zurich",
      description: "Professional car repair, bodywork, auto painting, tire services, and MFK preparation at SazCar Garage in Schöfflisdorf, Zurich."
    },
    nav: {
      home: "Home",
      services: "Services",
      cars: "Car Sales",
      gallery: "Before/After",
      estimate: "Get Estimate",
      contact: "Contact"
    },
    hero: {
      title: "SazCar Garage",
      subtitle: "Your reliable partner for bodywork, painting, tire services, and MFK preparation in Zurich. With over 40 years of experience, we stand behind our craftsmanship to ensure your safety and absolute satisfaction.",
      ctaEstimate: "Get a Price Estimate",
      ctaServices: "Our Services",
      badge: "Premium Car Service & Repair"
    },
    services: {
      title: "Our Services",
      subtitle: "Comprehensive service for your vehicle – professional, fast, and reliable.",
      bodyworkTitle: "Bodywork & Collision Repair",
      bodyworkDesc: "Professional accident repair, dent removal, and sheet metal damage correction to the highest quality standards.",
      paintingTitle: "Auto Painting & Refinishing",
      paintingDesc: "Scratch removal, partial and complete paintwork with a modern mixing system for perfect color matching.",
      repairTitle: "Car Service & Repair",
      repairDesc: "Regular maintenance, oil changes, brake service, computer diagnostics, and repairs for all car brands.",
      tiresTitle: "Tire Services",
      tiresDesc: "Tire replacement (summer/winter), wheel balancing, mounting, and proper tire storage.",
      mfkTitle: "MFK Inspection Prep (Vorführen)",
      mfkDesc: "Complete check and repair of all inspection-relevant defects and presentation of the vehicle to the Swiss road traffic office.",
      glassTitle: "Auto Glass Service",
      glassDesc: "Repair and replacement of windshields, rear and side windows due to stone chips or cracks, including direct insurance handling.",
      autokaufTitle: "Car Sales / Purchase"
    },
    gallery: {
      title: "Our Work Compared",
      subtitle: "See for yourself how we restore accident-damaged and scratched vehicles to brand new condition.",
      sliderInstruction: "Drag the slider left or right to compare the before and after states.",
      beforeLabel: "Before",
      afterLabel: "After"
    },
    estimate: {
      title: "Request Estimate & Appointment",
      subtitle: "Describe your damage, upload 3-4 photos, and receive a fast price quote or request your desired appointment date.",
      fieldName: "Full Name",
      fieldEmail: "Email Address",
      fieldPhone: "Phone Number",
      fieldCar: "Vehicle (Make, Model, Year)",
      fieldServiceType: "Desired Service",
      fieldMessage: "Damage Description / Details",
      fieldPhotos: "Damage Photos (max. 4 images)",
      fieldPhotosHint: "Drag and drop images here, or click to select",
      fieldDate: "Preferred Appointment Date (optional)",
      btnSubmit: "Submit Request",
      sending: "Sending...",
      success: "Thank you! Your request has been sent successfully. We will get back to you shortly with a price estimate.",
      error: "Error sending request. Please try again.",
      captchaTitle: "Security Question",
      captchaPlaceholder: "Result",
      captchaError: "Invalid captcha result",
      btnSelectPhoto: "SELECT PHOTO"
    },
    admin: {
      title: "SazCar Admin Panel",
      passcodeLabel: "Enter Admin Passcode",
      btnLogin: "Log In",
      loginError: "Incorrect Passcode!",
      fieldTitleDe: "Title (German)",
      fieldTitleTr: "Title (Turkish)",
      fieldTitleEn: "Title (English)",
      fieldBeforeImg: "BEFORE Image",
      fieldAfterImg: "AFTER Image",
      btnAddJob: "Publish Project",
      successAdd: "Project added successfully!",
      errorAdd: "Error adding project.",
      btnSelectPhoto: "SELECT PHOTO"
    },
    contact: {
      title: "Contact & Location",
      subtitle: "Visit us in Schöfflisdorf or contact us directly.",
      addressLabel: "Address",
      phoneLabel: "Phone",
      whatsappLabel: "WhatsApp",
      emailLabel: "Email",
      hoursLabel: "Opening Hours",
      directionsBtn: "Get Directions (Google Maps)"
    },
    footer: {
      hoursTitle: "Opening Hours",
      hoursWeekdays: "Monday - Friday: 07:30 AM - 12:00 PM, 01:15 PM - 06:00 PM",
      hoursSaturday: "Saturday: 09:00 AM - 02:00 PM",
      hoursSunday: "Sunday: Closed",
      contactTitle: "Contact & Address",
      address: "SAZCAR GMBH,\nUnterdorfstrasse 14,\n8165 Schöfflisdorf ZH",
      rights: "All rights reserved."
    },
    carSpecs: {
      year: "First Registration",
      mileage: "Mileage",
      power: "Power",
      transmission: "Transmission",
      fuelType: "Fuel Type",
      mfk: "MFK",
      manual: "Manual",
      automatic: "Automatic",
      petrol: "Petrol",
      diesel: "Diesel",
      hybrid: "Hybrid",
      electric: "Electric"
    }
  }
};
