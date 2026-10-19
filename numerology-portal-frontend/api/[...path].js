import http from 'http';
import url from 'url';

export default function handler(req, res) {
  // Bật CORS cho phép frontend gọi an toàn
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Lấy đường dẫn API phía sau /api/
  let path = '';
  if (req.query && req.query.path) {
    path = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
  } else {
    const parsed = url.parse(req.url || '', true);
    path = (parsed.pathname || '').replace(/^\/api\/?/, '');
  }

  // Tái tạo Query Parameters (loại trừ param 'path' do Vercel catch-all tự sinh)
  let search = '';
  if (req.query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      if (key !== 'path') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else if (value !== undefined) {
          params.append(key, value);
        }
      }
    }
    const qs = params.toString();
    if (qs) {
      search = '?' + qs;
    }
  } else {
    const parsed = url.parse(req.url || '', true);
    search = parsed.search || '';
  }

  const targetPath = `/api/${path}${search}`;

  // Forward các headers quan trọng, bắt buộc gán Host của Somee để IIS định tuyến đúng website
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    const lower = key.toLowerCase();
    if (['host', 'connection', 'content-length'].includes(lower)) continue;
    headers[key] = value;
  }
  headers['host'] = 'www.thansohoc.somee.com';

  let bodyBuffer = null;
  if (req.body) {
    const bodyStr = typeof req.body === 'object' ? JSON.stringify(req.body) : String(req.body);
    bodyBuffer = Buffer.from(bodyStr, 'utf-8');
    headers['content-length'] = bodyBuffer.length;
    if (!headers['content-type']) {
      headers['content-type'] = 'application/json';
    }
  }

  const proxyReq = http.request({
    hostname: 'www.thansohoc.somee.com',
    port: 80,
    path: targetPath,
    method: req.method,
    headers: headers,
  }, (proxyRes) => {
    res.statusCode = proxyRes.statusCode || 200;
    for (const [key, value] of Object.entries(proxyRes.headers)) {
      if (value !== undefined && key.toLowerCase() !== 'connection') {
        res.setHeader(key, value);
      }
    }
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Vercel proxy request error:', err);
    if (!res.headersSent) {
      res.statusCode = 502;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        message: 'Không thể kết nối đến máy chủ backend: ' + err.message
      }));
    }
  });

  if (bodyBuffer) {
    proxyReq.write(bodyBuffer);
    proxyReq.end();
  } else {
    req.pipe(proxyReq);
  }
}
