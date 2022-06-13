class Mouse {
    constructor() {
        this.pos = {x: 0, y: 0};
        // note: this is chess coords but (0,0) is top left
        this.posInBoard = {x: 0, y: 0};
        this.inBoard = true;
    }

    isInBoard() {
        if (this.pos.x < board.x || this.pos.x > board.x+board.w) return false;
        if (this.pos.y < board.y || this.pos.y > board.y+board.w) return false;
        return true;
    }

    getPosInBoard() {
        return {
            x: Math.floor((this.pos.x - board.x)/unit),
            y: Math.floor((this.pos.y - board.y)/unit),
        };

    }

    getPosIndex() {
        return mouse.posInBoard.y*8 + mouse.posInBoard.x
    }
}