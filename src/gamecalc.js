class GameCalc {
  decode(fencode, pieces) {
    this.posArray = Array(64).fill(0);
    const info = fencode.split(" ");
    this.playing = info[1] == "w" ? 16 : 8;
    info[2].split("").forEach((s) => {
      this.canCastle |= this.castling[s];
    });
    const letterToPiece = {
      p: pieces.Pawn,
      n: pieces.Knight,
      b: pieces.Bishop,
      r: pieces.Rook,
      q: pieces.Queen,
      k: pieces.King,
    };
    info[0].split("/").forEach((row, index) => {
      let c = 8 * index;
      row.split("").forEach((s) => {
        if (!isNaN(Number(s))) {
          c += Number(s);
          return;
        }
        if (s.toLowerCase() == "k") {
          this.kings.splice(s == s.toLowerCase() ? 0 : 1, 1, c);
        }
        this.posArray[c] =
          (s == s.toLowerCase() ? pieces.Dark : pieces.Light) |
          letterToPiece[s.toLowerCase()];
        c++;
      });
    });
    // board.shownArr = this.posArray;
  }

  isSameColor(playing, pos) {
    return (Math.abs(this.posArray[pos]) & playing) == playing ? true : false;
  }

  /*
  isPieceLight(piecePos) {
    return (Math.abs(this.posArray[piecePos]) & 16) == 16 ? true : false;
  }
  */

  getPiece(piece) {
    return Math.abs(this.posArray[piece]) & 7;
  }

  getPieceColor(piece) {
    return this.posArray[piece] & 24;
  }

  checkLegal2(_mouse = null, pieces, piece) {
    if (!piece) return;
  }

  getLegal(piece, pieces) {
    if (this.checkedLegal.hasOwnProperty(`${piece}`)) {
      if (this.getPiece(piece) == pieces.King) this.isK = true
      return this.checkedLegal[`${piece}`];
    }
    const legal = [];
    this.isK = false;
    const color = this.getPieceColor(piece);

    switch (this.getPiece(piece)) {
      case pieces.Pawn:
        const res = this.getPawn(color, piece, pieces);
        Object.values(res).forEach((x) => x.forEach((y) => legal.push(y)));
        break;

      case pieces.Knight:
        legal.push(...this.getKight(piece));
        break;

      case pieces.Bishop:
        legal.push(...this.getBishop(piece, pieces));
        break;

      case pieces.Rook:
        legal.push(...this.getRook(piece, pieces));
        break;

      case pieces.Queen:
        const q = this.getQueen(piece, pieces);
        legal.push(...q);
        break;

      case pieces.King: {
        this.isK = true
        const res = this.getKing(piece, pieces);
        legal.push(...res);

        if (![4, 60].includes(piece)) break;
        // Q-side castle
        const qside = -(piece % 8);
        // K-side casle
        const kside = 7 - (piece % 8);

        for (let i of [qside, kside]) {
          const r = piece + i; // position of the rook
          const curr = (r / 7) % 6;

          if ((this.canCastle & (2 ** curr)) == 0) continue;

          const diff = r - piece;
          const sign = Math.sign(diff);

          // Check if empty squares
          const color = this.getPieceColor(piece);
          empty: for (let i = 1; i < Math.abs(diff); i++) {
            let c = piece + sign * i;
            if (this.posArray[c] !== pieces.Null) break empty;

            if (this.checkChecks(c, pieces, color).length > 0) break empty;
            if (i !== Math.abs(diff) - 1) continue empty;
            if (i > 2) {
              c = piece + sign * (i-1)
              legal.push(c)
              break empty
            }
            legal.push(c)
          }
        }
        // TODO: castling

        break;
      }

      default:
        break;
    }

    if (legal.length > 0) {
      this.checkedLegal[`${piece}`] = legal;
    }

    return legal;
  }

  getPawn(color, piece, pieces) {
    const dir = Math.sign(color - 12); // to get -1 and +1
    const epRow = ((color - 8) / 8) * 5 + 1;
    const one = piece - 8 * dir;

    // --- forward ---
    const f = [];
    if (this.posArray[one] == pieces.Null) {
      f.push(one);

      const two = piece - 2 * 8 * dir;
      if (this.posArray[two] == pieces.Null && Math.floor(piece / 8) == epRow) {
        f.push(two);
        this.enPassant = one;
      }
    }

    // ---------------

    // --- capture ---
    const c = [];
    for (let i of [-1, 1]) {
      const curr = one + i;
      if (
        !this.posArray[curr] ||
        this.posArray[curr] == pieces.Null ||
        this.getPieceColor(curr) == this.getPieceColor(piece)
      )
        continue;

      c.push(curr);
    }
    // ---------------

    return { forward: f, capture: c };
  }

  getKight(piece) {
    const legal = [];
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;

      let curr = piece - i * 8;

      for (let j = 0; j < 2; j++) {
        let c = j * 2 - 1;
        let s = curr + Math.abs(Math.abs(i) - 2) * c + c;
        let ycheck = Math.abs(Math.floor(piece / 8) - Math.floor(s / 8)) > 2;
        if (Math.abs((piece % 8) - (s % 8)) > 2 || s > 63 || s < 0 || ycheck)
          continue;
        if (this.getPieceColor(s) == this.getPieceColor(piece)) continue;

        legal.push(s);
      }
    }
    return legal;
  }

  getBishop(piece, pieces) {
    const max = Math.max(piece % 8, 7 - (piece % 8));
    const legal = [];
    for (let i of [-1, 1]) {
      const blocked = [];

      for (let j = 1; j <= max; j++) {
        if (blocked.length == 2) break;

        let curr = piece - i * j * 8;
        for (let k of [-1, 1]) {
          if (blocked.includes(k)) continue;
          const c = curr + k * j;
          if (c > 63 || c < 0) continue;
          if (c % 8 != (piece % 8) + k * j) continue;
          if (this.posArray[c] !== pieces.Null) {
            blocked.push(k);

            if (this.getPieceColor(c) != this.getPieceColor(piece)) {
              legal.push(c);
            }
            continue;
          }
          legal.push(c);
        }
      }
    }
    return legal;
  }

  getRook(piece, pieces) {
    const xmax = Math.max(piece % 8, 7 - (piece % 8));
    const ymax = Math.max(Math.floor(piece / 8), 7 - Math.floor(piece / 8));

    const resx = this.getRookMoves(
      xmax,
      1,
      piece,
      pieces,
      Math.floor(piece / 8)
    );
    const resy = this.getRookMoves(ymax, 8, piece, pieces);

    return resx.concat(...resy);
  }

  getQueen(piece, pieces) {
    const b = this.getBishop(piece, pieces);
    const r = this.getRook(piece, pieces);

    return [...b, ...r];
  }

  getKing(piece) {
    const legal = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i == 0 && j == 0) continue;

        const curr = piece + i * 8 + j;

        if (curr > 63 || curr < 0) continue;
        if (this.getPieceColor(curr) == this.getPieceColor(piece)) continue;
        if (Math.abs((piece % 8) - (curr % 8)) > 2) continue;

        legal.push(curr);
      }
    }
    return legal;
  }

  getRookMoves(max, mod, piece, pieces, check) {
    const blocked = [];
    const legal = [];
    for (let i of [-1, 1]) {
      if (blocked.length == 2) break;
      if (blocked.includes(i)) continue;

      for (let j = 1; j <= max; j++) {
        if (blocked.includes(i)) continue;

        const curr = piece + i * j * mod;
        if (curr > 63 || curr < 0) continue;
        if (mod == 1) {
          if (Math.floor(curr / 8) !== check) continue;
        }

        if (this.posArray[curr] !== pieces.Null) {
          blocked.push(i);

          if (this.getPieceColor(curr) != this.getPieceColor(piece)) {
            legal.push(curr);
          }
          continue;
        }
        legal.push(curr);
      }
    }
    return legal;
  }

  checkChecks(king, pieces, color) {
    const checks = [];

    const check = (arr, p) => {
      arr.forEach((x) => {
        if (this.getPiece(x) !== p) return;
        if (this.getPieceColor(x) == color) return;
        checks.push(x);
      });
    };

    const pawn = this.getPawn(color, king, pieces)?.capture;
    check(pawn, pieces.Pawn);

    const knight = this.getKight(king);
    check(knight, pieces.Knight);

    const bishop = this.getBishop(king, pieces);
    check(bishop, pieces.Bishop);

    const rook = this.getRook(king, pieces);
    check(rook, pieces.Rook);

    const queen = this.getQueen(king, pieces);
    check(queen, pieces.Queen);

    const kingMoves = this.getKing(king);
    check(kingMoves, pieces.King);

    return checks;
  }
}
