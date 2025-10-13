// ========================================
// CONFIGURACIÓN DEL JUEGO
// ========================================

const config = {
    canvasSize: 600,      // Tamaño del canvas
    gridSize: 2,          // 2x2 = 4 piezas
    pieceSize: 300,       // 600 / 2 = 300px por pieza
    currentLevel: 1,
    maxLevels: 3,
    timerRunning: false,
    startTime: 0,
    elapsedTime: 0
};

// Banco de imágenes (mínimo 6 según requisitos)
const imageBank = [
    'https://picsum.photos/600/600?random=1',
    'https://picsum.photos/600/600?random=2',
    'https://picsum.photos/600/600?random=3',
    'https://picsum.photos/600/600?random=4',
    'https://picsum.photos/600/600?random=5',
    'https://picsum.photos/600/600?random=6'
];

// ========================================
// INICIALIZAR EL JUEGO
// ========================================

let game;

window.addEventListener('load', () => {
    game = new Game('gameCanvas');
    game.dibujarCirculo();
});