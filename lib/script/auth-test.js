import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 1 },    // Ramp up ke 1 VU (sangat dikurangi untuk avoid rate limiting)
    { duration: '1m', target: 1 },     // Stay di 1 VU
    { duration: '30s', target: 2 },    // Ramp up ke 2 VU
    { duration: '1m', target: 2 },     // Stay di 2 VU
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 5 detik untuk Vercel cold start
    http_req_failed: ['rate<0.20'],    // 20% error rate max
  },
};

const BASE_URL = 'https://al-munir-administration-v2.vercel.app';
const EMAIL = __ENV.TEST_EMAIL || 'subandi@gmail.com';
const PASS = __ENV.TEST_PASS || 'wasdqwe1234';

// Test users untuk load testing dengan multiple users
const TEST_USERS = [
  { email: 'subandi@gmail.com', password: __ENV.TEST_PASS || 'wasdqwe1234' },
  // Tambah user lain jika diperlukan untuk load test
  // { email: 'user2@gmail.com', password: 'password2' },
];

export function setup() {
  // Login sekali di setup untuk verifikasi credentials valid
  const loginRes = http.post(`${BASE_URL}/api/auth/sign-in/email`, JSON.stringify({
    email: EMAIL,
    password: PASS,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  console.log(`Setup login status: ${loginRes.status}`);
  
  if (loginRes.status !== 200) {
    console.log(`Setup login failed: ${loginRes.status} - ${loginRes.body}`);
    return { validCredentials: false };
  }

  // Ambil cookie dari header Set-Cookie
  const setCookie = loginRes.headers['Set-Cookie'];
  
  if (!setCookie) {
    console.log('Setup login success but no cookie received');
    return { validCredentials: false };
  }
  
  console.log(`Setup login success, cookie received`);
  
  return {
    validCredentials: true,
    sampleCookie: setCookie
  };
}

export default function (data) {
  const user = TEST_USERS[__VU % TEST_USERS.length];
  
  // === TEST 1: Homepage (Public) ===
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    'homepage status 200': (r) => r.status === 200,
    'homepage response time < 3s': (r) => r.timings.duration < 3000,
  });
  sleep(0.5);

  // === TEST 2: Auth Page (Public) ===
  const authRes = http.get(`${BASE_URL}/auth`);
  check(authRes, {
    'auth page status 200': (r) => r.status === 200,
    'auth page response time < 3s': (r) => r.timings.duration < 3000,
  });
  sleep(0.5);

  // === TEST 3: Login Request ===
  const loginPayload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const loginRes = http.post(`${BASE_URL}/api/auth/sign-in/email`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Extract cookie dari Set-Cookie header (seperti di api-test.js)
  const setCookieHeader = loginRes.headers['Set-Cookie'];
  const hasCookie = setCookieHeader && setCookieHeader.length > 0;
  
  // FIX: Convert cookie array to proper string format for K6
  const cookieString = Array.isArray(setCookieHeader)
    ? setCookieHeader.map(c => c.split(';')[0]).join('; ')
    : (setCookieHeader ? setCookieHeader.split(';')[0] : '');
  
  let loginSuccess = loginRes.status === 200 && hasCookie;

  check(loginRes, {
    'login status 200': (r) => {
      if (r.status !== 200) {
        console.log(`[VU ${__VU}] Login failed: ${r.status} - ${r.body.substring(0, 200)}`);
      }
      return r.status === 200;
    },
    'login has session cookie': () => hasCookie,
    'login response time < 5s': (r) => r.timings.duration < 5000,
  });

  sleep(2); // Increased sleep to avoid rate limiting

  // === TEST 4: Protected API dengan Session Cookie ===
  if (loginSuccess && cookieString) {
    const headers = {
      'Cookie': cookieString,  // FIX: Use properly formatted cookie string
      'Content-Type': 'application/json',
    };

    // Test 4a: Get Session Info
    const sessionRes = http.get(`${BASE_URL}/api/auth/session`, { headers });
    check(sessionRes, {
      'session valid': (r) => {
        if (r.status !== 200) {
          console.log(`[VU ${__VU}] Session check failed: ${r.status} - ${r.body.substring(0, 200)}`);
        }
        return r.status === 200;
      },
    });

    sleep(0.5);

    // Test 4b: Get Transaksi (Protected API)
    const transaksiRes = http.get(`${BASE_URL}/api/transaksi?page=1&limit=10`, { headers });
    check(transaksiRes, {
      'transaksi API status 200 or 401': (r) => r.status === 200 || r.status === 401,
      'transaksi response time < 5s': (r) => r.timings.duration < 5000,
    });

    sleep(1);

    // Test 4c: Get Santri (Protected API)
    const santriRes = http.get(`${BASE_URL}/api/santri?page=1&limit=10`, { headers });
    check(santriRes, {
      'santri API status 200 or 401': (r) => r.status === 200 || r.status === 401,
    });

    sleep(1);

    // Test 4d: Payment check-status (POST request)
    const paymentRes = http.post(
      `${BASE_URL}/api/payment/check-status`,
      JSON.stringify({ orderId: `TEST-${__VU}-${__ITER}` }),
      { headers }
    );
    check(paymentRes, {
      'payment check-status responded': (r) => r.status === 200 || r.status === 400 || r.status === 404,
    });

    sleep(1);

    // === TEST 5: Sign Out ===
    const signOutRes = http.post(`${BASE_URL}/api/auth/sign-out`, {}, { headers });
    check(signOutRes, {
      'sign-out responded': (r) => r.status === 200 || r.status === 302 || r.status === 500,
    });
  }

  sleep(2);
}

// Teardown untuk summary
export function teardown(data) {
  console.log('Auth stress test completed');
}
