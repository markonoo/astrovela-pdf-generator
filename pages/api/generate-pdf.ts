import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Parse incoming JSON body for quiz results
  const data = req.body || {};
  const { name = 'Anonymous', score = 0, result = '' } = data;

  // Define HTML template using Tailwind CSS via CDN
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Astrovela Astrology Report</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="p-8">
      <h1 class="text-3xl font-bold mb-4">Astrovela Astrology Report</h1>
      <p class="mb-2"><strong>Name:</strong> ${name}</p>
      <p class="mb-2"><strong>Score:</strong> ${score}</p>
      <p class="mb-4"><strong>Result:</strong> ${result}</p>
      <p class="text-sm text-gray-600">This sample report demonstrates PDF generation using Puppeteer and Tailwind CSS.</p>
    </body>
  </html>
  `;

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating PDF' });
  }
}
