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
        
    } catch (error) {
        console.error('Something went wrong');
    }
}

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

    await loginUser(page);

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