import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { uploadApi } from './api';
import { cleanText, isReadableText } from './sanitize';
import { PhotoCandidate, PhotoData } from '../types';

// Set up local PDF.js worker via Vite asset URL
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
  } catch (err) {
    console.warn('PDF.js worker initialization notice:', err);
  }
}

export interface ExtractedFileResult {
  text: string;
  numPages?: number;
  fileType: string;
  fileName: string;
  fileSize: string;
  extractedPhotoUrl?: string;
  photoData?: PhotoData;
  photoCandidates?: PhotoCandidate[];
}


/**
 * Analyzes pixel data to calculate skin tone ratio and color variance
 */
function analyzeImagePixels(data: Uint8ClampedArray, width: number, height: number): { skinRatio: number; colorVariance: number } {
  let skinPixels = 0;
  const totalPixels = width * height;
  if (totalPixels === 0) return { skinRatio: 0, colorVariance: 0 };

  const step = Math.max(1, Math.floor(totalPixels / 2000));
  let sampledCount = 0;
  const rValues: number[] = [];

  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 50) continue;
    sampledCount++;
    rValues.push(r);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const isSkin = (r > 40 && g > 25 && b > 15 && (max - min > 10) && Math.abs(r - g) > 8 && r > g && r > b);
    if (isSkin) skinPixels++;
  }

  if (sampledCount === 0) return { skinRatio: 0, colorVariance: 0 };

  const skinRatio = skinPixels / sampledCount;
  const meanR = rValues.reduce((acc, val) => acc + val, 0) / rValues.length;
  const varR = rValues.reduce((acc, val) => acc + Math.pow(val - meanR, 2), 0) / rValues.length;
  const colorVariance = Math.sqrt(varR);

  return { skinRatio, colorVariance };
}

function scorePhotoCandidate(width: number, height: number, skinRatio: number, colorVariance: number, pageIndex: number = 0): number {
  if (width < 35 || height < 35) return 0;
  if (width > 2600 || height > 2600) return 0;

  let score = 55;
  const aspectRatio = width / height;

  if (aspectRatio >= 0.65 && aspectRatio <= 1.45) {
    score += 35;
  } else if (aspectRatio >= 0.45 && aspectRatio <= 2.2) {
    score += 15;
  } else {
    score -= 20;
  }

  if (width >= 60 && width <= 1000 && height >= 60 && height <= 1000) {
    score += 20;
  }

  if (skinRatio >= 0.03 && skinRatio <= 0.8) {
    score += 30;
  } else if (skinRatio > 0.8) {
    score += 10;
  }

  if (pageIndex === 0) {
    score += 25;
  } else {
    score -= 20;
  }

  if (colorVariance > 15) {
    score += 15;
  }

  return Math.max(20, Math.min(100, Math.round(score)));
}



/**
 * Processes PDF image object (ImageBitmap or raw bytes) into PhotoCandidate
 */
function processPdfImageCandidate(imgObj: any, pageIndex: number, opIndex: number): PhotoCandidate | null {
  if (typeof document === 'undefined') return null;

  try {
    let width = imgObj.width || 0;
    let height = imgObj.height || 0;
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;

    // Case 1: ImageBitmap or HTMLImageElement
    const bitmap = imgObj.bitmap || (typeof ImageBitmap !== 'undefined' && imgObj instanceof ImageBitmap ? imgObj : null);
    if (bitmap && bitmap.width && bitmap.height) {
      width = bitmap.width;
      height = bitmap.height;
      if (width < 35 || height < 35 || width > 4000 || height > 4000) return null;

      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0);
      }
    }
    // Case 2: Raw byte array (Uint8ClampedArray / Uint8Array)
    else if (imgObj.data && width > 0 && height > 0) {
      if (width < 35 || height < 35 || width > 4000 || height > 4000) return null;

      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');
      if (ctx) {
        const imgData = ctx.createImageData(width, height);
        const srcData = imgObj.data;

        if (srcData.length === width * height * 4) {
          imgData.data.set(srcData);
        } else if (srcData.length === width * height * 3) {
          let j = 0;
          for (let k = 0; k < srcData.length; k += 3) {
            imgData.data[j++] = srcData[k];
            imgData.data[j++] = srcData[k + 1];
            imgData.data[j++] = srcData[k + 2];
            imgData.data[j++] = 255;
          }
        } else if (srcData.length === width * height) {
          let j = 0;
          for (let k = 0; k < srcData.length; k++) {
            const v = srcData[k];
            imgData.data[j++] = v;
            imgData.data[j++] = v;
            imgData.data[j++] = v;
            imgData.data[j++] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }
    }

    if (!canvas || !ctx) return null;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.94);
    if (!dataUrl || dataUrl.length < 500) return null;

    const finalCtx = canvas.getContext('2d');
    const finalData = finalCtx ? finalCtx.getImageData(0, 0, width, height).data : null;
    const { skinRatio, colorVariance } = finalData
      ? analyzeImagePixels(finalData, width, height)
      : { skinRatio: 0.3, colorVariance: 40 };

    const score = Math.max(90, scorePhotoCandidate(width, height, skinRatio, colorVariance, pageIndex));

    return {
      id: `pdf-img-${pageIndex}-${opIndex}-${Date.now()}`,
      url: dataUrl,
      score,
      width,
      height,
      source: 'resume',
    };
  } catch (e) {
    console.warn('Process PDF image candidate notice:', e);
  }
  return null;
}

/**
 * Unified single-pass PDF extractor: extracts full text AND embedded photos concurrently
 * Prevents ArrayBuffer detachment and ensures fast, reliable photo extraction
 */
async function extractPdfData(arrayBuffer: ArrayBuffer): Promise<{
  text: string;
  numPages: number;
  photoCandidates: PhotoCandidate[];
}> {
  // Clone ArrayBuffer to ensure isolation from worker detachment
  const safeData = new Uint8Array(arrayBuffer.slice ? arrayBuffer.slice(0) : arrayBuffer);

  const loadingTask = pdfjsLib.getDocument({
    data: safeData,
    useSystemFonts: true,
    disableFontFace: true,
  } as any);

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages || 1;
  let fullText = '';
  const photoCandidates: PhotoCandidate[] = [];

  const pagesToScan = Math.min(numPages, 2);

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);

      // 1. Text extraction with natural layout line breaks
      try {
        const textContent = await page.getTextContent();
        let pageText = '';
        let lastY: number | null = null;
        for (const item of textContent.items as any[]) {
          if (item && item.str !== undefined) {
            const currentY = item.transform ? item.transform[5] : null;
            if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 4) {
              pageText += '\n';
            } else if (pageText && !pageText.endsWith('\n') && !pageText.endsWith(' ') && item.str) {
              pageText += ' ';
            }
            pageText += item.str;
            if (currentY !== null) lastY = currentY;
          }
        }
        fullText += pageText + '\n\n';
      } catch (textErr) {
        console.warn(`Text extraction warning on page ${pageNum}:`, textErr);
      }

      // 2. Photo extraction (scan first 2 pages)
      if (pageNum <= pagesToScan) {
        try {
          // Pre-render page to offscreen canvas to trigger PDF.js object decoding in worker
          let pageCanvas: HTMLCanvasElement | null = null;
          let viewport: any = null;
          if (typeof document !== 'undefined') {
            try {
              viewport = page.getViewport({ scale: 2.0 });
              pageCanvas = document.createElement('canvas');
              pageCanvas.width = viewport.width;
              pageCanvas.height = viewport.height;
              const pageCtx = pageCanvas.getContext('2d');
              if (pageCtx) {
                await (page.render({ canvasContext: pageCtx, viewport } as any)).promise;
              }
            } catch (rErr) {
              console.warn('Pre-render notice for PDF decoding:', rErr);
            }
          }

          const opList = await page.getOperatorList();
          let lastTransform: number[] | null = null;

          for (let opIdx = 0; opIdx < opList.fnArray.length; opIdx++) {
            const fn = opList.fnArray[opIdx];
            const args = opList.argsArray[opIdx];

            if (fn === (pdfjsLib as any).OPS?.transform || fn === 12) {
              lastTransform = args;
            }

            const isImageOp =
              fn === (pdfjsLib as any).OPS?.paintImageXObject ||
              fn === (pdfjsLib as any).OPS?.paintInlineImageXObject ||
              fn === (pdfjsLib as any).OPS?.paintJpegXObject ||
              fn === (pdfjsLib as any).OPS?.paintImageMaskXObject ||
              fn === 85 || fn === 84 || fn === 83 || fn === 82;

            if (isImageOp && args && args[0]) {
              const imgName = args[0];
              let candidate: PhotoCandidate | null = null;

              // Method A: Direct image object resolution
              if (typeof imgName === 'string') {
                let imgObj: any = null;

                if ((page as any).objs && typeof (page as any).objs.has === 'function' && (page as any).objs.has(imgName)) {
                  try { imgObj = (page as any).objs.get(imgName); } catch {}
                }
                if (!imgObj && (page as any).commonObjs && typeof (page as any).commonObjs.has === 'function' && (page as any).commonObjs.has(imgName)) {
                  try { imgObj = (page as any).commonObjs.get(imgName); } catch {}
                }

                if (imgObj) {
                  candidate = processPdfImageCandidate(imgObj, pageNum - 1, opIdx);
                }
              }

              // Method B: Exact Operator Bounding Box on rendered canvas
              // PDF.js worker rendered the image directly on pageCanvas at the transform coordinates
              if (!candidate && lastTransform && pageCanvas && viewport && typeof document !== 'undefined') {
                try {
                  const [a, b, c, d, e, f] = lastTransform;
                  const p1 = viewport.convertToViewportPoint(e, f);
                  const p2 = viewport.convertToViewportPoint(e + a, f + d);
                  const cropX = Math.round(Math.min(p1[0], p2[0]));
                  const cropY = Math.round(Math.min(p1[1], p2[1]));
                  const cropW = Math.round(Math.abs(p2[0] - p1[0]));
                  const cropH = Math.round(Math.abs(p2[1] - p1[1]));

                  if (
                    cropW >= 40 &&
                    cropH >= 40 &&
                    cropX >= 0 &&
                    cropY >= 0 &&
                    cropX + cropW <= pageCanvas.width &&
                    cropY + cropH <= pageCanvas.height
                  ) {
                    const cropCanvas = document.createElement('canvas');
                    cropCanvas.width = cropW;
                    cropCanvas.height = cropH;
                    const cropCtx = cropCanvas.getContext('2d');
                    if (cropCtx) {
                      cropCtx.drawImage(pageCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
                      const dataUrl = cropCanvas.toDataURL('image/jpeg', 0.94);
                      const cropData = cropCtx.getImageData(0, 0, cropW, cropH).data;
                      const { skinRatio, colorVariance } = analyzeImagePixels(cropData, cropW, cropH);
                      const score = Math.max(90, scorePhotoCandidate(cropW, cropH, skinRatio, colorVariance, pageNum - 1));

                      candidate = {
                        id: `pdf-op-img-${pageNum}-${opIdx}-${Date.now()}`,
                        url: dataUrl,
                        score,
                        width: cropW,
                        height: cropH,
                        source: 'resume',
                      };
                    }
                  }
                } catch (cropErr) {
                  console.warn('Operator canvas crop notice:', cropErr);
                }
              }

              if (candidate) {
                photoCandidates.push(candidate);
              }
            }
          }

        } catch (imgScanErr) {
          console.warn(`Image scan notice on page ${pageNum}:`, imgScanErr);
        }
      }
    } catch (pageErr) {
      console.warn(`Error processing PDF page ${pageNum}:`, pageErr);
    }
  }

  photoCandidates.sort((a, b) => b.score - a.score);
  return { text: fullText, numPages, photoCandidates };
}

/**
 * Extracts candidate embedded photos from DOCX file using Mammoth
 */
async function extractPhotosFromDocxArrayBuffer(arrayBuffer: ArrayBuffer): Promise<PhotoCandidate[]> {
  const candidates: PhotoCandidate[] = [];
  try {
    let index = 0;
    const buffer = typeof Buffer !== 'undefined' ? Buffer.from(arrayBuffer) : (arrayBuffer as any);
    await mammoth.convertToHtml(
      { arrayBuffer, buffer } as any,
      {
        convertImage: mammoth.images.imgElement((image: any) => {
          return image.read('base64').then((imageBuffer: string) => {
            if (imageBuffer && imageBuffer.length > 1500) {
              const url = `data:${image.contentType || 'image/jpeg'};base64,${imageBuffer}`;
              const score = imageBuffer.length > 10000 ? 98 : 90;
              index++;
              candidates.push({
                id: `docx-img-${index}-${Date.now()}`,
                url,
                score,
                source: 'resume',
              });
            }
            return { src: '' };
          });
        }),
      }
    );
  } catch (err) {
    console.warn('DOCX photo extraction notice:', err);
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}

export function buildPhotoDataFromCandidates(candidates: PhotoCandidate[]): PhotoData {
  if (!candidates || candidates.length === 0) {
    return {
      source: 'none',
      url: '',
      selected: false,
      candidates: [],
    };
  }

  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const validPhoto = Boolean(best && best.url);

  return {
    source: validPhoto ? 'resume' : 'none',
    url: validPhoto ? best.url : '',
    selected: validPhoto,
    candidates: sorted.map((c, idx) => ({
      ...c,
      selected: validPhoto && idx === 0,
    })),
  };
}

/**
 * Universal resume and document text extractor
 * Supports PDF, DOCX, DOC, TXT, JSON, MD, PNG, JPG
 */
export async function extractTextFromFile(file: File): Promise<ExtractedFileResult> {
  const fileName = file.name;
  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const fileSize = file.size < 1024 * 1024
    ? `${(file.size / 1024).toFixed(0)} KB`
    : `${fileSizeMb} MB`;

  const lowerName = fileName.toLowerCase();

  // 1. Direct Image Resume or Photo (JPG, PNG, WEBP)
  if (file.type.startsWith('image/') || lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.webp')) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const photoCandidate: PhotoCandidate = {
      id: `img-${Date.now()}`,
      url: dataUrl,
      score: 95,
      source: 'resume',
      selected: true,
    };

    const photoData: PhotoData = {
      source: 'resume',
      url: dataUrl,
      selected: true,
      candidates: [photoCandidate],
    };

    return {
      text: fileName.replace(/\.[^/.]+$/, ''),
      fileType: 'image',
      fileName,
      fileSize,
      numPages: 1,
      extractedPhotoUrl: dataUrl,
      photoData,
      photoCandidates: [photoCandidate],
    };
  }

  // 2. Plain Text or JSON or Markdown files
  if (
    file.type.includes('text') ||
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.json') ||
    lowerName.endsWith('.md') ||
    lowerName.endsWith('.csv')
  ) {
    const rawText = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string || '');
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });

    const text = cleanText(rawText);
    if (!isReadableText(text)) {
      throw new Error('The uploaded text file does not appear to contain readable text content.');
    }

    return {
      text,
      fileType: lowerName.endsWith('.json') ? 'json' : 'text',
      fileName,
      fileSize,
      numPages: 1,
    };
  }

  // 3. DOCX & Word Files
  if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc') || file.type.includes('wordprocessingml') || file.type.includes('msword')) {
    // Attempt client-side DOCX parsing using Mammoth first
    if (lowerName.endsWith('.docx') || file.type.includes('wordprocessingml')) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = typeof Buffer !== 'undefined' ? Buffer.from(arrayBuffer) : (arrayBuffer as any);
        const result = await mammoth.extractRawText({ arrayBuffer, buffer } as any);
        const text = cleanText(result.value || '');
        const photoCandidates = await extractPhotosFromDocxArrayBuffer(arrayBuffer).catch(() => []);
        const photoData = buildPhotoDataFromCandidates(photoCandidates);

        if (text.length > 20 && isReadableText(text)) {
          return {
            text,
            fileType: 'docx',
            fileName,
            fileSize,
            numPages: 1,
            extractedPhotoUrl: photoData.url || undefined,
            photoData,
            photoCandidates,
          };
        }
      } catch (docxErr) {
        console.warn('Client DOCX parsing failed, attempting backend fallback:', docxErr);
      }
    }

    // Backend fallback for DOC / DOCX
    try {
      const backendRes = await uploadApi.parseResume(file);
      if (backendRes.success && backendRes.text) {
        const text = cleanText(backendRes.text);
        if (text.length > 20 && isReadableText(text)) {
          return {
            text,
            fileType: lowerName.endsWith('.doc') ? 'doc' : 'docx',
            fileName,
            fileSize,
            numPages: backendRes.numPages || 1,
          };
        }
      }
    } catch (backendErr) {
      console.warn('Backend Word parse fallback error:', backendErr);
    }

    throw new Error('Could not extract readable text from this Word document. Please save your resume as a modern .docx or .pdf file and try again.');
  }

  // 4. PDF Files
  if (lowerName.endsWith('.pdf') || file.type.includes('pdf')) {
    // Attempt client-side PDF.js parsing first
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { text: rawText, numPages, photoCandidates } = await extractPdfData(arrayBuffer);
      const text = cleanText(rawText);
      const photoData = buildPhotoDataFromCandidates(photoCandidates);

      if (text.length > 30 && isReadableText(text)) {
        return {
          text,
          fileType: 'pdf',
          fileName,
          fileSize,
          numPages,
          extractedPhotoUrl: photoData.url || undefined,
          photoData,
          photoCandidates,
        };
      }
    } catch (clientPdfErr) {
      console.warn('Client-side PDF.js parsing error, trying backend server fallback:', clientPdfErr);
    }

    // Attempt backend server parse API fallback
    try {
      const backendRes = await uploadApi.parseResume(file);
      if (backendRes.success && backendRes.text) {
        const text = cleanText(backendRes.text);
        if (text.length > 30 && isReadableText(text)) {
          return {
            text,
            fileType: 'pdf',
            fileName,
            fileSize,
            numPages: backendRes.numPages || 1,
          };
        }
      }
    } catch (backendErr) {
      console.warn('Backend PDF parse fallback error:', backendErr);
    }

    // Final fallback: surface a clear user error instead of returning garbled binary data
    throw new Error('Could not extract readable text from this PDF. The PDF might be scanned (image-only) or have encrypted/embedded fonts. Please try a .docx or .txt version of your resume instead.');
  }

  // Generic fallback with validation
  const rawText = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string || '');
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });

  const text = cleanText(rawText);
  if (!isReadableText(text)) {
    throw new Error('Could not extract readable text from this file format. Please upload a standard PDF, DOCX, or TXT resume.');
  }

  return {
    text,
    fileType: 'unknown',
    fileName,
    fileSize,
    numPages: 1,
  };
}
