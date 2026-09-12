# Card Snap backend

The API behind [Card Snap](../README.md): contacts CRUD on MongoDB and OCR for photos of business cards. It is Express 5 + TypeScript, run with `ts-node`.

## Setup

From the repository root:

```bash
cd backend
npm install
cp .env.example .env   # then fill it in
npm run dev            # ts-node src/server.ts
```

The server connects to MongoDB first and exits if that fails. Once it's listening it prints local and network URLs for `GET /api/playground/status` (default port `5091`) and calls its own diagnostics once as a self-check.

There is no build script; `npm run dev` is the only way to start it. Run it from `backend/` so `tesseract.js` finds `eng.traineddata` and the temporary `uploads/` folder is created there.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string (Atlas or local). |
| `PORT` | No | Port to listen on. Defaults to `5091`. |
| `LOG_RESPONSE` | No | `true` logs every request and response body. These include base64 images and contact details, so keep it off unless you are debugging. |
| `HUGGINGFACE_API_KEY` | No | Token for the Hugging Face Inference API. The NER step is skipped when it is empty. |
| `NODE_ENV` | No | `production` makes `/api/playground/system` and `/api/playground/db` return 404. |

## API

All routes are under `/api`. JSON bodies up to 20 MB are accepted (enough for a base64 photo).

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/contacts` | All contacts. |
| `POST` | `/api/contacts` | Create a contact. `201` with the saved document, `400` if validation fails. |
| `GET` | `/api/contacts/:id` | One contact. `400` for an invalid id, `404` if not found. |
| `PUT` | `/api/contacts/:id` | Update a contact (validators run). |
| `DELETE` | `/api/contacts/:id` | Delete a contact. `204` on success. |
| `GET` | `/api/user/me` | The first document in the `users` collection (`_id`, `fullName`, `email`), `404` if there is none. No route creates users. |
| `POST` | `/api/ocr` | Raw OCR text for a base64 image. |
| `POST` | `/api/ocrExtract` | OCR plus field extraction (used by the app's scan screen). |
| `GET` | `/api/playground/status` | Health check: name, status, timestamp, port and `NODE_ENV`. |
| `GET` | `/api/playground/system` | Platform, uptime and memory. Not available when `NODE_ENV=production`. |
| `GET` | `/api/playground/db` | Collection names and document counts. Not available when `NODE_ENV=production`. |

### OCR request

Both OCR endpoints take the image as base64, without a `data:` prefix:

```json
{ "base64": "<base64 image data>" }
```

`POST /api/ocr` responds with:

```json
{ "message": "OCR completed", "fileType": "image/png", "text": "..." }
```

`POST /api/ocrExtract` responds with:

```json
{
  "message": "OCR & extraction completed",
  "text": "...full OCR text...",
  "compromiseEntities": { "names": [], "organizations": [], "emails": [], "phones": [] },
  "huggingFaceResult": null,
  "rawExtraction": { "name": "", "email": "", "phone": "", "company": "" }
}
```

`huggingFaceResult` is the model's raw output, or `null` when the key is not set or the call fails. The app prefills its form from `rawExtraction`, falling back to the first item of each `compromiseEntities` list.

### How OCR works

1. `sharp` auto-rotates, converts to grayscale, resizes to 1000 px wide and sharpens the image, writing a temporary PNG to `uploads/` (created on first use and deleted after each request).
2. `tesseract.js` reads the text with the English model (`eng.traineddata`).
3. `compromise` finds people and organizations; regular expressions find emails, phone numbers and lines labeled "Name:"/"Company:".
4. Optionally, the text is sent to Hugging Face `dslim/bert-base-NER`.

### Contact model

`fullName`, `email` and `company` are required. Optional: `jobTitle`, `phone`, `address`, `website`, `linkedin`, `department`, `industry`, `notes`, `imageUri`. `scannedAt` defaults to the creation time.

## Security notes

- There is **no authentication** and CORS allows any origin: anyone who can reach the server can read, change or delete every contact. `src/middleware/auth.ts` is a mock that is not mounted anywhere. Run the API only on a trusted network.
- The diagnostics routes never return environment variables or database documents.
- Never commit `.env`; `.env.example` lists the variable names.

## Florence-2 notebook (experimental)

`train_florence2.ipynb` is a Google Colab notebook (T4 GPU) that fine-tunes `microsoft/Florence-2-base` with LoRA (r = 8, 15 epochs, `paged_adamw_8bit`) to output contact details as JSON from a card image. It expects a `./dataset` folder with the images and an `annotations.json` that maps each image filename to its target JSON string, and saves the result to `./custom_florence2_model`. The API does not use this model yet.

## Project structure

```text
backend/
├── src/
│   ├── server.ts            # Express app, routes, request logger, startup
│   ├── controllers/         # contacts, OCR (ocrController, ocrWirhExtractController), playground
│   ├── routes/              # /api/contacts, /api/user, /api/ocr, /api/ocrExtract, /api/playground
│   ├── models/              # Mongoose Contact and User schemas
│   ├── middleware/auth.ts   # Mock auth (not mounted)
│   └── @types/              # Shared TypeScript types
├── eng.traineddata          # Tesseract English language data
├── train_florence2.ipynb    # Florence-2 LoRA fine-tuning notebook
└── .env.example             # Environment variable names
```

## Author

**Trupal Patel** · [trupalpatel.com](https://trupalpatel.com) · [trupal.work@gmail.com](mailto:trupal.work@gmail.com) · [GitHub](https://github.com/TRUPALIX9)
