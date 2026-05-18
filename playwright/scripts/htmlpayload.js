import { chromium } from "playwright";

async function loginUser(page, context, baseUrl) {
    try {
        await page.goto(baseUrl);

        const loginResponse = await page.evaluate(async (url) => {
            const res = await fetch(`${url}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: "admin",
                    password: "thebigcheese#123"
                })
            });
            return { status: res.status, body: await res.text() };
        }, baseUrl);

    } catch (error) {
        console.error('Failed to log into the victim account. This can either be a server issue or an error on your end with the URL you have the victim visit.');
    }
}

// Loads <argument 1> as HTML, and detects if a request is made to site <argument 2>
async function run() {
    if (!process.argv[2])
    {
        throw new Error("No payload provided.")
    }
    if (!process.argv[3])
    {
        throw new Error("No Chamber URL provided.")
    }

    const maliciousHTML = process.argv[2]
    const chamberUrl = process.argv[3]

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Log in as an admin user (the victim of the attack) that currently has an active session
    await loginUser(page, context, chamberUrl);

    // Track the request and response to determine whether attack was successful
    let correctRequestUrl = false
    let correctResponse = false

    page.on("request", request => {
        if (request.url().includes("/api/accounts/me")) {
            correctRequestUrl = true
        }
    })

    // Attach event listener to response
    page.on("response", async (response) => {
        const body = await response.text();
        if (response.url().includes("/api/accounts/me")) {
            console.log("BODY: ", body)
            console.log("URL:", response.url());
            console.log("STATUS:", response.status());
        }
        
        // If the response body contains "admin", we can reasonably assume the request successfully retrieved the admin's profile
        if (body.includes("admin")) {
            correctResponse = true
        }
    });

    await page.setContent(maliciousHTML, {waitUntil: 'networkidle'});

    await page.waitForTimeout(3000);

    if (correctRequestUrl && correctResponse) {
        console.log("flag{csrf_attack_aeabbe58-642d-4d5a-a7df-71ea2facc73a}");
    }

    await browser.close();
    process.exit(0)
}

run().catch((err) => {
    console.error("An error occurred when running the Playwright script")
    console.error(err)
    process.exit(1)
});