const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chat = async (req, res) => {
    try {
        const { prompt, context } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let fullPrompt = `You are an AI Clinical Assistant built into MediConnect, an intelligent healthcare platform. 
If you are talking to a doctor: Your goal is to assist with summarizing patient history, suggesting possible diagnoses, or formatting prescription drafts. 
If you are talking to a patient: Answer their health-related queries safely, suggest possible conditions based on symptoms (triage), and remind them to consult a doctor. Do NOT issue prescriptions to patients.
Keep your responses concise, professional, and well-structured (use bullet points or line breaks where appropriate).
If asked to format a prescription draft (by a doctor), just list the medication name, dosage, and duration clearly.
Do NOT use markdown code blocks like \`\`\`json or \`\`\`markdown. Provide plain text or simple markdown formatting.
`;

        if (context) {
            fullPrompt += `\n--- Context (Current Patient Details) ---\n${context}\n---------------------------------------\n`;
        }

        fullPrompt += `\nDoctor's Prompt: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        let text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("AI Chat Error:", error);
        
        // Mock fallback for hackathon if API fails
        const lowerPrompt = req.body.prompt ? req.body.prompt.toLowerCase() : "";
        let mockReply = "Based on your prompt, I recommend consulting a doctor. (Note: This is a demo fallback response because the AI API could not be reached).";
        
        if (lowerPrompt.includes("fever")) {
            mockReply = "For a fever, it's generally recommended to stay hydrated and rest. You may take Paracetamol 500mg (1 tablet every 6 hours) to reduce the fever. If it persists for more than 3 days or exceeds 103°F, consult a doctor immediately.\n\n*(Note: This is a demo fallback response)*";
        } else if (lowerPrompt.includes("headache")) {
            mockReply = "For a mild headache, rest and hydration are key. Ibuprofen 400mg or Paracetamol 500mg can help. If it is severe, accompanied by vision changes or stiffness in the neck, seek emergency medical care.\n\n*(Note: This is a demo fallback response)*";
        } else if (lowerPrompt.includes("summarize") || lowerPrompt.includes("summary")) {
            mockReply = "Patient Summary: The patient has a history of mild hypertension and seasonal allergies. Recent visits indicate no acute abnormalities. Vitals are stable.\n\n*(Note: This is a demo fallback response)*";
        }

        res.json({ reply: mockReply });
    }
};
