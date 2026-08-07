const axios = require('axios');
const qs = require('qs'); // ye already axios ke saath install hota hai, agar error aaye to: npm install qs

const runPerformanceCheck = async (url) => {
  try {
    const apiKey = process.env.PAGESPEED_API_KEY;
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`;

    const response = await axios.get(apiUrl, {
      params: {
        url: url,
        key: apiKey,
        category: ['performance', 'accessibility', 'best-practices', 'seo'],
        strategy: 'mobile'
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
      timeout: 30000
    });

    const lighthouse = response.data.lighthouseResult;
    const categories = lighthouse.categories;

    // Safety check add kiya — agar koi category missing ho to crash na ho
    const performanceScore = categories.performance ? Math.round(categories.performance.score * 100) : 0;
    const accessibilityScore = categories.accessibility ? Math.round(categories.accessibility.score * 100) : 0;
    const bestPracticesScore = categories['best-practices'] ? Math.round(categories['best-practices'].score * 100) : 0;

    const audits = lighthouse.audits;
    const firstContentfulPaint = audits['first-contentful-paint']?.displayValue || 'N/A';
    const largestContentfulPaint = audits['largest-contentful-paint']?.displayValue || 'N/A';
    const totalBlockingTime = audits['total-blocking-time']?.displayValue || 'N/A';
    const cumulativeLayoutShift = audits['cumulative-layout-shift']?.displayValue || 'N/A';
    const speedIndex = audits['speed-index']?.displayValue || 'N/A';

    const score = Math.round((performanceScore + accessibilityScore + bestPracticesScore) / 3);

    const issues = [];
    if (performanceScore < 50) issues.push('Poor performance score — page loads slowly');
    if (accessibilityScore < 50) issues.push('Poor accessibility — may not work well with screen readers');
    if (bestPracticesScore < 50) issues.push('Not following web development best practices');

    return {
      score,
      performanceScore,
      accessibilityScore,
      bestPracticesScore,
      metrics: {
        firstContentfulPaint,
        largestContentfulPaint,
        totalBlockingTime,
        cumulativeLayoutShift,
        speedIndex
      },
      issues
    };

  } catch (error) {
    return {
      score: 0,
      error: 'Could not fetch performance data',
      details: error.response?.data?.error?.message || error.message
    };
  }
};

module.exports = { runPerformanceCheck };