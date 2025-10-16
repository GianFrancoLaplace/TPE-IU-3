const canvas = document.querySelector('#game-canvas');
const context = canvas.getContext('2d');
const resetBtn = document.getElementById('reset-button');
const images = [
    "images/ocarinaoftime.jpeg",
    "images/Peg hawaiano 1.png",
    "images/PORTAL 2.jpeg",
    "images/RED DEAD 2.jpeg",
    "images/STREET FIGHTER 6.jpeg",
    "images/THE WITCHER 3.jpeg",
    "images/VALORANT.jpeg",
    "images/WARZONE.jpeg"

]
const TILE_COUNT = 2;
let nivel = 0

gameWon = false;
pieces = [];
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
    // Si ya no hay más imágenes, muestra un mensaje final
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

    // Le dice al objeto 'image' que cargue la imagen del nivel actual
    image.src = images[nivel];
    // Cuando la nueva imagen termine de cargar, se ejecuta esto:
    image.onload = function () {
        initializePuzzle();
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
    if (gameWon) return;

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
 * Checks if all pieces are correctly oriented.
 */
function checkWinCondition() {
    // Check if every piece's rotation is a multiple of 360 degrees (2 * PI)
    const isSolved = pieces.every(p => (p.rotation % (2 * Math.PI)).toFixed(4) == 0.0000);

    if (isSolved) {
        gameWon = true;
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

