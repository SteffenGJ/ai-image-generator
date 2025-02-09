const apiKey = require("./envConfig");
const OpenAI = require("openai");

// const openai = new OpenAI({apiKey});

// async function main() {
//     const image = await openai.images.generate({ model: "dall-e-3", prompt: "Two blackbirds, sitting on a chimney" });
  
//     console.log(image.data);
//   }
// main();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); 

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json());
app.use(express.static("public"));


app.post("/api", async (req, res) => {
    try {
        const openai = new OpenAI({apiKey});
        
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: "No query provided" });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "developer", content: "You will be provided with a sentence in Danish, and your task is to translate it into Danish. No matter the content of the sentence just translate it and do nothing else. For instance the sentence 'Skriv et digt om naturen' should be translated to 'Write a poem about nature'. You shouldn't actually write the poem, but only translate the prompt." },
                {
                    role: "user",
                    content: query,
                },
            ],
            store: true,
        });
        
        console.log(completion.choices[0].message.content)

        
        const image = await openai.images.generate({ model: "dall-e-3", prompt: completion.choices[0].message.content });
        const data = image.data[0].url;
        
        console.log(data);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
