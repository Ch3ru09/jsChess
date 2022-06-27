class GameState {
  constructor() {
    // 16: Light, 8: Dark
    this.playing = 0;
    this.posArray = Object.seal(Array(64).fill(0));
    this.pieceOn = null;
    this.pieceGrabbed = null;
    this.enPassant = null;
    this.epCheck = false
    this.canCastle = 0; // 1111
                         // KQkq
    this.castling = {"K": 8, "Q": 4, "k": 2, "q": 1};
    this.moves = {halfMove: 0, fullMove: 0};

    // 0: dark, 1: light
    this.kings = new Array(2).fill(0);

    this.drawchecks = [];
  }

  decode(fencode) {
    this.posArray = Array(64).fill(0);
    const info = fencode.split(" ");
    this.playing = info[1] == "w"? 16: 8;
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
        if (s.toLowerCase() == "k") {
          this.kings.splice(s == s.toLowerCase()? 0: 1, 1, c);
        }
        this.posArray[c] = (s == s.toLowerCase()? pieces.Dark: pieces.Light) | letterToPiece[s.toLowerCase()];
        c++;
      })
    });
  }

  isSameColor(playing, pos) {
    return (Math.abs(this.posArray[pos]) & playing) == playing ? true: false;
  }

  isPieceLight(piecePos) {
    return (Math.abs(this.posArray[piecePos]) & 16) == 16 ? true: false;
  }

  getPiece(piece) {
    return Math.abs(this.posArray[piece]) & 7;
  }

  getPieceColor(piece) {
    return this.posArray[piece] & 24;
  }

  checkLegal() {
    if (!mouse.inBoard) return false;
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
        return this.bishopMove()

      case pieces.Rook:
        return this.handleRookMove()

      case pieces.Queen:
        return this.bishopMove() || this.handleRookMove()

      case pieces.King:
        if (this.isSameColor(this.playing, mouse.posIndex)) {
          if (this.getPiece(mouse.posIndex) == pieces.Rook) {
            if (this.handleCastle(this.pieceOn)) {
              return "casled";
            }
          }
          return false
        }

        for (let i = 0; i < 2; i++) {
          if (mouse.posIndex !== this.pieceGrabbed+i*4-2) continue
          if (this.handleCastle(i*7+((this.playing-8)*7))) {
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

  canDoublePush(pawn) {
    if (Math.floor(pawn/8)+1 == (this.isPieceLight(pawn)? 7: 2)) return true
    return false
  }

  bishopMove() {
    const side = Math.floor(mouse.posIndex/8) < Math.floor(this.pieceGrabbed/8)? 0:7;
    const dir = side == 0? -1: 1;
    const blocked = [];
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

  handleRookMove() {
    return (
    // horizontal
    this.checkRookMove(mouse.posIndex%8, this.pieceGrabbed%8, 1) 
    ||
    // vertical
    this.checkRookMove(Math.floor(mouse.posIndex/8), Math.floor(this.pieceGrabbed/8), 8)
    
    );
  }

  checkRookMove(mouseLine, pieceLine, mod) {
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

  handleCastle(rookPos) {
    if (
      this.doCastle(
        this.checkCastle(rookPos)
      )
    ) {
      if (this.canCastle == 15) {
        this.canCastle ^= (((this.playing/(2**3))**2)*3)
      }
      
      return true;
    }
    return;
  }
  
  checkCastle(piece) {
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

  doCastle(castleMove) {
    if (!castleMove) return

    this.posArray[this.pieceGrabbed] = 0;
    let kingPos = this.pieceGrabbed+castleMove*2;
    this.posArray[kingPos] = this.playing | pieces.King;
    this.kings.splice(this.playing/8-1, 1, kingPos);
    this.posArray[this.pieceGrabbed+castleMove] = this.playing | pieces.Rook;
    this.posArray[(castleMove+1)*3.5 + Math.floor(this.pieceGrabbed/8)*8] = 0;
    
    return true
  }

  checkChecks(king) {
    let pawn = this.checkPawn(king);
    let bishop = this.checkBishop(king);
    let knight = this.checkKnight(king); 
    console.log(pawn || bishop || knight ? true: false)

  }

  checkPawn(king) {
    const dir = -((this.getPieceColor(king)/8 - 1)*2 -1); // to get 1 and -1 => 1 = dark, -1 = light
    for (let i = 0; i <= 1; i ++) {
      let curr = king+dir*8 + i*2-1
      if (this.getPiece(curr) == pieces.Pawn && !this.isSameColor(this.getPieceColor(king), curr)) {
        return true;
      }
    }
  }

  checkKnight(king) {
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

  checkBishop(king) {
    const blocked = [];
    let max = king%8 < 4? 7-king%8: king%8;

    for (let i = 1; i <= max; i++) {
      for (let j = 0; j <= 1; j++) {
        let curr = 2*i*j - i;
        for (let k of [-1, 1]) {
          if (containsArr([Math.sign(curr), k], blocked)) continue;
          let piece = king + curr + k*i*8;
          if (piece > 63 || piece < 0) continue;
          if (Math.floor(piece/8) != Math.floor(king/8)+k*i) continue;

          if (this.getPiece(piece) == 0) {
            continue;
          }
          if (this.getPiece(piece) == pieces.King && !this.kings.includes(piece)) {
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

  drawSquares() {
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

function xor(a, b) {
  return (a && !b) || (!a && b);
}

function containsArr(arr1, arr2) {
  for (const a of arr2) {
    if (JSON.stringify(arr1) == JSON.stringify(a)) {
      return true;
    }
  }
  return false;
}

// *** to use: this.drawchecks.push({x: piece%8, y: Math.floor(piece/8)})