const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });


const app = express();
const PORT = 3000;

// allow FE origins (localhost and 127.0.0.1 are different!)
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  })
);

// accept larger code payloads
app.use(express.json({ limit: "2mb" }));

// simple browser check
app.get("/health", (req, res) => res.json({ ok: true }));

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
              "You generate high-quality README.md files from source code.",
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
    res.json({ readme: response.data.choices?.[0]?.message?.content ?? "" });
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error:
        error.response?.data?.error?.message || error.message || "Server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
