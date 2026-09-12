# Card Snap app

The mobile app for [Card Snap](../README.md), built with Expo SDK 53 (React Native 0.79, TypeScript), Expo Router and React Native Paper. All contact data comes from the [backend](../backend/README.md) API; the only thing stored on the device is your light/dark theme choice.

## Screens

| Route | Screen |
|---|---|
| `/` | **Home**: welcome card with View Contacts, Add Contact and Profile & Settings |
| `/contacts` | **Contacts**: searchable list (name, email or company), pull to refresh, `+` button |
| `/profile` | **Profile**: the user from `/api/user/me` and the Dark Mode switch |
| `/add` | **Add a Contact**: choose Scan Business Card or Enter Info Manually |
| `/add/scan` | **Scan Business Card**: camera view, camera flip and shutter |
| `/add/manual` | **Add Contact Manually**: ten fields; name, email and company are required |
| `/contacts/:id` | **Contact Info**: tap the phone to call or the email to write |

The bottom tabs (Home, Contacts, Profile) are icon-only. A global header from `components/Header.tsx` sits above every screen and shows a back arrow on pushed screens.

### Scan flow

1. The scan screen asks for camera permission and takes a base64 photo with `expo-camera`.
2. It posts `{ "base64": "..." }` to `POST /api/ocrExtract`.
3. It opens `/add/manual` with `fullName`, `email`, `phone` and `company` taken from the response (`rawExtraction`, then the first entry of each `compromiseEntities` list), so you only review and save.
4. Saving posts the form to `POST /api/contacts` and returns to the Contacts tab, which refetches.

## Setup

Start the backend first (see [backend/README.md](../backend/README.md)), then from the repository root:

```bash
cd frontend
npm install
cp .env.example .env   # then set EXPO_PUBLIC_API_URL
npx expo start         # or: npm start
```

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Yes | Base URL of the backend as seen from your phone, for example `http://<your computer's LAN IP>:5091`, with no trailing slash. `localhost` only works in a simulator on the same machine. |

In the Expo terminal, scan the QR code with Expo Go, or press `i` (iOS simulator), `a` (Android) or `w` (web). The camera scan needs a real device or a simulator with a camera.

Type-check with:

```bash
npx tsc --noEmit
```

## Builds (EAS)

`eas.json` defines `development` (dev client, internal), `preview` (internal) and `production` (auto-increment) profiles. The app name is Card Snap, and the bundle identifier / package is `com.trupalix9.cardSnap`.

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
eas build -p ios --profile production   # needs an Apple Developer account
```

## Project structure

```text
frontend/
├── app/
│   ├── _layout.tsx          # Root: fonts, theme providers, global Header, Stack
│   ├── (tabs)/              # Home (index), Contacts, Profile + tab bar layout
│   ├── add/                 # Add chooser, scan/ and manual/
│   ├── contacts/[id].tsx    # Contact Info
│   ├── manualAdd.tsx        # Older add form (only reachable at /manualAdd)
│   └── +not-found.tsx       # 404 screen
├── components/Header.tsx    # Global app bar
├── context/ThemeContext.tsx # Light/dark state, saved with AsyncStorage
├── theme/index.ts           # MD3 light and dark themes (primary #008BFF)
├── assets/                  # App icons, splash, fonts
├── app.json                 # Expo config
└── eas.json                 # EAS Build profiles
```

## Author

**Trupal Patel** · [trupalpatel.com](https://trupalpatel.com) · [trupal.work@gmail.com](mailto:trupal.work@gmail.com) · [LinkedIn](https://www.linkedin.com/in/trupalix) · [GitHub](https://github.com/TRUPALIX9)
