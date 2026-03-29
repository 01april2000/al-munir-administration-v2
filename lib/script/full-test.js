import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Kurangi target dulu untuk testing awal di Vercel
    { duration: '3m', target: 50 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.10'],
  },
};

const BASE_URL = 'https://domain-vercel-anda.com'; // Pastikan diganti

export default function () {
  const url = 'https://your-app.vercel.app/api/auth/login/email';
  const payload = JSON.stringify({
    email: 'test-user@example.com',
    password: 'password123',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  // 1. Melakukan Login
  const loginRes = http.post(url, payload, params);
  
  // 2. Mengambil Cookie dari Responses
  // Better Auth biasanya otomatis mengirim Set-Cookie header
  const jar = http.cookieJar();
  const cookies = jar.getCookies(url);

  check(loginRes, {
    'logged in successfully': (r) => r.status === 200,
    'has session cookie': () => cookies.length > 0,
  });

  // 3. Request Selanjutnya Otomatis Membawa Cookie (jika menggunakan http.get/post biasa dalam iterasi yang sama)
  const transaksiRes = http.get('https://your-app.vercel.app/api/transaksi', params);
  
  check(transaksiRes, {
    'access granted to transaksi': (r) => r.status === 200,
  });

  sleep(1);


  // === 3. PAYMENT TESTS (DENGAN TOKEN) ===
  // Menggunakan tagihan dummy yang benar-benar ada di DB
  const createPayload = JSON.stringify({
    tagihanId: 'ID_TAGIHAN_DUMMY_DI_DB', 
  });

  const createPaymentRes = http.post(`${BASE_URL}/api/payment/create`, createPayload, authHeaders);
  check(createPaymentRes, { 'create payment OK (200/201)': (r) => r.status === 200 || r.status === 201 });
  
  sleep(2);
}