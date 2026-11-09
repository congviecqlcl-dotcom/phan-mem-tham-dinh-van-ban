type OcrPageResult = { page: number; text: string; confidence: number; status: "dat" | "can_kiem_tra" | "khong_doc_duoc" };

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

function loadScriptOnce(url: string, key: string): Promise<void> {
  window.__docuguardOcrScripts ||= {};
  if (window.__docuguardOcrScripts[key]) return window.__docuguardOcrScripts[key];
  window.__docuguardOcrScripts[key] = new Promise((resolve, reject) => {
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
      reject(new Error(`Không tải được thành phần OCR từ ${new URL(url).hostname}. Có thể mạng nội bộ hoặc chính sách bảo mật đang chặn CDN.`));
    };
    if (!existing) document.head.appendChild(script);
  });
  return window.__docuguardOcrScripts[key];
}

// PDF and image data stay in this browser tab. Only static libraries and Vietnamese
// language data are fetched from public CDNs; no uploaded document is sent to them.
export async function recognizeScannedPdf(file: File): Promise<PdfOcrResult> {
  await loadScriptOnce(
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js",
    "pdfjs"
  );
  await loadScriptOnce(
    "https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js",
    "tesseract"
  );

  const pdfjs = window.pdfjsLib;
  const tesseract = window.Tesseract;
  if (!pdfjs?.getDocument) throw new Error("Thư viện đọc PDF đã tải nhưng không khởi tạo được.");
  if (!tesseract?.createWorker) throw new Error("Thư viện OCR đã tải nhưng không khởi tạo được.");

  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  let worker: any;
  const pages: OcrPageResult[] = [];
  try {
    worker = await tesseract.createWorker("vie", 1, {
      workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/worker.min.js",
      corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@6.0.1",
      langPath: "https://tessdata.projectnaptha.com/4.0.0",
      logger: () => undefined,
    });

    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
      const page = await pdf.getPage(pageNo);
      const viewport = page.getViewport({ scale: 1.8 });
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
    throw new Error(`Không khởi chạy được OCR: ${message}`);
  } finally {
    if (worker) await worker.terminate().catch(() => undefined);
    await pdf.destroy();
  }

  const text = pages.map((p) => `[Trang ${p.page}]\n${p.text}`).join("\n\n").trim();
  return { text, pages, needsReview: pages.some((p) => p.status !== "dat") };
}


export async function recognizeImageText(file: File): Promise<{ text: string; confidence: number }> {
  await loadScriptOnce(
    "https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js",
    "tesseract"
  );
  const tesseract = window.Tesseract;
  if (!tesseract?.createWorker) throw new Error("Thư viện OCR đã tải nhưng không khởi tạo được.");
  let worker: any;
  try {
    worker = await tesseract.createWorker("vie", 1, {
      workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/worker.min.js",
      corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@6.0.1",
      langPath: "https://tessdata.projectnaptha.com/4.0.0",
      logger: () => undefined,
    });
    const result = await worker.recognize(file);
    return {
      text: String(result?.data?.text || "").trim(),
      confidence: Number(result?.data?.confidence || 0),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Không nhận dạng được ảnh: ${message}`);
  } finally {
    if (worker) await worker.terminate().catch(() => undefined);
  }
}
