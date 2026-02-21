const { chromium } = require('playwright');

async function scrapeSeed(page, seed) {
    const url = `https://YOUR_BASE_URL/seed/${seed}`; // Replace this
    await page.goto(url, { waitUntil: 'networkidle' });

    await page.waitForSelector('table');

    const numbers = await page.$$eval('table td', tds =>
        tds
            .map(td => parseFloat(td.innerText))
            .filter(n => !isNaN(n))
    );

    return numbers.reduce((a, b) => a + b, 0);
}

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    let total = 0;

    for (let seed = 11; seed <= 20; seed++) {
        const sum = await scrapeSeed(page, seed);
        console.log(`Seed ${seed}:`, sum);
        total += sum;
    }

    console.log("FINAL TOTAL:", total);

    await browser.close();
})();
