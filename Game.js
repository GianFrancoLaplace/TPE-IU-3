// ===== ELEMENTOS DEL DOM =====
const canvas = document.querySelector('#game-canvas');
const context = canvas.getContext('2d');
const startBtn = document.getElementById('start-button');
const resetBtn = document.getElementById('reset-button');
const menuBtn = document.getElementById('menu-button');
const welcomeScreen = document.getElementById('welcome-screen');
const gameContent = document.getElementById('game-content');

// ===== CONSTANTES DEL JUEGO =====
const BLOCKA_SIZE = 300;
const INFO_HEIGHT = 60;
const GAME_OFFSET_Y = INFO_HEIGHT;
const hashMap = new Map();

hashMap.set(4, {x: 2, y: 2});
hashMap.set(6, {x: 3, y: 2});
hashMap.set(8, {x: 4, y: 2});

// ===== IMÁGENES Y CONFIGURACIÓN =====
const images = [
    "images/ocarinaoftime.jpeg",
    "images/Peg hawaiano 1.png",
    "images/PORTAL 2.jpeg",
    "images/RED DEAD 2.jpeg",
    "images/STREET FIGHTER 6.jpeg",
    "images/THE WITCHER 3.jpeg",
    "images/VALORANT.jpeg",
    "images/WARZONE.jpeg"
];

let nivel = 0;
let gameWon = false;
let juegoActivo = false;
let pieces = [];
let tileCount = 4;
let imagenSeleccionada = null; // Guardar qué imagen eligió la ruleta

// ===== TEMPORIZADOR =====
let tiempoInicio = 0;
let tiempoActual = 0;
let timerInterval = null;

// ===== THUMBNAILS =====
async function ejecutarRuleta() {
    const y = canvas.height - 50;
    const x = canvas.width / images.length;
    const thumbnails = [];

    // Crear thumbnails
    for (let i = 0; i < images.length; i++) {
        const imagen = new Image();
        imagen.src = images[i];

        // Esperar a que cargue la imagen
        await new Promise(resolve => {
            imagen.onload = resolve;
        });

        const thumbnail = {
            imagen: imagen,
            x: x * i,
            y: y,
            width: 30,
            height: 30,
            isSelected: false,
            borderColor: "#4CAF50",
            borderWidth: 4
        };
        thumbnails.push(thumbnail);
    }

    // Limpiar canvas para la ruleta
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Texto de inicio
    context.fillStyle = "#333";
    context.font = "bold 20px 'Helvetica Neue'";
    context.textAlign = "center";
    context.fillText("Seleccionando imagen...", canvas.width / 2, canvas.height / 2 - 40);

    // Dibujar todos los thumbnails inicialmente
    thumbnails.forEach(thumb => dibujarThumbnail(thumb));

    // Animación de la ruleta
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const cantVueltas = 3
    let indiceGanador;
    // Pasada rápida
    for (let vuelta = 0; vuelta < cantVueltas; vuelta++) {
        let fin;
        if (vuelta === cantVueltas - 1) { // ultima vuelta es random
            fin = Math.floor(Math.random() * thumbnails.length);
            indiceGanador = fin - 1;
        } else {
            fin = thumbnails.length;
        }

        for (let i = 0; i < fin; i++) {
            thumbnails.forEach(t => t.isSelected = false);
            thumbnails[i].isSelected = true;

            // Re-dibujar todos
            context.clearRect(0, y - 5, canvas.width, 40);
            thumbnails.forEach(thumb => dibujarThumbnail(thumb));

            await sleep(200);
        }
    }

    // Guardar la imagen seleccionada
    imagenSeleccionada = images[indiceGanador];

    // Mostrar resultado
    context.fillStyle = "#4CAF50";
    context.font = "bold 24px 'Helvetica Neue'";
    context.fillText("¡Imagen seleccionada!", canvas.width / 2, canvas.height / 2 + 20);

    await sleep(1500);

    return imagenSeleccionada;
}

function dibujarThumbnail(thumbnailData) {
    context.drawImage(
        thumbnailData.imagen,
        thumbnailData.x,
        thumbnailData.y,
        thumbnailData.width,
        thumbnailData.height
    );

    if (thumbnailData.isSelected) {
        context.strokeStyle = thumbnailData.borderColor;
        context.lineWidth = thumbnailData.borderWidth;
        context.strokeRect(
            thumbnailData.x - 2,
            thumbnailData.y - 2,
            thumbnailData.width + 4,
            thumbnailData.height + 4
        );
    }
}

// ===== DIBUJAR JUEGO (SIN RULETA) =====
function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawInfo();
    drawPieces();

    if (!gameWon) {
        filtro();
    }
}

// ===== DIBUJAR PIEZAS =====
function drawPieces() {
    const horizontal = hashMap.get(tileCount).x;
    const vertical = hashMap.get(tileCount).y;
    const parteWidth = BLOCKA_SIZE / horizontal;
    const parteHeight = BLOCKA_SIZE / vertical;

    pieces.forEach(piece => {
        context.save();
        context.translate(piece.dx + parteWidth/2, piece.dy + parteHeight/2);
        context.rotate(piece.rotation);
        context.drawImage(
            image,
            piece.sx, piece.sy, parteWidth, parteHeight,
            -parteWidth/2, -parteHeight/2, parteWidth, parteHeight
        );
        context.restore();
    });
}

// ===== TEMPORIZADOR =====
function iniciarTemporizador() {
    tiempoInicio = Date.now();
    tiempoActual = 0;

    timerInterval = setInterval(() => {
        if (!gameWon) {
            tiempoActual = Math.floor((Date.now() - tiempoInicio) / 1000);
            drawInfo();
        }
    }, 1000);
}

function detenerTemporizador() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
}

// ===== DIBUJAR ÁREA DE INFORMACIÓN =====
function drawInfo() {
    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, BLOCKA_SIZE, INFO_HEIGHT);

    context.strokeStyle = "#333";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, INFO_HEIGHT);
    context.lineTo(BLOCKA_SIZE, INFO_HEIGHT);
    context.stroke();

    context.fillStyle = "#333";
    context.font = "bold 18px 'Helvetica Neue'";
    context.textAlign = "left";

    context.fillText("Tiempo:", 15, 30);
    context.fillStyle = "#007bff";
    context.fillText(formatearTiempo(tiempoActual), 15, 50);

    context.fillStyle = "#333";
    context.textAlign = "right";
    context.fillText("Nivel:", BLOCKA_SIZE - 15, 30);
    context.fillStyle = "#28a745";
    context.fillText((nivel + 1).toString(), BLOCKA_SIZE - 15, 50);
}

function clearInfo() {
    context.fillRect(0, 0, BLOCKA_SIZE, INFO_HEIGHT);
}

// ===== MOSTRAR/OCULTAR PANTALLAS =====
function mostrarBienvenida() {
    welcomeScreen.classList.remove('hidden');
    gameContent.classList.remove('active');
    juegoActivo = false;
}

function mostrarJuego() {
    welcomeScreen.classList.add('hidden');
    gameContent.classList.add('active');
}

// ===== EVENT LISTENERS =====

startBtn.addEventListener('click', async () => {
    mostrarJuego();

    // 1. Ejecutar ruleta (SOLO UNA VEZ)
    await ejecutarRuleta();

    // 2. Iniciar el juego con la imagen seleccionada
    image.src = imagenSeleccionada;
    image.onload = function() {
        initializePuzzle();
        iniciarTemporizador(); // ← Iniciar temporizador DESPUÉS de la ruleta
    };
});

menuBtn.addEventListener('click', () => {
    detenerTemporizador();
    mostrarBienvenida();
    nivel = 0;
});

resetBtn.addEventListener('click', initializePuzzle);

canvas.addEventListener('mousedown', onCanvasClick);

// ===== IMAGEN INICIAL =====
const image = new Image();

function startLevel() {
    if (nivel >= images.length) {
        detenerTemporizador();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.font = "bold 30px 'Helvetica Neue'";
        context.textAlign = "center";
        context.fillText("¡Juego Completado!", canvas.width / 2, canvas.height / 2);
        nivel = 0;
        setTimeout(() => {
            startLevel();
        }, 2000);
        return;
    }

    // Usar imagen aleatoria o la seleccionada por la ruleta
    const imagenParaCargar = imagenSeleccionada || images[Math.floor(Math.random() * images.length)];
    image.src = imagenParaCargar;
    image.onload = function() {
        initializePuzzle();
        juegoActivo = true;
    };
}

function initializePuzzle() {
    gameWon = false;
    pieces = [];
    juegoActivo = true;

    detenerTemporizador();
    iniciarTemporizador();

    const horizontal = hashMap.get(tileCount).x;
    const vertical = hashMap.get(tileCount).y;
    const parteWidth = BLOCKA_SIZE / horizontal;
    const parteHeight = BLOCKA_SIZE / vertical;
    const rotaciones = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];

    for (let x = 0; x < horizontal; x++) {
        for (let y = 0; y < vertical; y++) {
            const piece = {
                sx: x * parteWidth,
                sy: y * parteHeight,
                dx: x * parteWidth,
                dy: y * parteHeight + GAME_OFFSET_Y,
                rotation: rotaciones[Math.floor(Math.random() * rotaciones.length)],
            };
            pieces.push(piece);
        }
    }

    drawGame();
}

async function onCanvasClick(event) {
    if (!juegoActivo || gameWon) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const horizontal = hashMap.get(tileCount).x;
    const vertical = hashMap.get(tileCount).y;
    const tileW = BLOCKA_SIZE / horizontal;
    const tileH = BLOCKA_SIZE / vertical;

    const clickedPiece = pieces.find(piece =>
        x >= piece.dx && x < piece.dx + tileW &&
        y >= piece.dy && y < piece.dy + tileH
    );

    if (clickedPiece) {
        clickedPiece.rotation += Math.PI / 2;
        drawGame();
        await checkWinCondition();
    }
}

async function checkWinCondition() {
    const isSolved = pieces.every(p => (p.rotation % (2 * Math.PI)).toFixed(4) == 0.0000);

    if (isSolved) {
        gameWon = true;
        detenerTemporizador();

        setTimeout(async () => {
            drawGame();

            context.fillStyle = "rgba(0, 0, 0, 0.6)";
            context.fillRect(0, GAME_OFFSET_Y, BLOCKA_SIZE, BLOCKA_SIZE);
            context.fillStyle = "white";
            context.font = "bold 40px 'Helvetica Neue'";
            context.textAlign = "center";
            context.fillText("¡Ganaste!", BLOCKA_SIZE / 2, canvas.height / 2);
            context.fillText("avanzando...", BLOCKA_SIZE / 2, canvas.height / 2 + 40);

            nivel++;

            clearInfo();
            setTimeout( async () => {
                await ejecutarRuleta
                // clearRuleta ??
            }, 2000);

            setTimeout(startLevel, 2000);
        }, 100);
    }
}

function filtro() {
    const imageData = context.getImageData(0, GAME_OFFSET_Y, BLOCKA_SIZE, BLOCKA_SIZE);

    for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {
            setPixel(imageData, x, y);
        }
    }

    context.putImageData(imageData, 0, GAME_OFFSET_Y);
}

function setPixel(imageData, x, y) {
    const index = (x + y * imageData.width) * 4;
    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];
    const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);

    switch (nivel) {
        case 0:
            imageData.data[index] = gray;
            imageData.data[index+1] = gray;
            imageData.data[index+2] = gray;
            break;
        case 1:
            imageData.data[index] = imageData.data[index]+50;
            imageData.data[index+1] = imageData.data[index+1]+50;
            imageData.data[index+2] = imageData.data[index+2]+50;
            break;
        case 2:
            imageData.data[index] = 255-imageData.data[index];
            imageData.data[index+1] = 255-imageData.data[index+1];
            imageData.data[index+2] = 255-imageData.data[index+2];
            break;
        case 3:
            imageData.data[index] = imageData.data[index]+50;
            imageData.data[index+1] = imageData.data[index+1]+50;
            imageData.data[index+2] = imageData.data[index+2]+50;
            break;
        case 4:
            imageData.data[index] = gray;
            imageData.data[index+1] = gray;
            imageData.data[index+2] = gray;
            break;
        case 5:
            imageData.data[index] = 255-imageData.data[index];
            imageData.data[index+1] = 255-imageData.data[index+1];
            imageData.data[index+2] = 255-imageData.data[index+2];
            break;
        case 6:
            imageData.data[index] = imageData.data[index]+50;
            imageData.data[index+1] = imageData.data[index+1]+50;
            imageData.data[index+2] = imageData.data[index+2]+50;
            break;
        case 7:
            imageData.data[index] = gray;
            imageData.data[index+1] = gray;
            imageData.data[index+2] = gray;
            break;
    }
}