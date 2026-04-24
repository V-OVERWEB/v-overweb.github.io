const canvas = document.getElementById('MatrixCanvas');
const ctx = canvas.getContext('2d');

const CHARSET = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}:<>?~";

function getRandomChar() {
    return CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
}

const DROP_WIDTH = 14;
const FONT_SIZE = 16;
const LINE_HEIGHT = 16;

let columns = 0;
let rainDrops = [];

let animationFrameId = null;
let lastTimestamp = 0;
const UPDATE_INTERVAL_MS = 30;

class RainStream {
    constructor(colIndex, xPos, startYOffset = null) {
        this.colIndex = colIndex;
        this.x = xPos;
        this.yPos = startYOffset !== null ? startYOffset : -Math.random() * canvas.height * 1.5;
        this.speed = 6.4 + Math.random() * 10.5;
        this.tailLength = Math.floor(12 + Math.random() * 20);
        this.symbols = [];
        this.brightness = 0.65 + Math.random() * 0.35;
        this.changeCounter = Math.floor(Math.random() * 8);
        
        for(let i = 0; i < this.tailLength; i++) {
            this.symbols.push(getRandomChar());
        }
    }
    
    update(globalFrameCounter) {
        this.yPos += this.speed;
        
        if (globalFrameCounter % 5 === 0 && this.tailLength > 1) {
            const mutationChance = 0.28;
            if (Math.random() < mutationChance) {
                const mutationsCount = Math.random() > 0.7 ? 2 : 1;
                for(let m = 0; m < mutationsCount; m++) {
                    const idxToChange = 1 + Math.floor(Math.random() * (this.tailLength - 1));
                    if (idxToChange < this.symbols.length) {
                        this.symbols[idxToChange] = getRandomChar();
                    }
                }
            }
        }
        
        if (globalFrameCounter % 12 === 0 && Math.random() < 0.15) {
            if(this.symbols.length > 0) {
                this.symbols[0] = getRandomChar();
            }
        }
        
        const headBottomPixel = this.yPos;
        const tailTopPixel = headBottomPixel - (this.tailLength - 1) * LINE_HEIGHT;
        if (tailTopPixel > canvas.height + 80 || headBottomPixel + 30 < -120) {
            this.reset();
        }
    }
    
    reset() {
        this.yPos = -Math.random() * canvas.height * 0.8 - 50;
        this.speed = 6.4 + Math.random() * 10.5;
        const newLength = Math.floor(7 + Math.random() * 24);
        this.tailLength = newLength;
        this.brightness = 0.6 + Math.random() * 0.4;
        this.symbols = [];
        for(let i = 0; i < this.tailLength; i++) {
            this.symbols.push(getRandomChar());
        }
        this.changeCounter = 0;
    }
    
    draw(ctx, globalAlpha = 1.0) {
        if (this.tailLength === 0 || this.symbols.length === 0) return;
        
        const headY = this.yPos;
        
        for (let i = 0; i < this.symbols.length; i++) {
            const charIndex = i;
            const charY = headY - (charIndex * LINE_HEIGHT);

            if (charY + FONT_SIZE < 0 || charY > canvas.height + 80) continue;

            let colorR, colorG, colorB;

            if (charIndex === 0) {
                colorR = 240;
                colorG = 255;
                colorB = 210;
            } else {
                const fadeFactor = 1 - (charIndex / this.tailLength);
                let intensity = Math.pow(fadeFactor, 1.5);
                intensity = Math.max(0.08, Math.min(0.85, intensity));
                intensity = intensity * this.brightness;

                const greenVal = Math.floor(30 + intensity * 200);
                colorR = 5;
                colorG = greenVal;
                colorB = 5 + Math.floor(intensity * 30);
            }

            if (charIndex > 0 && Math.random() < 0.02) {
                colorG = Math.min(200, colorG + 40);
            }

            ctx.font = `500 ${FONT_SIZE}px "Courier New", "Fira Code", monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillStyle = `rgb(${colorR}, ${colorG}, ${colorB})`;
            ctx.fillText(this.symbols[charIndex], this.x, charY);
        }
    }
}

function initRainColumns() {
    const approxCharWidth = FONT_SIZE * 0.65;
    columns = Math.floor(canvas.width / DROP_WIDTH) + 2;
    
    const newDrops = [];
    for (let col = 0; col < columns; col++) {
        let xPos = col * DROP_WIDTH + (DROP_WIDTH / 2);
        xPos = Math.min(canvas.width - 8, Math.max(8, xPos));
        
        const startY = -Math.random() * canvas.height;
        const stream = new RainStream(col, xPos, startY);
        newDrops.push(stream);
    }
    rainDrops = newDrops;
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    initRainColumns();
    
    ctx.imageSmoothingEnabled = false;
    ctx.font = `500 ${FONT_SIZE}px "Courier New", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
}

let globalFrame = 0;

function drawRain(currentFrame) {
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let stream of rainDrops) {
        stream.update(globalFrame);
    }
    
    for (let stream of rainDrops) {
        stream.draw(ctx);
    }
    
    globalFrame++;
}

let lastRenderTime = 0;

function animationLoop(timestamp) {
    if (!lastRenderTime) {
        lastRenderTime = timestamp;
        requestAnimationFrame(animationLoop);
        return;
    }
    
    const delta = timestamp - lastRenderTime;
    if (delta >= UPDATE_INTERVAL_MS) {
        drawRain(globalFrame);
        lastRenderTime = timestamp;
    }
    
    requestAnimationFrame(animationLoop);
}

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
    }, 100);
});

function startMatrixRain() {
    resizeCanvas();
    globalFrame = 0;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    lastRenderTime = 0;
    requestAnimationFrame(animationLoop);
}

startMatrixRain();

canvas.addEventListener('click', (e) => {
    for(let i = 0; i < 5; i++) {
        if(rainDrops.length > i) {
            const stream = rainDrops[Math.floor(Math.random() * rainDrops.length)];
            if(stream && stream.symbols.length) {
                stream.symbols[0] = getRandomChar();
                const idx2 = 1 + Math.floor(Math.random() * (stream.tailLength-1));
                if(idx2 < stream.symbols.length) stream.symbols[idx2] = getRandomChar();
            }
        }
    }
    ctx.fillStyle = "rgba(100, 255, 100, 0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setTimeout(() => {}, 30);
});

window.addEventListener('load', () => {
    resizeCanvas();
    startMatrixRain();
});