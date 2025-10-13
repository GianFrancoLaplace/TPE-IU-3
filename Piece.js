// ========================================
// CLASE PIECE - Representa cada sub-imagen
// ========================================

class Piece {
    constructor(x, y, row, col, image) {
        this.x = x;                    // Posición X en el canvas
        this.y = y;                    // Posición Y en el canvas
        this.row = row;                // Fila en la grid
        this.col = col;                // Columna en la grid
        this.rotation = 0;             // Rotación actual (0, 90, 180, 270)
        this.correctRotation = 0;      // Rotación correcta
        this.image = image;            // Referencia a la imagen
        this.size = config.pieceSize;  // Tamaño de la pieza
        this.filter = 'none';          // Filtro aplicado
    }

    // Rotar la pieza hacia la izquierda
    rotateLeft() {
        this.rotation = (this.rotation - 90 + 360) % 360;
    }

    // Rotar la pieza hacia la derecha
    rotateRight() {
        this.rotation = (this.rotation + 90) % 360;
    }

    // Verificar si está en la posición correcta
    isCorrect() {
        return this.rotation === this.correctRotation;
    }

    // Dibujar la pieza en el canvas
    draw(ctx) {
        ctx.save();

        // Trasladar al centro de la pieza
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);

        // Aplicar rotación
        ctx.rotate((this.rotation * Math.PI) / 180);

        // Aplicar filtro según el nivel
        this.applyFilter(ctx);

        // Dibujar la sección de imagen correspondiente
        ctx.drawImage(
            this.image,
            this.col * this.size, // sx: posición X en la imagen fuente
            this.row * this.size, // sy: posición Y en la imagen fuente
            this.size,            // sWidth: ancho de la sección
            this.size,            // sHeight: alto de la sección
            -this.size / 2,       // dx: posición X en el canvas (centrado)
            -this.size / 2,       // dy: posición Y en el canvas (centrado)
            this.size,            // dWidth: ancho de destino
            this.size             // dHeight: alto de destino
        );

        ctx.restore();

        // Dibujar borde de la pieza
        this.drawBorder(ctx);
    }

    // Aplicar filtros según el nivel
    applyFilter(ctx) {
        switch(config.currentLevel) {
            case 1:
                // Nivel 1: Escala de grises
                ctx.filter = 'grayscale(100%)';
                break;
            case 2:
                // Nivel 2: Brillo 30%
                ctx.filter = 'brightness(0.3)';
                break;
            case 3:
                // Nivel 3: Negativo
                ctx.filter = 'invert(100%)';
                break;
            default:
                ctx.filter = 'none';
        }
    }

    // Dibujar borde de la pieza
    drawBorder(ctx) {
        ctx.save();
        ctx.strokeStyle = this.isCorrect() ? '#00ff00' : '#0f3460';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }

    // Verificar si un punto está dentro de la pieza
    containsPoint(x, y) {
        return x >= this.x &&
            x <= this.x + this.size &&
            y >= this.y &&
            y <= this.y + this.size;
    }
}