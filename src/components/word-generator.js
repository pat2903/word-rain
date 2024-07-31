import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config()

const OPEN_AI_KEY = process.env.OPEN_AI_KEY

export async function generateWords(count = 5) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: `Generate ${count} random words suitable for a word game. Provide only the words in a comma-separated list.`
                }
            ],
            temperature: 0.7,
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const wordList = data.choices[0].message.content.split(',').map(word => word.trim());
        return wordList;
    }
    catch (error) {
        console.error('Error generating words:', error);
        // fallback
        return ['Donkey', 'Slug', 'Honk', 'Bottle', 'Spice'];
    }
}