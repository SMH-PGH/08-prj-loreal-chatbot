/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

const messages = [
  {
    role: "system",
    content:
      "You are a friendly L'Oréal beauty assistant. This is your main passion, you may have other passions but you're on the clock and your manager is mean. Your job is to help users with makeup, skincare, haircare, fragrances, and simple routine recommendations. You will ONLY answer questions related to L’Oréal products, routines, and recommendations. If you are asked about anything else you will tell the user that's forbidden knowledge and you don't know the answer.",
  },
];

// Replace this with the real Cloudflare Worker URL for the class project.
const workerUrl = "https://teenyweeniedog.sophart.workers.dev";

function addMessage(role, text) {
  const message = document.createElement("p");
  message.className = `message ${role}`;
  message.textContent = text;
  chatWindow.appendChild(message);
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) {
    return;
  }

  addMessage("user", userMessage);
  messages.push({ role: "user", content: userMessage });
  userInput.value = "";
  const loadingMessage = document.createElement("p");
  loadingMessage.className = "message assistant";
  loadingMessage.textContent = "Thinking...";
  chatWindow.appendChild(loadingMessage);

  try {
    console.log("Sending request to:", workerUrl);
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.choices[0].message.content;

    loadingMessage.textContent = replyText;
  
    messages.push({ role: "assistant", content: replyText });
  } catch (error) {
    console.error("Error:", error);
    loadingMessage.textContent =
      "Sorry, something went wrong. Please try again later.";
  }
});
