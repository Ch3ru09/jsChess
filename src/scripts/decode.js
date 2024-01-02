function decode(fencode) {
    const temporaryBoard = [];
    const pieces = new Pieces();

    const info = fencode.split(" ");
    this.playing = info[1] === "w" ? 1 : 0;
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
            if (!Number.isNaN(Number(s))) {
                c += Number(s);
                return;
            }
            if (s.toLowerCase() === "k") {
                this.kings.splice(s === s.toLowerCase() ? 0 : 1, 1, c);
            }
            this.posArray[c] =
                (s === s.toLowerCase() ? pieces.Dark : pieces.Light) |
                letterToPiece[s.toLowerCase()];
            c++;
        });
    });
    return temporaryBoard;
}

export { decode }
