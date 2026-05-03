import { chromium } from "playwright";

async function loginUser(page) {
    const url = 'http://localhost:3000/api/users/login';
    const payload = {
        username: "admin",
        password: "thebigcheese#123"
    };

    try {
        // Make the POST request and wait for the response
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Check if the login was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON body
        const data = await response.json();

        // Set the response in localStorage
        // Note: localStorage is a Browser API. If running in pure Node, 
        // you'd typically use a variable or a file instead.
        await page.evaluate((data) => {
          localStorage.setItem('userdata', JSON.stringify(data));
        }, data);

        console.log('Login successful, userdata saved.');
        
    } catch (error) {
        console.error('Failed to log in:', error);
    }
}

// Loads <argument 1> as HTML, and detects if a request is made to site <argument 2>
async function run() {
    if (!process.argv[2])
    {
        throw new Error("No payload provided.")
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(process.argv[2]);

    await loginUser(page)

    let requestMade = false;

    console.log()

    page.on("request", async (request) => {
        const url = request.url();

        if (url.includes(process.argv[3])) {
            console.log("flag{csrf_attack_aeabbe58-642d-4d5a-a7df-71ea2facc73a}");
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