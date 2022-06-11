class GameState {
  constructor() {
    // 0: white, 1: black
    this.playing = 0;
    this.posArray = Array(64).fill(0);
  }

  decode(fencode) {
    this.posArray = Array(64).fill(0);
    const info = fencode.split(" ");
    this.playing = info[1] == "w"? 0: 1;
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
        this.posArray[c] = (s == s.toLowerCase()? pieces.Black: pieces.White) | letterToPiece[s.toLowerCase()];
        c++;
      })
    });
  }
}