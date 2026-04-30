const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submitBtn');
const formBlock = document.getElementById('contactsFormBlock');
const crtEffect = document.querySelector('.crt-turn-off');
const globalNotification = document.getElementById('globalNotification'); // ← НОВАЯ СТРОКА
const notificationText = document.querySelector('.notification-text'); // ← НОВАЯ СТРОКА
const notificationIcon = document.querySelector('.notification-icon'); // ← НОВАЯ СТРОКА

function showNotification(type, message) {
    globalNotification.className = 'global-notification ' + type;
    notificationText.textContent = message;
    globalNotification.classList.add('show');
}

function hideNotification() {
    globalNotification.classList.remove('show');
}

if (form) {
    form.removeAttribute('data-netlify');
    form.removeAttribute('netlify-honeypot');
}

async function handleSubmit(e) {
    e.preventDefault();
    
    if (submitBtn.disabled) {
        console.warn('⚠️ Отправка уже в процессе');
        return;
    }
    
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
            showNotification('success', 'Сигнал принят! Я выйду на связь.');
            
            crtEffect.classList.add('active');
            
            formBlock.classList.add('hidden-form');
            
            setTimeout(() => {
                crtEffect.classList.remove('active');
                formBlock.classList.remove('hidden-form');
                formBlock.classList.add('show-form');
                
                submitBtn.disabled = false;
                form.reset();
                
                setTimeout(() => {
                    hideNotification();
                }, 2000);
                
                setTimeout(() => {
                    formBlock.classList.remove('show-form');
                }, 600);
                
            }, 5000);
            
        } else {
            showNotification('error', 'Ошибка передачи: ' + (result.error || 'неизвестная ошибка'));
            submitBtn.disabled = false;
            
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

form.removeEventListener('submit', handleSubmit);
form.addEventListener('submit', handleSubmit);
