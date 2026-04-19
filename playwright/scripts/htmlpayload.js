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

    page.on("request", async (request) => {
        const url = request.url();

        if (url.includes(process.argv[3])) {
            console.log('Request made to target site:', url);
        }
    });

    await page.setContent(process.argv[2]);

    await page.waitForTimeout(3000);

    if (!requestMade) {
        console.log("No request made.");
    }

    await browser.close();
}

run().catch(console.error);