import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = process.cwd();
const publicOcr = path.join(root, "public", "ocr");
const coreOut = path.join(publicOcr, "core");
const langOut = path.join(publicOcr, "lang");

function packageRoot(name) {
  try {
    return path.dirname(require.resolve(name + "/package.json"));
  } catch {
    const entry = require.resolve(name);
    let current = path.dirname(entry);
    while (current !== path.dirname(current)) {
      if (fs.existsSync(path.join(current, "package.json"))) {
        const pkg = JSON.parse(fs.readFileSync(path.join(current, "package.json"), "utf8"));
        if (pkg.name === name) return current;
      }
      current = path.dirname(current);
    }
    throw new Error("Không tìm thấy gói " + name + " trong node_modules.");
  }
}

function findFiles(dir, predicate, found = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) findFiles(full, predicate, found);
    else if (predicate(item.name)) found.push(full);
  }
  return found;
}

fs.rmSync(publicOcr, { recursive: true, force: true });
fs.mkdirSync(coreOut, { recursive: true });
fs.mkdirSync(langOut, { recursive: true });

const tesseractRoot = packageRoot("tesseract.js");
const pdfRoot = packageRoot("pdfjs-dist");
const dataRoot = packageRoot("@tesseract.js-data/vie");
const coreRoot = packageRoot("tesseract.js-core");

const workerSource = path.join(tesseractRoot, "dist", "worker.min.js");
if (!fs.existsSync(workerSource)) throw new Error("Không tìm thấy Tesseract worker: " + workerSource);
fs.copyFileSync(workerSource, path.join(publicOcr, "worker.min.js"));

const pdfScript = path.join(pdfRoot, "build", "pdf.min.js");
const pdfWorker = path.join(pdfRoot, "build", "pdf.worker.min.js");
if (!fs.existsSync(pdfScript) || !fs.existsSync(pdfWorker)) {
  throw new Error("Không tìm thấy bộ đọc PDF.js trong node_modules.");
}
fs.copyFileSync(pdfScript, path.join(publicOcr, "pdf.min.js"));
fs.copyFileSync(pdfWorker, path.join(publicOcr, "pdf.worker.min.js"));

// Tesseract.js-core package versions use several filename conventions
// (including *.wasm.js); copy all runtime assets instead of relying on one regex.
const coreFiles = findFiles(coreRoot, (name) => /\\.(?:js|wasm|data)$/.test(name));
if (coreFiles.length === 0) {
  throw new Error("Không tìm thấy tệp JavaScript/WASM trong gói tesseract.js-core tại " + coreRoot);
}
for (const file of coreFiles) {
  const relative = path.relative(coreRoot, file);
  const destination = path.join(coreOut, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(file, destination);
}

const languageFiles = findFiles(dataRoot, (name) => name === "vie.traineddata.gz");
if (!languageFiles.length) throw new Error("Không tìm thấy dữ liệu ngôn ngữ tiếng Việt vie.traineddata.gz.");
fs.copyFileSync(languageFiles[0], path.join(langOut, "vie.traineddata.gz"));

console.log("Đã chuẩn bị OCR tự lưu trữ:", {
  worker: 1,
  pdfjs: 2,
  core: coreFiles.length,
  vietnameseLanguageData: 1,
});
