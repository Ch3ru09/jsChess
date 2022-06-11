class Board {
  constructor() {
    this.w = 8*unit;
    this.x = (W-this.w)/2;
    this.y = (H-this.w)/2;
    this.colors = [
      "#888",
      "#eee",
    ];
    this.position =
      this.initialPos = "";
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = "#000";
    const border = 10;
    ctx.fillRect(-border/2, -border/2, this.w+border, this.w+border);
    ctx.fillStyle = this.colors[0];
    ctx.fillRect(0, 0, this.w, this.w);
    this.drawSmallSquares();
    ctx.restore();
  }

  drawSmallSquares() {
    ctx.fillStyle = this.colors[1];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        ctx.fillRect(2*i*unit + (j % 2 ? unit : 0), j*unit, unit, unit);
      }
    }
  }

  setup() {

  }

  resize() {
    this.w = 8*unit;
    this.x = (W-this.w)/2;
    this.y = (H-this.w)/2; 
  }
}