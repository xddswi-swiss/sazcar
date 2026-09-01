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
    shortDescription: 'Professionelle Unfallinstandsetzung, Karosseriearbeiten und sanfte Dellenbehebung bei Hagelschaden – inklusive 100% direkter Versicherungsabwicklung.',
    longDescription: 'Wir reparieren Blechschäden aller Art fachgerecht und nach Herstellervorgaben. Egal ob Parkschaden, Hagelschaden oder grössere Kollision – unsere moderne Werkstatt bringt Ihr Fahrzeug wieder in Form. Sämtliche Formalitäten und die direkte Schadenabrechnung mit Ihrer Schweizer Kaskoversicherung übernehmen wir komplett für Sie.',
    iconName: 'Wrench',
    features: [
      'Komplette Unfallreparatur & Spenglerarbeiten nach Herstellervorgaben',
      'Hagelschaden-Instandsetzung (Dellen drücken ohne Lackieren)',
      'Chassis- & Richtbankarbeiten bei Rahmenschäden',
      'Fachgerechtes Ersetzen & Einpassen von Karosserieteilen',
      '100% direkte Schadenabwicklung & Abrechnung mit allen Schweizer Versicherungen'
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
    shortDescription: 'Zuverlässiger Unterhalt, herstellerkonforme Inspektionen, Computer-Diagnosen und fachgerechte mechanische Reparaturen für alle Automarken.',
    longDescription: 'Vom regelmässigen Ölwechsel bis zur komplexen Motor- oder Getriebediagnose – wir warten und reparieren Ihr Fahrzeug nach offiziellen Herstellervorgaben. Dank modernster OBD-II Auslesegeräte und Markenwerkzeugen bleibt Ihre volle Herstellergarantie erhalten.',
    iconName: 'Settings',
    features: [
      'Periodischer Autoservice & Inspektion nach Herstellervorgaben (100% Garantieerhalt)',
      'Computergestützte OBD-II Fehldiagnose & Steuergeräte-Auslesen aller Marken',
      'Bremsservice (Wechsel von Bremsscheiben, Bremsbelägen & Bremsflüssigkeit)',
      'Klimaservice (Dichtigkeitsprüfung, Kältemittel-Auffüllung R134a/R1234yf & Desinfektion)',
      'Mechanische Reparaturen (Motor, Getriebe, Kupplung, Auspuff & Fahrwerk)',
      'Batterie- & Lichtmaschinen-Check, Zahnriemenwechsel & elektronische Systemtests'
    ]
  },
  {
    id: 'mfk-vorbereitung',
    title: 'MFK-Vorbereitung & Vorführung',
    shortDescription: 'Stressfreie MFK-Abwicklung: Rundum-Check, Motorreinigung & offizielle Vorführung beim Strassenverkehrsamt. Einladung erhalten? Kontaktieren Sie uns am besten 2 Wochen vor Ihrem Termin.',
    longDescription: 'Haben Sie ein Einladungsschreiben zur Motorfahrzeugkontrolle (MFK) erhalten? Kontaktieren Sie uns am besten 2 Wochen vor Ihrem MFK-Termin – wir übernehmen den gesamten Ablauf für Sie. Von der gründlichen Fahrzeugprüfung über die geforderte Chassis- & Motorreinigung bis hin zur persönlichen Vorführung beim Strassenverkehrsamt gestalten wir diesen Prozess für Sie vollkommen reibungslos und entspannt.',
    iconName: 'ClipboardCheck',
    features: [
      'Entspannter Ablauf: Kontaktieren Sie uns am besten 2 Wochen vor Ihrem MFK-Termin',
      'Gründlicher MFK-Vorbereitungscheck aller sicherheitsrelevanten Komponenten',
      'Vorgeschriebene Motor- & Unterbodenreinigung (Chassiswäsche)',
      'Fachgerechte Mängelbehebung vor der amtlichen Prüfung',
      'Kompletter Vorführservice: Wir bringen Ihr Fahrzeug direkt zum Strassenverkehrsamt',
      'Faire & transparente Beratung ohne unvorhergesehene Überraschungen'
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
