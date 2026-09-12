import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { createWorker } from "tesseract.js";
import nlp from "compromise";

const UPLOAD_DIR = "uploads";

// Utility: Save image and preprocess
const preprocessImage = async (base64: string, filename: string) => {
  const imageBuffer = Buffer.from(base64, "base64");
  // uploads/ is gitignored, so create it on first use (sharp won't).
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const outputPath = path.join(UPLOAD_DIR, filename);
  await sharp(imageBuffer)
    .rotate() // auto-rotate
    .grayscale()
    .resize({ width: 1000 })
    .sharpen()
    .toFile(outputPath);
  return outputPath;
};

// Utility: Hugging Face NER API (optional).
// Returns null when HUGGINGFACE_API_KEY is unset or the call fails, so the
// Tesseract and regex results are still returned.
const extractWithHuggingFace = async (text: string) => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      "https://api-inference.huggingface.co/models/dslim/bert-base-NER",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      }
    );
    if (!res.ok) {
      console.warn(`HuggingFace NER skipped: HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn("HuggingFace NER skipped:", String(err));
    return null;
  }
};

export const handleOcrExtract = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { base64 } = req.body;
  if (!base64) {
    res.status(400).json({ error: "Missing base64 image data" });
    return;
  }

  const timestamp = Date.now();
  const filename = `processed-${timestamp}.png`;
  const imagePath = path.join(UPLOAD_DIR, filename);

  try {
    // 1. Preprocess image
    await preprocessImage(base64, filename);
    console.log("📷 Preprocessed Image Path:", imagePath);

    // 2. Run OCR with Tesseract.js
    const worker = await createWorker("eng");
    const {
      data: { text },
    } = await worker.recognize(imagePath);
    await worker.terminate();

    console.log("🧠 [1] Raw OCR Text:\n", text.trim());

    // 3. Run spaCy-style extraction (via compromise.js)
    const doc = nlp(text);
    const people = doc.people().out("array");
    const organizations = doc.organizations().out("array");
    const emails =
      text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g) || [];
    const phones =
      text.match(
        /(?:\+?\d{1,3})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g
      ) || [];

    const compromiseEntities = {
      names: people,
      organizations,
      emails,
      phones,
    };
    console.log("🧪 [2] Manual Compromise NLP:\n", compromiseEntities);

    // 4. Run Hugging Face NER model
    const huggingFaceResult = await extractWithHuggingFace(text);
    console.log("🤖 [3] HuggingFace NER:\n", huggingFaceResult);

    // 5. Optional: Raw Regex Extraction (fallback baseline)
    const rawExtraction = {
      name: text.match(/(?:Name|Contact)[:\-]?\s*([^\n]+)/i)?.[1] || "",
      email: emails[0] || "",
      phone: phones[0] || "",
      company:
        text.match(/(?:Company|Organization|Firm)[:\-]?\s*([^\n]+)/i)?.[1] ||
        "",
    };
    console.log("🧾 [4] Basic Regex Result:\n", rawExtraction);

    res.json({
      message: "OCR & extraction completed",
      text: text.trim(),
      compromiseEntities,
      huggingFaceResult,
      rawExtraction,
    });
  } catch (err) {
    console.error("❌ OCR extraction error:", err);
    res
      .status(500)
      .json({ error: "Failed to extract text", details: String(err) });
  } finally {
    // Don't keep photos of people's business cards on disk.
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }
};
