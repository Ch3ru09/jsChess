class Main {
  constructor() {
    this.canvas =  document.createElement("canvas");
    document.body.appendChild(canvas);

    this.ctx = canvas.getContext("2d");

    canvas.height = H = innerHeight;
    canvas.width = W = innerWidth;
    
    this.unit = 60;
  }

  animation() {
    this.draw()
    
    requestAnimationFrame(animation)
  }

  draw() {

  }
}
