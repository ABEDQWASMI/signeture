# 📱 Signature Coffeehouse — iOS Install Profile Distribution

This guide explains how to let anyone install the app directly on their iPhone
by visiting a link — **no App Store required**.

---

## 🔑 How It Works

```
User visits your link → taps "Install on iPhone"
→ iOS shows "Install App?" prompt
→ App installs on home screen like a native app
```

This uses Apple's **OTA (Over-The-Air)** distribution via `itms-services://`
combined with an **EAS internal distribution build** from Expo.

---

## ✅ Step-by-Step Setup

### Step 1 — Create a Free Expo Account

1. Go to **https://expo.dev/signup**
2. Create your account (free)
3. In your terminal, run:
   ```bash
   npx eas-cli login
   ```

### Step 2 — Link This Project to EAS

```bash
cd SignatureApp
npx eas-cli init
```

- Choose **"Use an existing EAS project"** or create new
- Copy the **Project ID** shown
- Paste it into `app.json` → replace `YOUR_EAS_PROJECT_ID`

### Step 3 — Build the iOS IPA (Internal Distribution)

```bash
npx eas-cli build --platform ios --profile preview
```

> ⚠️ You need an **Apple Developer Account** ($99/year) to build for real devices.
> 
> **FREE ALTERNATIVE:** Use `--profile development` with Expo Go, or use the
> **Expo internal distribution** link EAS generates automatically (no Apple account needed for TestFlight-style links).

EAS will:
1. Build your app in the cloud ☁️
2. Give you a **shareable install link** like:
   `https://expo.dev/accounts/YOUR_NAME/projects/SignatureApp/builds/xxx`

### Step 4 — Get the EAS Shareable Link (Easiest Option)

After the build finishes on **https://expo.dev/builds**:

1. Open your build
2. Click **"Share"** button
3. Copy the link — it looks like:
   ```
   https://expo.dev/accounts/abedqwasmi/projects/SignatureApp/builds/xxxxxxxx
   ```
4. Anyone with this link on iPhone can tap **"Install"** and the app installs!

### Step 5 — Host the Landing Page (Optional but Recommended)

Deploy `install-page/` to **Vercel** for a beautiful download page:

```bash
# Install Vercel CLI
npm i -g vercel

# From the SignatureApp folder
vercel --name signature-install
```

Then update `install-page/index.html`:
- Replace `YOUR_HOSTING_URL` with your Vercel URL
- Replace `YOUR_EXPO_USERNAME` with your Expo username

---

## 🚀 Quick Deploy to Vercel (Landing Page Only)

```bash
npx vercel install-page/ --name signature-coffee
```

Share the Vercel URL with anyone. They visit it, tap Install, done!

---

## 📋 Files Overview

```
install-page/
├── index.html      ← Beautiful download landing page (Arabic UI)
├── manifest.plist  ← iOS OTA install manifest (update URLs after build)
└── manifest.json   ← Android PWA manifest

eas.json            ← EAS build profiles (preview = internal distribution)
app.json            ← App config with bundleIdentifier
```

---

## 🔄 Update manifest.plist After Build

After EAS gives you the `.ipa` URL:

1. Open `install-page/manifest.plist`
2. Replace all `YOUR_HOSTING_URL` with your actual hosted URL
3. Replace `YOUR_HOSTING_URL/SignatureCoffeehouse.ipa` with the actual IPA URL
4. Host the plist at a public HTTPS URL
5. Update `IPA_PLIST_URL` in `index.html`

---

## ⚡ Fastest Path (No Apple Account)

1. Run: `npx eas-cli build --platform ios --profile preview`
2. EAS builds it and gives you a link automatically
3. Share that link — iOS users tap Install

**That's it.** No hosting, no plist, no Apple account needed for this path.

---

## 📞 Support

- EAS Docs: https://docs.expo.dev/build/introduction/
- Internal Distribution: https://docs.expo.dev/build/internal-distribution/
- GitHub: https://github.com/ABEDQWASMI/signeture
