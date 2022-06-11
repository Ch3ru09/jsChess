const pieces = new Pieces();
const board = new Board();
const gameState = new GameState();

window.addEventListener("resize", () => {
  H = canvas.height = innerHeight;
  W = canvas.width = innerWidth;

  unit = H*0.8/8;

  board.resize();
}, false)

gameState.decode("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
console.log('>>', gameState.posArray);

function animation() {
  draw();
  requestAnimationFrame(animation);
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  board.draw();
}

animation();