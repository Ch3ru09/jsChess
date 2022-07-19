import { Board } from "./board"
import { GameState } from "./gamestate"
import { Mouse } from "./mouse"
import { Pieces } from "./pieces"

export class Game {
  H: number;
  W: number;
  unit: number;
  private piecesAssets: {[id:string]:HTMLImageElement} = {};
  board: Board;
  gameState: GameState;
  mouse: Mouse;
  pieces: Pieces;

  constructor(width: number, height: number, canvas: HTMLCanvasElement) {
    canvas.width = this.W = width;
    canvas.height = this.H = height;
    this.unit = Math.min(this.H*0.7/8, this.W*0.7/8);

    this.board = new Board(this.W, this.H, this.unit);
    this.gameState = new GameState();
    this.mouse = new Mouse();
    this.pieces = new Pieces();
  }

  resetRes(board: Board): void {
    this.H = innerHeight;
    this.W = innerWidth;
    this.unit = Math.min(this.H*0.7/8, this.W*0.7/8);
  }

  loadPieces(): void {
    let ps = ["pawn", "knight", "bishop", "rook", "queen", "king"];

    const newImage: Function = (src: string) => {
      var tmp = new Image();
      tmp.src = src;
      return tmp
    }
    
    ps.forEach((p, i) => {
      this.piecesAssets[`${16 |(i+1)}`] = newImage(`./assets/light/${p}.png`);
      this.piecesAssets[`${8 |(i+1)}`] = newImage(`./assets/dark/${p}.png`);
    });
  }

  draw(canvas: HTMLCanvasElement) {
    let ctx = canvas.getContext("2d");
    this.board.draw(canvas, ctx, this.unit, this.mouse, this.gameState, this.piecesAssets)
  }

  animate(canvas: HTMLCanvasElement): any {
    this.draw(canvas)

    requestAnimationFrame(this.animate(canvas).bind(this))
  }

}