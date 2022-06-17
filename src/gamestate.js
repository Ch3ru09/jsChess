class GameState {
  constructor() {
    // 8: Light, 16: Dark
    this.playing = 0;
    this.posArray = Array(64).fill(0);
    this.pieceOn = null;
    this.pieceGrabbed = null;
    this.enPassant = null;
    this.canCastle = 0; // 1111
                         // KQkq
    this.castling = {"K": 8, "Q": 4, "k": 2, "q": 1};
    this.moves = {halfMove: 0, fullMove: 0};
  }

  decode(fencode) {
    this.posArray = Array(64).fill(0);
    const info = fencode.split(" ");
    this.playing = info[1] == "w"? 8: 16;
    info[2].split("").forEach(s => {this.canCastle |= this.castling[s]})
    
    const letterToPiece = {
      "p": pieces.Pawn, "n": pieces.Knight, "b": pieces.Bishop, "r": pieces.Rook, "q": pieces.Queen, "k": pieces.King,
    }

    info[0].split("/").forEach((row, index) => {
      let c = 8*index;
      row.split("").forEach(s => {
        if (!isNaN(Number(s))) {
          c += Number(s);
          return;
        }
        this.posArray[c] = (s == s.toLowerCase()? pieces.Dark: pieces.Light) | letterToPiece[s.toLowerCase()];
        c++;
      })
    });
  }

  isSameColor(playing) {
    return (Math.abs(this.posArray[mouse.getPosIndex()]) & playing) == playing ? true: false;
  }

  isPieceLight(piecePos) {
    return (Math.abs(this.posArray[piecePos]) & 8) == 8 ? true: false;
  }

  checkLegal() {
    if (!mouse.inBoard) return false;
    if (this.isSameColor(this.playing)) return false;

    switch ((Math.abs(this.posArray[this.pieceGrabbed]) << 29) >>> 29) {
      case pieces.Pawn:
        let direction = this.isPieceLight(this.pieceGrabbed)? -1: 1;
        

        // get 1 and 2 for 1 forwards or 2 forwards:
        for (let i = 1; i <= 2; i++) {
          if (mouse.getPosIndex() != this.pieceGrabbed+(8*direction*(i))) continue;
          if (this.pieceOn != null) return false;
          if (this.posArray[this.pieceGrabbed+(8*direction)] != 0) return false
          if (i != 2) return true;
          
          if (this.canDoublePush(this.pieceGrabbed)) {
            this.enPassant = this.pieceGrabbed+(8*direction);
            return true;
          }
        }

        // get -1 and 1 for side captures
        for (let i of [-1, 1]) {
          if (mouse.getPosIndex() != this.pieceGrabbed+(8*direction+(i))) continue;
          if (mouse.getPosIndex() == this.enPassant) {
            this.posArray[this.enPassant+(-direction*8)] = 0;
            return true;
          }

          if (this.pieceOn == null) break;
          return true;
        }
        break;

      case pieces.Knight:
        console.log("Knight");
        break;

      case pieces.Bishop:
        const side = Math.floor(mouse.getPosIndex()/8) < Math.floor(this.pieceGrabbed/8)? 0:7;
        const dir = side == 0? -1: 1;
        const blocked = [];
        for (let i = 1; i <= Math.abs(side-(Math.floor(this.pieceGrabbed/8))); i++) {
          if (blocked.length == 2) break
          for (let j = 0; j < 2; j++) {
            if (blocked.includes(j)) continue;
            
            let curr = this.pieceGrabbed + dir*8*i + j*i*2 - i;
            if (curr > 64 || curr < 0) continue;
            if (Math.floor(curr/8) != Math.floor(this.pieceGrabbed/8) + dir*i) continue
            
            if (this.posArray[curr] !== 0 && curr !== mouse.getPosIndex()) {
              blocked.push(j)
              continue
            }
            if (mouse.getPosIndex() == curr) {
              return true
            }
          }
        }
        break;

      case pieces.Rook:
        // horizontal
        {
          const side = mouse.getPosIndex()%8 < this.pieceGrabbed%8? 0:7;
          const dir = side == 0? -1: 1;
          for (let i = 1; i <= Math.abs(side-this.pieceGrabbed%8); i++) {
            let curr = this.pieceGrabbed+i*dir
            if (this.posArray[curr] !== 0 && curr != mouse.getPosIndex()) {
              break
            }
            if (mouse.getPosIndex() == curr) {
              return true
            }
          }
        }

        // vertical
        {
          const side = Math.floor(mouse.getPosIndex()/8) < Math.floor(this.pieceGrabbed/8)? 0:7;
          const dir = side == 0? -1: 1; 
          for (let i = 1; i <= Math.abs(side-(Math.floor(this.pieceGrabbed/8))); i++) {
            let curr = this.pieceGrabbed+8*i*dir
            if (this.posArray[curr] !== 0 && curr != mouse.getPosIndex()) {
              break
            }
            if (mouse.getPosIndex() == curr) {
              return true
            }
          }
        }

        break;

      case pieces.Queen:
        console.log("Queen");
        break;

      case pieces.King:
        for (let i = -1; i < 2; i++) {
          if (Math.floor((this.pieceGrabbed+i*8)/8) != Math.floor(mouse.getPosIndex()/8)) continue;
          for (let j = -1; j < 2; j++) {
            if (i == 0 && j == 0) continue;
            const curr = this.pieceGrabbed +i*8 +j
            if (curr == mouse.getPosIndex()) return true
          }
        }
        break;

      default:
        break;
    }

    return false;
  }

  canDoublePush(pawn) {
    if (Math.floor(pawn/8)+1 == (this.isPieceLight(pawn)? 7: 2)) return true
    return false
  }
}

function xor(a, b) {
  return (a && !b) || (!a && b);
}