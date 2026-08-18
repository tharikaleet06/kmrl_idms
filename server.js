import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Forward all /api request traffic to Spring Cloud Gateway (:8080)
app.use('/api', async (req, res) => {
  const targetUrl = `http://localhost:8080/api${req.url}`;
  try {
    const requestHeaders = {
      'Content-Type': req.headers['content-type'] || 'application/json',
      'Accept': req.headers['accept'] || 'application/json'
    };
    Object.keys(req.headers).forEach((key) => {
      if (key.startsWith('x-user-') || key.startsWith('x-')) {
        requestHeaders[key] = req.headers[key];
      }
    });

    const fetchOptions = {
      method: req.method,
      headers: requestHeaders
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const gatewayRes = await fetch(targetUrl, fetchOptions);
    res.status(gatewayRes.status);
    gatewayRes.headers.forEach((val, key) => {
      if (key.toLowerCase() !== 'content-length' && key.toLowerCase() !== 'content-encoding') {
        res.setHeader(key, val);
      }
    });
    const data = await gatewayRes.arrayBuffer();
    res.send(Buffer.from(data));
  } catch (err) {
    res.status(503).json({
      success: false,
      error: 'Java Spring Cloud Gateway (http://localhost:8080) unavailable. Please start the Java microservices cluster.',
      details: err.message
    });
  }
});

// Serve Vite dev middleware or static production build
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`KMRL Web Server running on http://0.0.0.0:${PORT} (Proxying /api -> Spring Cloud Gateway on :8080)`);
});
