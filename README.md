# TT VDO DOWNLOADER

Professional TikTok video & MP3 downloader — fast, free, no watermark.
Built as a single-page PWA with a Firebase backend.

🌐 **Live:** https://your-domain.vercel.app

---

## 📁 Project structure (deployment folder)

```
.
├── index.html              ← Main public website
├── 404.html                ← Custom 404 page
├── privacy.html            ← Privacy Policy
├── terms.html              ← Terms of Service
├── manifest.json           ← PWA manifest (installable app)
├── sw.js                   ← Service worker (offline + caching)
├── robots.txt              ← SEO crawler rules
├── sitemap.xml             ← SEO sitemap
├── vercel.json             ← Vercel deployment config (headers, redirects)
├── favicon.ico             ← Browser tab icon
├── og-image.png            ← Social share preview (1200×630)
└── icons/                  ← All PWA icons (16px → 512px + maskable)
    ├── icon-16.png … icon-512.png
    ├── maskable-192.png
    ├── maskable-512.png
    └── apple-touch-icon.png
```

> The admin panel is kept **outside** this folder for security and is used privately by the owner.

---

## 🚀 Deploy to Vercel

### Option 1 — Drag & drop
1. Zip the whole folder
2. Go to https://vercel.com/new
3. Drag the zip → Deploy

### Option 2 — GitHub
1. Push this folder to a GitHub repo
2. Connect to Vercel → it auto-detects → Deploy

No build step needed — it's plain HTML/CSS/JS.

---

## 🔧 First-time Firebase setup (one time only)

### 1. Firebase Console → enable services
- **Firestore Database** → Create (production mode)

### 2. Firestore Rules (paste into Firestore → Rules tab)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public website can log visits/downloads/users
    match /visits/{id}    { allow create: if true; allow read: if request.auth != null; }
    match /downloads/{id} { allow create: if true; allow read: if request.auth != null; }
    match /users/{uid}    { allow create, update: if true; allow read: if request.auth != null; }

    // Settings: public READ (so the website can load them), admin-only WRITE
    match /settings/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
Click **Publish**.

### 3. Authorize your domain
Firebase Console → Authentication → **Settings → Authorized domains** → add your Vercel domain (e.g. `ttvdo.vercel.app`).

---

## 📱 PWA — installable app

The site is a full Progressive Web App. On Android Chrome / iOS Safari, users will see an "Install" / "Add to home screen" prompt. After installing, it opens like a real native app (no browser bar).

---

## 🛠️ Customize

| What | Where |
|---|---|
| Brand name | `index.html`, `manifest.json`, `README.md` |
| Colors | CSS `:root` variables in `index.html` |
| Domain in sitemap | `sitemap.xml`, `robots.txt` |
| APK link, socials, contact | Admin panel → Site Settings |

---

## 🔒 Security

- Strict security headers via `vercel.json`
- Firestore rules enforce write-protection on settings
- Admin panel is kept separately by the owner (not deployed publicly)

---

## 📜 License

Personal / educational use. TikTok™ is a trademark of ByteDance; this project is not affiliated.
