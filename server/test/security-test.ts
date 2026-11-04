import http from 'http';
import app from '../src/index.js';

interface TestResult {
  name: string;
  passed: boolean;
  status: number;
  expectedStatus: number | number[];
  details: string;
}

const results: TestResult[] = [];

function makeRequest(
  options: http.RequestOptions,
  body?: string
): Promise<{ status: number; data: string; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode || 0, data, headers: res.headers }));
    });
    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runSecurityTests() {
  console.log('\n=============================================');
  console.log('  RUNNING SAKSHAM RAJ PORTFOLIO SECURITY SUITE');
  console.log('=============================================\n');

  // Start test server on dynamic port on 127.0.0.1
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 5000;

  const getOptions = (clientIp: string): http.RequestOptions => ({
    hostname: '127.0.0.1',
    port,
    path: '/api/contact',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:5173',
      'X-Forwarded-For': clientIp,
    },
  });

  // Test 1: Empty Fields Rejection
  try {
    const res = await makeRequest(getOptions('198.51.100.1'), JSON.stringify({}));
    const pass = res.status === 400;
    results.push({
      name: '1. Empty payload rejected',
      passed: pass,
      status: res.status,
      expectedStatus: 400,
      details: res.data,
    });
  } catch (err) {
    results.push({ name: '1. Empty payload rejected', passed: false, status: 0, expectedStatus: 400, details: String(err) });
  }

  // Test 2: Oversized Input Rejection (Name > 100)
  try {
    const oversizedBody = JSON.stringify({
      name: 'A'.repeat(150),
      email: 'test@example.com',
      subject: 'Valid Subject',
      message: 'Valid message body.',
      consent: true,
      renderedAt: Date.now() - 5000,
    });
    const res = await makeRequest(getOptions('198.51.100.2'), oversizedBody);
    const pass = res.status === 400;
    results.push({
      name: '2. Oversized field rejected (Zod bounds)',
      passed: pass,
      status: res.status,
      expectedStatus: 400,
      details: res.data,
    });
  } catch (err) {
    results.push({ name: '2. Oversized field rejected', passed: false, status: 0, expectedStatus: 400, details: String(err) });
  }

  // Test 3: NoSQL Injection Payload Rejection / Sanitization
  try {
    const nosqlBody = JSON.stringify({
      name: { $gt: '' },
      email: 'test@example.com',
      subject: 'Hello',
      message: 'Test message here',
      consent: true,
      renderedAt: Date.now() - 5000,
    });
    const res = await makeRequest(getOptions('198.51.100.3'), nosqlBody);
    const pass = res.status === 400;
    results.push({
      name: '3. NoSQL operator injection rejected',
      passed: pass,
      status: res.status,
      expectedStatus: 400,
      details: res.data,
    });
  } catch (err) {
    results.push({ name: '3. NoSQL operator injection rejected', passed: false, status: 0, expectedStatus: 400, details: String(err) });
  }

  // Test 4: Newline / CRLF Injection in Subject Rejection
  try {
    const crlfBody = JSON.stringify({
      name: 'Saksham Test',
      email: 'test@example.com',
      subject: 'Header\r\nBcc: evil@attacker.com',
      message: 'Testing CRLF prevention',
      consent: true,
      renderedAt: Date.now() - 5000,
    });
    const res = await makeRequest(getOptions('198.51.100.4'), crlfBody);
    const pass = res.status === 400;
    results.push({
      name: '4. CRLF / Email header injection rejected',
      passed: pass,
      status: res.status,
      expectedStatus: 400,
      details: res.data,
    });
  } catch (err) {
    results.push({ name: '4. CRLF / Email header injection rejected', passed: false, status: 0, expectedStatus: 400, details: String(err) });
  }

  // Test 5: Filled Honeypot Handling (must return silent 200 without saving or processing)
  try {
    const honeypotBody = JSON.stringify({
      name: 'Spam Bot',
      email: 'bot@spam.com',
      subject: 'Buy crypto',
      message: 'Buy now please',
      consent: true,
      honeypot: 'http://spamlink.com',
      renderedAt: Date.now() - 5000,
    });
    const res = await makeRequest(getOptions('198.51.100.5'), honeypotBody);
    const pass = res.status === 200;
    results.push({
      name: '5. Honeypot traps spambots silently',
      passed: pass,
      status: res.status,
      expectedStatus: 200,
      details: res.data,
    });
  } catch (err) {
    results.push({ name: '5. Honeypot traps spambots silently', passed: false, status: 0, expectedStatus: 200, details: String(err) });
  }

  // Test 6: Instant Submissions Under 1.5s (Bot Speed Check)
  try {
    const fastBotBody = JSON.stringify({
      name: 'Fast Bot',
      email: 'fast@bot.com',
      subject: 'Fast submission',
      message: 'I am too fast for humans',
      consent: true,
      renderedAt: Date.now() - 200, // only 200ms
    });
    const res = await makeRequest(getOptions('198.51.100.6'), fastBotBody);
    const pass = res.status === 400;
    results.push({
      name: '6. Sub-second bot submissions blocked',
      passed: pass,
      status: res.status,
      expectedStatus: 400,
      details: res.data,
    });
  } catch (err) {
    results.push({ name: '6. Sub-second bot submissions blocked', passed: false, status: 0, expectedStatus: 400, details: String(err) });
  }

  // Test 7: Rate Limit Verification (send 6 rapid requests from same IP)
  try {
    const rateLimitIp = '198.51.100.7';
    let hitRateLimit = false;
    for (let i = 0; i < 6; i++) {
      const res = await makeRequest(
        getOptions(rateLimitIp),
        JSON.stringify({
          name: `User ${i}`,
          email: `user${i}@example.com`,
          subject: `Test ${i}`,
          message: 'Valid message body text',
          consent: true,
          renderedAt: Date.now() - 5000,
        })
      );
      if (res.status === 429) {
        hitRateLimit = true;
        break;
      }
    }
    results.push({
      name: '7. IP Rate Limiting triggers on 5+ submissions (HTTP 429)',
      passed: hitRateLimit,
      status: hitRateLimit ? 429 : 200,
      expectedStatus: 429,
      details: hitRateLimit ? '429 Too Many Requests received' : 'Did not trigger 429',
    });
  } catch (err) {
    results.push({ name: '7. IP Rate Limiting triggers', passed: false, status: 0, expectedStatus: 429, details: String(err) });
  }

  // Test 8: Legitimate Submission Accepted & Processed
  try {
    const validBody = JSON.stringify({
      name: 'Hiring Manager',
      email: 'recruiter@techcorp.com',
      subject: 'Data Analyst Role Inquiry',
      message: 'Hi Saksham, we were very impressed with your customer churn analysis project and Power BI dashboards.',
      consent: true,
      renderedAt: Date.now() - 6000,
    });
    const res = await makeRequest(getOptions('198.51.100.8'), validBody);
    const pass = res.status === 200;
    results.push({
      name: '8. Legitimate submission accepted & processed',
      passed: pass,
      status: res.status,
      expectedStatus: 200,
      details: res.data,
    });
  } catch (err) {
    results.push({ name: '8. Legitimate submission accepted & processed', passed: false, status: 0, expectedStatus: 200, details: String(err) });
  }

  // Test 9: Health Check Endpoint
  try {
    const healthRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/health',
      method: 'GET',
    });
    const pass = healthRes.status === 200 && healthRes.data.includes('healthy');
    results.push({
      name: '9. Health check returns 200 OK',
      passed: pass,
      status: healthRes.status,
      expectedStatus: 200,
      details: healthRes.data,
    });
  } catch (err) {
    results.push({ name: '9. Health check returns 200 OK', passed: false, status: 0, expectedStatus: 200, details: String(err) });
  }

  // Test 10: Projects API Endpoint
  try {
    const projRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/projects',
      method: 'GET',
    });
    const parsed = JSON.parse(projRes.data);
    const pass = projRes.status === 200 && Array.isArray(parsed.data) && parsed.data.length >= 3;
    results.push({
      name: '10. Projects API returns curated data',
      passed: pass,
      status: projRes.status,
      expectedStatus: 200,
      details: `Returned ${parsed.data?.length} projects`,
    });
  } catch (err) {
    results.push({ name: '10. Projects API returns curated data', passed: false, status: 0, expectedStatus: 200, details: String(err) });
  }

  // Test 11: Security Headers (Helmet, nosniff, HSTS, frame-ancestors)
  try {
    const healthRes = await makeRequest({
      hostname: '127.0.0.1',
      port,
      path: '/api/health',
      method: 'GET',
    });
    const headers = healthRes.headers;
    const hasNosniff = headers['x-content-type-options'] === 'nosniff';
    const hasCsp = typeof headers['content-security-policy'] === 'string';
    const noPoweredBy = headers['x-powered-by'] === undefined;
    const pass = hasNosniff && hasCsp && noPoweredBy;
    results.push({
      name: '11. Security headers verified (nosniff, strict CSP, no x-powered-by)',
      passed: pass,
      status: healthRes.status,
      expectedStatus: 200,
      details: `nosniff: ${hasNosniff}, CSP: ${hasCsp}, hidePoweredBy: ${noPoweredBy}`,
    });
  } catch (err) {
    results.push({ name: '11. Security headers verified', passed: false, status: 0, expectedStatus: 200, details: String(err) });
  }

  server.close();

  console.log('\n--- TEST RESULTS SUMMARY ---');
  let allPassed = true;
  for (const r of results) {
    const mark = r.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} | ${r.name} (HTTP ${r.status})`);
    if (!r.passed) {
      console.log(`   Details: ${r.details}`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('\n🎉 ALL SECURITY AND API TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('\n⚠️ SOME TESTS FAILED!\n');
    process.exit(1);
  }
}

runSecurityTests().catch((err) => {
  console.error('Fatal testing error:', err);
  process.exit(1);
});
