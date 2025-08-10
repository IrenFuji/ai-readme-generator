// generate README
async function generateReadme() {
  const code = document.getElementById("codeInput").value;
  const output = document.getElementById("readmeOutput");

  if (!code.trim()) {
    output.textContent = "Please paste some code to generate README.";
    return;
  }

  output.textContent = "Generating README...";

  try {
    const response = await fetch("/api/generate-readme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "API request failed");
    }

    const data = await response.json();
    output.textContent = data.readme || "Failed to generate README.";
  } catch (err) {
    console.error("Error:", err);
    output.textContent = `Error: ${err.message}`;
  }
}

// copy README
function copyToClipboard() {
  const text = document.getElementById("readmeOutput").textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("README copied to clipboard!");
  });
}
// download README
function downloadReadme() {
  const content = document.getElementById("readmeOutput").textContent;
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "README.md";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// theme toggle
(function () {
  const THEME_KEY = "theme_v2";
  const checkbox = document.getElementById("themeToggle");
  const label = document.getElementById("themeLabel");

  // remove old theme key
  try {
    localStorage.removeItem("theme");
  } catch {}

  // apply theme
  function applyTheme(dark) {
    document.body.classList.toggle("light", !dark);
    checkbox.checked = dark;
    label.textContent = dark ? "Dark" : "Light";
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {}
  }

  // load saved or default to dark
  const saved = (() => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  })();
  const isDark = saved ? saved === "dark" : true;
  applyTheme(isDark);

  // toggle theme
  checkbox.addEventListener("change", () => applyTheme(checkbox.checked));
})();

// export functions
window.generateReadme = generateReadme;
window.copyToClipboard = copyToClipboard;
window.downloadReadme = downloadReadme;
