class Pieces {
    constructor() {
        this.NULL = 0;

        // using 3-bit binary representation
        // 001
        this.PAWN = 1;
        // 010
        this.KNIGHT = 2;
        // 011
        this.BISHOP = 3;
        // 100
        this.ROOK = 4;
        // 101
        this.QUEEN = 5;
        // 110
        this.KING = 6;


        this.WHITE = 0;
        this.BLACK = 1;
    }

    getColor(piece) {
        // mask with 1000
        return piece & 8;
    }

    getPiece(piece) {
        // mask with 0111
        return piece & 7;
    }

    isCurrentlyPlaying(piece, currentlyPlaying) {
        return (~(this.getColor(piece) ^ currentlyPlaying) + 2) === 1
    }
}
