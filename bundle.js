(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./src/game");
// import { Board } from "./src/board";
// import { Mouse } from "./src/mouse";
// import { GameState } from "./src/gamestate";
const canvas = document.getElementById("game");
const game = new game_1.Game(innerHeight, innerHeight, canvas);
game.animate(canvas);

},{"./src/game":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
class Board {
    constructor(W, H, unit) {
        this.reversed = false;
        this.w = 8 * unit;
        this.x = (W - this.w) / 2;
        this.y = (H - this.w) / 2;
        this.colors = [
            "#888",
            "#eee",
        ];
    }
    ;
    draw(canvas, unit, mouse, gameState, piecesAssets) {
        const ctx = canvas.getContext("2d");
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = "#000";
        const border = 10;
        ctx.fillRect(-border / 2, -border / 2, this.w + border, this.w + border);
        ctx.fillStyle = this.colors[0];
        ctx.fillRect(0, 0, this.w, this.w);
        this.drawSmallSquares(ctx, unit);
        this.mouse(mouse, gameState, canvas, unit);
        this.drawPieces(gameState, ctx, unit, piecesAssets, mouse);
        ctx.restore();
    }
    drawSmallSquares(ctx, unit) {
        ctx.fillStyle = this.colors[1];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 8; j++) {
                ctx.fillRect(2 * i * unit + (j % 2 ? unit : 0), j * unit, unit, unit);
            }
        }
    }
    drawPieces(gameState, ctx, unit, piecesAssets, mouse) {
        let grabbed;
        gameState.posArray.forEach((s, i) => {
            ctx.fillStyle = "#000";
            ctx.fillText(`${i}`, (i % 8) * unit + 0.1 * unit, Math.floor(i / 8) * unit + 0.2 * unit, 100);
            if (s == 0)
                return;
            var a, coor;
            if (Number(s) < 0) {
                grabbed = -s;
            }
            else {
                coor = { x: (i % 8) * unit, y: Math.floor(i / 8) * unit };
                a = s;
                
                ctx.drawImage(piecesAssets[`${a}`], coor.x, coor.y, unit, unit);
            }
        });
        if (grabbed) {
            var coor = { x: mouse.pos.x - this.x - unit / 2, y: mouse.pos.y - this.y - unit / 2 };
            ctx.drawImage(piecesAssets[`${grabbed}`], coor.x, coor.y, unit, unit);
        }
    }
    resize(screen) {
        this.w = 8 * screen.unit;
        this.x = (screen.W - this.w) / 2;
        this.y = (screen.H - this.w) / 2;
    }
    mouse(mouse, gameState, canvas, unit) {
        const ctx = canvas.getContext("2d");
        if (!mouse.inBoard) {
            canvas.style.cursor = "default";
            return;
        }
        let pos = Object.values(mouse.posInBoard).map((v) => {
            return v * unit;
        });
        if (gameState.posArray[mouse.posIndex] !== 0) {
            canvas.style.cursor = "grab";
            gameState.pieceOn = mouse.posIndex;
        }
        else {
            canvas.style.cursor = "default";
            gameState.pieceOn = null;
        }
        ctx.save();
        ctx.fillStyle = "#f008";
        ctx.fillRect(pos[0], pos[1], unit, unit);
        ctx.restore();
    }
}
exports.Board = Board;
/*
class Board {
  constructor() {
    this.w = 8*unit;
    this.x = (W-this.w)/2;
    this.y = (H-this.w)/2;
    this.colors = [
      "#888",
      "#eee",
    ];
    this.position =
      this.initialPos = "";
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = "#000";
    const border = 10;
    ctx.fillRect(-border/2, -border/2, this.w+border, this.w+border);
    ctx.fillStyle = this.colors[0];
    ctx.fillRect(0, 0, this.w, this.w);

    this.drawSmallSquares();

    this.mouse();
    this.drawPieces();
    ctx.restore();
  }

  drawSmallSquares() {
    ctx.fillStyle = this.colors[1];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        ctx.fillRect(2*i*unit + (j % 2 ? unit : 0), j*unit, unit, unit);
      }
    }
  }

  drawPieces() {
    let grabbed;
    gameState.posArray.forEach((s, i) => {
      ctx.fillStyle = "#000";
      ctx.fillText(`${i}`, (i % 8)*unit + 0.1*unit, Math.floor(i / 8)*unit + 0.2*unit, 100, 100)
      if (s == 0) return;
      var a, coor

      if (Number(s) < 0) {
        grabbed = -s;
      } else {
        coor = { x: (i % 8)*unit, y: Math.floor(i / 8)*unit }
        a = s;
        ctx.drawImage(piecesAssets[`${a}`], coor.x, coor.y, unit, unit)
      }

    });
    if (grabbed) {
      var coor = { x: mouse.pos.x-this.x-unit/2, y: mouse.pos.y-this.y-unit/2}
      ctx.drawImage(piecesAssets[`${grabbed}`], coor.x, coor.y, unit, unit)
    }
  }

  resize() {
    this.w = 8*unit;
    this.x = (W-this.w)/2;
    this.y = (H-this.w)/2;
  }

  mouse() {
    if (!mouse.inBoard) {
      canvas.style.cursor = "default";
      return;
    }

    let pos = Object.values(mouse.posInBoard).map(v => {
      return v*unit;
    });

    if (gameState.posArray[mouse.posIndex] !== 0) {
      canvas.style.cursor = "grab";
      gameState.pieceOn = mouse.posIndex;
    } else {
      canvas.style.cursor = "default";
      gameState.pieceOn = null;
    }

    ctx.save();
    ctx.fillStyle = "#f008";
    ctx.fillRect(pos[0], pos[1], unit, unit);
    ctx.restore();
  }

}
 */ 

},{}],3:[function(require,module,exports){
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

},{"./board":2,"./gamestate":4,"./mouse":5,"./pieces":6}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
class GameState {
    constructor() {
        // playing: number;
        // private posArray: Array<number>;
        // pieceOn: any;
        // pieceGrabbed: any;
        // enPassant: any;
        // epCheck: boolean;
        // canCastle: number;
        // castling: {[id: string]: number};
        // moves: object;
        // kings = new Array(2).fill(0);
        // drawchecks: Array<object>;
        this.playing = 0;
        this.posArray = Object.seal(Array(64).fill(0));
        this.pieceOn = null;
        this.pieceGrabbed = null;
        this.enPassant = null;
        this.epCheck = false;
        this.canCastle = 0; // 1111
        // KQkq
        this.castling = { "K": 8, "Q": 4, "k": 2, "q": 1 };
        this.moves = { halfMove: 0, fullMove: 0 };
        // 0: dark, 1: light
        this.kings = new Array(2).fill(0);
        this.drawchecks = [];
    }
    // constructor() {
    // 16: Light, 8: Dark
    // this.playing = 0;
    // this.posArray = Object.seal(Array(64).fill(0));
    // this.pieceOn = null;
    // this.pieceGrabbed = null;
    // this.enPassant = null;
    // this.epCheck = false
    // this.canCastle = 0; // 1111
    //                      // KQkq
    // this.castling = {"K": 8, "Q": 4, "k": 2, "q": 1};
    // this.moves = {halfMove: 0, fullMove: 0};
    // 0: dark, 1: light
    // this.kings = new Array(2).fill(0);
    // this.drawchecks = [];
    // }
    decode(fencode, pieces, board) {
        this.posArray = Array(64).fill(0);
        const info = fencode.split(" ");
        this.playing = info[1] == "w" ? 16 : 8;
        info[2].split("").forEach(s => { this.canCastle |= this.castling[s]; });
        const letterToPiece = {
            "p": pieces.Pawn, "n": pieces.Knight, "b": pieces.Bishop, "r": pieces.Rook, "q": pieces.Queen, "k": pieces.King,
        };
        info[0].split("/").forEach((row, index) => {
            let c = 8 * index;
            row.split("").forEach(s => {
                if (!isNaN(Number(s))) {
                    c += Number(s);
                    return;
                }
                if (s.toLowerCase() == "k") {
                    this.kings.splice(s == s.toLowerCase() ? 0 : 1, 1, c);
                }
                this.posArray[c] = (s == s.toLowerCase() ? pieces.Dark : pieces.Light) | letterToPiece[s.toLowerCase()];
                c++;
            });
        });
        // board.shownArr = this.posArray;
    }
    isSameColor(playing, pos) {
        return (Math.abs(this.posArray[pos]) & playing) == playing ? true : false;
    }
    isPieceLight(piecePos) {
        return (Math.abs(this.posArray[piecePos]) & 16) == 16 ? true : false;
    }
    getPiece(piece) {
        return Math.abs(this.posArray[piece]) & 7;
    }
    getPieceColor(piece) {
        return this.posArray[piece] & 24;
    }
    checkLegal(mouse, pieces) {
        if (!mouse.inBoard)
            return false;
        if (this.pieceGrabbed == null)
            return false;
        if (this.isSameColor(this.playing, mouse.posIndex) && this.getPiece(this.pieceGrabbed) != pieces.King)
            return false;
        switch (this.getPiece(this.pieceGrabbed)) {
            case pieces.Pawn:
                let direction = this.isPieceLight(this.pieceGrabbed) ? -1 : 1;
                // get 1 and 2 for 1 forwards or 2 forwards:
                for (let i = 1; i <= 2; i++) {
                    if (mouse.posIndex != this.pieceGrabbed + (8 * direction * (i)))
                        continue;
                    if (this.pieceOn != null)
                        return false;
                    if (this.posArray[this.pieceGrabbed + (8 * direction)] != 0)
                        return false;
                    if (i != 2)
                        return true;
                    if (this.canDoublePush(this.pieceGrabbed)) {
                        this.enPassant = this.pieceGrabbed + (8 * direction);
                        this.epCheck = true;
                        return true;
                    }
                }
                // get -1 and 1 for side captures
                for (let i of [-1, 1]) {
                    if (mouse.posIndex != this.pieceGrabbed + (8 * direction + (i)))
                        continue;
                    if (mouse.posIndex == this.enPassant) {
                        this.posArray[this.enPassant + (-direction * 8)] = 0;
                        return true;
                    }
                    if (this.pieceOn == null)
                        break;
                    return true;
                }
                break;
            case pieces.Knight:
                const side = Math.floor(mouse.posIndex / 8) < Math.floor(this.pieceGrabbed / 8) ? 0 : 7;
                const dir = side == 0 ? -1 : 1;
                for (let i = 1; i <= 2; i++) {
                    for (let j = 0; j < 2; j++) {
                        let xdelta = i == 1 ? 2 : 1;
                        let curr = this.pieceGrabbed + i * 8 * dir + j * 2 * xdelta - xdelta;
                        if (mouse.posIndex == curr)
                            return true;
                    }
                }
                break;
            case pieces.Bishop:
                return this.bishopMove(mouse);
            case pieces.Rook:
                return this.handleRookMove(mouse);
            case pieces.Queen:
                return this.bishopMove(mouse) || this.handleRookMove(mouse);
            case pieces.King:
                if (this.isSameColor(this.playing, mouse.posIndex)) {
                    if (this.getPiece(mouse.posIndex) == pieces.Rook) {
                        if (this.handleCastle(this.pieceOn, pieces)) {
                            return "casled";
                        }
                    }
                    return false;
                }
                for (let i = 0; i < 2; i++) {
                    if (mouse.posIndex !== this.pieceGrabbed + i * 4 - 2)
                        continue;
                    if (this.handleCastle(i * 7 + ((this.playing - 8) * 7), pieces)) {
                        return "casled";
                    }
                    continue;
                }
                for (let i = -1; i < 2; i++) {
                    if (Math.floor((this.pieceGrabbed + i * 8) / 8) != Math.floor(mouse.posIndex / 8))
                        continue;
                    for (let j = -1; j < 2; j++) {
                        if (i == 0 && j == 0)
                            continue;
                        const curr = this.pieceGrabbed + i * 8 + j;
                        if (curr == mouse.posIndex) {
                            if (this.canCastle == 15) {
                                this.canCastle ^= (((this.playing / (2 ** 3)) ** 2) * 3);
                            }
                            this.kings.splice(this.playing / 8 - 1, 1, mouse.posIndex);
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
        if (Math.floor(pawn / 8) + 1 == (this.isPieceLight(pawn) ? 7 : 2))
            return true;
        return false;
    }
    bishopMove(mouse) {
        const side = Math.floor(mouse.posIndex / 8) < Math.floor(this.pieceGrabbed / 8) ? 0 : 7;
        const dir = side == 0 ? -1 : 1;
        const blocked = [];
        for (let i = 1; i <= Math.abs(side - (Math.floor(this.pieceGrabbed / 8))); i++) {
            if (blocked.length == 2)
                break;
            for (let j = 0; j < 2; j++) {
                if (blocked.includes(j))
                    continue;
                let curr = this.pieceGrabbed + dir * 8 * i + j * i * 2 - i;
                if (curr > 64 || curr < 0)
                    continue;
                if (Math.floor(curr / 8) != Math.floor(this.pieceGrabbed / 8) + dir * i)
                    continue;
                if (this.posArray[curr] !== 0 && curr !== mouse.posIndex) {
                    blocked.push(j);
                    continue;
                }
                if (mouse.posIndex == curr) {
                    return true;
                }
            }
        }
        return false;
    }
    handleRookMove(mouse) {
        return (
        // horizontal
        this.checkRookMove(mouse.posIndex % 8, this.pieceGrabbed % 8, 1, mouse)
            ||
                // vertical
                this.checkRookMove(Math.floor(mouse.posIndex / 8), Math.floor(this.pieceGrabbed / 8), 8, mouse));
    }
    checkRookMove(mouseLine, pieceLine, mod, mouse) {
        // mod is for the 8x while moving vertically
        const side = Math.floor(mouseLine) < pieceLine ? 0 : 7;
        const dir = side == 0 ? -1 : 1;
        for (let i = 1; i <= Math.abs(side - (pieceLine)); i++) {
            let curr = this.pieceGrabbed + mod * i * dir;
            if (this.posArray[curr] !== 0 && curr != mouse.posIndex) {
                break;
            }
            if (mouse.posIndex == curr) {
                return true;
            }
        }
        return false;
    }
    handleCastle(rookPos, pieces) {
        if (this.doCastle(this.checkCastle(rookPos), pieces)) {
            if (this.canCastle == 15) {
                this.canCastle ^= (((this.playing / (2 ** 3)) ** 2) * 3);
            }
            return true;
        }
        return;
    }
    checkCastle(piece) {
        if (![0, 7, 56, 63].includes(piece))
            return;
        var curr = (piece / 7) % 7 + 1;
        if (piece / 7 > 4) {
            curr = 2 ** curr;
        }
        if ((this.canCastle & curr) === 0)
            return;
        let min = Math.min(piece, this.pieceGrabbed) + 1;
        let max = Math.max(piece, this.pieceGrabbed);
        for (let i = min; i < max; i++) {
            if (this.posArray[i] !== 0)
                return false;
        }
        return Math.sign(piece - this.pieceGrabbed);
    }
    doCastle(castleMove, pieces) {
        if (!castleMove)
            return;
        this.posArray[this.pieceGrabbed] = 0;
        let kingPos = this.pieceGrabbed + castleMove * 2;
        this.posArray[kingPos] = this.playing | pieces.King;
        this.kings.splice(this.playing / 8 - 1, 1, kingPos);
        this.posArray[this.pieceGrabbed + castleMove] = this.playing | pieces.Rook;
        this.posArray[(castleMove + 1) * 3.5 + Math.floor(this.pieceGrabbed / 8) * 8] = 0;
        return true;
    }
    checkChecks(king, pieces) {
        const color = this.getPieceColor(king);
        const pawn = this.checkPawn(king, pieces);
        const knight = this.checkKnight(king, pieces);
        const bishop = this.checkBishop(king, pieces);
        const rook = this.checkRook(king, pieces);
        const queen = this.checkRook(king, pieces) || this.checkBishop(king, pieces);
        const res = (pawn || bishop || knight || rook || queen) ? true : false;
        return [res, color];
    }
    checkPawn(king, pieces) {
        const dir = -((this.getPieceColor(king) / 8 - 1) * 2 - 1); // to get 1 and -1 => 1 = dark, -1 = light
        for (let i = 0; i <= 1; i++) {
            let curr = king + dir * 8 + i * 2 - 1;
            if (this.getPiece(curr) == pieces.Pawn && !this.isSameColor(this.getPieceColor(king), curr)) {
                return true;
            }
        }
    }
    checkKnight(king, pieces) {
        for (const dir of [-1, 1]) {
            for (let i = 1; i <= 2; i++) {
                for (let j = 0; j < 2; j++) {
                    let xdelta = i == 1 ? 2 : 1;
                    let piece = king + i * 8 * dir + j * 2 * xdelta - xdelta;
                    if (piece > 63 || piece < 0)
                        continue;
                    if (piece % 8 != king % 8 + j * 2 * xdelta - xdelta)
                        continue;
                    if (!this.isSameColor(this.getPieceColor(king), piece) && this.getPiece(piece) == pieces.Knight) {
                        return true;
                    }
                }
            }
        }
    }
    checkBishop(king, pieces) {
        const blocked = [];
        const max = king % 8 < 4 ? 7 - king % 8 : king % 8;
        for (let i = 1; i <= max; i++) {
            for (let j = 0; j <= 1; j++) {
                let curr = 2 * i * j - i;
                for (let k of [-1, 1]) {
                    if (containsArr([Math.sign(curr), k], blocked))
                        continue;
                    let piece = king + curr + k * i * 8;
                    if (piece > 63 || piece < 0)
                        continue;
                    if (Math.floor(piece / 8) != Math.floor(king / 8) + k * i)
                        continue;
                    if (this.getPiece(piece) == pieces.Null) {
                        continue;
                    }
                    if (this.isSameColor(this.getPieceColor(king), piece)) {
                        // guard clause, else:
                        blocked.push([Math.sign(curr), k]);
                        continue;
                    }
                    // else :
                    if (this.getPiece(piece) == pieces.Bishop)
                        return true;
                    // guard clause, else:
                    blocked.push([Math.sign(curr), k]);
                    continue;
                }
            }
        }
    }
    checkRook(king, pieces) {
        // %: horizontal, /: vertical
        for (const op of ["%", "/"]) {
            let max = eval(`Math.floor(${king}${op}8)<4? 7-Math.floor(${king}${op}8): Math.floor(${king}${op}8)`);
            let blocked = [];
            for (let i = 1; i <= max; i++) {
                for (const k of [-1, 1]) {
                    if (blocked.includes(k))
                        continue;
                    let piece = king + i * k * (op == "%" ? 1 : 8);
                    if (piece > 63 || piece < 0)
                        continue;
                    let checkOp = op == "%" ? "/" : "%";
                    if (eval(`Math.floor(${piece}${checkOp}8)`) != eval(`Math.floor(${king}${checkOp}8)`))
                        continue;
                    this.drawchecks.push({ x: piece % 8, y: Math.floor(piece / 8) });
                    if (this.getPiece(piece) == pieces.Null)
                        continue;
                    if (this.isSameColor(this.getPieceColor(king), piece)) {
                        blocked.push(k);
                        continue;
                    }
                    if (this.getPiece(piece) == pieces.Rook) {
                        return true;
                    }
                }
            }
        }
    }
    drawSquares(ctx, board, unit) {
        this.drawchecks.forEach(p => {
            ctx.save();
            ctx.translate(board.x, board.y);
            ctx.fillStyle = "#448";
            ctx.beginPath();
            ctx.arc(p.x * unit + unit / 2 + unit / 64, p.y * unit + unit / 2, unit / 8, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        });
    }
}
exports.GameState = GameState;
// function xor(a: boolean, b: boolean) {
//   return (a && !b) || (!a && b);
// }
function containsArr(arr1, arr2) {
    for (const a of arr2) {
        if (JSON.stringify(arr1) == JSON.stringify(a)) {
            return true;
        }
    }
    return false;
}

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mouse = void 0;
class Mouse {
    constructor() {
        this.pos = { x: 0, y: 0 };
        // note: this is chess coords but (0,0) is top left
        this.posInBoard = { x: 0, y: 0 };
        this.inBoard = false;
        this.posIndex = null;
    }
    isInBoard(board) {
        if (this.pos.x < board.x || this.pos.x > board.x + board.w)
            return false;
        if (this.pos.y < board.y || this.pos.y > board.y + board.w)
            return false;
        return true;
    }
    getPosInBoard(board, unit) {
        return {
            x: Math.floor((this.pos.x - board.x) / unit),
            y: Math.floor((this.pos.y - board.y) / unit),
        };
    }
    getPosIndex(board) {
        return Math.abs((board.reversed ? 63 : 0) - (this.posInBoard.y * 8 + this.posInBoard.x));
    }
}
exports.Mouse = Mouse;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pieces = void 0;
class Pieces {
    constructor() {
        this.Null = 0;
        this.Pawn = 1;
        this.Knight = 2;
        this.Bishop = 3;
        this.Rook = 4;
        this.Queen = 5;
        this.King = 6;
        this.Light = 16;
        this.Dark = 8;
    }
}
exports.Pieces = Pieces;

},{}]},{},[1]);
