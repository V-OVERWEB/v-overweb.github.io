const CHARS = 'KアZカQサEソFニHウJスUナMイTケLトXカWスYイRシNエBシIヌOソCノ0123456789';

function createColumn() {
    const col = document.createElement('div');
    col.className = 'column';
    
    const charCount = 15 + Math.floor(Math.random() * 15);
    for (let i = 0; i < charCount; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        span.style.opacity = Math.max(0.12, 0.6 - i * 0.02);
        col.appendChild(span);
    }
    
    return col;
}

function startColumnRain(column, delay = 0) {
    const duration = 1.7 + Math.random() * 1.3;
    
    function fallCycle() {
        column.style.transition = 'none';
        column.style.transform = `translateY(-50%)`;
        column.style.top = '-40%';
        
        const viewportWidth = window.innerWidth;
        const columnWidth = column.offsetWidth;
        const maxX = Math.max(0, viewportWidth - columnWidth);
        column.style.left = `${Math.random() * maxX}px`;
        
        void column.offsetHeight;
        
        column.style.transition = `transform ${duration}s linear`;
        column.style.transform = `translateY(150vh)`;
    }
    
    setTimeout(() => {
        fallCycle();
        setInterval(fallCycle, duration * 1000 + 100);
    }, delay);
}

function init() {
    const container = document.getElementById('rain-container');
    const count = window.innerWidth < 768 ? 15 : 40;
    
    for (let i = 0; i < count; i++) {
        const col = createColumn();
        container.appendChild(col);
        startColumnRain(col, Math.random() * 3000);
    }
}

init();