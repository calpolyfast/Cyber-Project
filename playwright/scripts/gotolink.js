import { chromium } from "playwright";

async function run() {
    if (!process.argv[2])
    {
        throw new Error("No link provided.")
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    let alertDetected = false;

    page.on("dialog", async (dialog) => {
        console.log("Alert detected:", dialog.message());
        alertDetected = true;
        await dialog.dismiss();
    });

    await page.goto(process.argv[2]);

    await page.waitForTimeout(3000);

    if (!alertDetected) {
        console.log("No alert appeared.");
    }

    await browser.close();
    process.exit(0)
}

run().catch((err) => {
        console.error("Nothing happened.")
        process.exit(1)
    }
);