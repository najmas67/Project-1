const facts = [
  'Badtz-Maru was born on April 1, making him an April Fool with perfect mischievous energy.',
  'His full name is Badtz-Maru, and he is a little penguin from Sakhalin Island.',
  'Badtz-Maru often says he wants to be the coolest penguin around.',
  'He has a best friend named Hana-Maru and a favorite pastime of playing baseball.',
  'He sometimes uses a small shark character named Mr. G to help show his attitude.'
];

const button = document.getElementById('surpriseButton');
const factText = document.getElementById('factText');

if (button && factText) {
  button.addEventListener('click', () => {
    const random = facts[Math.floor(Math.random() * facts.length)];
    factText.textContent = random;
  });
}
