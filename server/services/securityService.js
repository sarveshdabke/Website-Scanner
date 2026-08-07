const axios = require('axios');

const runSecurityCheck = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const headers = response.headers;

    // 1. HTTPS check
    const isHttps = url.startsWith('https://');

    // 2. Important security headers check
    const hasCSP = !!headers['content-security-policy'];
    const hasXFrameOptions = !!headers['x-frame-options'];
    const hasHSTS = !!headers['strict-transport-security'];
    const hasXContentTypeOptions = !!headers['x-content-type-options'];
    const hasReferrerPolicy = !!headers['referrer-policy'];
    const hasPermissionsPolicy = !!headers['permissions-policy'];

    // 3. Server info leak check (server apna version to nahi bata raha)
    const serverHeader = headers['server'] || '';
    const exposesServerInfo = /\d/.test(serverHeader); // agar version number dikh raha hai

    // --- Scoring logic ---
    let score = 100;
    const issues = [];

    if (!isHttps) {
      score -= 25;
      issues.push('Website is not using HTTPS — major security risk');
    }

    if (!hasHSTS) {
      score -= 15;
      issues.push('Missing Strict-Transport-Security header (HSTS)');
    }

    if (!hasCSP) {
      score -= 15;
      issues.push('Missing Content-Security-Policy header');
    }

    if (!hasXFrameOptions) {
      score -= 10;
      issues.push('Missing X-Frame-Options header (clickjacking risk)');
    }

    if (!hasXContentTypeOptions) {
      score -= 10;
      issues.push('Missing X-Content-Type-Options header');
    }

    if (!hasReferrerPolicy) {
      score -= 5;
      issues.push('Missing Referrer-Policy header');
    }

    if (!hasPermissionsPolicy) {
      score -= 5;
      issues.push('Missing Permissions-Policy header');
    }

    if (exposesServerInfo) {
      score -= 10;
      issues.push(`Server header exposes version info: "${serverHeader}"`);
    }

    score = Math.max(score, 0);

    return {
      score,
      isHttps,
      hasCSP,
      hasXFrameOptions,
      hasHSTS,
      hasXContentTypeOptions,
      hasReferrerPolicy,
      hasPermissionsPolicy,
      serverHeader: serverHeader || 'Not disclosed',
      issues
    };

  } catch (error) {
    return {
      score: 0,
      error: 'Could not fetch headers from the website',
      details: error.message
    };
  }
};

module.exports = { runSecurityCheck };