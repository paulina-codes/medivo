# Medivo - UI-Prototyp v0.2

Interaktiver Frontend-Entwurf für ein adaptives Gesundheitsmanagement. React, TypeScript, Vite, Lucide Icons und eigenes CSS.

## Start

1. Node.js LTS installieren.
2. Terminal im Projektordner öffnen.
3. `npm install`
4. `npm run dev`
5. Die angezeigte lokale URL im Browser öffnen.

## Veröffentlichung

`npm run build` erzeugt den Ordner `dist/`. Diesen kannst du bei einem statischen Hoster veröffentlichen. GitHub Pages erfordert bei einem Projekt-Repository eine passende `base`-Konfiguration in Vite oder einen eigenen Domain-Root.

## Aufbau

| Datei | Inhalt |
|---|---|
| `src/main.tsx` | App, Onboarding (Start → Login → Modus) und alle Seiten |
| `src/illustrations.tsx` | Gezeichnete Illustrationen als SVG-Komponenten (Katze, Modus-Motive, Symptome …) |
| `src/style.css` | Design-Tokens, Layout, Modi, Dark Mode, Responsive, Druck |

### Illustrationen austauschen

Alle Illustrationen sind React-Komponenten in `src/illustrations.tsx`. Eine eigene Zeichnung lässt sich direkt einsetzen: SVG exportieren, z. B. nach `src/assets/cat.svg`, und die Komponente `Cat` ersetzen:

```tsx
import catUrl from './assets/cat.svg';
export const Cat = ({ size = 128, className = '' }: IllProps & { mood?: CatMood }) =>
  <img src={catUrl} width={size} height={size} className={`ill ${className}`} alt="" />;
```

Für verschiedene Stimmungen (`happy`, `cheer`, `sleepy`) je eine Datei anlegen und per `mood` auswählen.

## Status und Einschränkungen

- Alle Einträge sind **fiktive Demo-Daten**.
- Änderungen werden **nicht gespeichert** und verschwinden beim Neuladen.
- Kein Backend, keine echte Anmeldung, keine echte Benachrichtigung, keine medizinische Auswertung.
- Die Sprachwahl ist vorbereitet, die Texte sind derzeit Deutsch.
- Die Berichtsvorschau ist ein Demo-Ausdruck, keine medizinisch validierte Zusammenfassung.
- Nicht als datenschutzkonformes Produkt oder Medizinprodukt freigegeben.

## Nächste Schritte

Routing, Formularvalidierung, Internationalisierung, Accessibility-Tests, sichere Authentifizierung, API-Schnittstellen, PostgreSQL, Spring Boot, Einwilligungs- und Löschkonzept.
