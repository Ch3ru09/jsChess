const pieces = new Pieces();
const board = new Board();
const gameState = new GameState();
const mouse = new Mouse();


window.addEventListener("resize", handleWindowResize, false);
function handleWindowResize() {
  H = canvas.height = innerHeight;
  W = canvas.width = innerWidth;

  unit = Math.min(H*0.7/8, W*0.7/8);

  board.resize();
}

document.addEventListener("mousemove", handleMouseMove, false);
function handleMouseMove(e) {
  mouse.pos.x = e.clientX;
  mouse.pos.y = e.clientY;
  mouse.inBoard = mouse.isInBoard();
  if (mouse.inBoard) {
    mouse.posInBoard = mouse.getPosInBoard();
  } else {
    mouse.posInBoard = {x: null, y: null};
  }
}

document.addEventListener("mousedown", handleMouseDown, false);
function handleMouseDown() {
  if (!gameState.pieceOn || !mouse.inBoard) return;

  if (((gameState.posArray[gameState.pieceOn]) & 8) == gameState.playing) {
    gameState.posArray[gameState.pieceOn] *= -1;
    gameState.pieceGrabbed = gameState.pieceOn;
  }
}

document.addEventListener("mouseup", handleMouseUp, false);
function handleMouseUp() {
  if (mouse.getPosIndex() != gameState.pieceGrabbed && gameState.checkLegal()) {
    gameState.posArray[mouse.getPosIndex()] = -gameState.posArray[gameState.pieceGrabbed];
    gameState.posArray[gameState.pieceGrabbed] = 0;
  } else {
    gameState.posArray[gameState.pieceGrabbed] *= -1;
  }
  
}


gameState.decode("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");



function animation() {
  draw();
  requestAnimationFrame(animation);
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  board.draw();
}

animation();