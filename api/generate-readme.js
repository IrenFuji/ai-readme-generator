export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { code } = req.body || {};
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      }
    );

    if (!openaiRes.ok) {
      const err = await openaiRes.json().catch(() => ({}));
      return res
        .status(openaiRes.status)
        .json({ error: err.error?.message || "OpenAI error" });
    }

    const data = await openaiRes.json();
    return res
      .status(200)
      .json({ readme: data.choices?.[0]?.message?.content ?? "" });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}