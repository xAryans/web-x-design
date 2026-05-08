const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        const models = data.models.filter(m => m.name.includes('gemini'));
        console.log(models.map(m => m.name).join('\n'));
    } catch (e) {
        console.error(e);
    }
}
listModels();
