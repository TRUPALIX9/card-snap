
# 📇 Card Vault – Frontend (React Native + Expo + TypeScript)

Card Vault is a cross-platform mobile app built with **React Native (Expo)** and **TypeScript** for scanning business cards, extracting contact info using OCR, and saving it locally or syncing with a backend.

This frontend uses **Expo Router** for file-based navigation and is optimized for Android, iOS, and Web.

---

## 🧭 Features

- 📸 Scan business cards using device camera (`expo-camera`)
- 🧠 OCR & AI/Regex-based parsing on backend
- 🗂 View and manage contacts
- 📝 Add contacts manually
- 🌗 Light/dark mode with ThemeContext
- 📁 Organized with file-based routing via Expo Router
- ⚙️ Configurable with `.env` support for backend URL

---

## 📁 Project Layout (Key Folders)

```

app/
├── (tabs)/           # Home, Profile, Contacts tabs
├── add/              # Add contact manually or via scan
├── contacts/\[id].tsx # View individual contact
├── \_layout.tsx       # Root layout using Stack
├── +not-found.tsx    # 404 fallback
components/           # Header and UI components
context/              # ThemeContext
constants/            # Theme colors
assets/               # Images & Fonts
theme/                # Theme management

````

---

## ⚙️ Environment Setup

Create a `.env` file in the root:

```env
EXPO_PUBLIC_API_URL=http://<your-local-ip>:5091
````

> Replace `<your-local-ip>` with your backend's IP address (accessible from your phone on same network).

---

## ▶️ Run the App Locally

1. **Install dependencies**

```bash
npm install
```

2. **Start Expo**

```bash
npx expo start
```

3. **Preview options**

* Press `a` → Android
* Press `i` → iOS (Mac only)
* Press `w` → Web

> Scan the QR code with the Expo Go app to preview on physical device.

---

## 📸 OCR API Used

The app sends base64 image data to the backend via:

### POST `/ocrExtract`

**Payload:**

```json
{
  "base64": "<image_data>"
}
```

**Response:**

```json
{
  "text": "Extracted OCR text",
  "data": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1 234 567 8900",
    "company": "Startup Co",
    "address": "456 Innovation Way"
  }
}
```

---

## 🏗 Build for Production (EAS)

You can generate installable builds using **EAS**:

### Install EAS

```bash
npm install -g eas-cli
```

### Login & configure

```bash
eas login
eas init
```

### Build commands

```bash
eas build -p android --profile production
eas build -p ios --profile production
```

> iOS builds require Apple Developer credentials.

---

## 🔧 Upcoming Features

* [ ] Offline OCR fallback (on-device)
* [ ] MMKV-based local storage
* [ ] NFC/QR contact exchange
* [ ] Tagging + filter UI for contacts

---

## 🧑‍💻 Author

**Trupal Patel**
📧 [trupal.work@gmail.com](mailto:trupal.work@gmail.com)
🔗 GitHub: [@TRUPALIX9](https://github.com/TRUPALIX9)

---

## 📄 License

MIT License © 2025 Trupal Patel

---

## 🙌 Acknowledgements

* [Expo](https://expo.dev/)
* [React Native Paper](https://callstack.github.io/react-native-paper/)
* [Tesseract.js](https://github.com/naptha/tesseract.js)
* [Hugging Face](https://huggingface.co/)
* [Expo Router](https://expo.github.io/router/)

```

```
