require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testModel(modelName) {
    console.log(`Testing: ${modelName}`);
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log(`[PASS] ${modelName}`);
        return true;
    } catch (error) {
        // console.error(`[FAIL] ${modelName}: ${error.message}`);
        console.log(`[FAIL] ${modelName}: ${error.message.split(' ').slice(0, 10).join(' ')}...`); // Shorten error
        return false;
    }
}

async function run() {
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-pro",
        "gemini-1.5-pro-001",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    console.log("Starting Model Check...");
    let found = false;
    for (const m of models) {
        if (await testModel(m)) {
            found = true;
            console.log(`\n>>> FOUND WORKING MODEL: ${m} <<<`);
            break;
        }
    }

    if (!found) {
        console.log("\nNo working model found. Please check API Key permissions.");
    }
}

run();
