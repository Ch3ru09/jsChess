const canvas = document.getElementById("game")

const ctx = canvas.getContext("2d");

var H = canvas.height = innerHeight;
var W = canvas.width = innerWidth;

var unit = Math.min(H*0.7/8, W*0.7/8);


var piecesAssets = {};
function loadPieces() {
  let ps = ["pawn", "knight", "bishop", "rook", "queen", "king"];
  
  ps.forEach((p, i) => {
    piecesAssets[`${16 |(i+1)}`] = new Image();
    piecesAssets[`${16 |(i+1)}`].src = `./assets/light/${p}.png`;
    piecesAssets[`${8 |(i+1)}`] = new Image();
    piecesAssets[`${8 |(i+1)}`].src = `./assets/dark/${p}.png`;
  });
} loadPieces();

let spriteSheet = new Image();
spriteSheet.src = "./assets/spritesheets/default.png";