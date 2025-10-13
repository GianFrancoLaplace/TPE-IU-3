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

    function dibujarCirculo(){
        // Los círculos se dibujan con "paths" (caminos)

        // Círculo relleno
        ctx.beginPath();  // Iniciar un nuevo camino
        ctx.arc(
            150,      // x: centro del círculo
            350,      // y: centro del círculo
            80,       // radio
            0,        // ángulo inicial (radianes)
            Math.PI * 2  // ángulo final (2π = círculo completo)
        );
        ctx.fillStyle = '#ffd93d';  // Amarillo
        ctx.fill();  // Rellenar el camino

        // Círculo solo con borde
        ctx.beginPath();
        ctx.arc(400, 350, 80, 0, Math.PI * 2);
        ctx.strokeStyle = '#6bcf7f';  // Verde
        ctx.lineWidth = 5;
        ctx.stroke();  // Dibujar solo el borde

        // Círculo con relleno Y borde
        ctx.beginPath();
        ctx.arc(650, 350, 80, 0, Math.PI * 2);
        ctx.fillStyle = '#c77dff';  // Púrpura
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    dibujarCirculo(){}
}