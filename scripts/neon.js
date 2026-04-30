const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789!@#$%^&*()_+[]{};:<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01";
const charsArray = matrixChars.split('');
const nameSpans = document.querySelectorAll('.neon__name span');
function applyMatrixGlitch() {
    setInterval(() => {
        if (Math.random() > 0.5) {
            const randomSpan = nameSpans[Math.floor(Math.random() * nameSpans.length)];
            const originalText = randomSpan.innerText;
            const glitchChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            randomSpan.style.transition = '0.05s';
            randomSpan.innerText = glitchChar;
            setTimeout(() => {
                randomSpan.innerText = originalText;
            }, 70);
        }
        if (Math.random() > 0.92) {
            const title = document.querySelector('.neon__name');
            title.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                title.style.transform = '';
            }, 60);
        }
    }, 800);
}
applyMatrixGlitch()


const matrixRings = document.querySelectorAll('.matrix-ring');
const randomCodeStrings = [
    "01001101 01100001 01110100 01110010 01101001 01111000", 
    "FARAL ERROR || FARAL ERROR || FARAL ERROR || FARAL ERROR || FARAL ERROR", 
    ">_ SYSTEM ONLINE _< || >_ SYSTEM ONLINE _< || >_ SYSTEM ONLINE _<", 
    "01101001 01101110 01101001 01110100 00100000 01101101 01100001 01110100 01110010 01101001",
];

function updateRingCode() {
    matrixRings.forEach(ring => {
        if (Math.random() > 0.7) {
            let newCode = randomCodeStrings[Math.floor(Math.random() * randomCodeStrings.length)];
            if (Math.random() > 0.5) newCode += " " + Math.floor(Math.random() * 9999).toString(16);
            ring.setAttribute('data-code', newCode);
        }
    });
    setTimeout(updateRingCode, 2800 + Math.random() * 2000);
}
updateRingCode();
