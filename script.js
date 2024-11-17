/**
 *
 *
 *  Puppeteer script to scrape HTML structure of WireCutter for analysis
 *  Version 1: save as JSON, and PDF file
 *  Version 2: add pagination, save to MongoDB
 *  Version 3: have REST API with Express that can talk to laravel application
 *
 *
 */

const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify the question method
const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function scrapeSite(url) {
  try {
    // Ensure URL has protocol
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    // Extract domain for file naming
    const domain = new URL(url).hostname;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputDir = path.join(__dirname, "scrapes", domain, timestamp);

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    console.log("\nLaunching browser...");
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set viewport for better PDF rendering
    await page.setViewport({
      width: 1200,
      height: 800,
    });

    console.log("Navigating to page...");
    const response = await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Get and save raw HTML
    console.log("Getting raw HTML...");
    const html = await page.content();
    const htmlPath = path.join(outputDir, "page.html");
    await fs.writeFile(htmlPath, html);

    // Generate and save PDF
    console.log("Generating PDF...");
    const pdfPath = path.join(outputDir, "page.pdf");
    await page.pdf({
      path: pdfPath,
      format: "A4",
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      printBackground: true,
    });

    // Try to get sitemap.xml
    console.log("Attempting to fetch sitemap.xml...");
    const sitemapUrls = [
      `${url}/sitemap.xml`,
      `${url}/sitemap_index.xml`,
      `${url}/sitemap`,
      `${url}/sitemap_index`,
    ];

    let sitemapContent = null;
    for (const sitemapUrl of sitemapUrls) {
      try {
        const sitemapResponse = await page.goto(sitemapUrl, {
          timeout: 5000,
          waitUntil: "networkidle0",
        });

        if (sitemapResponse.ok()) {
          sitemapContent = await page.content();
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (sitemapContent) {
      const sitemapPath = path.join(outputDir, "sitemap.xml");
      await fs.writeFile(sitemapPath, sitemapContent);
      console.log("Sitemap.xml saved successfully!");
    } else {
      console.log("No sitemap.xml found.");
    }

    await browser.close();

    console.log("\nScraping completed successfully!");
    console.log("Files saved in:", outputDir);
    console.log("Generated files:");
    console.log("- page.html (Raw HTML)");
    console.log("- page.pdf (PDF version)");
    if (sitemapContent) console.log("- sitemap.xml (Site structure)");

    return outputDir;
  } catch (error) {
    console.error("Error during scraping:", error);
    throw error;
  }
}

async function main() {
  try {
    while (true) {
      const url = await question(
        '\nEnter the website URL to scrape (or "exit" to quit): ',
      );

      if (url.toLowerCase() === "exit") {
        break;
      }

      console.log(`\nStarting to scrape ${url}...`);
      await scrapeSite(url);

      const again = await question(
        "\nWould you like to scrape another website? (y/n): ",
      );
      if (again.toLowerCase() !== "y") {
        break;
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    rl.close();
  }
}

// Start the script
console.log("Website Structure Scraper");
console.log("------------------------");
main();
