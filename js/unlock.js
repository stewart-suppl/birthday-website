// Логика разблокировки локаций

// Глобальные функции должны быть доступны сразу
window.startAdventure = function() {
    document.getElementById('welcome-page').classList.remove('active');
    document.getElementById('map-page').classList.add('active');
    
    // Инициализировать карту после появления
    setTimeout(() => {
        if (typeof initMap === 'function') {
            initMap();
        }
    }, 100);
}

// Показать форму ввода кода
function showUnlockForm() {
    const modal = document.getElementById('unlock-modal');
    const input = document.getElementById('secret-code');
    const error = document.getElementById('error-message');
    
    input.value = '';
    error.textContent = '';
    
    modal.classList.add('active');
    setTimeout(() => input.focus(), 300);
}

// Закрыть форму ввода кода
function closeUnlockForm() {
    document.getElementById('unlock-modal').classList.remove('active');
}

// Разблокировать локацию
function unlockLocation() {
    const input = document.getElementById('secret-code');
    const code = input.value.trim().toUpperCase();
    const error = document.getElementById('error-message');
    
    if (!code) {
        error.textContent = 'Введи код!';
        shakeElement(input);
        return;
    }
    
    // Найти локацию по коду
    const location = CONFIG.locations.find(loc => 
        loc.code.toUpperCase() === code && !loc.unlocked
    );
    
    if (location) {
        // Успешная разблокировка!
        location.unlocked = true;
        
        // Сохранить прогресс
        saveProgress();
        
        // Закрыть модальное окно
        closeUnlockForm();
        
        // Обновить маркер
        updateMarker(location.id);
        
        // Обновить путь и прогресс
        drawPath();
        updateProgress();
        
        // Показать сообщение с задержкой
        setTimeout(() => {
            showLocationMessage(location);
        }, 800);
        
    } else {
        // Проверить, может код уже использован
        const alreadyUnlocked = CONFIG.locations.find(loc => 
            loc.code.toUpperCase() === code && loc.unlocked
        );
        
        if (alreadyUnlocked) {
            error.textContent = 'Эта локация уже открыта! 😊';
        } else {
            error.textContent = 'Неверный код. Попробуй ещё раз! 💔';
        }
        
        shakeElement(input);
        input.value = '';
        
        setTimeout(() => {
            error.textContent = '';
        }, 3000);
    }
}

// Enter для отправки
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('secret-code');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                unlockLocation();
            }
        });
    }
});

// Показать финальную страницу
function showFinalPage() {
    document.getElementById('map-page').classList.remove('active');
    document.getElementById('final-page').classList.add('active');
    
    document.getElementById('final-message').textContent = CONFIG.finalMessage;
    
    // Запустить конфетти
    createBigConfetti();
}

// Вернуться к карте
function backToMap() {
    document.getElementById('final-page').classList.remove('active');
    document.getElementById('map-page').classList.add('active');
}

// Закрытие модальных окон по клику вне контента
document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});
