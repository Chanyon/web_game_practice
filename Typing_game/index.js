const quotes = [
  'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
  'There is nothing more deceptive than an obvious fact.',
  'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
  'I never make exceptions. An exception disproves the rule.',
  'What one man can invent another can discover.',
  'Nothing clears up a case so much as stating it to another person.',
  'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

let words = [];
let wordsIndex = 0;
let startTime = 0;

const quoteEle = document.querySelector("#quote");
const message = document.querySelector("#message");
const typedValue = document.querySelector("#typed-value");
const start = document.querySelector("#start");

function random() {
  return Math.floor(Math.random() * quotes.length);
}
start.addEventListener("click", () => {
  let quoteIndex = random();
  let quote = quotes[quoteIndex];
  words = quote.split(' ');
  const spanWords = words.map(word => {
    return `<span>${word}</span>`;
  });
  quoteEle.innerHTML = spanWords.join(' ');
  quoteEle.children[0].className = "highlight";
  message.innerText = "";
  typedValue.value = "";
  typedValue.focus();
  startTime = new Date().getTime();
});

typedValue.addEventListener('input', (e) => {
  console.log(e.target);
  const currentWord = words[wordsIndex];
  const inputValue = e.target.value;
  if (inputValue === currentWord && wordsIndex === words.length - 1) {
    const elapsedTime = new Date().getTime() - startTime;
    const messageTime = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds.`;
    message.innerText = messageTime;
  } else if (currentWord === inputValue.trim() && inputValue.endsWith(" ")) {
    typedValue.value = "";
    wordsIndex += 1;
    for (const wordEle of quoteEle.children) {
      wordEle.className = "";
    }
    quoteEle.children[wordsIndex].className = "highlight";
  } else if (currentWord.startsWith(inputValue)) {
    e.target.className = "";
  } else {
    e.target.className = "error";
  }
});