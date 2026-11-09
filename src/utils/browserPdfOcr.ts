type OcrPageResult = { page: number; text: string; confidence: number; status: "dat" | "can_kiem_tra" | "khong_doc_duoc" };

export type PdfOcrResult = {
  text: string;
  pages: OcrPageResult[];
  needsReview: boolean;
};

// PDF pages are rendered and recognized in the browser. Document bytes and page images
// are not uploaded to the OCR provider; only OCR engine/language assets are downloaded.
export async function recognizeScannedPdf(file: File): Promise<PdfOcrResult> {
  const pdfjsUrl = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs";
  const tesseractUrl = "https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.esm.min.js";
  const pdfjs: any = await import(/* @vite-ignore */ pdfjsUrl);
  const tesseract: any = await import(/* @vite-ignore */ tesseractUrl);

  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs";

  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  const worker = await tesseract.createWorker("vie", 1, {
    workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/worker.min.js",
    corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@6.0.1",
    langPath: "https://tessdata.projectnaptha.com/4.0.0",
    logger: () => undefined,
  });

  const pages: OcrPageResult[] = [];
  try {
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
  } finally {
    await worker.terminate();
    await pdf.destroy();
  }

  const text = pages.map((p) => `[Trang ${p.page}]\n${p.text}`).join("\n\n").trim();
  return {
    text,
    pages,
    needsReview: pages.some((p) => p.status !== "dat"),
  };
}
