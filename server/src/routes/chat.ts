import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

interface ChatMessage {
    role: string;
    content: string;
}

const router = express.Router();

// Configure OpenAI client with Azure endpoint
const client = new OpenAI({ 
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN 
});

router.post('/chat', async (req, res) => {
    try {
        const { message, code, error } = req.body;

        // Construct the messages array
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: "You are a helpful coding assistant. " + 
                    (code ? `Here's the code being discussed:\n\`\`\`\n${code}\n\`\`\`\n` : '') +
                    (error ? `The user is encountering this error:\n\`\`\`\n${error}\n\`\`\`\n` : '') +
                    "Please provide clear, concise assistance."
            },
            {
                role: "user",
                content: message
            }
        ];

        // Make request to Azure OpenAI API
        const response = await client.chat.completions.create({
            messages: messages,
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 1000,
            model: "gpt-4o"
        });

        // Extract the response text
        const responseText = response.choices[0].message.content || 'No response generated';

        res.json({
            message: responseText
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({
            error: 'Failed to process chat message'
        });
    }
});

export default router; 