import { Board } from "./board";
import { Pieces } from "./pieces";
import { Mouse } from "./mouse";

import { Position } from "./mouse";

interface Castling {

}

export class GameState {
  // playing: number;
  // private posArray: Array<number>;
  // pieceOn: any;
  // pieceGrabbed: any;
  // enPassant: any;
  // epCheck: boolean;
  // canCastle: number;
  // castling: {[id: string]: number};
  // moves: object;
  // kings = new Array(2).fill(0);
  // drawchecks: Array<object>;

  playing = 0;
  posArray = Object.seal(Array(64).fill(0));
  pieceOn: number = null;
  pieceGrabbed: number = null;
  enPassant: number = null;
  private epCheck = false
  private canCastle = 0; // 1111
                 // KQkq
  private castling: {[id: string]: number} = {"K": 8, "Q": 4, "k": 2, "q": 1};
  private moves = {halfMove: 0, fullMove: 0};

  // 0: dark, 1: light
  kings = new Array(2).fill(0);

  private drawchecks: Array<Position> = [];

  // constructor() {
    // 16: Light, 8: Dark
    // this.playing = 0;
    // this.posArray = Object.seal(Array(64).fill(0));
    // this.pieceOn = null;
    // this.pieceGrabbed = null;
    // this.enPassant = null;
    // this.epCheck = false
    // this.canCastle = 0; // 1111
    //                      // KQkq
    // this.castling = {"K": 8, "Q": 4, "k": 2, "q": 1};
    // this.moves = {halfMove: 0, fullMove: 0};

    // 0: dark, 1: light
    // this.kings = new Array(2).fill(0);

    // this.drawchecks = [];
  // }

  decode(fencode: string, pieces: Pieces, board: Board): void {
    this.posArray = Array(64).fill(0);
    const info = fencode.split(" ");
    this.playing = info[1] == "w"? 16: 8;
    info[2].split("").forEach(s => {this.canCastle |= this.castling[s]})
    
    const letterToPiece: {[id: string]: number} = {
      "p": pieces.Pawn, "n": pieces.Knight, "b": pieces.Bishop, "r": pieces.Rook, "q": pieces.Queen, "k": pieces.King,
    }

    info[0].split("/").forEach((row, index) => {
      let c = 8*index;
      row.split("").forEach(s => {
        if (!isNaN(Number(s))) {
          c += Number(s);
          return;
        }
        if (s.toLowerCase() == "k") {
          this.kings.splice(s == s.toLowerCase()? 0: 1, 1, c);
        }
        this.posArray[c] = (s == s.toLowerCase()? pieces.Dark: pieces.Light) | letterToPiece[s.toLowerCase()];
        c++;
      })
    });
    // board.shownArr = this.posArray;
  }

  isSameColor(playing: number, pos: number): boolean {
    return (Math.abs(this.posArray[pos]) & playing) == playing ? true: false;
  }

  isPieceLight(piecePos: number): boolean {
    return (Math.abs(this.posArray[piecePos]) & 16) == 16 ? true: false;
  }

  getPiece(piece: number): number {
    return Math.abs(this.posArray[piece]) & 7;
  }

  getPieceColor(piece: number): number {
    return this.posArray[piece] & 24;
  }

  checkLegal(mouse: Mouse, pieces: Pieces): any {
    if (!mouse.inBoard) return false;
    if (this.pieceGrabbed == null) return false;
    if (this.isSameColor(this.playing, mouse.posIndex) && this.getPiece(this.pieceGrabbed) != pieces.King) return false;

    switch (this.getPiece(this.pieceGrabbed)) {
      case pieces.Pawn:
        let direction = this.isPieceLight(this.pieceGrabbed)? -1: 1;
        

        // get 1 and 2 for 1 forwards or 2 forwards:
        for (let i = 1; i <= 2; i++) {
          if (mouse.posIndex != this.pieceGrabbed+(8*direction*(i))) continue;
          if (this.pieceOn != null) return false;
          if (this.posArray[this.pieceGrabbed+(8*direction)] != 0) return false
          if (i != 2) return true;
          
          if (this.canDoublePush(this.pieceGrabbed)) {
            this.enPassant = this.pieceGrabbed+(8*direction);
            this.epCheck = true;
            return true;
          }
        }

        // get -1 and 1 for side captures
        for (let i of [-1, 1]) {
          if (mouse.posIndex != this.pieceGrabbed+(8*direction+(i))) continue;
          if (mouse.posIndex == this.enPassant) {
            this.posArray[this.enPassant+(-direction*8)] = 0;
            return true;
          }

          if (this.pieceOn == null) break;
          return true;
        }
        break;

      case pieces.Knight:
        const side = Math.floor(mouse.posIndex/8) < Math.floor(this.pieceGrabbed/8)? 0:7;
        const dir = side == 0? -1: 1;
        for (let i = 1; i <= 2; i++) {
          for (let j = 0; j < 2; j++) {
            let xdelta = i == 1 ? 2: 1
            let curr = this.pieceGrabbed + i*8*dir + j*2*xdelta-xdelta
            if (mouse.posIndex == curr) return true;
          }
        }
        break;

      case pieces.Bishop:
        return this.bishopMove(mouse)

      case pieces.Rook:
        return this.handleRookMove(mouse)

      case pieces.Queen:
        return this.bishopMove(mouse) || this.handleRookMove(mouse)

      case pieces.King:
        if (this.isSameColor(this.playing, mouse.posIndex)) {
          if (this.getPiece(mouse.posIndex) == pieces.Rook) {
            if (this.handleCastle(this.pieceOn, pieces)) {
              return "casled";
            }
          }
          return false
        }

        for (let i = 0; i < 2; i++) {
          if (mouse.posIndex !== this.pieceGrabbed+i*4-2) continue
          if (this.handleCastle(i*7+((this.playing-8)*7), pieces)) {
            return "casled";
          }

          continue
        }

        for (let i = -1; i < 2; i++) {
          if (Math.floor((this.pieceGrabbed+i*8)/8) != Math.floor(mouse.posIndex/8)) continue;
          for (let j = -1; j < 2; j++) {
            if (i == 0 && j == 0) continue;
            const curr = this.pieceGrabbed +i*8 +j
            if (curr == mouse.posIndex) {
              if (this.canCastle == 15) {
                this.canCastle ^= (((this.playing/(2**3))**2)*3)
              }
              this.kings.splice(this.playing/8-1, 1, mouse.posIndex);
              return pieces.King;
            }
          }
        }

        break;

      default:
        break;
    }

    return false;
  }

  canDoublePush(pawn: number): boolean {
    if (Math.floor(pawn/8)+1 == (this.isPieceLight(pawn)? 7: 2)) return true
    return false
  }

  bishopMove(mouse: Mouse) {
    const side = Math.floor(mouse.posIndex/8) < Math.floor(this.pieceGrabbed/8)? 0:7;
    const dir = side == 0? -1: 1;
    const blocked: Array<number> = [];
    for (let i = 1; i <= Math.abs(side-(Math.floor(this.pieceGrabbed/8))); i++) {
      if (blocked.length == 2) break
      for (let j = 0; j < 2; j++) {
        if (blocked.includes(j)) continue;
        
        let curr = this.pieceGrabbed + dir*8*i + j*i*2 - i;
        if (curr > 64 || curr < 0) continue;
        if (Math.floor(curr/8) != Math.floor(this.pieceGrabbed/8) + dir*i) continue
        
        if (this.posArray[curr] !== 0 && curr !== mouse.posIndex) {
          blocked.push(j)
          continue
        }
        if (mouse.posIndex == curr) {
          return true
        }
      }
    }
    return false
  }

  handleRookMove(mouse: Mouse) {
    return (
    // horizontal
    this.checkRookMove(mouse.posIndex%8, this.pieceGrabbed%8, 1, mouse) 
    ||
    // vertical
    this.checkRookMove(Math.floor(mouse.posIndex/8), Math.floor(this.pieceGrabbed/8), 8, mouse)
    
    );
  }

  checkRookMove(mouseLine: number, pieceLine: number, mod: number, mouse: Mouse) {
    // mod is for the 8x while moving vertically
    const side = Math.floor(mouseLine) < pieceLine? 0:7;
    const dir = side == 0? -1: 1; 
    for (let i = 1; i <= Math.abs(side-(pieceLine)); i++) {
      let curr = this.pieceGrabbed+ mod*i*dir
      if (this.posArray[curr] !== 0 && curr != mouse.posIndex) {
        break
      }
      if (mouse.posIndex == curr) {
        return true
      }
    }
    return false;
  }

  handleCastle(rookPos: number, pieces: Pieces) {
    if (
      this.doCastle(
        this.checkCastle(rookPos),
        pieces
      )
    ) {
      if (this.canCastle == 15) {
        this.canCastle ^= (((this.playing/(2**3))**2)*3)
      }
      
      return true;
    }
    return;
  }
  
  checkCastle(piece: number) {
    if (![0, 7, 56, 63].includes(piece)) return;
    var curr = (piece/7)%7+1
    if (piece/7 > 4) {
      curr = 2**curr;
    }
    if ((this.canCastle & curr) === 0) return;

    let min = Math.min(piece, this.pieceGrabbed) +1;
    let max = Math.max(piece, this.pieceGrabbed);
    for (let i = min; i < max; i++) {
      if (this.posArray[i] !== 0) return false
    }
    
    return Math.sign(piece-this.pieceGrabbed)
  }

  doCastle(castleMove: number | false, pieces: Pieces) {
    if (!castleMove) return

    this.posArray[this.pieceGrabbed] = 0;
    let kingPos = this.pieceGrabbed+castleMove*2;
    this.posArray[kingPos] = this.playing | pieces.King;
    this.kings.splice(this.playing/8-1, 1, kingPos);
    this.posArray[this.pieceGrabbed+castleMove] = this.playing | pieces.Rook;
    this.posArray[(castleMove+1)*3.5 + Math.floor(this.pieceGrabbed/8)*8] = 0;
    
    return true
  }

  checkChecks(king: number, pieces: Pieces) {
    const color = this.getPieceColor(king);

    const pawn = this.checkPawn(king, pieces);
    const knight = this.checkKnight(king, pieces);
    const bishop = this.checkBishop(king, pieces);
    const rook = this.checkRook(king, pieces);
    const queen = this.checkRook(king, pieces) || this.checkBishop(king, pieces);

    const res = ( pawn || bishop || knight || rook || queen ) ? true: false

    return [res, color]
  }

  checkPawn(king: number, pieces: Pieces) {
    const dir = -((this.getPieceColor(king)/8 - 1)*2 -1); // to get 1 and -1 => 1 = dark, -1 = light
    for (let i = 0; i <= 1; i ++) {
      let curr = king+dir*8 + i*2-1
      if (this.getPiece(curr) == pieces.Pawn && !this.isSameColor(this.getPieceColor(king), curr)) {
        return true;
      }
    }
  }

  checkKnight(king: number, pieces: Pieces) {
    for (const dir of [-1, 1]) {
      for (let i = 1; i <= 2; i++) {
        for (let j = 0; j < 2; j++) {
          let xdelta = i == 1 ? 2: 1;
          let piece = king + i*8*dir + j*2*xdelta-xdelta;
          if (piece > 63 || piece < 0) continue;
          if (piece%8 != king%8 + j*2*xdelta-xdelta) continue;

          if (!this.isSameColor(this.getPieceColor(king), piece) && this.getPiece(piece) == pieces.Knight) {
            return true;
          }
        }
      }
    }
  }

  checkBishop(king: number, pieces: Pieces) {
    const blocked = [];
    const max = king%8 < 4? 7-king%8: king%8;

    for (let i = 1; i <= max; i++) {
      for (let j = 0; j <= 1; j++) {
        let curr = 2*i*j - i;
        for (let k of [-1, 1]) {
          if (containsArr([Math.sign(curr), k], blocked)) continue;
          let piece = king + curr + k*i*8;
          if (piece > 63 || piece < 0) continue;
          if (Math.floor(piece/8) != Math.floor(king/8)+k*i) continue;

          if (this.getPiece(piece) == pieces.Null) {
            continue;
          }
          if (this.isSameColor(this.getPieceColor(king), piece)) {
            
            // guard clause, else:
            blocked.push([Math.sign(curr), k]);
            continue;
          }
          // else :
          if (this.getPiece(piece) == pieces.Bishop) return true;
          // guard clause, else:
          blocked.push([Math.sign(curr), k]);
          continue;
        }
      }
    }
  }

  checkRook(king: number, pieces: Pieces) {
    // %: horizontal, /: vertical
    for (const op of ["%", "/"]) {
      
      let max = eval(`Math.floor(${king}${op}8)<4? 7-Math.floor(${king}${op}8): Math.floor(${king}${op}8)`);
      let blocked: Array<number> = [];
      for (let i = 1; i <= max; i++) {
        for (const k of [-1, 1]) {
          if (blocked.includes(k)) continue;
          let piece = king + i*k * (op=="%"? 1: 8);
          
          if (piece > 63 || piece < 0) continue;
          let checkOp = op=="%"? "/": "%";
          if (eval(`Math.floor(${piece}${checkOp}8)`) != eval(`Math.floor(${king}${checkOp}8)`)) continue;
          this.drawchecks.push({x: piece%8, y: Math.floor(piece/8)})
          if (this.getPiece(piece) == pieces.Null) continue;
          if (this.isSameColor(this.getPieceColor(king), piece)) {
            blocked.push(k)
            continue
          }
          if (this.getPiece(piece) == pieces.Rook) {
            return true
          }

        }
      }
    }
  }

  drawSquares(ctx: CanvasRenderingContext2D, board: Board, unit: number) {
    this.drawchecks.forEach(p => {
      ctx.save()
      ctx.translate(board.x, board.y)
      ctx.fillStyle = "#448";
      ctx.beginPath()
      ctx.arc(p.x*unit+unit/2+unit/64, p.y*unit+unit/2, unit/8, 0, Math.PI*2, false);
      ctx.fill()
      ctx.closePath()
      ctx.restore()
    })
    
  }
}

// function xor(a: boolean, b: boolean) {
//   return (a && !b) || (!a && b);
// }

function containsArr(arr1: any[], arr2: any[]) {
  for (const a of arr2) {
    if (JSON.stringify(arr1) == JSON.stringify(a)) {
      return true;
    }
  }
  return false;
}
