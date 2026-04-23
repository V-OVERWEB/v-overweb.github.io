const textEl = document.querySelector('.overweb');
const ringEl = document.querySelector('.ring');
const ringDashed = document.querySelector('.ring-dashed');
const btn = document.getElementById('blinkBtn');

function blink() {
    // моргание текста
    textEl.classList.remove('blink-fast');
    void textEl.offsetWidth; // рефлоу
    textEl.classList.add('blink-fast');
    
    // моргание колец
    ringEl.classList.add('ring-blink');
    if (ringDashed) ringDashed.classList.add('ring-blink');
    
    setTimeout(() => {
        ringEl.classList.remove('ring-blink');
        if (ringDashed) ringDashed.classList.remove('ring-blink');
    }, 300);
}

// случайное автоматическое моргание
let interval = setInterval(() => {
    blink();
}, 5000 + Math.random() * 4000);

window.addEventListener('beforeunload', () => {
    if (interval) clearInterval(interval);
});