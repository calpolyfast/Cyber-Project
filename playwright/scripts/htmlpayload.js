import { chromium } from "playwright";

// Loads <argument 1> as HTML, and detects if a request is made to site <argument 2>
async function run() {
    if (!process.argv[2])
    {
        throw new Error("No payload provided.")
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    let requestMade = false;

    console.log()

    page.on("request", async (request) => {
        const url = request.url();

        if (url.includes(process.argv[3])) {
            console.log('Request made to target site:', url);
            requestMade = true;
        }
    });

    await page.setContent(process.argv[2], {waitUntil: 'networkidle'});

    await page.waitForTimeout(3000);

    if (!requestMade) {
        console.log(`No request made to ${process.argv[3]}.`);
    }

    await browser.close();
    process.exit(0)
}

run().catch(() => {
    console.error("An error occurred when running the Playwright script")
    process.exit(1)
});