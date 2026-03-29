import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 30 },
    { duration: '1m', target: 30 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.10'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test bendahara/admin user
const TEST_USER = {
  email: 'admin.test@example.com',
  password: 'testpass123',
};

export function setup() {
  const signInPayload = JSON.stringify({
    email: TEST_USER.email,
    password: TEST_USER.password,
  });

  const signInRes = http.post(`${BASE_URL}/api/auth/sign-in/email`, signInPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return {
    cookies: signInRes.cookies,
    loginSuccess: signInRes.status === 200,
  };
}

export default function (data) {
  if (!data.loginSuccess) {
    console.log('Login failed, skipping tests');
    return;
  }

  const cookies = data.cookies;

  // === TEST 1: Get all transaksi ===
  const listRes = http.get(`${BASE_URL}/api/transaksi?page=1&limit=10`, {
    cookies: cookies,
  });

  check(listRes, {
    'transaksi list 200': (r) => r.status === 200,
    'transaksi has data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data !== undefined || Array.isArray(body);
      } catch {
        return false;
      }
    },
  });

  sleep(0.5);

  // === TEST 2: Filter by jenis ===
  const filterJenisRes = http.get(`${BASE_URL}/api/transaksi?jenis=SPP&page=1&limit=10`, {
    cookies: cookies,
  });

  check(filterJenisRes, {
    'filter jenis OK': (r) => r.status === 200,
  });

  sleep(0.5);

  // === TEST 3: Filter by status ===
  const filterStatusRes = http.get(`${BASE_URL}/api/transaksi?status=PENDING&page=1&limit=10`, {
    cookies: cookies,
  });

  check(filterStatusRes, {
    'filter status OK': (r) => r.status === 200,
  });

  sleep(0.5);

  // === TEST 4: Search transaksi ===
  const searchRes = http.get(`${BASE_URL}/api/transaksi?search=test&page=1&limit=10`, {
    cookies: cookies,
  });

  check(searchRes, {
    'search OK': (r) => r.status === 200,
  });

  sleep(1);

  // === TEST 5: Filter by tahun & bulan ===
  const dateFilterRes = http.get(`${BASE_URL}/api/transaksi?tahun=2024&bulan=01&page=1&limit=10`, {
    cookies: cookies,
  });

  check(dateFilterRes, {
    'date filter OK': (r) => r.status === 200,
  });

  sleep(2);
}

export function teardown(data) {
  http.post(`${BASE_URL}/api/auth/sign-out`);
}
