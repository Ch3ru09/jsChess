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

    this.mouse();
    this.drawPieces();
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

  drawPieces() {
    let grabbed;
    gameState.posArray.forEach((s, i) => {
      ctx.fillStyle = "#000";
      ctx.fillText(`${i}`, (i % 8)*unit + 0.1*unit, Math.floor(i / 8)*unit + 0.2*unit, 100, 100)
      if (s == 0) return;
      var a, coor

      if (Number(s) < 0) {
        grabbed = -s;
      } else {
        coor = { x: (i % 8)*unit, y: Math.floor(i / 8)*unit }
        a = s;
        ctx.drawImage(piecesAssets[`${a}`], coor.x, coor.y, unit, unit)
      }

    });
    if (grabbed) {
      var coor = { x: mouse.pos.x-this.x-unit/2, y: mouse.pos.y-this.y-unit/2}
      ctx.drawImage(piecesAssets[`${grabbed}`], coor.x, coor.y, unit, unit)
    }
  }

  resize() {
    this.w = 8*unit;
    this.x = (W-this.w)/2;
    this.y = (H-this.w)/2;
  }

  mouse() {
    if (!mouse.inBoard) {
      canvas.style.cursor = "default";
      return;
    }

    let pos = Object.values(mouse.posInBoard).map(v => {
      return v*unit;
    });

    if (gameState.posArray[mouse.posIndex] !== 0) {
      canvas.style.cursor = "grab";
      gameState.pieceOn = mouse.posIndex;
    } else {
      canvas.style.cursor = "default";
      gameState.pieceOn = null;
    }

    ctx.save();
    ctx.fillStyle = "#f008";
    ctx.fillRect(pos[0], pos[1], unit, unit);
    ctx.restore();
  }

}