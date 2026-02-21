const { chromium } = require('playwright');

async function scrapeSeed(page, seed) {
    try {
        const url = `PASTE_REAL_BASE_URL_HERE/${seed}`;
        console.log("Opening:", url);

        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

        await page.waitForSelector('table', { timeout: 10000 });

        const numbers = await page.$$eval('table td', tds =>
            tds
                .map(td => parseFloat(td.innerText))
                .filter(n => !isNaN(n))
        );

        return numbers.reduce((a, b) => a + b, 0);

    } catch (err) {
        console.log(`Seed ${seed} failed:`, err.message);
        return 0;
    }
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    let total = 0;

    for (let seed = 11; seed <= 20; seed++) {
        const sum = await scrapeSeed(page, seed);
        console.log(`Seed ${seed} sum:`, sum);
        total += sum;
    }

    console.log("=================================");
    console.log("FINAL TOTAL:", total);
    console.log("=================================");

    await browser.close();
})();
