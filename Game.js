// ===== ELEMENTOS DEL DOM =====
const canvas = document.querySelector('#game-canvas');
const context = canvas.getContext('2d');
const startBtn = document.getElementById('start-button');
const resetBtn = document.getElementById('reset-button');
const menuBtn = document.getElementById('menu-button');
const welcomeScreen = document.getElementById('welcome-screen');
const gameContent = document.getElementById('game-content');
const timerDisplay = document.getElementById('timer-display');
const levelDisplay = document.getElementById('level-display');

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

const TILE_COUNT = 2;
let nivel = 0;
let gameWon = false;
let juegoActivo = false;
let pieces = [];

// Función para iniciar el temporizador
function iniciarTemporizador() {
    tiempoInicio = Date.now();
    juegoIniciado = true;

    timerInterval = setInterval(() => {
        if (!gameWon) {
            tiempoActual = Math.floor((Date.now() - tiempoInicio) / 1000);
            actualizarDisplayTiempo();
        }
    }, 1000);
}

// Función para detener el temporizador
function detenerTemporizador() {
    clearInterval(timerInterval);
    return tiempoActual;
}

// Función para mostrar el tiempo
function actualizarDisplayTiempo() {
    const minutos = Math.floor(tiempoActual / 60);
    const segundos = tiempoActual % 60;
    const display = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    document.getElementById('timer-display').textContent = display;
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

canvas.addEventListener('click', onCanvasClick);

function randomImage() {
    return images[nivel];
}


const image = new Image();
image.src = randomImage();
image.onload = function () {
    initializePuzzle();
}

resetBtn.addEventListener('click', initializePuzzle);
canvas.addEventListener('click', onCanvasClick);


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

    // Actualizar display del nivel
    levelDisplay.textContent = nivel + 1;

    image.src = images[nivel];
    image.onload = function () {
        initializePuzzle();
        juegoActivo = true; // Activar el juego
    };
}

function initializePuzzle(){
    gameWon = false;
    pieces = [];


    const parteWidth = canvas.width/TILE_COUNT;
    const parteHeight = canvas.height/TILE_COUNT;
    const rotaciones = [0, Math.PI / 2, Math.PI, Math.PI * 1.5]; // 0, 90, 180, 270

    for(let x = 0; x < TILE_COUNT;x++){
        for(let y = 0; y < TILE_COUNT;y++){
            const piece = {
                sx : x * parteWidth,
                sy : y * parteHeight,
                dx : x * parteWidth,
                dy : y * parteHeight,
                rotation : rotaciones[Math.floor(Math.random() * rotaciones.length)],
            }
            pieces.push(piece);
        }
    }
    drawPieces();
    filtro();

}

function drawPieces(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    const parteWidth = canvas.width/TILE_COUNT;
    const parteHeight = canvas.height/TILE_COUNT;

    pieces.forEach(piece => {
        context.save();
        context.translate(piece.dx+parteWidth/2,piece.dy+parteHeight/2);
        context.rotate(piece.rotation);
        context.drawImage(
            image,
            piece.sx,piece.sy,parteWidth,parteHeight,
            -parteWidth/2,-parteHeight/2,parteWidth,parteHeight
        );
        context.restore();
    })
}

function onCanvasClick(event) {
    if (!juegoActivo || gameWon) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const tileW = canvas.width / TILE_COUNT;
    const tileH = canvas.height / TILE_COUNT;

    const clickedPiece = pieces.find(piece =>
        x >= piece.dx && x < piece.dx + tileW &&
        y >= piece.dy && y < piece.dy + tileH
    );

    if (clickedPiece) {
        // rota 90 grados
        clickedPiece.rotation += Math.PI / 2;
        drawPieces();
        filtro();
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
        detenerTemporizador();
        setTimeout(() => {
            drawPieces(); // Redraw to show final state
            context.fillStyle = "rgba(0, 0, 0, 0.6)";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "white";
            context.font = "bold 40px 'Helvetica Neue'";
            context.textAlign = "center";
            context.fillText("¡Ganaste!", canvas.width / 2, canvas.height / 2);
            context.fillText("avanzando...", canvas.width / 2, canvas.height / 2 + 40);
            nivel++;
            setTimeout(startLevel, 2000);
        }, 100);
    }
}



function filtro() {
    const imageData = context.getImageData(0, 0, 300, 300);

    for(let x = 0;x<imageData.width;x++){
        for(let y=0;y<imageData.height;y++){
            setPixel(imageData,x,y)
        }

    }
    context.putImageData(imageData, 0, 0);

}

function setPixel(imageData,x,y){
    const index = (x+y*imageData.width)*4;
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

