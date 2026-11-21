# AGENTS.md - Interactive Adult Learning Web Application (MVP)

## 1. Project Overview & Goal
Build a zero-backend, single-page interactive HTML web application for corporate training titled **"6 หลักการเรียนรู้แบบผู้ใหญ่ (6 Principles of Adult Learning)"** for **NAN YANG TEXTILE GROUP**.
- **Architecture:** Content-as-Code (Single Source of Truth). No database, no `localStorage` persistence for content edits. All content updates happen directly in the codebase.
- **Languages Supported (4 Languages):** Thai (`th`), English (`en`), Lao (`lo`), and Vietnamese (`vi`).
- **UI/UX Style:** Clean, modern, Apple-inspired SaaS presentation dashboard with dark/light clarity, smooth transitions, responsive layout (desktop presentation & tablet/mobile friendly), and interactive cards/accordions. Avoid generic/outdated templates.

---

## 2. Strict Directory & File Structure
The agent MUST follow this exact folder and file structure:

```text
adult-learning-web/
├── index.html          # Main UI, Tailwind CSS (via CDN), and layout structure
├── app.js              # Core application logic (state management, language switcher, navigation)
├── data/
│   ├── part1.js        # Principle 01 data (4 languages) + image paths
│   ├── part2.js        # Principle 02 data (4 languages) + image paths
│   ├── part3.js        # Principle 03 data (4 languages) + image paths
│   ├── part4.js        # Principle 04 data (4 languages) + image paths
│   ├── part5.js        # Principle 05 data (4 languages) + image paths
│   └── part6.js        # Principle 06 data (4 languages) + image paths
├── i18n/
│   ├── th.js           # UI labels & common terms in Thai
│   ├── en.js           # UI labels & common terms in English
│   ├── lo.js           # UI labels & common terms in Lao
│   └── vi.js           # UI labels & common terms in Vietnamese
└── images/
    ├── part1/          # Placeholder or SVG illustrations for Principle 01
    ├── part2/          # Placeholder or SVG illustrations for Principle 02
    ├── part3/          # Placeholder or SVG illustrations for Principle 03
    ├── part4/          # Placeholder or SVG illustrations for Principle 04
    ├── part5/          # Placeholder or SVG illustrations for Principle 05
    └── part6/          # Placeholder or SVG illustrations for Principle 06



## 2. Technical Stack & Libraries
The agent MUST use the following lightweight and robust tech stack (no complex build steps, optimized for easy deployment and future migration to Firestore):

- **Frontend Core:** Pure HTML5, Modern JavaScript (ES6+), and CSS3.
- **Styling Framework:** Tailwind CSS (loaded via CDN in `index.html`) for clean, responsive, and modern SaaS UI design (glassmorphism, dark/light contrast support, clean typography).
- **Icons & UI Enhancements:** Lucide Icons (via CDN) or clean inline SVGs for navigation arrows, language icons, and UI buttons.
- **Fonts (Multi-language Support):** Google Fonts loaded in `<head>`:
  - `Inter` (for English & numbers)
  - `Noto Sans Thai` (for Thai)
  - `Noto Sans Lao` (for Lao)
  - `Be Vietnam Pro` (for Vietnamese)
- **Architecture Pattern:** Zero-Backend / Content-as-Code. Data is loaded synchronously via global window objects (`window.COURSE_PARTS` and `window.I18N`) to ensure compatibility when opening `index.html` locally (`file://`) without a local web server.