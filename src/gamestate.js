class GameState {
  constructor() {
    // 8: Light, 16: Dark
    this.playing = 0;
    this.posArray = Array(64).fill(0);
    this.pieceOn = null;
    this.pieceGrabbed = null;
    this.enPassant = null;
  }

  decode(fencode) {
    this.posArray = Array(64).fill(0);
    const info = fencode.split(" ");
    this.playing = info[1] == "w"? 8: 16;
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

  isPieceLight(piecePos) {
    return (Math.abs(this.posArray[piecePos]) & 8) == 8 ? true: false;
  }

  checkLegal() {
    if (!mouse.inBoard) return false;
    if (!xor(this.isPieceLight(mouse.getPosIndex()), this.isPieceLight(this.pieceGrabbed))) return false;

    switch ((Math.abs(this.posArray[this.pieceGrabbed]) << 29) >>> 29) {
      case pieces.Pawn:
        let direction = this.isPieceLight(this.pieceGrabbed)? -1: 1;
        if (mouse.pieceOn != null) return false

        if (mouse.getPosIndex() == this.pieceGrabbed+(8*direction)) return true;
        if (this.checkPawnDoublePush(this.pieceGrabbed)) {
          if (mouse.getPosIndex() == this.pieceGrabbed+(8*direction*2)) return true;
          this.enPassant = this.pieceGrabbed+(8*direction);
        }
        break;

      case pieces.Knight:
        console.log("Knight");
        break;

      case pieces.Bishop:
        console.log("Bishop");
        break;

      case pieces.Rook:
        console.log("Rook");
        break;

      case pieces.Queen:
        console.log("Queen");
        break;

      case pieces.King:
        console.log("King");
        break;

      default:
        break;
    }
    console.log(this.playing ^ 24);
    // this.playing = this.playing ^ 24
    return true;
  }

  checkPawnDoublePush(piece) {
    if (Math.floor(piece/8)+1 == (this.isPieceLight(piece)? 7: 2)) return true
    return false
  }
}

function xor(a, b) {
  return (a || b) && !(a && b);
}