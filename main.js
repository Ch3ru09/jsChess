const board = new Board();

function animation() {
  draw()
  requestAnimationFrame(animation);
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  board.draw();
}

animation();