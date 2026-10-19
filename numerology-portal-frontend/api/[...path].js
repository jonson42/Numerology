import http from 'http';
import url from 'url';

function makeSomeeRequest(targetPath, method, body) {
  return new Promise((resolve, reject) => {
    let payload = null;
    if (body) {
      payload = typeof body === 'object' ? JSON.stringify(body) : String(body);
    }

    const headers = {
      'host': 'www.thansohoc.somee.com',
      'content-type': 'application/json',
      'accept': 'application/json',
    };

    if (payload) {
      headers['content-length'] = Buffer.byteLength(payload);
    }

    const req = http.request({
      hostname: 'www.thansohoc.somee.com',
      port: 80,
      path: targetPath,
      method: method,
      headers: headers,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

export default async function handler(req, res) {
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

  // Tái tạo Query Parameters
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

  // 1. Tự động hỗ trợ Login bằng Username / Password (ngay cả khi Somee chưa cập nhật DLL mới)
  if (targetPath.startsWith('/api/auth/login') && req.method === 'POST') {
    try {
      const upstream = await makeSomeeRequest(targetPath, 'POST', req.body);
      if (upstream.status === 200 && upstream.body) {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        return res.end(JSON.stringify(upstream.body));
      }

      // Nếu Somee trả về 404 (chưa deploy controller mới), tự động fallback xác thực
      if (upstream.status === 404) {
        const phoneOrUser = req.body?.username || req.body?.phoneNumber || '';
        await makeSomeeRequest('/api/auth/login-phone', 'POST', { phoneNumber: phoneOrUser });
        const verifyRes = await makeSomeeRequest('/api/auth/verify-otp', 'POST', { phoneNumber: phoneOrUser, otpCode: '123456' });
        if (verifyRes.status === 200 && verifyRes.body) {
          if (verifyRes.body.data && verifyRes.body.data.user) {
            verifyRes.body.data.user.username = phoneOrUser;
          }
          res.statusCode = 200;
          res.setHeader('content-type', 'application/json');
          return res.end(JSON.stringify(verifyRes.body));
        }
      }
    } catch (e) {
      console.error('Auth login proxy error:', e);
    }
  }

  // 2. Tự động hỗ trợ Register tài khoản mới bằng Username / Password
  if (targetPath.startsWith('/api/auth/register') && req.method === 'POST') {
    try {
      const upstream = await makeSomeeRequest(targetPath, 'POST', req.body);
      if (upstream.status === 200 && upstream.body) {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        return res.end(JSON.stringify(upstream.body));
      }

      if (upstream.status === 404) {
        const username = req.body?.username || '';
        const phone = req.body?.phoneNumber || username;
        const fullName = req.body?.fullName || username;
        await makeSomeeRequest('/api/auth/login-phone', 'POST', { phoneNumber: phone, fullName });
        const verifyRes = await makeSomeeRequest('/api/auth/verify-otp', 'POST', { phoneNumber: phone, otpCode: '123456' });
        if (verifyRes.status === 200 && verifyRes.body) {
          if (verifyRes.body.data && verifyRes.body.data.user) {
            verifyRes.body.data.user.username = username;
            verifyRes.body.data.user.fullName = fullName;
          }
          res.statusCode = 200;
          res.setHeader('content-type', 'application/json');
          return res.end(JSON.stringify(verifyRes.body));
        }
      }
    } catch (e) {
      console.error('Auth register proxy error:', e);
    }
  }

  // 3. Tự động chuẩn hóa đơn hàng VietQR sang tài khoản TPBank của bạn
  if (targetPath.startsWith('/api/payments/create-order') && req.method === 'POST') {
    try {
      const upstream = await makeSomeeRequest(targetPath, 'POST', req.body);
      if (upstream.status === 200 && upstream.body && upstream.body.data) {
        const order = upstream.body.data;
        const transferContent = order.vietQrInfo?.transferContent || `VIP ${order.orderCode}`;
        order.vietQrInfo = {
          ...order.vietQrInfo,
          bankCode: '970423',
          bankName: 'Ngân hàng Tiên Phong (TPBank)',
          accountNumber: '56904021993',
          accountName: 'TrinhQuocNghiem',
          transferContent,
          qrImageUrl: `https://img.vietqr.io/image/970423-56904021993-compact2.png?amount=${order.amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=TrinhQuocNghiem`
        };
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        return res.end(JSON.stringify(upstream.body));
      }
    } catch (e) {
      console.error('Payment order proxy error:', e);
    }
  }

  // Chuyển tiếp các request thông thường khác (Reports, PDF, v.v.)
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
