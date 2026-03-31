import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
};

const BASE_URL = 'https://al-munir-administration-v2.vercel.app';
const EMAIL = __ENV.TEST_EMAIL || 'subandi@gmail.com';  // Ganti dengan email asli
const PASS = __ENV.TEST_PASS || 'wasdqwe1234';          // Ganti dengan password asli

export default function () {
  console.log('========================================');
  console.log('Testing Better Auth Endpoints');
  console.log(`BASE_URL: ${BASE_URL}`);
  console.log(`EMAIL: ${EMAIL}`);
  console.log('========================================\n');

  // Test 1: Homepage
  console.log('--- Test 1: GET / (homepage) ---');
  const home = http.get(`${BASE_URL}/`);
  console.log(`Status: ${home.status}`);
  console.log(`Response time: ${home.timings.duration}ms`);
  check(home, { 'homepage OK': (r) => r.status === 200 });

  // Test 2: Auth page
  console.log('\n--- Test 2: GET /auth (login page) ---');
  const authPage = http.get(`${BASE_URL}/auth`);
  console.log(`Status: ${authPage.status}`);
  console.log(`Response time: ${authPage.timings.duration}ms`);
  check(authPage, { 'auth page accessible': (r) => r.status === 200 });

  // Test 3: Session before login
  console.log('\n--- Test 3: GET /api/auth/session (before login) ---');
  const sessBefore = http.get(`${BASE_URL}/api/auth/session`);
  console.log(`Status: ${sessBefore.status}`);
  console.log(`Response time: ${sessBefore.timings.duration}ms`);
  console.log(`Body: ${sessBefore.body}`);
  check(sessBefore, { 'session endpoint works': (r) => r.status === 200 });

  // Test 4: Sign in
  console.log('\n--- Test 4: POST /api/auth/sign-in/email ---');
  const loginPayload = JSON.stringify({
    email: EMAIL,
    password: PASS,
  });
  
  const login = http.post(`${BASE_URL}/api/auth/sign-in/email`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  console.log(`Status: ${login.status}`);
  console.log(`Response time: ${login.timings.duration}ms`);
  console.log(`Body: ${login.body}`);
  console.log(`Headers: ${JSON.stringify(login.headers)}`);
  
  check(login, {
    'login status OK': (r) => r.status === 200 || r.status === 201 || r.status === 302,
    'login has response body': (r) => r.body && r.body.length > 0,
  });

  // Test 5: Session after login
  console.log('\n--- Test 5: GET /api/auth/session (after login) ---');
  const sessAfter = http.get(`${BASE_URL}/api/auth/session`);
  console.log(`Status: ${sessAfter.status}`);
  console.log(`Response time: ${sessAfter.timings.duration}ms`);
  console.log(`Body: ${sessAfter.body}`);
  
  check(sessAfter, {
    'session after login OK': (r) => r.status === 200,
    'session has user data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.user !== undefined || body.session !== undefined || body.id !== undefined;
      } catch {
        return r.body.includes('user') || r.body.includes('session');
      }
    },
  });

  // Test 6: Sign out
  console.log('\n--- Test 6: POST /api/auth/sign-out ---');
  const logout = http.post(`${BASE_URL}/api/auth/sign-out`, null, {
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(`Status: ${logout.status}`);
  console.log(`Response time: ${logout.timings.duration}ms`);
  console.log(`Body: ${logout.body}`);
  check(logout, { 'logout OK': (r) => r.status === 200 || r.status === 302 });

  console.log('\n========================================');
  console.log('Debug Complete');
  console.log('========================================');
}
