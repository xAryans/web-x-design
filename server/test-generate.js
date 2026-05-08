const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGenerate() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Hello!");
        const response = await result.response;
        console.log(response.text());
    } catch (e) {
        console.error("Error generating:", e.message);
    }
}
testGenerate();
