"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const board_1 = require("./board");
const gamestate_1 = require("./gamestate");
const mouse_1 = require("./mouse");
const pieces_1 = require("./pieces");
class Game {
    constructor(width, height, canvas) {
        this.piecesAssets = {};
        canvas.width = this.W = width;
        canvas.height = this.H = height;
        this.unit = Math.min(this.H * 0.7 / 8, this.W * 0.7 / 8);
        this.board = new board_1.Board(this.W, this.H, this.unit);
        this.gameState = new gamestate_1.GameState();
        this.mouse = new mouse_1.Mouse();
        this.pieces = new pieces_1.Pieces();
    }
    resetRes(board) {
        this.H = innerHeight;
        this.W = innerWidth;
        this.unit = Math.min(this.H * 0.7 / 8, this.W * 0.7 / 8);
    }
    loadPieces() {
        let ps = ["pawn", "knight", "bishop", "rook", "queen", "king"];
        const newImage = (src) => {
            var tmp = new Image();
            tmp.src = src;
            return tmp;
        };
        ps.forEach((p, i) => {
            this.piecesAssets[`${16 | (i + 1)}`] = newImage(`./assets/light/${p}.png`);
            this.piecesAssets[`${8 | (i + 1)}`] = newImage(`./assets/dark/${p}.png`);
        });
    }
    draw(canvas) {
        this.board.draw(canvas, this.unit, this.mouse, this.gameState, this.piecesAssets);
    }
    animate(canvas) {
        this.draw(canvas);
        requestAnimationFrame(this.animate(canvas));
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map