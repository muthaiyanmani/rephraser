const DEBOUNCE_DELAY = 800;

let apiKey = "";
const processedElements = new Set();

chrome.storage.local.get(["apiToken"], function (items) {apiKey = items?.apiToken});

function debounce(func, delay) {
  let timerId;
  return function () {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

async function handleInputChange(event) {
  const inputElement = event.target;
  const inputValue = event?.target?.value || event?.target?.innerText;

  if (inputValue) {
    const resp = await processMessage(inputValue);
    removeChatBubble();
    const chatBubble = createChatBubble(resp);
    inputElement.insertAdjacentElement("afterend", chatBubble);
  }
}

function handleMutation(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const textInputs = document.querySelectorAll('[data-purpose="zcslash"], input[type="text"], textarea');
      
      const filteredInputs = Array.from(textInputs).filter((element) => !processedElements.has(element));
      filteredInputs.forEach((element) => {
        processedElements.add(element);
        element.addEventListener("input",debounce(handleInputChange, DEBOUNCE_DELAY));
      });
    }
  }
}

async function processMessage(message = "") {
  try {
    // TODO: Add error handling
    if (!apiKey) return;

    const apiUrl = "https://api.openai.com/v1/completions";
    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: `Please rephrase and correct the following sentence: "${message}"`,
        max_tokens: 50,
        model: "text-davinci-003"
      })
    });
    const data = await resp.json();
    return data.choices[0].text;
  } catch (error) {
    console.error(error);
  }
}

function createChatBubble(text) {
  const bubble = document.createElement("div");
  bubble.setAttribute("data-name", "rephrase");
  bubble.classList.add("chat-bubble");

  bubble.style.position = "absolute";
  bubble.style.top = "0";
  bubble.style.right = "0";
  bubble.style.backgroundColor = "red";
  bubble.style.color = "white";
  bubble.style.padding = "8px";
  bubble.style.borderRadius = "5px";
  bubble.style.zIndex = "9999";
  bubble.style.fontSize = "11px";
  bubble.style.width = "10%";
  const chat = bubble.appendChild(document.createElement("p"));
  chat.style.cursor = "pointer";
  chat.textContent = text;
  return bubble;
}

const removeChatBubble = (event) => {
  const chatBubble = document.querySelector('[data-name="rephrase"]');
  if (chatBubble) {
    chatBubble.remove();
  }
};

// Start observing changes in the DOM
const observer = new MutationObserver(handleMutation);
observer.observe(document.body, { childList: true,subtree: true });
