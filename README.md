# Astrovela PDF Generator  
This repository implements an automated workflow for Astrovela to generate personalized astrology reports as PDFs. It uses a Next.js API route that renders a Tailwind CSS HTML template into a PDF using the headless Chrome renderer (Puppeteer). The generated PDF can be published via a Vercel deployment and integrated with Supabase and Zapier/Make.  
  
## How it works  
- **API route**: The `pages/api/generate‑pdf.ts` endpoint accepts quiz result data via JSON or query parameters. It builds an HTML report using a simple Tailwind template and renders it to a PDF with Puppeteer. The response is returned as a PDF file.  
- **PDF renderer**: Puppeteer is used as the headless browser to generate PDFs on the server side. This is recommended for Next.js backend functions because it isolates the rendering from the client ([Creating a PDF in Next.js Backend using Pupeteer](https://medium.com/%40farmaan30327/creating-a-pdf-in-next-js-backend-using-pupeteer-bdc27c99b1e8#:~:text=Creating%20a%20PDF%20in%20Next,it%20via%20an%20API%20route)).  
- **Template**: A minimal Tailwind CSS template is embedded in the API route. It displays the user's name, score and result along with a heading and a disclaimer. You can customise this template to match Astrovela’s branding.  
- **Supabase integration**: To fetch quiz submissions, use the Supabase client library in a separate script or API route. For example, subscribe to inserts on a `quiz_results` table and send each new row to the PDF API. Because credentials are not included here, you should set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as environment variables when adding that logic.  
- **Automation trigger**: Zapier or Make can watch for new rows in Supabase. When a new quiz result appears, configure the workflow to call the Vercel-hosted `/api/generate‑pdf` endpoint with the quiz data. The workflow can then email the generated PDF to the user or store it back in Supabase storage.  
- **Deployment**: Deploy this Next.js app to Vercel by connecting this GitHub repository. Use the Next.js preset and ensure that Puppeteer is available in the serverless environment (Vercel’s default Node.js runtime supports it). After deployment, the PDF endpoint will be available at `https://<your-vercel-domain>/api/generate-pdf`.  
  
## Sample usage  
1. Install dependencies locally:  
   ```bash  
   npm install  
   ```  
2. Start the development server:  
   ```bash  
   npm run dev  
   ```  
3. Use `curl` or Postman to call the API:  
   ```bash  
   curl -X POST http://localhost:3000/api/generate-pdf \  
     -H "Content-Type: application/json" \  
     -d '{"name":"Alice","score":85,"result":"You are a Leo with strong creative energies"}' --output report.pdf  
   ```  
   This command saves the generated report to a file named `report.pdf`. You can also test via GET parameters in a browser: `http://localhost:3000/api/generate-pdf?name=Alice&score=85&result=You%20are%20a%20Leo`.  
  
## Repository contents  
- `pages/api/generate-pdf.ts` – Next.js API route that uses Puppeteer to render a Tailwind HTML template into a PDF.  
- `package.json` – Contains dependencies for Next.js and Puppeteer.  
- `README.md` – Instructions for setup, deployment and automation.  
  
## Notes  
- The Tailwind CSS is loaded from the CDN inside the PDF template for simplicity. In a production environment you might generate styles ahead of time and embed them inline.  
- To connect to Supabase, add the official `@supabase/supabase-js` package and authenticate using environment variables.  
- When setting up automation with Zapier/Make, ensure that the PDF endpoint is publicly accessible and consider adding authentication (such as a secret key) to prevent unauthorized requests. 
