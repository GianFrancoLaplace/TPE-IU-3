// ========================================
// CLASE GAME - Lógica principal del juego
// ========================================

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.pieces = [];
        this.currentImage = null;
        this.gameWon = false;

        this.initializeEventListeners();
    }

    // Inicializar event listeners
    initializeEventListeners() {

    }

    // Obtener pieza en una posición específica
    getPieceAtPosition(x, y) {
    }

    // Cargar imagen aleatoria del banco
    loadRandomImage() {

    }

    // Iniciar nivel
    async startLevel() {
    }

    // Crear las 4 piezas del rompecabezas
    createPieces() {
    }

    // Desordenar rotaciones de las piezas
    shufflePieces() {
    }

    // Verificar condición de victoria
    checkWinCondition() {
    }

    // Renderizar el juego
    render() {

    }

    // Mostrar pantalla de carga
    showLoading() {
    }

    // Mostrar pantalla de victoria
    showVictoryScreen() {
    }

    // Reiniciar juego
    resetGame() {
    }

    // Dentro de la clase Game, reemplaza esto:

    dibujarCirculo() {
        // Los círculos se dibujan con "paths" (caminos)

        // Círculo relleno
        this.ctx.beginPath();  // ⚠️ Usa this.ctx
        this.ctx.arc(150, 350, 80, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffd93d';
        this.ctx.fill(); // fondo

        // Círculo con borde
        this.ctx.beginPath();
        this.ctx.arc(400, 350, 80, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#6bcf7f';
        this.ctx.lineWidth = 5;
        this.ctx.stroke(); // borde
    }
}