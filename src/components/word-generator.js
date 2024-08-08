const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export async function generateWords(count = 10) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
        body: JSON.stringify({
            //model: 'gpt-4o-mini',
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: `Generate ${count} random words for a B1 French language learning game. They should come strictly in a pair in the format of "FrenchWord:EnglishWord". Provide this in a comma-separated list.`
                }
            ],
            temperature: 1,
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        // structure like
        // { french: 'Pomme', english: 'Apple' }
        const wordList = data.choices[0].message.content.split(',').map(pair => {
            const [french, english] = pair.trim().split(':');
            return { french, english };
        });
        // console.log(wordList);
        return wordList;
    }
    catch (error) {
        console.error('Error generating words:', error);
        return [
            { french: 'Pomme', english: 'Apple' },
            { french: 'École', english: 'School' },
            { french: 'Ami', english: 'Friend' },
            { french: 'Voiture', english: 'Car' },
            { french: 'Eau', english: 'Water' }
        ];
    }
}