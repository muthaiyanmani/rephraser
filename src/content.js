
const DEBOUNCE_DELAY = 800;

let apiKey = '';

chrome.storage.local.get(["apiToken"], function (items) {
  apiKey = items?.apiToken;
});

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
  const inputValue = event.target.value;
  const resp = await processMessage(inputValue);
  const chatBubble = createChatBubble(resp);
  console.log(chatBubble);
  inputElement.insertAdjacentElement("afterend", chatBubble);
}

function processInputElements() {
  const textInputs = document.querySelectorAll('input[type="text"], textarea');

  textInputs.forEach((element) => {
    element.addEventListener("input", debounce(handleInputChange,DEBOUNCE_DELAY));
  });
}

async function processMessage(message='') {
  try {

    // TODO: Add error handling
    if (!apiKey) return;

    const apiUrl = 'https://api.openai.com/v1/completions';
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: `Please rephrase and correct the following sentence: "${message}"`,
        max_tokens: 50,
        model: 'text-davinci-003',
      }),
    });
    const data = await resp.json();
    return data.choices[0].text;
  }catch(error) {
    console.error(error);
  }
}

function createChatBubble(text) {
  const bubble = document.createElement('div');
  bubble.classList.add('chat-bubble');

  bubble.style.position = 'absolute';
  bubble.style.top = '0';
  bubble.style.right = '0';
  bubble.style.backgroundColor = 'red';
  bubble.style.color = 'white';
  bubble.style.padding = '12px';
  bubble.style.borderRadius = '5px';
  bubble.style.zIndex = '9999';
  const chat = bubble.appendChild(document.createElement('p'));
  chat.style.cursor = 'pointer';
  chat.textContent = text;
  return bubble;
}

processInputElements();