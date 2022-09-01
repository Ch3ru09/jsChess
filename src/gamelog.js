class GameLog {
  constructor() {
    this.log = [];
    // *** c:captured, m: moved, i: initial, f: final
    // *** log[n]:Array<number> = [c c c, m m m, i i, f f]

    this.curr = 0;
    this.reverted = false;
    this.forwarded = false;
  }

  addMove(p, i, f, gs) {
    // piece, initial, final, gameState
    let c = gs.posArray[f];
    this.log.push([c, p, i, f]);
  }

  // TODO: Optimize 18-54

  // revertMove(remove, gs) {
  //   if (this.log.length + this.curr !== 0) {
  //     !this.forwarded ? --this.curr: 0;
  //   }
  //   let c = this.log[this.log.length + this.curr];
  //   gs.posArray[c[2]] = c[1];
  //   gs.posArray[c[3]] = c[0];

  //   gs.pieceOn = null;
  //   gs.pieceGrabbed = null;
  //   gs.enPassant = null;

  //   if (remove !== 0) {
  //     this.log.splice(this.log.length + remove, 1);
  //     this.curr = 0
  //   }
  //   this.reversed = true;
  //   this.forwarded = false;
  // }

  // nextMove(gs) {
  //   if (this.log.length + this.curr < this.log.length-1) {
  //     !this.reversed ? ++this.curr: 0;
  //   }

  //   let c = this.log[this.log.length + this.curr];
    
  //   gs.posArray[c[2]] = 0;
  //   gs.posArray[c[3]] = c[1];

  //   gs.pieceOn = null;
  //   gs.pieceGrabbed = null;
  //   gs.enPassant = null;

  //   this.reversed = false;
  //   this.forwarded = true;
  // }

  changeMove(delta, gs, remove) {
    // if (this.log.length + this.curr !== 0) {
    //   !this.forwarded ? --this.curr: 0;
    // }

    if (this.log.length + delta !== 0) {
      !this.forwarded ? this.curr+delta: 0;
      !this.reversed ? this.curr+delta: 0;
    }

    let c = this.log[this.log.length + this.curr];
    gs.posArray[c[2]] = c[1];
    gs.posArray[c[3]] = c[0];

    gs.pieceOn = null;
    gs.pieceGrabbed = null;
    gs.enPassant = null;

    if (remove && remove !== 0) {
      this.log.splice(this.log.length + remove, 1);
      this.curr = 0
    }
    
    this.reversed = !this.reversed;
    this.forwarded = !this.forwarded;
  }

  // TODO: optimize above
}

