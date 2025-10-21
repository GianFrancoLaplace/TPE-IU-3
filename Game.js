// ===== ELEMENTOS DEL DOM =====
const canvas = document.querySelector('#game-canvas');
const context = canvas.getContext('2d');
const startBtn = document.getElementById('start-button');
const resetBtn = document.getElementById('reset-button');
const menuBtn = document.getElementById('menu-button');
const welcomeScreen = document.getElementById('welcome-screen');
const gameContent = document.getElementById('game-content');

// ===== CONSTANTES DEL JUEGO =====
const BLOCKA_SIZE = 300;  // Área de juego (piezas)
const INFO_HEIGHT = 60;     // Altura del área de información superior
const GAME_OFFSET_Y = INFO_HEIGHT; // Desplazamiento vertical del área de juego
const hashMap =  new Map();

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

// ===== TEMPORIZADOR =====
let tiempoInicio = 0;
let tiempoActual = 0;
let timerInterval = null;

async function inciarThumbnail() {
    const y = canvas.height - 50;
    const x = canvas.width / images.length;
    const thumbnails = [];

    for (let i = 0; i < images.length; i++) {
        const imagen = new Image();
        imagen.src = images[i];
        const thumbnail = {
            imagen: imagen,        // La imagen cargada
            x: x * i,                 // Posición X donde dibujar
            y: y,                     // Posición Y donde dibujar
            width: 30,                // Ancho del thumbnail
            height: 30,               // Alto del thumbnail
            isSelected: false,        // ¿Está actualmente resaltado?
            borderColor: "black",     // Color del borde
            borderWidth: 2            // Grosor del borde
        }
        thumbnails.push(thumbnail);
        dibujarThumbnail(thumbnail)
    }

    await animarRuleta(thumbnails);
}

function dibujarThumbnail(thumbnailData){
    context.drawImage(
        thumbnailData.imagen,
        thumbnailData.x,
        thumbnailData.y,
        thumbnailData.width,
        thumbnailData.height
    )

    // 2. Si está seleccionado, dibujar borde resaltado
    if (thumbnailData.isSelected) {
        context.strokeStyle = thumbnailData.borderColor;
        context.lineWidth = thumbnailData.borderWidth;
        context.strokeRect(
            thumbnailData.x,
            thumbnailData.y,
            thumbnailData.width,
            thumbnailData.height
        );
    }
}

async function animarRuleta(thumbnails) {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < thumbnails.length; i++) {
        const selected = thumbnails[i];
        selected.isSelected = true;
        dibujarThumbnail(selected);

        console.log("Antes Sleep");
        await sleep(1500); // ESPERA 1.5 segundos
        console.log("Despues Sleep");

        selected.isSelected = false;
        context.clearRect(selected.x, selected.y, 30, 30);
        dibujarThumbnail(selected);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// ===== DIBUJAR TODO EL JUEGO =====
function drawGame() {
    // Limpiar todo el canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    setTimeout(inciarThumbnail, 1000);

    // 1. Dibujar área de información
    // drawInfo();
    //
    // // 2. Dibujar las piezas
    // drawPieces();
    //
    // // 3. Aplicar filtro
    // filtro();
}

// ===== DIBUJAR PIEZAS (modificado para usar GAME_OFFSET_Y) =====
function drawPieces(){
    const horizontal = hashMap.get(tileCount).x;
    const vertical = hashMap.get(tileCount).y;

    // const size = (horizontal + vertical) / 2;
    //
    // const parteWidth = BLOCKA_SIZE / size;
    // const parteHeight = BLOCKA_SIZE / size;

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
    })
}

// ===== TEMPORIZADOR =====
function iniciarTemporizador() {
    tiempoInicio = Date.now();
    tiempoActual = 0;

    timerInterval = setInterval(() => {
        if (!gameWon) {
            tiempoActual = Math.floor((Date.now() - tiempoInicio) / 1000);
            drawGame(); // Redibujar todo para actualizar el tiempo
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
    // Fondo del área de info
    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, BLOCKA_SIZE, INFO_HEIGHT);

    // Línea divisoria
    context.strokeStyle = "#333";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, INFO_HEIGHT);
    context.lineTo(BLOCKA_SIZE, INFO_HEIGHT);
    context.stroke();

    // Configuración de texto
    context.fillStyle = "#333";
    context.font = "bold 18px 'Helvetica Neue'";
    context.textAlign = "left";

    // Temporizador (izquierda)
    context.fillText("Tiempo:", 15, 30);
    context.fillStyle = "#007bff";
    context.fillText(formatearTiempo(tiempoActual), 15, 50);

    // Nivel (derecha)
    context.fillStyle = "#333";
    context.textAlign = "right";
    context.fillText("Nivel:", BLOCKA_SIZE - 15, 30);
    context.fillStyle = "#28a745";
    context.fillText((nivel + 1).toString(), BLOCKA_SIZE - 15, 50);
}


// ===== FUNCIÓN PARA MOSTRAR/OCULTAR PANTALLAS =====
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
startBtn.addEventListener('click', () => {
    iniciarTemporizador()
    mostrarJuego();
    startLevel(); // Inicia el primer nivel
});

menuBtn.addEventListener('click', () => {
    mostrarBienvenida();
    nivel = 0; // Resetear al nivel 1
});

resetBtn.addEventListener('click',initializePuzzle);

canvas.addEventListener('mousedown', onCanvasClick);

function randomImage() {
    return images[nivel];
}


const image = new Image();
image.src = randomImage();
image.onload = function () {
    initializePuzzle();
}


function startLevel() {

    iniciarTemporizador();
    if (nivel >= images.length) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.font = "bold 30px 'Helvetica Neue'";
        context.textAlign = "center";
        context.fillText("¡Juego Completado!", canvas.width / 2, canvas.height / 2);
        nivel = 0;
        setTimeout(startLevel, 1000);
        return;
    }

    image.src = images[getRandomInt(images.length)];
    image.onload = function () {
        initializePuzzle();
        juegoActivo = true; // Activar el juego
    };
}

function initializePuzzle(){
    gameWon = false;
    pieces = [];
    juegoActivo = true;

    // Iniciar temporizador
    detenerTemporizador();
    iniciarTemporizador();

    const horizontal = hashMap.get(tileCount).x;
    const vertical = hashMap.get(tileCount).y;

    const parteWidth = BLOCKA_SIZE   / horizontal;
    const parteHeight = BLOCKA_SIZE / vertical;
    const rotaciones = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];

    for(let x = 0; x < horizontal; x++){
        for(let y = 0; y < vertical; y++){
            const piece = {
                sx: x * parteWidth,
                sy: y * parteHeight,
                dx: x * parteWidth,
                dy: y * parteHeight + GAME_OFFSET_Y, // ← AGREGADO OFFSET
                rotation: rotaciones[Math.floor(Math.random() * rotaciones.length)],
            }
            pieces.push(piece);
        }
    }

    drawGame(); // ← NUEVA FUNCIÓN QUE DIBUJA TODO
}

function onCanvasClick(event) {
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
        drawGame(); // ← Usar drawGame en lugar de drawPieces + filtro
        checkWinCondition();
    }
}

/**
 *
 */
function checkWinCondition() {
    const isSolved = pieces.every(p => (p.rotation % (2 * Math.PI)).toFixed(4) == 0.0000);

    if (isSolved) {
        gameWon = true;
        detenerTemporizador(); // ← Detener temporizador

        setTimeout(() => {
            drawGame(); // Redibujar sin filtro

            // Overlay de victoria
            context.fillStyle = "rgba(0, 0, 0, 0.6)";
            context.fillRect(0, GAME_OFFSET_Y, BLOCKA_SIZE, BLOCKA_SIZE);
            context.fillStyle = "white";
            context.font = "bold 40px 'Helvetica Neue'";
            context.textAlign = "center";
            context.fillText("¡Ganaste!", BLOCKA_SIZE / 2, canvas.height / 2);
            context.fillText("avanzando...", BLOCKA_SIZE / 2, canvas.height / 2 + 40);

            nivel++;
            setTimeout(startLevel, 2000);
        }, 100);
    }
}



function filtro() {
    // Obtener solo el área de juego (sin el área de info)
    const imageData = context.getImageData(
        0,
        GAME_OFFSET_Y,
        BLOCKA_SIZE,
        BLOCKA_SIZE
    );

    for(let x = 0; x < imageData.width; x++){
        for(let y = 0; y < imageData.height; y++){
            setPixel(imageData, x, y);
        }
    }

    // Volver a poner la imagen filtrada en el área de juego
    context.putImageData(imageData, 0, GAME_OFFSET_Y);
}

function setPixel(imageData,x,y){
    const index = (x + y * imageData.width ) * 4;
    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];
    const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);


    switch (nivel){
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

