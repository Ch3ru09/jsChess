const pieces = new Pieces();
const board = new Board();
const gameState = new GameState();

const mousePos = {x: 0, y: 0};

window.addEventListener("resize", handleWindowResize, false);

function handleWindowResize() {
  H = canvas.height = innerHeight;
  W = canvas.width = innerWidth;

  unit = H*0.7/8;

  board.resize();
}

document.addEventListener("mousemouve", handleMouseMove, false);

function handleMouseMove(e) {
  var rect = canvas.getBoundingClientRect();
  
  mousePos.x = e.clientX - rect.left;
  mousePos.y = e.clientY - rect.top;
  
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