import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { readFileContent } from '../utils/fileUtils';

dotenv.config();

const router = express.Router();

// Configure OpenAI client with Azure endpoint
const client = new OpenAI({ 
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN 
});

router.post('/chat', async (req, res) => {
    try {
        const { message, filePath, currentCode, error } = req.body;

        // Get the file content if a path is provided
        let fileContent = currentCode;
        if (filePath) {
            const absolutePath = path.join(process.cwd(), '..', filePath);
            fileContent = readFileContent(absolutePath) || currentCode;
        }

        // Construct the messages array
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: "You are a helpful coding assistant. Your task is to help with code understanding, suggestions, and improvements. " + 
                    "When suggesting code changes, format them as follows:\n" +
                    "```suggestion\n[your code suggestion here]\n```\n" +
                    (fileContent ? `Here's the current code:\n\`\`\`\n${fileContent}\n\`\`\`\n` : '') +
                    (error ? `The user is encountering this error:\n\`\`\`\n${error}\n\`\`\`\n` : '') +
                    "Please provide clear, concise assistance and specific code suggestions when appropriate."
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

        // Extract the response text and check for code suggestions
        const responseText = response.choices[0].message.content || 'No response generated';
        const suggestions = responseText.match(/```suggestion\n([\s\S]*?)```/g)?.map(match => {
            return match.replace(/```suggestion\n/, '').replace(/```$/, '').trim();
        }) || [];

        res.json({
            message: responseText,
            suggestions: suggestions
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({
            error: 'Failed to process chat message'
        });
    }
});

export default router; 