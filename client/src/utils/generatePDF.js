import jsPDF from 'jspdf';

export const generatePDFReport = (scanData) => {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text('Website Scan Report', 20, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`URL: ${scanData.url}`, 20, y);
  y += 7;
  doc.text(`Overall Score: ${scanData.overallScore}/100`, 20, y);
  y += 12;

  doc.setFontSize(14);
  doc.text('SEO Report', 20, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(`Score: ${scanData.seo.score || 'N/A'}`, 20, y);
  y += 6;
  doc.text(`Title: ${scanData.seo.title || 'N/A'}`, 20, y);
  y += 6;
  doc.text(`Word Count: ${scanData.seo.wordCount || 'N/A'}`, 20, y);
  y += 10;

  doc.setFontSize(14);
  doc.text('Performance Report', 20, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(`Score: ${scanData.performance.score || 'N/A'}`, 20, y);
  y += 6;
  doc.text(`Performance: ${scanData.performance.performanceScore || 'N/A'}`, 20, y);
  y += 6;
  doc.text(`Accessibility: ${scanData.performance.accessibilityScore || 'N/A'}`, 20, y);
  y += 10;

  doc.setFontSize(14);
  doc.text('Security Report', 20, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(`Score: ${scanData.security.score || 'N/A'}`, 20, y);
  y += 6;
  doc.text(`HTTPS: ${scanData.security.isHttps ? 'Yes' : 'No'}`, 20, y);
  y += 6;
  doc.text(`Server: ${scanData.security.serverHeader || 'N/A'}`, 20, y);

  doc.save(`scan-report-${Date.now()}.pdf`);
};