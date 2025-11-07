// Анимации и эффекты

// Создание анимированных частиц на фоне
function createBackgroundParticles() {
    const container = document.getElementById('particles');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        container.appendChild(particle);
    }
}

// Создание конфетти
function createConfetti(container) {
    const colors = ['#D4AF37', '#C19A6B', '#FFE4B5', '#F5E6D3'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        // Случайная форма
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        container.appendChild(confetti);
        
        // Удаление после анимации
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Создание большого конфетти для финальной страницы
function createBigConfetti() {
    const container = document.getElementById('big-confetti');
    if (!container) return;
    
    const colors = ['#D4AF37', '#C19A6B', '#FFE4B5', '#F5E6D3', '#8B6F47'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 8 + 5) + 'px';
        confetti.style.height = (Math.random() * 8 + 5) + 'px';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        container.appendChild(confetti);
    }
    
    // Продолжать создавать конфетти
    setTimeout(createBigConfetti, 3000);
}

// Анимация появления элементов
function animateElement(element, animation = 'fadeIn') {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = `${animation} 0.5s ease`;
    }, 10);
}

// Вибрация при ошибке
function shakeElement(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'shake 0.5s ease';
    }, 10);
}

// Добавить стиль для shake анимации
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// Инициализация анимаций при загрузке
document.addEventListener('DOMContentLoaded', () => {
    createBackgroundParticles();
});
