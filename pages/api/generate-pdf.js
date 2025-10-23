import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }
  const { name, score, result } = req.body;
  const html = `<!DOCTYPE html>
  <html lang="en">
   <head>
    <meta charset="UTF-8">
    <title>Astrology Report</title>
    <script src="https://cdn.tailwindcss.com"></script>
   </head>
   <body class="p-8">
     <h1 class="text-2xl font-bold mb-4">Astrology Report</h1>
     <p><strong>Name:</strong> ${name}</p>
     <p><strong>Score:</strong> ${score}</p>
     <p><strong>Result:</strong> ${result}</p>
   </body>
  </html>`;
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
  res.status(200).send(pdfBuffer);
}
