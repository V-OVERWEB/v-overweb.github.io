// Минимальный JS: перемещение колонок по вертикали + случайная X-позиция при каждом цикле
const columns = document.querySelectorAll('.column');

function startColumnRain(column, delay = 0) {
    // Случайная скорость падения от 1.2 до 2.5 секунд
    const duration = 1.7 + Math.random() * 1.3;
    
    function fallCycle() {
        // 1. Отключаем transition и телепортируем наверх
        column.style.transition = 'none';
        column.style.transform = `translateY(-50%)`;
        column.style.top = '-40%';
        
        // 2. Меняем X-позицию в пределах вьюпорта
        const viewportWidth = window.innerWidth;
        const columnWidth = column.offsetWidth;
        const maxX = viewportWidth - columnWidth;
        const randomX = Math.random() * maxX;
        column.style.left = `${randomX}px`;
        
        // Форсируем перерисовку
        void column.offsetHeight;
        
        // 3. Включаем transition и падаем вниз (X при этом остаётся фиксированным)
        column.style.transition = `transform ${duration}s linear`;
        column.style.transform = `translateY(150vh)`;
    }
    
    // Стартуем с задержкой
    setTimeout(() => {
        fallCycle();
        // Повторяем каждый цикл
        setInterval(fallCycle, duration * 1000 + 100);
    }, delay);
}

// Запускаем все колонки с разными задержками
columns.forEach((col, idx) => {
    const randomDelay = Math.random() * 3000;
    startColumnRain(col, randomDelay);
});