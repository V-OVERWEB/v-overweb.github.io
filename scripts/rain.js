const screen = document.getElementById('Matrix');
const brush = screen.getContext('2d');

screen.width = window.innerWidth;
screen.height = document.body.scrollHeight;

const symbolsSet = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const charSize = 14;
// Уменьшаем ширину колонки для большего количества линий
const colWidth = charSize * 1.8; // ← линии будут чаще
const totalCols = screen.width / colWidth;

const dropsPosition = new Array(Math.floor(totalCols));
for (let i = 0; i < dropsPosition.length; i++) {
    // Каждая колонка начинает с разной позиции
    dropsPosition[i] = Math.random() * -screen.height / charSize;
}

// Дополнительные параметры для увеличения плотности
const extraLines = 2; // Количество дополнительных слоев дождя
const extraDrops = [];

// Создаем дополнительные линии с разной скоростью
for (let i = 0; i < extraLines; i++) {
    extraDrops.push({
        positions: new Array(Math.floor(totalCols)),
        speed: 0.8 + (i * 0.2), // Разная скорость для каждого слоя
        opacity: 0.3 + (i * 0.2)  // Разная прозрачность для глубины
    });
    
    for (let j = 0; j < extraDrops[i].positions.length; j++) {
        extraDrops[i].positions[j] = Math.random() * -screen.height / charSize;
    }
}

function animateRain() {
    // Основной слой (самый яркий)
    brush.fillStyle = 'rgba(0, 0, 0, 0.01)';
    brush.fillRect(0, 0, screen.width, screen.height);
    
    // Рисуем все слои дождя
    for (let layer = 0; layer < extraDrops.length; layer++) {
        const currentLayer = extraDrops[layer];
        
        // Устанавливаем прозрачность для слоя
        brush.fillStyle = `rgba(0, 255, 0, ${currentLayer.opacity})`;
        brush.font = `${charSize}px monospace`;
        
        for (let col = 0; col < currentLayer.positions.length; col++) {
            const randomSymbol = symbolsSet[Math.floor(Math.random() * symbolsSet.length)];
            const yPos = currentLayer.positions[col] * charSize;
            
            if (yPos >= 0 && yPos <= screen.height) {
                brush.fillText(randomSymbol, col * colWidth, yPos);
            }
            
            const shouldReset = currentLayer.positions[col] * charSize > screen.height + charSize;
            
            if (shouldReset) {
                currentLayer.positions[col] = Math.random() * -screen.height / charSize;
            } else {
                currentLayer.positions[col] += currentLayer.speed;
            }
        }
    }
    
    // Основной слой (передний план) - самый яркий и быстрый
    brush.fillStyle = '#0F0';
    brush.font = `${charSize}px monospace`;
    
    for (let col = 0; col < dropsPosition.length; col++) {
        const randomSymbol = symbolsSet[Math.floor(Math.random() * symbolsSet.length)];
        const yPos = dropsPosition[col] * charSize;
        
        if (yPos >= 0 && yPos <= screen.height) {
            brush.fillText(randomSymbol, col * colWidth, yPos);
        }
        
        const shouldReset = dropsPosition[col] * charSize > screen.height + charSize;
        
        if (shouldReset) {
            dropsPosition[col] = Math.random() * -screen.height / charSize;
        } else {
            dropsPosition[col] += 1.2; // Основной слой быстрее
        }
    }
}

setInterval(animateRain, 35);