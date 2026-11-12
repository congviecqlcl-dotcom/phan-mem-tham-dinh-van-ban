import { createWorker } from "tesseract.js";

type OcrPageResult = {
  page: number;
  text: string;
  confidence: number;
  status: "dat" | "can_kiem_tra" | "khong_doc_duoc";
};

export type PdfOcrResult = {
  text: string;
  pages: OcrPageResult[];
  needsReview: boolean;
};

declare global {
  interface Window {
    pdfjsLib?: any;
    Tesseract?: any;
    __docuguardOcrScripts?: Record<string, Promise<void>>;
  }
}

function loadLocalScript(url: string, key: string): Promise<void> {
  window.__docuguardOcrScripts ||= {};
  const existingPromise = window.__docuguardOcrScripts[key];
  if (existingPromise) return existingPromise;

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[data-docuguard-ocr="${key}"]`) as HTMLScriptElement | null;
    if (existing?.dataset.loaded === "true") return resolve();
    const script = existing || document.createElement("script");
    script.src = url;
    script.async = true;
    script.dataset.docuguardOcr = key;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      delete window.__docuguardOcrScripts?.[key];
      reject(new Error(`Không tải được thành phần OCR nội bộ tại ${url}.`));
    };
    if (!existing) document.head.appendChild(script);
  });
  window.__docuguardOcrScripts[key] = promise;
  return promise;
}

async function createVietnameseWorker() {
  return createWorker("vie", 1, {
    workerPath: "/ocr/worker.min.js",
    corePath: "/ocr/core",
    langPath: "/ocr/lang",
    cacheMethod: "write",
    logger: () => undefined,
  });
}

// Uploaded document bytes, rendered page images, OCR worker, WASM core and Vietnamese
// traineddata are served from the application's own origin. No document is sent to a CDN.
export async function recognizeScannedPdf(file: File): Promise<PdfOcrResult> {
  await loadLocalScript("/ocr/pdf.min.js", "pdfjs");
  const pdfjs = window.pdfjsLib;
  if (!pdfjs?.getDocument) throw new Error("Bộ đọc PDF nội bộ không khởi tạo được.");
  pdfjs.GlobalWorkerOptions.workerSrc = "/ocr/pdf.worker.min.js";

  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  if (pdf.numPages > 100) {
    await pdf.destroy();
    throw new Error('PDF có ' + pdf.numPages + ' trang, vượt giới hạn OCR trực tiếp 100 trang. Hãy chia nhỏ tệp hoặc xử lý theo quy trình phù hợp.');
  }
  let worker: any;
  const pages: OcrPageResult[] = [];

  try {
    worker = await createVietnameseWorker();
    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
      const page = await pdf.getPage(pageNo);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Trình duyệt không tạo được vùng xử lý ảnh.");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: context, viewport }).promise;
      const result = await worker.recognize(canvas);
      const text = String(result?.data?.text || "").trim();
      const confidence = Number(result?.data?.confidence || 0);
      pages.push({
        page: pageNo,
        text,
        confidence,
        status: text.length < 20 ? "khong_doc_duoc" : confidence < 65 ? "can_kiem_tra" : "dat",
      });
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Không khởi chạy được OCR nội bộ: ${message}`);
  } finally {
    if (worker) await worker.terminate().catch(() => undefined);
    await pdf.destroy();
  }

  const text = pages.map((page) => `[Trang ${page.page}]\n${page.text}`).join("\n\n").trim();
  return { text, pages, needsReview: pages.some((page) => page.status !== "dat") };
}

export async function recognizeImageText(file: File): Promise<{ text: string; confidence: number }> {
  let worker: any;
  try {
    worker = await createVietnameseWorker();
    const result = await worker.recognize(file);
    return {
      text: String(result?.data?.text || "").trim(),
      confidence: Number(result?.data?.confidence || 0),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Không nhận dạng được ảnh bằng OCR nội bộ: ${message}`);
  } finally {
    if (worker) await worker.terminate().catch(() => undefined);
  }
}
