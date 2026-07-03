import type { Language } from '../contexts/LanguageContext';

export interface Translations {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  badges: {
    clientSide: string;
    noUpload: string;
    swissPrivacy: string;
  };
  trustBadges: {
    clientSide: { title: string; description: string };
    noUpload: { title: string; description: string };
    swissPrivacy: { title: string; description: string };
  };
  dropZone: {
    dragDrop: string;
    button: string;
    formats: string;
    processing: string;
  };
  inspector: {
    title: string;
    analyzing: string;
    cleaning: string;
    alertGPS: string;
    viewMap: string;
    labelCamera: string;
    labelMake: string;
    labelDate: string;
    labelSoftware: string;
    labelLens: string;
    labelAperture: string;
    labelISO: string;
    labelFocalLength: string;
    labelNoData: string;
    btnClean: string;
    totalFields: string;
    categoryGPS: string;
    categoryCamera: string;
    categoryDateTime: string;
    categorySettings: string;
    categoryOther: string;
    ariaClose: string;
    ariaCleanAndDownload: string;
    reportTitle: string;
    reportSuccess: string;
    reportSuccessDesc: string;
    fileSizeComparison: string;
    originalSize: string;
    cleanedSize: string;
    spaceSaved: string;
    removedMetadata: string;
    removedTags: string;
    preservedTechnical: string;
    preservedDesc: string;
    viewPreservedTags: string;
    downloadCleanImage: string;
  };
  footer: {
    promise: string;
    impressum: string;
    datenschutz: string;
  };
  modal: {
    ariaClose: string;
  };
  seo: {
    whyTitle: string;
    whyText: string;
    gpsLocation: string;
    gpsLocationDesc: string;
    deviceFingerprint: string;
    deviceFingerprintDesc: string;
    timestamp: string;
    timestampDesc: string;
    importantFor: string;
    marketplaces: string;
    marketplacesDesc: string;
    dating: string;
    datingDesc: string;
    professional: string;
    professionalDesc: string;
    comparisonTitle: string;
    comparisonText: string;
    tableHeaders: {
      feature: string;
      ourSolution: string;
      otherTools: string;
    };
    tableRows: {
      storage: { label: string; ours: string; others: string };
      privacy: { label: string; ours: string; others: string };
      speed: { label: string; ours: string; others: string };
      quality: { label: string; ours: string; others: string };
    };
    howTitle: string;
    howText: string;
    howSteps: {
      local: string;
      secure: string;
      fast: string;
    };
    faqTitle: string;
    faq: {
      nuclear: { q: string; a: string };
      malware: { q: string; a: string };
      quality: { q: string; a: string };
      compliance: { q: string; a: string };
      heic: { q: string; a: string };
    };
  };
  result: {
    success: string;
    successMessage: string;
    originalSize: string;
    cleanedSize: string;
    metadataRemoved: string;
    download: string;
    processAnother: string;
  };
}

const translations: Record<Language, Translations> = {
  de: {
    meta: {
      title: 'Metadaten aus Bildern entfernen | Schweiz | EXIF & GPS',
      description: 'EXIF-Daten & GPS aus Fotos löschen. 100% lokal im Browser, kein Upload. nDSG-konform. Kostenlos für die Schweiz – Jetzt Bilder anonymisieren.',
      ogTitle: 'Metadaten aus Bildern entfernen – Schweizer Datenschutz | nDSG',
      ogDescription: 'EXIF-Daten, GPS und Kameramodell aus Fotos entfernen. 100% Client-Side, keine Server. Privacy by Design nach Schweizer nDSG.',
      twitterTitle: 'EXIF & GPS aus Bildern entfernen | Schweiz',
      twitterDescription: 'Metadaten löschen ohne Upload. 100% Client-Side. nDSG & DSGVO-konform.',
    },
    hero: {
      title: 'Metadaten aus Bildern entfernen – EXIF & GPS sicher löschen in der Schweiz',
      subtitle:
        'Bilder anonymisieren ohne Upload: Entfernen Sie EXIF-Daten, GPS-Standort und Kameramodell direkt im Browser. 100% Client-Side nach Schweizer nDSG. Kostenlos und sicher.',
    },
    badges: {
      clientSide: '100% Client-Side',
      noUpload: 'Kein Server-Upload (nDSG)',
      swissPrivacy: 'Swiss Privacy Standard',
    },
    trustBadges: {
      clientSide: {
        title: '100% Client-Side',
        description: 'Offline-fähig',
      },
      noUpload: {
        title: 'Kein Server-Upload',
        description: 'DSGVO Konform',
      },
      swissPrivacy: {
        title: 'Swiss Privacy Standard',
        description: 'Maximaler Datenschutz',
      },
    },
    dropZone: {
      dragDrop: 'Bilder hier ablegen oder klicken',
      button: 'Bild auswählen',
      formats: 'Unterstützt: JPG, PNG, WEBP, HEIC',
      processing: 'Metadaten werden entfernt...',
    },
    inspector: {
      title: 'Gefundene Metadaten (Analyse)',
      analyzing: 'Analysiere Bilddaten...',
      cleaning: 'Bereinigung läuft...',
      alertGPS: '⚠️ ACHTUNG: Exakte GPS-Standortdaten entdeckt!',
      viewMap: 'Standort auf Karte zeigen',
      labelCamera: 'Kameramodell',
      labelMake: 'Hersteller',
      labelDate: 'Aufnahmedatum',
      labelSoftware: 'Software',
      labelLens: 'Objektiv',
      labelAperture: 'Blende',
      labelISO: 'ISO',
      labelFocalLength: 'Brennweite',
      labelNoData: '✓ Keine versteckten Daten gefunden (Sicher)',
      btnClean: 'Jetzt alles bereinigen',
      totalFields: 'Gesamt gefundene Datenfelder',
      categoryGPS: 'GPS & Standortdaten',
      categoryCamera: 'Kamera & Gerätedaten',
      categoryDateTime: 'Datum & Zeitstempel',
      categorySettings: 'Aufnahmeeinstellungen',
      categoryOther: 'Weitere Metadaten',
      ariaClose: 'Dialog schließen',
      ariaCleanAndDownload: 'Metadaten entfernen und Bild herunterladen',
      reportTitle: 'Ergebnis der Bereinigung',
      reportSuccess: 'Bild erfolgreich bereinigt',
      reportSuccessDesc: 'Ihr Bild wurde verarbeitet und ist bereit zum Download',
      fileSizeComparison: 'Dateigrößen-Vergleich',
      originalSize: 'Originalgröße',
      cleanedSize: 'Neue Größe',
      spaceSaved: 'Gespart',
      removedMetadata: 'Entfernte Metadaten',
      removedTags: 'Tags',
      preservedTechnical: 'Beibehaltene technische Daten',
      preservedDesc: 'Einige technische Daten wurden für die korrekte Bilddarstellung beibehalten',
      viewPreservedTags: 'Beibehaltene Tags anzeigen',
      downloadCleanImage: 'Bereinigtes Bild herunterladen',
    },
    footer: {
      promise: 'Ihre Dateien verlassen niemals Ihr Gerät.',
      impressum: 'Impressum',
      datenschutz: 'Datenschutz',
    },
    modal: {
      ariaClose: 'Dialog schließen',
    },
    seo: {
      whyTitle: 'EXIF-Daten aus Fotos entfernen: Warum Metadaten Ihre Privatsphäre gefährden',
      whyText:
        'Ihre Smartphone-Fotos speichern versteckte Metadaten, die mehr verraten als Sie denken. EXIF-Daten enthalten sensible Informationen, die Ihre Sicherheit gefährden können:',
      gpsLocation: 'GPS-Standort:',
      gpsLocationDesc: 'Ihr exakter Wohnort, Arbeitsplatz oder aktuelle Position wird an Fremde weitergegeben.',
      deviceFingerprint: 'Geräte-Fingerabdruck:',
      deviceFingerprintDesc: 'Kameramodell, Seriennummer, Software-Version und Geräte-ID werden gespeichert.',
      timestamp: 'Zeitstempel & Aufnahmedaten:',
      timestampDesc: 'Exakte Uhrzeit und Datum verraten Ihre Gewohnheiten und Bewegungsmuster.',
      importantFor: 'Metadaten entfernen ist besonders wichtig für:',
      marketplaces: 'Verkaufsplattformen (Ricardo, Tutti, eBay):',
      marketplacesDesc:
        'Verhindern Sie, dass Käufer Ihre Privatadresse aus Produktfotos auslesen können.',
      dating: 'Dating-Apps, Social Media & Messenger:',
      datingDesc: 'Schützen Sie sich vor Stalking und digitaler Verfolgung durch GPS-Daten in Bildern.',
      professional: 'Geschäftliche & berufliche Kommunikation:',
      professionalDesc: 'Versenden Sie professionelle Bilder ohne persönliche Metadaten an Kunden und Partner.',
      comparisonTitle: 'Bilder anonymisieren ohne Upload: Lokale Technologie vs. Cloud-Tools',
      comparisonText:
        'Die meisten Online-Tools zum EXIF-Daten entfernen laden Ihre Fotos auf fremde Server hoch – ein Datenschutzrisiko. Unser Tool verarbeitet Bilder 100% lokal im Browser ohne Server-Upload.',
      tableHeaders: {
        feature: 'Funktion',
        ourSolution: 'Unsere Lösung',
        otherTools: 'Andere Tools',
      },
      tableRows: {
        storage: {
          label: 'Datenspeicherung',
          ours: 'Keine (Nur Browser-RAM)',
          others: 'Upload auf Cloud-Server',
        },
        privacy: {
          label: 'Privatsphäre (nDSG)',
          ours: '✔ 100% Konform',
          others: '⚠ Risiko (Server-Logs)',
        },
        speed: {
          label: 'Geschwindigkeit',
          ours: '⚡ Sofort (Kein Upload nötig)',
          others: 'Langsam (Upload/Download)',
        },
        quality: {
          label: 'Bildqualität',
          ours: '💎 Original (Verlustfrei)',
          others: 'Oft komprimiert',
        },
      },
      howTitle: 'So funktioniert der EXIF-Remover: Client-Side Technologie für maximale Sicherheit',
      howText:
        'Maximale Sicherheit durch Client-Side-Verarbeitung: Im Gegensatz zu Cloud-basierten Metadaten-Entfernern verarbeiten wir Ihre Bilder ausschliesslich lokal. Kein Upload, kein Datentransfer, keine Server-Logs.',
      howSteps: {
        local: '100% Lokal: Die EXIF-Bereinigung läuft vollständig in Ihrem Browser (Chrome, Safari, Firefox, Edge). Funktioniert auch offline.',
        secure: 'Schweizer Datenschutz: Ihre Fotos verlassen niemals Ihr Gerät. Keine Server, keine Cloud, keine Speicherung. nDSG & DSGVO-konform.',
        fast: 'Sofortige Verarbeitung: Ohne Upload-Wartezeit werden Metadaten in Sekunden entfernt – selbst bei grossen HEIC- oder RAW-Dateien.',
      },
      faqTitle: 'Häufig gestellte Fragen – EXIF & Metadaten entfernen',
      faq: {
        nuclear: {
          q: 'Wie entfernt Ihr Tool EXIF-Daten sicherer als andere?',
          a: 'Wir verwenden Pixel-Neugenerierung: Das Bild wird komplett neu aufgebaut, nicht nur bereinigt. Herkömmliche Tools löschen oft nur sichtbare EXIF-Tags, übersehen aber versteckte Thumbnails mit GPS-Daten. Unsere Methode macht es physisch unmöglich, dass alte Metadaten überleben.',
        },
        malware: {
          q: 'Entfernt das Tool auch versteckten Schadcode aus Bildern?',
          a: 'Ja. Die Pixel-Neugenerierung wirkt wie ein digitales Desinfektionsmittel. Da wir nur die visuellen Bilddaten extrahieren und neu kodieren, wird jeglicher versteckter Code oder eingebettete Malware automatisch entfernt.',
        },
        quality: {
          q: 'Verliert mein Foto an Qualität beim Entfernen der Metadaten?',
          a: 'Nein. Die Bildqualität bleibt visuell identisch. Wir verwenden verlustfreie Kompression. Nur die unsichtbaren Metadaten (EXIF, GPS, Kameramodell) werden entfernt – die Pixel selbst bleiben unverändert.',
        },
        compliance: {
          q: 'Ist der Metadaten-Entferner mit Schweizer Datenschutz (nDSG) konform?',
          a: 'Ja, zu 100%. Wir folgen dem Prinzip "Privacy by Design". Da Ihre Bilder ausschliesslich lokal im Browser verarbeitet werden und niemals unsere Server erreichen, sammeln, speichern oder verarbeiten wir keinerlei Daten. Das erfüllt die strengsten Anforderungen des Schweizer nDSG und der EU-DSGVO.',
        },
        heic: {
          q: 'Funktioniert das Tool mit HEIC-Dateien von iPhones?',
          a: 'Ja. Unser Tool unterstützt HEIC-Dateien nativ. Sie können HEIC-Fotos hochladen und wir entfernen alle Metadaten. Auf Wunsch konvertieren wir HEIC automatisch in kompatible JPG-Dateien – natürlich ohne GPS-Daten oder EXIF-Informationen.',
        },
      },
    },
    result: {
      success: 'Bereinigt',
      successMessage: 'Metadaten erfolgreich entfernt!',
      originalSize: 'Originalgrösse',
      cleanedSize: 'Neue Grösse',
      metadataRemoved: 'Metadaten entfernt',
      download: 'Gereinigtes Bild herunterladen',
      processAnother: 'Neu beginnen',
    },
  },
  fr: {
    meta: {
      title: 'Supprimer les Métadonnées & GPS des Images – Protection Suisse | MetadatenEntferner.ch',
      description: 'Outil gratuit pour supprimer les données EXIF, GPS et informations d\'appareil photo. 100% côté client, conforme RGPD. Vos photos ne quittent jamais votre navigateur.',
      ogTitle: 'Supprimer les Métadonnées & GPS – Confidentialité Suisse',
      ogDescription: 'Nettoyez les données EXIF, le modèle d\'appareil et l\'historique de localisation en un clic. Vos photos sont traitées localement dans le navigateur.',
      twitterTitle: 'Supprimer les Métadonnées & GPS des Images',
      twitterDescription: 'Outil gratuit pour supprimer les données EXIF. 100% côté client, conforme RGPD.',
    },
    hero: {
      title: 'Supprimer les Métadonnées & GPS – Confidentialité Suisse',
      subtitle:
        'Anonymisez vos photos avant de partager. Supprimez EXIF, GPS et modèle d\'appareil. Vos données restent 100% locales.',
    },
    badges: {
      clientSide: '100% Client-Side',
      noUpload: 'Aucun Upload (Conforme nLPD)',
      swissPrivacy: 'Standard Suisse de Confidentialité',
    },
    trustBadges: {
      clientSide: {
        title: '100% Client-Side',
        description: 'Fonctionne Hors-ligne',
      },
      noUpload: {
        title: 'Aucun Upload',
        description: 'Conforme RGPD',
      },
      swissPrivacy: {
        title: 'Standard Suisse',
        description: 'Protection Maximale',
      },
    },
    dropZone: {
      dragDrop: 'Déposez vos images ici ou cliquez',
      button: 'Sélectionner des images',
      formats: 'Formats: JPG, PNG, WEBP, HEIC',
      processing: 'Suppression des métadonnées...',
    },
    inspector: {
      title: 'Métadonnées détectées (Analyse)',
      analyzing: 'Analyse des données d\'image...',
      cleaning: 'Nettoyage en cours...',
      alertGPS: '⚠️ ATTENTION : Données GPS exactes détectées !',
      viewMap: 'Voir la position sur la carte',
      labelCamera: 'Modèle d\'appareil',
      labelMake: 'Fabricant',
      labelDate: 'Date de prise de vue',
      labelSoftware: 'Logiciel',
      labelLens: 'Objectif',
      labelAperture: 'Ouverture',
      labelISO: 'ISO',
      labelFocalLength: 'Focale',
      labelNoData: '✓ Aucune donnée cachée trouvée (Sûr)',
      btnClean: 'Tout nettoyer maintenant',
      totalFields: 'Total des champs de données trouvés',
      categoryGPS: 'GPS & Données de localisation',
      categoryCamera: 'Appareil & Caméra',
      categoryDateTime: 'Date & Horodatage',
      categorySettings: 'Paramètres de prise de vue',
      categoryOther: 'Autres métadonnées',
      ariaClose: 'Fermer la boîte de dialogue',
      ariaCleanAndDownload: 'Supprimer les métadonnées et télécharger l\'image',
      reportTitle: 'Rapport de nettoyage',
      reportSuccess: 'Image nettoyée avec succès',
      reportSuccessDesc: 'Votre image a été traitée et est prête au téléchargement',
      fileSizeComparison: 'Comparaison de la taille',
      originalSize: 'Taille originale',
      cleanedSize: 'Nouvelle taille',
      spaceSaved: 'Économisé',
      removedMetadata: 'Métadonnées supprimées',
      removedTags: 'tags',
      preservedTechnical: 'Données techniques conservées',
      preservedDesc: 'Certaines données techniques ont été conservées pour un affichage correct de l\'image',
      viewPreservedTags: 'Afficher les tags conservés',
      downloadCleanImage: 'Télécharger l\'image nettoyée',
    },
    footer: {
      promise: 'Vos fichiers ne quittent jamais votre appareil.',
      impressum: 'Mentions Légales',
      datenschutz: 'Confidentialité',
    },
    modal: {
      ariaClose: 'Fermer la boîte de dialogue',
    },
    seo: {
      whyTitle: 'Pourquoi supprimer les données EXIF de vos photos',
      whyText:
        'Saviez-vous que vos photos contiennent des informations cachées ? Ces métadonnées révèlent plus que vous ne le pensez:',
      gpsLocation: 'Localisation GPS:',
      gpsLocationDesc: 'N\'importe qui peut voir où vous habitez ou travaillez.',
      deviceFingerprint: 'Empreinte d\'appareil:',
      deviceFingerprintDesc: 'Modèle de caméra, numéro de série et paramètres.',
      timestamp: 'Horodatage:',
      timestampDesc: 'Quand exactement la photo a été prise.',
      importantFor: 'Particulièrement important pour:',
      marketplaces: 'Plateformes de vente:',
      marketplacesDesc:
        '(Ricardo, Tutti, eBay) – Empêchez les acheteurs de lire votre adresse.',
      dating: 'Apps de rencontre & Réseaux sociaux:',
      datingDesc: 'Protégez votre vie privée contre le harcèlement.',
      professional: 'Documents professionnels:',
      professionalDesc: 'Envoyez des images neutres sans métadonnées aux clients.',
      comparisonTitle: 'Comparaison: Pourquoi notre technologie locale est meilleure',
      comparisonText:
        'La plupart des outils en ligne téléchargent vos images sur des serveurs. Pas nous.',
      tableHeaders: {
        feature: 'Fonctionnalité',
        ourSolution: 'Notre Solution',
        otherTools: 'Autres Outils',
      },
      tableRows: {
        storage: {
          label: 'Stockage des données',
          ours: 'Aucun (RAM du navigateur)',
          others: 'Upload sur serveurs cloud',
        },
        privacy: {
          label: 'Confidentialité (nLPD)',
          ours: '✔ 100% Conforme',
          others: '⚠ Risque (Logs serveur)',
        },
        speed: {
          label: 'Vitesse',
          ours: '⚡ Instantané (Pas d\'upload)',
          others: 'Lent (Upload/Download)',
        },
        quality: {
          label: 'Qualité d\'image',
          ours: '💎 Original (Sans perte)',
          others: 'Souvent compressé',
        },
      },
      howTitle: 'Comment fonctionne le nettoyeur EXIF? (Technologie)',
      howText:
        'Sécurité par technologie "Client-Side". Contrairement aux convertisseurs en ligne, aucun transfert de données n\'a lieu.',
      howSteps: {
        local:
          'Local: Notre script s\'exécute isolé dans votre navigateur (Chrome, Safari, Firefox).',
        secure:
          'Sécurisé: L\'image ne quitte jamais votre appareil (ordinateur ou smartphone).',
        fast: 'Rapide: Sans upload nécessaire, le nettoyage est instantané – même pour de gros fichiers.',
      },
      faqTitle: 'Questions Fréquentes (FAQ)',
      faq: {
        nuclear: {
          q: 'Pourquoi la "Régénération de Pixels" est-elle plus sûre ?',
          a: 'Les outils classiques oublient souvent des miniatures cachées. Notre technologie recrée l\'image pixel par pixel. Il est physiquement impossible que d\'anciennes données GPS survivent.',
        },
        malware: {
          q: 'L\'outil protège-t-il contre les malwares ?',
          a: 'Oui. Comme notre processus reconstruit l\'image visuellement, l\'outil agit comme un "désinfectant numérique" contre tout code caché.',
        },
        quality: {
          q: 'La qualité est-elle affectée ?',
          a: 'Non. L\'image reste visuellement identique.',
        },
        compliance: {
          q: 'L\'outil est-il conforme à la loi suisse (nLPD) ?',
          a: 'Oui, absolument. Nous suivons le principe "Privacy by Design". Comme nous ne collectons, stockons ou traitons aucune donnée, nous respectons les exigences les plus strictes de la nLPD suisse et du RGPD européen.',
        },
        heic: {
          q: 'Puis-je nettoyer des photos HEIC (iPhone) ?',
          a: 'Oui. Nous supportons nativement les fichiers HEIC et les convertissons en JPG compatibles, sans métadonnées.',
        },
      },
    },
    result: {
      success: 'Nettoyé',
      successMessage: 'Métadonnées supprimées avec succès!',
      originalSize: 'Taille originale',
      cleanedSize: 'Nouvelle taille',
      metadataRemoved: 'Métadonnées supprimées',
      download: 'Télécharger l\'image nettoyée',
      processAnother: 'Recommencer',
    },
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
