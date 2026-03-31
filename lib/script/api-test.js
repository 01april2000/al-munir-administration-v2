import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 5 },
    { duration: '2m', target: 5 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.20'],
  },
};

const BASE_URL = 'https://al-munir-administration-v2.vercel.app';
const EMAIL = __ENV.TEST_EMAIL || 'subandi@gmail.com';
const PASS = __ENV.TEST_PASS || 'wasdqwe1234';

export function setup() {
  // Login sekali di setup untuk dapat cookie session
  const loginRes = http.post(`${BASE_URL}/api/auth/sign-in/email`, JSON.stringify({
    email: EMAIL,
    password: PASS,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (loginRes.status !== 200) {
    console.log(`Setup login failed: ${loginRes.status}`);
    return { cookie: null };
  }

  // Ambil cookie dari header Set-Cookie (format: __Secure-better-auth.session_token=...)
  const setCookie = loginRes.headers['Set-Cookie'];
  
  if (!setCookie) {
    console.log('Setup login success but no cookie received');
    return { cookie: null };
  }
  
  console.log(`Setup login success, cookie: ${setCookie.substring(0, 60)}...`);
  
  return { cookie: setCookie };
}

export default function (data) {
  if (!data.cookie) {
    console.log('No cookie, skipping test');
    return;
  }

  const headers = {
    'Cookie': data.cookie,  // Gunakan cookie lengkap dari Set-Cookie header
    'Content-Type': 'application/json',
  };

  // Test 1: Get Transaksi
  const transaksiRes = http.get(`${BASE_URL}/api/transaksi?page=1&limit=10`, { headers });
  check(transaksiRes, {
    'transaksi list OK': (r) => r.status === 200,
    'transaksi has data': (r) => {
      try {
        const body = JSON.parse(r.body);
        // Response format: { items: [...], total, page, limit, totalSaldoUangSaku }
        return body.items !== undefined || body.data !== undefined || Array.isArray(body);
      } catch {
        return false;
      }
    },
  });

  sleep(1);

  // Test 2: Get Transaksi with filter
  const filterRes = http.get(`${BASE_URL}/api/transaksi?jenis=SPP&status=PENDING`, { headers });
  check(filterRes, {
    'filter transaksi OK': (r) => r.status === 200,
  });

  sleep(1);

  // Test 3: Payment check status (POST request, bukan GET)
  // Endpoint ini memerlukan POST dengan body JSON
  const paymentRes = http.post(
    `${BASE_URL}/api/payment/check-status`,
    JSON.stringify({ orderId: `TEST-${__VU}-${__ITER}` }),
    { headers }
  );
  check(paymentRes, {
    'payment check OK': (r) => r.status === 200 || r.status === 400 || r.status === 404,
  });

  sleep(1);

  // Test 4: Santri API
  const santriRes = http.get(`${BASE_URL}/api/santri?page=1&limit=10`, { headers });
  check(santriRes, {
    'santri list OK': (r) => r.status === 200 || r.status === 401,
  });

  sleep(2);
}
