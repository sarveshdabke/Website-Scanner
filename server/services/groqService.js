const axios = require('axios');

const generateAIFixes = async (scanData) => {
  try {
    const prompt = `You are a senior web development expert. Analyze this website scan report and provide:
1. A brief overall assessment (2-3 sentences)
2. Top 5 prioritized fixes with clear, actionable steps (code snippets where helpful)

Website: ${scanData.url}
Overall Score: ${scanData.overallScore}/100

SEO Issues: ${JSON.stringify(scanData.seo.issues || [])}
Performance Issues: ${JSON.stringify(scanData.performance.issues || [])}
Security Issues: ${JSON.stringify(scanData.security.issues || [])}
Performance Metrics: ${JSON.stringify(scanData.performance.metrics || {})}

Respond ONLY in this exact JSON format, no markdown, no extra text:
{
  "assessment": "brief overall assessment here",
  "fixes": [
    { "title": "fix title", "priority": "high|medium|low", "description": "clear actionable steps" }
  ]
}`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1500
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    let content = response.data.choices[0].message.content.trim();
    // Kabhi kabhi model markdown code block mein wrap kar deta hai, usko clean karo
    content = content.replace(/```json|```/g, '').trim();

    return JSON.parse(content);

  } catch (error) {
    console.error('Groq AI Error:', error.response?.data || error.message);
    return {
      assessment: 'Could not generate AI analysis at this time.',
      fixes: []
    };
  }
};

module.exports = { generateAIFixes };