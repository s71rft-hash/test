const puppeteer = require('puppeteer');

module.exports = async (url, callback) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });
    callback(null, pdf);
  } catch (err) {
    callback(err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
