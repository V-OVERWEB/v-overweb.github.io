// Минимальный JS: только перемещение колонок по вертикали
// Каждая колонка: телепорт наверх (без transition) -> падение вниз (с transition) -> повтор
const columns = document.querySelectorAll('.column');

// Функция для запуска бесконечного цикла у одной колонки
function startColumnRain(column, delay = 0) {
    // Случайная скорость падения от 1.2 до 2.5 секунд
    const duration = 1.7 + Math.random() * 1.3;
    
    function fallCycle() {
        // 1. Отключаем transition и телепортируем наверх
        column.style.transition = 'none';
        column.style.transform = 'translateY(-50%)';
        column.style.top = '-40%';
        
        // Форсируем перерисовку
        void column.offsetHeight;
        
        // 2. Включаем transition и падаем вниз
        column.style.transition = `transform ${duration}s linear`;
        column.style.transform = `translateY(150vh)`;
    }
    
    // Стартуем с задержкой, чтобы колонки падали не одновременно
    setTimeout(() => {
        fallCycle();
        // Повторяем каждые (duration + 0.1) секунд
        setInterval(fallCycle, duration * 1000 + 100);
    }, delay);
}

// Запускаем все 50 колонок с разными задержками
columns.forEach((col, idx) => {
    const randomDelay = Math.random() * 3000;
    startColumnRain(col, randomDelay);
});