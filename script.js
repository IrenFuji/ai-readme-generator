// function for README.md file using OpenAI BE
async function generateReadme() {
  const code = document.getElementById("codeInput").value; // user input
  const output = document.getElementById("readmeOutput"); // output container

  // prevent empty submission
  if (!code.trim()) {
    output.textContent = "Please paste some code to generate README.";
    return;
  }

  output.textContent = "Generating README..."; // ui feedback while loading

  try {
    // send code to be which proxies OpenAI API
    const response = await fetch("http://localhost:3000/api/generate-readme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    // handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "API request failed");
    }

    // parse and display generated README
    const data = await response.json();
    const readme = data.readme || "Failed to generate README.";
    output.textContent = readme;
  } catch (error) {
    // Log error and inform user
    console.error("Error:", error);
    output.textContent = `Error: ${error.message}`;
  }
}

// Copies the generated README content to clipboard
function copyToClipboard() {
  const text = document.getElementById("readmeOutput").textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("README copied to clipboard!");
  });
}

// Downloads the generated README content as a .md file
function downloadReadme() {
  const content = document.getElementById("readmeOutput").textContent;
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "README.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// light/dark toggle
(function () {
  const checkbox = document.getElementById("themeToggle");
  const label = document.getElementById("themeLabel");

  // initialize from localStorage or system preference
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = stored ? stored === "dark" : prefersDark;

  document.body.classList.toggle("light", !isDark);
  checkbox.checked = isDark;
  label.textContent = isDark ? "Dark" : "Light";

  // toggle on change with smooth label fade
  checkbox.addEventListener("change", () => {
    const dark = checkbox.checked;

    // theme swap
    document.body.classList.toggle("light", !dark);
    localStorage.setItem("theme", dark ? "dark" : "light");

    // label for fade animation
    label.classList.remove("fade-in", "fade-out");
    label.classList.add("fade-out");

    setTimeout(() => {
      label.textContent = dark ? "Dark" : "Light";
      label.classList.remove("fade-out");
      label.classList.add("fade-in");
    }, 200);
  });
})();
