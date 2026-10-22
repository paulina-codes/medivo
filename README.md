# Medivo

### Adaptive Health Management for Everyday Life

**Gesundheit, die sich deinem Alltag anpasst.**

Medivo ist ein persönliches Softwareprojekt im Bereich der Medizinischen Informatik. Ziel ist die Entwicklung einer adaptiven Webanwendung, die Menschen mit chronischen Erkrankungen bei der strukturierten Dokumentation ihrer Gesundheit und der Organisation ihres Alltags unterstützt.

Im Mittelpunkt steht ein nutzerzentrierter Ansatz: Statt allen Nutzer:innen dieselbe Oberfläche vorzugeben, soll sich Medivo an unterschiedliche kognitive, körperliche und motivationale Bedürfnisse anpassen.

> **Unsere Gesundheit ist individuell. Warum sollte es unsere Gesundheits-App nicht auch sein?**

---

## Projektstatus

**In Entwicklung – Frontend-Prototyp (Version 0.1)**

Der aktuelle Entwicklungsstand konzentriert sich auf die visuelle Gestaltung, die grundlegende Navigation und erste interaktive Funktionen.

Die Anwendung verwendet derzeit ausschließlich fiktive Beispieldaten. Eine dauerhafte Datenspeicherung, Benutzerverwaltung und Backend-Anbindung sind noch nicht implementiert.

Medivo ist aktuell ein Demonstrations- und Entwicklungsprojekt und kein zertifiziertes Medizinprodukt.

## Kernfunktionen

### Gesundheitsdokumentation

Medivo soll die individuelle Erfassung verschiedener Gesundheitsinformationen ermöglichen:

- Symptome und Schmerzintensität
- Stimmung und psychisches Wohlbefinden
- Schlaf und Erholung
- Medikamente und Einnahmen
- Aktivitäten und Ernährung
- Individuelle Gesundheitsparameter
- Arzttermine und persönliche Notizen

Langfristig sollen Nutzer:innen eigene Symptome, Messwerte und Medikamente definieren sowie krankheitsspezifische Vorlagen verwenden können.

### Adaptive Benutzeroberfläche

Ein zentrales Merkmal von Medivo ist die Möglichkeit, die Benutzeroberfläche an persönliche Bedürfnisse anzupassen.

| Modus | Gestaltungsschwerpunkt |
|---|---|
| Standard | Übersichtliche und ausgewogene Darstellung |
| Senioren | Größere Schrift, hohe Kontraste, vereinfachte Navigation |
| Minimal | Reduzierte Informationen und ablenkungsarme Gestaltung |
| ADHD | Fokussierte Aufgaben, visuelle Priorisierung und Motivation |
| Kawaii | Freundliche Illustrationen, Pastellfarben und Companion |
| Gamified | Tagesziele, Fortschritte und spielerische Belohnungen |
| Autism | Vorhersehbare Abläufe, klare Strukturen und reduzierte Reize |

Die Modi befinden sich in unterschiedlichen Konzept- und Entwicklungsphasen. Die endgültige Gestaltung soll durch Usability-Tests und Nutzerfeedback überprüft werden.

### Auswertungen und Entwicklungen

Geplant sind verständliche Visualisierungen individueller Gesundheitsverläufe, beispielsweise:

- Veränderungen der Schmerzintensität
- Schlafentwicklung
- Symptomverläufe
- Medikamenteneinnahmen
- Mögliche zeitliche Zusammenhänge zwischen Gesundheitsparametern

Auswertungen sollen transparent, nachvollziehbar und ohne unbegründete medizinische Schlussfolgerungen dargestellt werden.

### Arztzusammenfassung

Ein geplantes Feature ist die Erstellung einer individuell konfigurierbaren Zusammenfassung für Arztgespräche.

Nutzer:innen sollen auswählen können, welche Daten und Zeiträume berücksichtigt werden. Diagramme, Kennzahlen und persönliche Anmerkungen sollen die Kommunikation unterstützen.

Besonderes Augenmerk liegt auf der transparenten Kennzeichnung fehlender Einträge, um Dokumentationslücken nicht mit beschwerdefreien Tagen zu verwechseln.

### Mehrsprachigkeit

Langfristig ist eine mehrsprachige Benutzeroberfläche vorgesehen.

Geplante Sprachen: Deutsch, Englisch, Französisch, Spanisch, Portugiesisch, Russisch und Arabisch.

### Datenschutz und Sicherheit

Da Gesundheitsdaten besonders sensibel sind, sollen Datenschutz und Datensicherheit von Beginn an in der Architektur berücksichtigt werden.

Geplante Maßnahmen umfassen:

- Datensparsame Verarbeitung
- Sichere Authentifizierung
- Geschützte Speicherung persönlicher Gesundheitsdaten
- Rollen- und Zugriffskonzepte
- Transparente Export- und Löschmöglichkeiten
- Berücksichtigung der DSGVO

**Wichtig:** Eine vollständige datenschutzrechtliche und sicherheitstechnische Prüfung steht noch aus. Die aktuelle Demo ist nicht für die Verarbeitung realer Gesundheitsdaten vorgesehen.

---

## Technologie-Stack

| Bereich | Technologie |
|---|---|
| Frontend | React, TypeScript, CSS |
| UI/UX-Konzeption | Figma |
| Backend (geplant) | Java, Spring Boot |
| Datenbank (geplant) | PostgreSQL |
| Versionsverwaltung | Git, GitHub |

Die Architektur wird schrittweise erweitert.

## Entwicklungs-Roadmap

### Phase 1 – UI/UX und Frontend

- [x] Grundkonzept und Funktionsplanung
- [x] Visuelles Designkonzept
- [x] Erste Frontend-Struktur
- [x] Dashboard mit Beispieldaten
- [x] Grundlegende Navigation
- [ ] Einheitliches Designsystem
- [ ] Responsive Design überprüfen und optimieren
- [ ] Adaptive Modi vollständig ausarbeiten
- [ ] Mehrsprachige UI implementieren

### Phase 2 – Gesundheitsmanagement

- [ ] Individuell konfigurierbare Symptomverwaltung
- [ ] Medikamentenverwaltung mit Dosierungen und Zeitplänen
- [ ] Krankheitsspezifische Vorlagen
- [ ] Individuelle Messwerte
- [ ] Gesundheitsverläufe und Diagramme
- [ ] Exportierbare Arztzusammenfassungen

### Phase 3 – Backend und Datenbank

- [ ] Datenmodell entwerfen
- [ ] PostgreSQL integrieren
- [ ] REST-API mit Spring Boot entwickeln
- [ ] Benutzerverwaltung und Authentifizierung
- [ ] Validierung und sichere Datenverarbeitung
- [ ] Automatisierte Tests

### Phase 4 – Personalisierung und Evaluation

- [ ] Individuelles Onboarding
- [ ] Companion-System
- [ ] Optionale Gamification
- [ ] Erweiterte Barrierefreiheit
- [ ] Usability-Tests mit verschiedenen Nutzergruppen
- [ ] Evaluation und iterative Verbesserungen

---

## Lokale Entwicklung

Voraussetzung: Node.js und npm.

```bash
git clone https://github.com/paulina-codes/medivo.git
cd medivo
npm install
npm run dev
```

Anschließend die vom Entwicklungsserver angezeigte lokale Adresse im Browser öffnen.

*Hinweis: Die Befehle setzen voraus, dass sich das Frontend-Projekt im Stammverzeichnis des Repositories befindet.*

---

## Projektziel

Medivo verbindet medizinische Informatik mit nutzerzentriertem Softwaredesign.

Das Projekt untersucht, wie adaptive Benutzeroberflächen, individualisierbare Gesundheitsdokumentation und motivierende Interaktionskonzepte die Zugänglichkeit und Nutzbarkeit digitaler Gesundheitsanwendungen verbessern können.

Der Schwerpunkt liegt nicht allein auf der technischen Umsetzung, sondern auf der Frage, wie Software Menschen mit unterschiedlichen Bedürfnissen im Alltag sinnvoll unterstützen kann.

---

## Entwicklung

**Paulina Kranewitter**

B.Sc. Medizinische Informatik

Persönliches Portfolio- und Entwicklungsprojekt mit Schwerpunkt auf Healthcare Software, Frontend Development und User Experience Design.

**Status:** Active Development

*Medivo is a personal software project and is not intended to provide medical diagnoses or treatment recommendations.*
