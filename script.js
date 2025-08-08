// function for README.md file using OpenAI BE
async function generateReadme() {
  const code = document.getElementById("codeInput").value; // user input
  const output = document.getElementById("readmeOutput"); // output container

  // prevent empty submission
  if (!code.trim()) {
    output.textContent = "Please paste some code to generate README.";
    return;
  }

  output.textContent = "Generating README..."; // UI feedback while loading

  try {
    // send code to be which proxies OpenAI API
    const response = await fetch("http://localhost:3000/api/generate-readme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });