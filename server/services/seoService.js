const axios = require('axios');
const cheerio = require('cheerio');

const runSeoCheck = async (url) => {
  try {
    // Website ka HTML fetch karo
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(html);

    // 1. Title check
    const title = $('title').text().trim();
    const titleLength = title.length;

    // 2. Meta description check
    const metaDescription = $('meta[name="description"]').attr('content') || '';

    // 3. Headings check
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h1Text = $('h1').first().text().trim();

    // 4. Images alt tag check
    const images = $('img');
    const totalImages = images.length;
    let imagesWithoutAlt = 0;
    images.each((i, el) => {
      if (!$(el).attr('alt')) imagesWithoutAlt++;
    });

    // 5. Meta viewport (mobile-friendly check)
    const hasViewport = $('meta[name="viewport"]').length > 0;

    // 6. Links count
    const totalLinks = $('a').length;

    // 7. Text content nikal ke word count karo
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(' ').length;

    // --- Scoring logic (apna khud ka simple rule-based system) ---
    let score = 100;
    const issues = [];

    if (!title) {
      score -= 15;
      issues.push('Title tag missing');
    } else if (titleLength < 10 || titleLength > 60) {
      score -= 5;
      issues.push('Title length not optimal (should be 10-60 characters)');
    }

    if (!metaDescription) {
      score -= 15;
      issues.push('Meta description missing');
    } else if (metaDescription.length < 50 || metaDescription.length > 160) {
      score -= 5;
      issues.push('Meta description length not optimal (should be 50-160 characters)');
    }

    if (h1Count === 0) {
      score -= 15;
      issues.push('No H1 tag found');
    } else if (h1Count > 1) {
      score -= 5;
      issues.push('Multiple H1 tags found (should be only 1)');
    }

    if (totalImages > 0 && imagesWithoutAlt > 0) {
      score -= 10;
      issues.push(`${imagesWithoutAlt} out of ${totalImages} images missing alt text`);
    }

    if (!hasViewport) {
      score -= 10;
      issues.push('Missing viewport meta tag (not mobile-friendly)');
    }

    if (wordCount < 300) {
      score -= 10;
      issues.push('Low text content (less than 300 words) — may hurt SEO');
    }

    score = Math.max(score, 0);

    return {
      score,
      title,
      titleLength,
      metaDescription,
      h1Count,
      h1Text,
      h2Count,
      totalImages,
      imagesWithoutAlt,
      hasViewport,
      totalLinks,
      wordCount,
      issues
    };

  } catch (error) {
    return {
      score: 0,
      error: 'Could not fetch or parse the website',
      details: error.message
    };
  }
};

module.exports = { runSeoCheck };