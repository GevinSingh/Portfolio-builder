import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mammoth from 'mammoth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Directories
const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? '/tmp/data' : path.join(__dirname, 'data');
const UPLOADS_DIR = IS_VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');
const RESUMES_DIR = path.join(UPLOADS_DIR, 'resumes');
const AVATARS_DIR = path.join(UPLOADS_DIR, 'avatars');

[DATA_DIR, UPLOADS_DIR, RESUMES_DIR, AVATARS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// JSON Store File Paths
const PORTFOLIOS_FILE = path.join(DATA_DIR, 'portfolios.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Helpers for reading/writing JSON stores
function readJson(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return defaultValue;
  }
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
    return false;
  }
}

// Middleware: CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware: Body Parser with high limits for base64 file payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
app.use('/uploads', express.static(UPLOADS_DIR));

// -------------------------------------------------------------
// 1. Health Check
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  const portfolios = readJson(PORTFOLIOS_FILE, []);
  const messages = readJson(MESSAGES_FILE, []);
  res.json({
    status: 'online',
    serverTime: new Date().toISOString(),
    portfoliosCount: portfolios.length,
    messagesCount: messages.length,
    nodeVersion: process.version,
    port: PORT,
  });
});

// -------------------------------------------------------------
// 2. Authentication API (Built-in Local Auth)
// -------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readJson(USERS_FILE, []);
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'A user with this email already exists' });
  }

  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    email: email.trim(),
    name: name?.trim() || email.split('@')[0],
    password: password, // In production, hash with bcrypt
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeJson(USERS_FILE, users);

  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ success: true, user: safeUser, token: 'token_' + safeUser.id });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readJson(USERS_FILE, []);
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    // If the email already exists, they entered the wrong password
    const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // If demo account credentials, create user on the fly
    if (email.includes('@') && password.length >= 6) {
      const demoUser = {
        id: 'user_' + Date.now(),
        email: email.trim(),
        name: email.split('@')[0],
        password: password,
        createdAt: new Date().toISOString(),
      };
      users.push(demoUser);
      writeJson(USERS_FILE, users);
      const { password: _, ...safeDemo } = demoUser;
      return res.json({ success: true, user: safeDemo, token: 'token_' + safeDemo.id });
    }
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token: 'token_' + safeUser.id });
});

app.get('/api/auth/users', (req, res) => {
  const users = readJson(USERS_FILE, []);
  const safeUsers = users.map(({ password, ...rest }) => rest);
  res.json({ users: safeUsers });
});

// -------------------------------------------------------------
// 3. Portfolios API
// -------------------------------------------------------------
app.get('/api/portfolios', (req, res) => {
  const portfolios = readJson(PORTFOLIOS_FILE, []);
  const summaries = portfolios.map((p) => ({
    slug: p.slug,
    title: p.title,
    userId: p.userId,
    updatedAt: p.updatedAt,
    viewsCount: p.viewsCount || 0,
    theme: p.data?.theme,
    profile: {
      fullName: p.data?.profile?.fullName,
      title: p.data?.profile?.title,
      avatarUrl: p.data?.profile?.avatarUrl,
    },
  }));
  res.json({ portfolios: summaries });
});

app.get('/api/portfolios/:slug', (req, res) => {
  const { slug } = req.params;
  const portfolios = readJson(PORTFOLIOS_FILE, []);
  const record = portfolios.find((p) => p.slug === slug);
  if (!record) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }
  // Increment view count
  record.viewsCount = (record.viewsCount || 0) + 1;
  writeJson(PORTFOLIOS_FILE, portfolios);

  res.json({ success: true, data: record.data, viewsCount: record.viewsCount });
});

app.get('/api/portfolios/user/:userId', (req, res) => {
  const { userId } = req.params;
  const portfolios = readJson(PORTFOLIOS_FILE, []);
  const userPortfolios = portfolios.filter((p) => p.userId === userId);
  if (userPortfolios.length === 0) {
    return res.status(404).json({ error: 'No portfolio found for this user' });
  }
  // Return most recently updated
  userPortfolios.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json({ success: true, data: userPortfolios[0].data });
});

app.post('/api/portfolios', (req, res) => {
  const { slug, title, data, userId } = req.body;
  if (!slug || !data) {
    return res.status(400).json({ error: 'Slug and portfolio data are required' });
  }

  const portfolios = readJson(PORTFOLIOS_FILE, []);
  const index = portfolios.findIndex((p) => p.slug === slug);

  const payload = {
    id: index >= 0 ? portfolios[index].id : 'port_' + Date.now(),
    slug: slug.trim(),
    title: title || `${data.profile?.fullName || 'User'}'s Portfolio`,
    userId: userId || (index >= 0 ? portfolios[index].userId : 'guest'),
    data: data,
    viewsCount: index >= 0 ? (portfolios[index].viewsCount || 0) : 0,
    updatedAt: new Date().toISOString(),
    createdAt: index >= 0 ? portfolios[index].createdAt : new Date().toISOString(),
  };

  if (index >= 0) {
    portfolios[index] = payload;
  } else {
    portfolios.push(payload);
  }

  writeJson(PORTFOLIOS_FILE, portfolios);
  res.json({ success: true, portfolio: payload });
});

app.delete('/api/portfolios/:slug', (req, res) => {
  const { slug } = req.params;
  let portfolios = readJson(PORTFOLIOS_FILE, []);
  const beforeLen = portfolios.length;
  portfolios = portfolios.filter((p) => p.slug !== slug);
  if (portfolios.length === beforeLen) {
    return res.status(404).json({ error: 'Portfolio not found' });
  }
  writeJson(PORTFOLIOS_FILE, portfolios);
  res.json({ success: true, message: `Portfolio ${slug} deleted` });
});

// -------------------------------------------------------------
// 4. Contact Messages API (Recruiter Inquiries)
// -------------------------------------------------------------
app.post('/api/messages', (req, res) => {
  const { portfolioSlug, name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const messages = readJson(MESSAGES_FILE, []);
  const newMsg = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    portfolioSlug: portfolioSlug || 'default',
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  messages.unshift(newMsg);
  writeJson(MESSAGES_FILE, messages);

  res.status(201).json({ success: true, message: newMsg });
});

app.get('/api/messages', (req, res) => {
  const messages = readJson(MESSAGES_FILE, []);
  res.json({ success: true, messages });
});

app.get('/api/messages/:portfolioSlug', (req, res) => {
  const { portfolioSlug } = req.params;
  const messages = readJson(MESSAGES_FILE, []);
  const filtered = messages.filter((m) => m.portfolioSlug === portfolioSlug || m.portfolioSlug === 'default');
  res.json({ success: true, messages: filtered });
});

app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  let messages = readJson(MESSAGES_FILE, []);
  messages = messages.filter((m) => m.id !== id);
  writeJson(MESSAGES_FILE, messages);
  res.json({ success: true });
});

// -------------------------------------------------------------
// 5. File Uploads (Resumes & Avatars)
// -------------------------------------------------------------
app.post('/api/upload/resume', (req, res) => {
  try {
    const { fileName, base64Data, userId } = req.body;
    if (!fileName || !base64Data) {
      return res.status(400).json({ error: 'fileName and base64Data are required' });
    }

    // Strip base64 headers if present (e.g. data:application/pdf;base64,...)
    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(RESUMES_DIR, safeName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/resumes/${safeName}`;
    res.json({ success: true, publicUrl, fileName: safeName });
  } catch (err) {
    console.error('Upload resume error:', err);
    res.status(500).json({ error: 'Failed to save resume file' });
  }
});

app.post('/api/upload/avatar', (req, res) => {
  try {
    const { fileName, base64Data } = req.body;
    if (!fileName || !base64Data) {
      return res.status(400).json({ error: 'fileName and base64Data are required' });
    }

    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(AVATARS_DIR, safeName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/avatars/${safeName}`;
    res.json({ success: true, publicUrl });
  } catch (err) {
    console.error('Upload avatar error:', err);
    res.status(500).json({ error: 'Failed to save avatar image' });
  }
});

// -------------------------------------------------------------
// 5b. Document Text Extraction API (PDF, DOCX, TXT)
// -------------------------------------------------------------
app.post('/api/parse/resume', async (req, res) => {
  try {
    const { fileName, base64Data } = req.body;
    if (!fileName || !base64Data) {
      return res.status(400).json({ error: 'fileName and base64Data are required' });
    }

    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const lowerName = fileName.toLowerCase();

    let extractedText = '';
    let numPages = 1;
    let extractedPhotoUrl = '';

// Helper to convert raw RGB/RGBA image data to standard BMP Data URL
function createBmpDataUrl(width, height, pixelData, kind) {
  try {
    const isRgba = kind === 3 || pixelData.length === width * height * 4;
    const bpp = 24;
    const rowSize = Math.floor((bpp * width + 31) / 32) * 4;
    const pixelArraySize = rowSize * height;
    const fileSize = 54 + pixelArraySize;
    const buf = Buffer.alloc(fileSize);

    buf.write('BM', 0);
    buf.writeUInt32LE(fileSize, 2);
    buf.writeUInt32LE(54, 10);
    buf.writeUInt32LE(40, 14);
    buf.writeInt32LE(width, 18);
    buf.writeInt32LE(-height, 22); // top-down
    buf.writeUInt16LE(1, 26);
    buf.writeUInt16LE(bpp, 28);
    buf.writeUInt32LE(0, 30);
    buf.writeUInt32LE(pixelArraySize, 34);

    const step = isRgba ? 4 : 3;
    for (let y = 0; y < height; y++) {
      const srcRow = y * width * step;
      const dstRow = 54 + y * rowSize;
      for (let x = 0; x < width; x++) {
        const srcIdx = srcRow + x * step;
        const dstIdx = dstRow + x * 3;
        buf[dstIdx] = pixelData[srcIdx + 2];     // B
        buf[dstIdx + 1] = pixelData[srcIdx + 1]; // G
        buf[dstIdx + 2] = pixelData[srcIdx];     // R
      }
    }

    return 'data:image/bmp;base64,' + buf.toString('base64');
  } catch (err) {
    console.warn('BMP conversion warning:', err.message);
    return '';
  }
}

    if (lowerName.endsWith('.pdf')) {
      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer), disableFontFace: true }).promise;
        numPages = doc.numPages;
        
        let fullText = '';
        const pagesToScan = Math.min(2, doc.numPages);
        
        for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
          const page = await doc.getPage(pageNum);
          
          // Layout-aware text extraction
          const tc = await page.getTextContent();
          let pageText = '';
          let lastY = null;
          for (const item of tc.items) {
            if (item && item.str !== undefined) {
              const curY = item.transform ? item.transform[5] : null;
              if (lastY !== null && curY !== null && Math.abs(curY - lastY) > 4) {
                pageText += '\n';
              } else if (pageText && !pageText.endsWith('\n') && !pageText.endsWith(' ') && item.str) {
                pageText += ' ';
              }
              pageText += item.str;
              if (curY !== null) lastY = curY;
            }
          }
          fullText += pageText + '\n\n';

          // Photo extraction (first 2 pages)
          if (pageNum <= pagesToScan && !extractedPhotoUrl) {
            try {
              const opList = await page.getOperatorList();
              for (let opIdx = 0; opIdx < opList.fnArray.length; opIdx++) {
                if (opList.fnArray[opIdx] === pdfjs.OPS.paintImageXObject) {
                  const name = opList.argsArray[opIdx][0];
                  let imgObj = null;
                  try { imgObj = page.objs.get(name); } catch {}
                  if (!imgObj) {
                    try { imgObj = page.commonObjs.get(name); } catch {}
                  }

                  if (imgObj && imgObj.width >= 50 && imgObj.height >= 50 && imgObj.data) {
                    const bmpUrl = createBmpDataUrl(imgObj.width, imgObj.height, imgObj.data, imgObj.kind);
                    if (bmpUrl) {
                      extractedPhotoUrl = bmpUrl;
                      break;
                    }
                  }
                }
              }
            } catch (imgErr) {
              console.warn('Backend image scan notice:', imgErr.message);
            }
          }
        }

        extractedText = fullText.trim();
      } catch (pdfJsErr) {
        console.warn('Backend PDF.js parser failed, falling back to basic scanner:', pdfJsErr.message);
        try {
          const rawStr = buffer.toString('latin1');
          const textChunks = rawStr.match(/[\x20-\x7E\s]{4,}/g) || [];
          extractedText = textChunks.filter(c => !/^[\/\\]/.test(c.trim())).join(' ');
        } catch (pdfErr) {
          console.error('PDF parsing error in backend:', pdfErr.message);
        }
      }
    } else if (lowerName.endsWith('.docx')) {
      try {
        const docxData = await mammoth.extractRawText({ buffer });
        extractedText = docxData.value || '';
        
        // Extract embedded profile photo from docx
        await mammoth.convertToHtml({ buffer }, {
          convertImage: mammoth.images.imgElement((img) => {
            return img.read('base64').then(b64 => {
              if (b64 && b64.length > 2000 && !extractedPhotoUrl) {
                extractedPhotoUrl = `data:${img.contentType || 'image/jpeg'};base64,${b64}`;
              }
              return { src: '' };
            });
          })
        }).catch(() => {});
      } catch (docxErr) {
        console.warn('Docx parsing error:', docxErr.message);
      }
    } else if (lowerName.endsWith('.doc')) {
      // For legacy Word binary .doc files: extract readable ASCII and UTF-16LE text runs without binary headers
      try {
        const docxData = await mammoth.extractRawText({ buffer }).catch(() => null);
        if (docxData && docxData.value) {
          extractedText = docxData.value;
        } else {
          // Scan for utf-16le and ascii string runs
          const utf16Str = buffer.toString('utf16le');
          const utf16Matches = utf16Str.match(/[\x20-\x7E\s]{4,}/g) || [];
          const latinStr = buffer.toString('latin1');
          const latinMatches = latinStr.match(/[\x20-\x7E\s]{4,}/g) || [];
          const combined = [...utf16Matches, ...latinMatches].filter(chunk => {
            const trimmed = chunk.trim();
            if (trimmed.length < 4) return false;
            if (/MSWordDoc|WordDocument|themeManager|\[Content_Types\]|_rels|clrMap|CJOJ/i.test(trimmed)) return false;
            return true;
          });
          extractedText = combined.join('\n');
        }
      } catch (docErr) {
        console.warn('Doc parsing error:', docErr.message);
      }
    } else {
      extractedText = buffer.toString('utf-8');
    }

    // Clean extracted text from control chars and binary mojibake
    const cleaned = (extractedText || '')
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
      .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      .replace(/\uFFFD/g, '')
      .trim();

    if (!cleaned || cleaned.length < 15) {
      return res.status(400).json({ error: 'Could not extract readable text from document. Please use a modern .docx, .pdf, or .txt file.' });
    }

    res.json({
      success: true,
      text: cleaned,
      numPages,
      fileName,
      extractedPhotoUrl: extractedPhotoUrl || undefined,
      photoData: extractedPhotoUrl ? {
        source: 'resume',
        url: extractedPhotoUrl,
        selected: true,
        candidates: [{ id: 'docx-img-1', url: extractedPhotoUrl, score: 95, source: 'resume' }]
      } : undefined
    });
  } catch (err) {
    console.error('Resume parse error:', err);
    res.status(500).json({ error: 'Failed to extract text from document: ' + err.message });
  }
});

// -------------------------------------------------------------
// 6. Production Static Client Serving
// -------------------------------------------------------------
const DIST_DIR = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
  });
}

// Start Server
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Tech Humans Unified Full Stack Server is LIVE!`);
    console.log(`🌐 Web App & API URL: http://localhost:${PORT}`);
    console.log(`📡 Backend Endpoints: http://localhost:${PORT}/api/*`);
    console.log(`📂 Data Storage: ${DATA_DIR}`);
    console.log(`📁 Uploads: ${UPLOADS_DIR}`);
    console.log(`==================================================\n`);
  });
}

export default app;
