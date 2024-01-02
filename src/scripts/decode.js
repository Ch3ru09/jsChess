import Pieces from "./pieces"

function decode(fencode) {
    const temporaryBoard = [];
    const pieces = new Pieces();

    const info = fencode.split(" ");
    const playing = info[1] === "w" ? 1 : 0;
    let canCastle = 0b0000;

    const letterToCastling = {
        K: 0b0001,
        Q: 0b0010,
        k: 0b0100,
        q: 0b1000,
    }

    for (let s of info[2].split("")) {
        canCastle |= letterToCastling[s];
    }

    const letterToPiece = {
        p: pieces.PAWN,
        n: pieces.KNIGHT,
        b: pieces.BISHOP,
        r: pieces.ROOK,
        q: pieces.QUEEN,
        k: pieces.KING,
    };

    const position = info[0].split("/")
    for (let index = 0; index < position.length; index++) {
        const row = position[index];

        let c = 8 * index;
        for (let s of row.split("")) {
            if (!Number.isNaN(Number(s))) {
                c += Number(s);
                return;
            }
            temporaryBoard[c] =
                (s === s.toLowerCase() ? pieces.Dark : pieces.Light) |
                letterToPiece[s.toLowerCase()];
            c++;
        };
    };

    const enPassant = info[3];

    return { info: { playing, canCastle, enPassant }, board: temporaryBoard };
}

export { decode }
