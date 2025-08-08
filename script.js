// function for README.md file using OpenAI BE
async function generateReadme() {
  const code = document.getElementById("codeInput").value; // user input
  const output = document.getElementById("readmeOutput"); // output container
  
  // prevent empty submission
  if (!code.trim()) {
    output.textContent = "Please paste some code to generate README.";
    return;
  }