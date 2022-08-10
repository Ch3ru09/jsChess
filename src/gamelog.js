class GameLog {
  constructor() {
    this.log = [];
    // *** c:captured, m: moved, i: initial, f: final
    // *** log[n]:Array<number> = [c c c, m m m, i i, f f]

    this.curr = 0;
  }

  addMove(p, i, f, gs) {
    // piece, initial, final, gameState
    let c = gs.posArray[f];
    this.log.push([c, p, i, f]);
  }

  revertMove(remove, gs) {
    if (this.log.length + this.curr !== 0) {
      --this.curr;
    }
    let c = this.log[this.log.length + this.curr];
    gs.posArray[c[2]] = c[1];
    gs.posArray[c[3]] = c[0];

    gs.pieceOn = null;
    gs.pieceGrabbed = null;
    gs.enPassant = null;
    if (remove !== 0) {
      this.log.splice(this.log.length + remove, 1);
    }
  }
}

