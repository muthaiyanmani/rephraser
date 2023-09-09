
const DEBOUNCE_DELAY = 500;

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

function handleInputChange(event) {
  const inputValue = event.target.value;
  processMessage(inputValue);
}

function processInputElements() {
  const textInputs = document.querySelectorAll('input[type="text"], textarea');

  textInputs.forEach((element) => {
    console.log(element);
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
    console.log(data);
  }catch(error) {
    console.error(error);
  }
}

processInputElements();