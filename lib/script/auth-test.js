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
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.10'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://al-munir-administration-v2.vercel.app';

// Test credentials - buat user test khusus untuk stress test
const TEST_USERS = [
  { email: 'subandi@gmail.com', password: 'wasdqwe1234' },
  { email: 'handoko123@gmail.com', password: 'wasdqwe1234' },
  { email: 'gita@gmail.com', password: 'wasdqwe1234' },
];

export default function () {
  // Rotate through test users
  const user = TEST_USERS[__VU % TEST_USERS.length];
  
  // === STEP 1: Get initial session (should be null) ===
  const sessionRes1 = http.get(`${BASE_URL}/api/auth/session`);
  check(sessionRes1, {
    'session endpoint accessible': (r) => r.status === 200,
  });
  sleep(0.5);

  // === STEP 2: Sign in with Better Auth ===
  const signInPayload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const signInRes = http.post(`${BASE_URL}/api/auth/sign-in/email`, signInPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const loginSuccess = check(signInRes, {
    'sign-in status 200 or redirect': (r) => r.status === 200 || r.status === 302,
    'sign-in response has user': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.user !== undefined;
      } catch {
        return false;
      }
    },
  });

  sleep(1);

  // === STEP 3: Verify session after login ===
  if (loginSuccess) {
    // Extract cookies from sign-in response for subsequent requests
    const cookies = signInRes.cookies;
    
    const sessionRes2 = http.get(`${BASE_URL}/api/auth/session`, {
      cookies: cookies,
    });
    
    check(sessionRes2, {
      'session has user after login': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.user !== undefined;
        } catch {
          return false;
        }
      },
    });
  }

  sleep(2);

  // === STEP 4: Sign out ===
  const signOutRes = http.post(`${BASE_URL}/api/auth/sign-out`, null, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(signOutRes, {
    'sign-out successful': (r) => r.status === 200 || r.status === 302,
  });

  sleep(1);
}
