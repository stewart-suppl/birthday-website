// Логика карты и маркеров

let map;
let markers = {};
let polyline;

// Инициализация карты
function initMap() {
    map = L.map('map').setView(CONFIG.mapCenter, CONFIG.mapZoom);
    
    // Стильная карта с теплыми тонами
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Загрузить прогресс и создать маркеры
    loadProgress();
    createMarkers();
    updateProgress();
    drawPath();
}

// Создание маркеров-сердечек
function createMarkers() {
    CONFIG.locations.forEach(location => {
        const isUnlocked = location.unlocked;
        
        // Создать иконку сердечка
        const heartIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="heart-marker ${isUnlocked ? '' : 'locked'}">${isUnlocked ? '❤️' : '🤍'}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
        
        const marker = L.marker(location.coords, { icon: heartIcon }).addTo(map);
        
        // Popup с информацией
        if (isUnlocked) {
            marker.bindPopup(`
                <div style="text-align: center; padding: 10px;">
                    <strong style="color: #8B6F47; font-size: 1.1rem;">${location.name}</strong>
                    <p style="color: #C19A6B; margin-top: 10px;">Кликай на сердечко</p>
                </div>
            `);
            
            marker.on('click', () => {
                showLocationMessage(location);
            });
        } else {
            marker.bindPopup(`
                <div style="text-align: center; padding: 10px;">
                    <strong style="color: #C19A6B;">???</strong>
                    <p style="color: #C19A6B; margin-top: 10px;">Заблокировано 🔒</p>
                </div>
            `);
        }
        
        markers[location.id] = marker;
    });
}

// Показать сообщение локации
window.showLocationMessage = function(location) {
    const modal = document.getElementById('message-modal');
    const title = document.getElementById('message-title');
    const text = document.getElementById('message-text');
    const confettiContainer = document.getElementById('confetti');
    
    title.textContent = location.name;
    text.textContent = location.message;
    
    modal.classList.add('active');
    
    // Конфетти
    confettiContainer.innerHTML = '';
    if (typeof createConfetti === 'function') {
        createConfetti(confettiContainer);
    }
}

// Закрыть сообщение
window.closeMessage = function() {
    document.getElementById('message-modal').classList.remove('active');
}

// Нарисовать путь между открытыми точками
function drawPath() {
    // Удалить старый путь
    if (polyline) {
        map.removeLayer(polyline);
    }
    
    // Получить открытые локации в правильном порядке
    const unlockedLocations = CONFIG.locations
        .filter(loc => loc.unlocked)
        .sort((a, b) => a.order - b.order);
    
    if (unlockedLocations.length > 1) {
        const coords = unlockedLocations.map(loc => loc.coords);
        
        polyline = L.polyline(coords, {
            color: '#8C00FF',
            weight: 5,
            opacity: 1.0,
            dashArray: '10, 10',
            dashOffset: '0'
        }).addTo(map);
        
        // Анимация пунктирной линии
        animateDashArray();
    }
}

// Анимация пунктирной линии
function animateDashArray() {
    let offset = 0;
    setInterval(() => {
        if (polyline) {
            offset -= 1;
            polyline.setStyle({ dashOffset: offset });
        }
    }, 50);
}

// Обновить прогресс
function updateProgress() {
    const unlockedCount = CONFIG.locations.filter(loc => loc.unlocked).length;
    const totalCount = CONFIG.locations.length;
    
    document.getElementById('unlocked-count').textContent = unlockedCount;
    document.getElementById('total-count').textContent = totalCount;
    
    const percentage = (unlockedCount / totalCount) * 100;
    document.getElementById('progress-fill').style.width = percentage + '%';
    
    // Проверить, все ли открыто
    if (unlockedCount === totalCount) {
        setTimeout(showFinalPage, 1000);
    }
}

// Обновить маркер
function updateMarker(locationId) {
    const location = CONFIG.locations.find(loc => loc.id === locationId);
    if (!location) return;
    
    const marker = markers[locationId];
    
    // Обновить иконку
    const heartIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="heart-marker">❤️</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });
    
    marker.setIcon(heartIcon);
    
    // Обновить popup
    marker.unbindPopup();
    marker.bindPopup(`
        <div style="text-align: center; padding: 10px;">
            <strong style="color: #8B6F47; font-size: 1.1rem;">${location.name}</strong>
            <p style="color: #C19A6B; margin-top: 10px;">Нажми, чтобы прочитать сообщение</p>
        </div>
    `);
    
    marker.off('click');
    marker.on('click', () => {
        showLocationMessage(location);
    });
    
    // Анимация появления
    setTimeout(() => {
        marker.openPopup();
    }, 500);
}

// Сохранить прогресс
function saveProgress() {
    const progress = {
        locations: CONFIG.locations.map(loc => ({
            id: loc.id,
            unlocked: loc.unlocked
        }))
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// Загрузить прогресс
function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const progress = JSON.parse(saved);
        progress.locations.forEach(savedLoc => {
            const location = CONFIG.locations.find(loc => loc.id === savedLoc.id);
            if (location) {
                location.unlocked = savedLoc.unlocked;
            }
        });
    }
}

// Показать список сообщений
function showMessages() {
    const modal = document.getElementById('messages-modal');
    const list = document.getElementById('messages-list');
    
    list.innerHTML = '';
    
    const unlockedLocations = CONFIG.locations
        .filter(loc => loc.unlocked)
        .sort((a, b) => a.order - b.order);
    
    if (unlockedLocations.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: var(--warm-brown);">Пока нет открытых сообщений</p>';
    } else {
        unlockedLocations.forEach(location => {
            const item = document.createElement('div');
            item.className = 'message-item';
            item.innerHTML = `
                <h3>${location.name}</h3>
                <p>${location.message}</p>
            `;
            item.onclick = () => {
                closeMessages();
                showLocationMessage(location);
            };
            list.appendChild(item);
        });
    }
    
    modal.classList.add('active');
}

// Закрыть список сообщений
function closeMessages() {
    document.getElementById('messages-modal').classList.remove('active');
}
