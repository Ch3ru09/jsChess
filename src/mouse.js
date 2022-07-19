class Mouse {
  constructor() {
    this.pos = { x: 0, y: 0 };
    // note: this is chess coords but (0,0) is top left
    this.posInBoard = { x: 0, y: 0 };
    this.inBoard = false;
    this.posIndex = null;
  }
  isInBoard(board) {
    if (this.pos.x < board.x || this.pos.x > board.x + board.w)
    return false;
    if (this.pos.y < board.y || this.pos.y > board.y + board.w)
    return false;
    return true;
  }
  getPosInBoard(board, unit) {
    return {
      x: Math.floor((this.pos.x - board.x) / unit),
      y: Math.floor((this.pos.y - board.y) / unit),
    };
  }
  getPosIndex(board) {
    return Math.abs((board.reversed ? 63 : 0) - (this.posInBoard.y * 8 + this.posInBoard.x));
  }
}