import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '2m', target: 10 },
    { duration: '30s', target: 30 },
    { duration: '1m', target: 30 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.15'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test santri user (harus sudah terdaftar di database)
const TEST_SANTRI = {
  email: 'santri.test@example.com',
  password: 'testpass123',
};

export function setup() {
  // Login sekali di setup untuk mendapatkan session
  const signInPayload = JSON.stringify({
    email: TEST_SANTRI.email,
    password: TEST_SANTRI.password,
  });

  const signInRes = http.post(`${BASE_URL}/api/auth/sign-in/email`, signInPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return {
    cookies: signInRes.cookies,
  };
}

export default function (data) {
  const cookies = data.cookies;

  // === TEST 1: Check Payment Status (with auth) ===
  const checkStatusRes = http.get(`${BASE_URL}/api/payment/check-status?orderId=TEST-${Date.now()}`, {
    cookies: cookies,
  });

  check(checkStatusRes, {
    'check-status responded': (r) => r.status === 200 || r.status === 404,
    'check-status not unauthorized': (r) => r.status !== 401,
  });

  sleep(1);

  // === TEST 2: Create Payment (POST) ===
  const createPayload = JSON.stringify({
    tagihanId: 'test-tagihan-id',
  });

  const createRes = http.post(`${BASE_URL}/api/payment/create`, createPayload, {
    headers: { 'Content-Type': 'application/json' },
    cookies: cookies,
  });

  check(createRes, {
    'create payment not 500 error': (r) => r.status !== 500,
    'create payment response OK': (r) => {
      // Expected: 201 (success), 400 (invalid), 404 (not found), 401 (unauth)
      return [201, 400, 404, 401].includes(r.status);
    },
  });

  sleep(2);

  // === TEST 3: Topup Endpoint ===
  const topupPayload = JSON.stringify({
    amount: 50000,
  });

  const topupRes = http.post(`${BASE_URL}/api/payment/topup`, topupPayload, {
    headers: { 'Content-Type': 'application/json' },
    cookies: cookies,
  });

  check(topupRes, {
    'topup endpoint responded': (r) => r.status !== 500,
  });

  sleep(1);
}

export function teardown(data) {
  // Sign out after test
  http.post(`${BASE_URL}/api/auth/sign-out`);
}
