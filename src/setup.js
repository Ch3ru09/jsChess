const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");

var H = (canvas.height = innerHeight);
var W = (canvas.width = innerWidth);

var unit = Math.min((H * 0.7) / 8, (W * 0.7) / 8);

var piecesAssets = {};
function loadPieces() {
  let ps = ["pawn", "knight", "bishop", "rook", "queen", "king"];

  ps.forEach((p, i) => {
    piecesAssets[`${16 | (i + 1)}`] = newImage(`./assets/light/${p}.png`);
    piecesAssets[`${8 | (i + 1)}`] = newImage(`./assets/dark/${p}.png`);
  });
}
loadPieces();

function newImage(src) {
  var tmp = new Image();
  tmp.src = src;
  return tmp;
}

let spriteSheet = new Image();
spriteSheet.src = "./assets/spritesheets/default.png";
