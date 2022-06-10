class Board {
  constructor() {
    this.w = 8*unit;
    this.x = (W-this.w)/2;
    this.y = (H-this.w)/2;
  }

  draw() {
    ctx.save()
    ctx.fillStyle = "#aaa"
    ctx.fillRect(this.x, this.y, this.w, this.w);
    
    ctx.restore()
  }
}