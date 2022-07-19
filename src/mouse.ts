import { Board } from "./board";

export interface Position {
  x: number,
  y: number
}

export class Mouse {
  pos: Position;
  posInBoard: Position;
  inBoard: boolean;
  posIndex: number;


  constructor() {
    this.pos = {x: 0, y: 0};
    // note: this is chess coords but (0,0) is top left
    this.posInBoard = {x: 0, y: 0};
    this.inBoard = false;
    this.posIndex = null;
  }
  
  isInBoard(board: Board) {
    if (this.pos.x < board.x || this.pos.x > board.x+board.w) return false;
    if (this.pos.y < board.y || this.pos.y > board.y+board.w) return false;
    return true;
  }
  
  getPosInBoard(board: Board, unit: number) {
    return {
      x: Math.floor((this.pos.x - board.x)/unit),
      y: Math.floor((this.pos.y - board.y)/unit),
    };
  }
  
  getPosIndex(board: Board) {
    return Math.abs((board.reversed?63:0) - (this.posInBoard.y*8 + this.posInBoard.x))
  }
}