require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testModel(modelName) {
    console.log(`\nTesting model: ${modelName}`);
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, this is a test.");
        const response = await result.response;
        console.log(`SUCCESS: ${modelName} worked! Response:`, response.text());
        return true;
    } catch (error) {
        console.error(`FAILED: ${modelName} - Error: ${error.message} (Status: ${error.status})`);
        return false;
    }
}

async function run() {
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];

    for (const m of models) {
        if (await testModel(m)) break;
    }
}

run();
