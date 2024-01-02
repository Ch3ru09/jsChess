class Pieces {
    constructor() {
        this.NULL = 0b000;

        this.PAWN = 0b001;
        this.KNIGHT = 0b010;
        this.BISHOP = 0b011;
        this.ROOK = 0b100;
        this.QUEEN = 0b101;
        this.KING = 0b110;

        this.WHITE = 0b0000;
        this.BLACK = 0b1000;
    }

    getColor(piece) {
        return piece & 0b1000;
    }

    getPiece(piece) {
        return piece & 0b0111;
    }

    isCurrentlyPlaying(piece, currentlyPlaying) {
        return (~(this.getColor(piece) ^ currentlyPlaying) + 2) === 1
    }
}

export default Pieces;
