// 🍔 Toggle Hamburger Menu
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

// 📋 Copy to Clipboard
function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).value;
  navigator.clipboard.writeText(text)
.then(() => alert("✅ Copied to clipboard!"))
.catch(() => alert("❌ Failed to copy."));
}

// ⬇️ Download as.js File
function downloadAsFile(elementId, filename) {
  const content = document.getElementById(elementId).value;
  const blob = new Blob([content], { type: "text/javascript"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// 🔐 Real-Time JS Obfuscator
document.getElementById("jsInput").addEventListener("input", () => {
  const input = document.getElementById("jsInput").value;
  try {
    const encoded = btoa(input); // Base64 encoding
    document.getElementById("jsOutput").value = encoded;
} catch (err) {
    document.getElementById("jsOutput").value = "Encoding failed.";
}
});

// 🐞 Real-Time JS Error Detector
document.getElementById("errorInput").addEventListener("input", () => {
  const code = document.getElementById("errorInput").value;
  const output = document.getElementById("errorOutput");

  try {
    new Function(code); // Try compiling the code
    output.textContent = "✅ No syntax errors detected.";
    output.style.color = "#56d364"; // green
} catch (err) {
    output.textContent = `❌ Error: ${err.message}`;
    output.style.color = "#ff7b72"; // red
}
});

// 📱 IP Address Detector
function detectIP() {
  fetch("https://api.ipify.org?format=json")
.then(res => res.json())
.then(data => {
      document.getElementById("ipResult").textContent = `Your IP: ${data.ip}`;
})
.catch(() => {
      document.getElementById("ipResult").textContent = "Failed to detect IP.";
});
}

// 🔐 Password Generator
function generatePassword() {
  const length = parseInt(document.getElementById("passLength").value);
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
}
  document.getElementById("generatedPassword").value = password;
}

// 📦 File Size Calculator
document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const sizeKB = (file.size / 1024).toFixed(2);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    document.getElementById("fileSizeResult").textContent = `Size: ${sizeKB} KB (${sizeMB} MB)`;
} else {
    document.getElementById("fileSizeResult").textContent = "No file selected.";
}
});
