# Website Structure Scraper

A Node.js tool that uses Puppeteer to capture website structures by saving the raw HTML, generating a PDF version, and attempting to retrieve the sitemap.xml file.

## Features

- 📑 Captures complete raw HTML structure
- 📄 Generates PDF version of the webpage
- 🗺️ Attempts to retrieve sitemap.xml
- 📁 Organized file storage with timestamp-based directories
- 🤝 Interactive command-line interface
- 🔄 Multiple website scanning in one session

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository or create a new directory:
```bash
mkdir website-scraper
cd website-scraper
```

2. Initialize a new Node.js project:
```bash
npm init -y
```

3. Install required dependencies:
```bash
npm install puppeteer
```

4. Create the script file:
```bash
# Copy the scraper.js code into this file
touch scraper.js
```

## Usage

Run the script using Node.js:
```bash
node scraper.js
```

Follow the interactive prompts:
1. Enter the website URL you want to scrape
2. Wait for the scraping process to complete
3. Choose to scrape another website or exit

### Output Structure

```
scrapes/
└── example.com/
    └── 2024-11-17-03-42-15/
        ├── page.html
        ├── page.pdf
        └── sitemap.xml
```

## Output Files

- `page.html`: Raw HTML structure of the website
- `page.pdf`: PDF version of the webpage
- `sitemap.xml`: Website sitemap (if available)

## Configuration

The script includes several configurable options in the code:

### PDF Settings
```javascript
await page.pdf({
  format: 'A4',
  margin: {
    top: '20px',
    right: '20px',
    bottom: '20px',
    left: '20px'
  },
  printBackground: true
});
```

### Viewport Settings
```javascript
await page.setViewport({
  width: 1200,
  height: 800
});
```

### Timeout Settings
```javascript
await page.goto(url, {
  waitUntil: 'networkidle0',
  timeout: 30000  // 30 seconds
});
```

## Error Handling

The script includes handling for common issues:
- Invalid URLs
- Missing sitemaps
- Network timeouts
- File system errors

## Limitations

- Some websites may block automated access
- Dynamic content might not be fully captured
- JavaScript-heavy sites may require additional configuration
- Some sitemaps might be protected or require authentication

## Common Issues and Solutions

### EACCES: permission denied
```bash
sudo chmod -R 755 ./scrapes
```

### Timeout Errors
Increase the timeout value in the code:
```javascript
timeout: 60000  // Increase to 60 seconds
```

### Memory Issues
Add additional Puppeteer launch arguments:
```javascript
const browser = await puppeteer.launch({
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu'
  ]
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Puppeteer](https://pptr.dev/) - Headless Chrome Node.js API
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [npm](https://www.npmjs.com/) - Package manager

## Support

For support, please open an issue in the repository or contact the maintainers.

## Future Improvements

- [ ] Add support for authentication
- [ ] Implement concurrent scraping
- [ ] Add custom CSS selectors for specific content
- [ ] Create configuration file support
- [ ] Add progress bars for long operations
- [ ] Implement retry mechanism for failed attempts
- [ ] Add support for custom output formats
