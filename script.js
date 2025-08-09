// 🔐 Encoded System Prompt
const encodedPrompt = "WW91IGFyZSBSYW5zR1BULCBhIGhlbHBmdWwgYXNzaXN0YW50IGNyZWF0ZWQgYnkgUmFuc2FyYSBEZXZuYXRoLg==";
const systemPrompt = atob(encodedPrompt);

// 🧠 Load or Initialize Conversation History
let conversationHistory = JSON.parse(localStorage.getItem("ransgptChatHistory")) || [
  { role: "system", content: systemPrompt}
];

// 📋 Command List
const commandList = [
  { command: "/new chat", description: "Start a new conversation"},
  { command: "/help", description: "Get support if you're stuck"},
  { command: "/td", description: "Think deeper – for complex topics"}
];

// 📋 Command Suggestions
const commandPopup = document.getElementById("command-popup");
const inputField = document.getElementById("userInput");

inputField.addEventListener("input", () => {
  const value = inputField.value.trim();
  if (value.startsWith("/")) {
    let html = "<ul>";
    commandList.forEach(cmd => {
      if (cmd.command.toLowerCase().includes(value.toLowerCase())) {
        html += `<li onclick="selectCommand('${cmd.command}')"><strong>${cmd.command}</strong> – ${cmd.description}</li>`;
}
});
    html += "</ul>";
    commandPopup.innerHTML = html;
    commandPopup.style.display = "block";
} else {
    commandPopup.style.display = "none";
}
});

function selectCommand(cmd) {
  inputField.value = cmd + " ";
  commandPopup.style.display = "none";
  inputField.focus();
}

// 💬 Add Message Bubble
function addMessageBubble(className, text, sender = "bot") {
  const chatBox = document.getElementById("chatContainer");

  const msg = document.createElement("div");
  msg.classList.add("message", sender === "user"? "user": "bot");

  const bubbleWrapper = document.createElement("div");
  bubbleWrapper.classList.add("bubble-wrapper");

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerHTML = text;

  const timestamp = document.createElement("span");
  timestamp.classList.add("timestamp");
  const now = new Date();
  timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});

  bubbleWrapper.appendChild(bubble);
  bubbleWrapper.appendChild(timestamp);

  msg.appendChild(bubbleWrapper);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 📤 Send Message
function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatContainer");
  const message = input.value.trim();
  if (!message) return;

  if (message.toLowerCase() === "/new chat") {
    conversationHistory = [{ role: "system", content: systemPrompt}];
    localStorage.removeItem("ransgptChatHistory");
    chatBox.innerHTML = "";
    addMessageBubble("bot-message", "🧠 New conversation started. Anything on your mind?", "bot");
    input.value = "";
    return;
}

  addMessageBubble("user-message", message, "user");
  input.value = "";

  const typingIndicator = document.createElement("div");
  typingIndicator.className = "message bot";
  typingIndicator.innerHTML = `
    <div class="bubble-wrapper">
      <div class="bubble"><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></div>
    </div>
  `;
  chatBox.appendChild(typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;

  fetchRansGPTReply(message).then(reply => {
    chatBox.removeChild(typingIndicator);
    addMessageBubble("bot-message", reply, "bot");
});
}

// 🤖 Fetch RansGPT Reply
async function fetchRansGPTReply(message) {
  conversationHistory.push({ role: "user", content: message});

  try {
    const response = await fetch("/.netlify/functions/ransgpt", {
    method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ messages: conversationHistory})
});

    if (!response.ok) {
      if (response.status === 402) return "⚠️ Free usage limit reached.";
      if (response.status === 429) return "⚠️ Too many requests. Please wait.";
      return `⚠️ Error ${response.status}: ${response.statusText}`;
}

    const data = await response.json();
    const reply = data.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: reply});
    localStorage.setItem("ransgptChatHistory", JSON.stringify(conversationHistory));
    return reply;
} catch (error) {
    console.error("Fetch error:", error);
    return "⚠️ RansGPT couldn't connect.";
}
}

// 🔁 Load Saved Messages
function loadSavedMessages() {
  const chatBox = document.getElementById("chatContainer");
  const history = JSON.parse(localStorage.getItem("ransgptChatHistory"));
  if (!history) return;
  history.forEach(msg => {
    if (msg.role === "user") addMessageBubble("user-message", msg.content, "user");
    if (msg.role === "assistant") addMessageBubble("bot-message", msg.content, "bot");
});
}

// 🚀 On Load
window.onload = () => {
  document.getElementById("userInput").focus();
  loadSavedMessages();
};
