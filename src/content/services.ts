export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  features: string[];
}

export const services: ServiceItem[] = [
  {
    id: 'hagelschaden-instandsetzung',
    title: 'Hagelschaden & Unwetterschaden',
    shortDescription: 'Spezialisierter Hagelservice: Drücktechnik (PDR), Ziehtechnik, Scheibenaustausch mit ADAS-Kalibrierung & 100% Kaskoservice.',
    longDescription: 'Als erfahrener Carrosserie- & Spenglerfachbetrieb reparieren wir Hagelschäden sanft, präzise und werterhaltend. Mit zertifizierter Drücktechnik (ohne Nachlackieren), Klebezugverfahren und kompletter Direktabrechnung mit Ihrer Schweizer Kaskoversicherung übernehmen wir den gesamten Ablauf für Sie.',
    iconName: 'CloudRain',
    features: [
      'PDR-Drücktechnik (Sanftes Herausmassieren von innen ohne Lackschaden)',
      'Klebetechnik / Ziehtechnik (für unzugängliche Dachholme & Säulen)',
      'Induktions- & Spannungsausgleich bei tiefen Einschlägen',
      'Konventionelle Spengler- & Neulackierung bei gerissenem Lack',
      'Scheibenaustausch & Kamera- / ADAS-Assistenzsystem-Kalibrierung',
      '100% direkte Schadenabwicklung mit allen Schweizer Kaskoversicherungen'
    ]
  },
  {
    id: 'karosserie-spenglerarbeiten',
    title: 'Karosserie & Spenglerarbeiten',
    shortDescription: 'Professionelle Unfallinstandsetzung, Karosseriearbeiten und sanfte Dellenbehebung bei Hagelschaden.',
    longDescription: 'Wir reparieren Blechschäden aller Art fachgerecht und nach Herstellervorgaben. Egal ob Parkschaden, Hagelschaden oder grössere Kollision – unsere moderne Werkstatt bringt Ihr Fahrzeug wieder in Form.',
    iconName: 'Wrench',
    features: [
      'Unfallreparatur & Spenglerarbeiten',
      'Hagelschaden-Instandsetzung (Dellen drücken ohne Lackieren)',
      'Chassis- & Richtbankarbeiten',
      'Ersetzen von Karosserieteilen'
    ]
  },
  {
    id: 'autolackierung-malerei',
    title: 'Autolackierung & Malerei',
    shortDescription: 'Umweltfreundliche Lackierungen, Teillackierungen und schnelle Spot-Repair bei Kleinschäden.',
    longDescription: 'Mit modernster Farbmischtechnologie und hochwertigen Lacken sorgen wir für glänzende Ergebnisse. Wir lackieren einzelne Teile, ganze Fahrzeuge oder führen präzise Spot-Repairs durch, um Kratzer kostengünstig zu entfernen.',
    iconName: 'Paintbrush',
    features: [
      'Ganz- & Teillackierungen',
      'Spot-Repair / Kleinschaden-Reparatur (Kratzer, Schrammen)',
      'Felgenaufbereitung & -lackierung',
      'Polierarbeiten & Lackversiegelung'
    ]
  },
  {
    id: 'autoservice-reparatur',
    title: 'Autoservice & Reparatur',
    shortDescription: 'Zuverlässiger Unterhalt, Diagnosen und mechanische Reparaturen aller Automarken.',
    longDescription: 'Vom einfachen Ölwechsel bis zur komplexen Motor- oder Getriebediagnose – wir warten Ihr Auto fachgerecht, damit Sie stets sicher unterwegs sind. Ihre Herstellergarantie bleibt dabei vollumfänglich erhalten.',
    iconName: 'Settings',
    features: [
      'Periodischer Autoservice & Inspektion',
      'Bremsscheiben- & Bremsbelagwechsel',
      'Klimaservice & Desinfektion',
      'Diagnose & Behebung von Fehlermeldungen'
    ]
  },
  {
    id: 'mfk-vorbereitung',
    title: 'MFK-Vorbereitung & Vorführung',
    shortDescription: 'Rundum-Check, Motorreinigung und offizielle MFK-Vorführung beim Strassenverkehrsamt.',
    longDescription: 'Wir bereiten Ihr Auto optimal auf die amtliche Motorfahrzeugkontrolle (MFK) vor. Wir prüfen alle relevanten Bauteile, führen die vorgeschriebene Motor- und Unterbodenreinigung durch und führen Ihr Auto direkt beim Amt vor.',
    iconName: 'ClipboardCheck',
    features: [
      'MFK-Vorbereitungscheck & Beratung',
      'Motor- & Unterbodenreinigung (Chassiswäsche)',
      'Mängelbehebung vor dem MFK-Termin',
      'Kompletter Vorführservice beim Strassenverkehrsamt'
    ]
  },
  {
    id: 'scheiben-glasschaden',
    title: 'Scheiben- & Glasschaden',
    shortDescription: 'Reparatur von Steinschlägen und Austausch von Front-, Heck- und Seitenscheiben.',
    longDescription: 'Ein Steinschlag in der Windschutzscheibe kann schnell zum Riss führen. Wir reparieren kleine Schäden innert kürzester Zeit oder tauschen die Scheibe bei Bedarf komplett aus. Die Abwicklung mit Ihrer Versicherung übernehmen wir direkt für Sie.',
    iconName: 'Sparkles',
    features: [
      'Schnelle Steinschlag-Reparatur',
      'Austausch von Front-, Heck- & Seitenscheiben',
      'Kalibrierung von Kameras & Assistenzsystemen (ADAS)',
      'Direkte Schadenabwicklung mit Kaskoversicherungen'
    ]
  },
  {
    id: 'reifenservice',
    title: 'Reifenservice',
    shortDescription: 'Saisonaler Reifenwechsel, Auswuchten, Neureifen-Verkauf und Reifeneinlagerung.',
    longDescription: 'Wir sorgen für den richtigen Grip zu jeder Jahreszeit. Neben dem schnellen Rad- und Reifenwechsel bieten wir das Auswuchten Ihrer Räder sowie die fachgerechte Einlagerung in unserem modernen Reifenhotel an.',
    iconName: 'CircleDot',
    features: [
      'Saisonaler Rad- & Reifenwechsel (Sommer/Winter)',
      'Verkauf von Qualitätsreifen aller namhaften Marken',
      'Präzises Auswuchten für vibrationsfreie Fahrt',
      'Bequeme Reifeneinlagerung (Reifenhotel)'
    ]
  }
];
