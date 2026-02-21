const { chromium } = require('playwright');

async function scrapeSeed(page, seed) {
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    console.log("Opening:", url);

    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for table to load (important because table is generated using JS)
    await page.waitForSelector('table');

    const numbers = await page.$$eval('table td', tds =>
        tds
            .map(td => parseFloat(td.innerText))
            .filter(n => !isNaN(n))
    );

    return numbers.reduce((a, b) => a + b, 0);
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    let total = 0;

    for (let seed = 11; seed <= 20; seed++) {
        const sum = await scrapeSeed(page, seed);
        console.log(`Seed ${seed}:`, sum);
        total += sum;
    }

    console.log("=================================");
    console.log("FINAL TOTAL:", total);
    console.log("=================================");

    await browser.close();
})();
