// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/generate-readme", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates high-quality README.md markdown files from given source code.",
          },
          {
            role: "user",
            content: `Generate a professional README.md file for the following code:\n\n${code}`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ readme: response.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: error.response?.data?.error?.message || "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
