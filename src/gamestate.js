class GameState extends GameCalc{
  constructor() {
    this.playing = 0;
    this.posArray = Object.seal(Array(64).fill(0));
    this.pieceOn = null;
    this.pieceGrabbed = null;
    this.enPassant = null;
    this.epCheck = false;
    this.canCastle = 0; // 1111
    // KQkq
    this.castling = { K: 8, Q: 4, k: 2, q: 1 };
    this.moves = { halfMove: 0, fullMove: 0 };
    // 0: dark, 1: light
    this.kings = new Array(2).fill(0);
    this.drawchecks = [];

    this.iPos = null;
    this.fPos = null;

    this.checkedLegal = {};
    this.clickmode = false;

    this.captured = [];
  }
}