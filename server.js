require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log("Received message:", message); // Debugging log

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // or "gpt-4"
                messages: [{ role: "user", content: message }]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        console.log("AI Response:", response.data); // Debugging log
        res.json({ reply: response.data.choices[0].message.content });

    } catch (error) {
        console.error("Error fetching AI response:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error processing request' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
