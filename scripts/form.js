const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submitBtn');
const formBlock = document.getElementById('contactsFormBlock');
const crtEffect = document.querySelector('.crt-turn-off');
const globalNotification = document.getElementById('globalNotification'); // ← НОВАЯ СТРОКА
const notificationText = document.querySelector('.notification-text'); // ← НОВАЯ СТРОКА
const notificationIcon = document.querySelector('.notification-icon'); // ← НОВАЯ СТРОКА

// Функция показа глобального уведомления
function showNotification(type, message) {
    globalNotification.className = 'global-notification ' + type;
    notificationText.textContent = message;
    globalNotification.classList.add('show');
}

// Функция скрытия глобального уведомления
function hideNotification() {
    globalNotification.classList.remove('show');
}

// Убираем Netlify атрибуты
if (form) {
    form.removeAttribute('data-netlify');
    form.removeAttribute('netlify-honeypot');
}

// Функция обработки отправки
async function handleSubmit(e) {
    e.preventDefault();
    
    if (submitBtn.disabled) {
        console.warn('⚠️ Отправка уже в процессе');
        return;
    }
    
    // ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ ОБ ОТПРАВКЕ
    showNotification('loading', 'Отправка сигнала...');
    
    submitBtn.disabled = true;
    const formData = new FormData(form);
    
    try {
        const response = await fetch('https://proud-water-3282.v-overweb.workers.dev', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ ОБ УСПЕХЕ
            showNotification('success', 'Сигнал принят! Я выйду на связь.');
            
            // Запускаем эффект выключения телевизора
            crtEffect.classList.add('active');
            
            // Прячем форму
            formBlock.classList.add('hidden-form');
            
            // Ждём 5 секунд и возвращаем форму
            setTimeout(() => {
                crtEffect.classList.remove('active');
                formBlock.classList.remove('hidden-form');
                formBlock.classList.add('show-form');
                
                submitBtn.disabled = false;
                form.reset();
                
                // СКРЫВАЕМ УВЕДОМЛЕНИЕ ПОСЛЕ ПОЯВЛЕНИЯ ФОРМЫ
                setTimeout(() => {
                    hideNotification();
                }, 2000);
                
                setTimeout(() => {
                    formBlock.classList.remove('show-form');
                }, 600);
                
            }, 5000);
            
        } else {
            // ПОКАЗЫВАЕМ УВЕДОМЛЕНИЕ ОБ ОШИБКЕ
            showNotification('error', 'Ошибка передачи: ' + (result.error || 'неизвестная ошибка'));
            submitBtn.disabled = false;
            
            // Скрываем уведомление через 5 секунд
            setTimeout(() => {
                hideNotification();
            }, 5000);
        }
    } catch (error) {
        console.error('❌ Ошибка соединения:', error);
        showNotification('error', 'Разрыв соединения. Попробуйте позже.');
        submitBtn.disabled = false;
        
        setTimeout(() => {
            hideNotification();
        }, 5000);
    }
}

// Удаляем старый обработчик и вешаем новый
form.removeEventListener('submit', handleSubmit);
form.addEventListener('submit', handleSubmit);

// Закрытие уведомления по клику на крестик уже работает через onclick в HTML

console.log('🚀 Форма готова к работе');