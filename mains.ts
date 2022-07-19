import { Game } from "./src/game";
// import { Board } from "./src/board";
// import { Mouse } from "./src/mouse";
// import { GameState } from "./src/gamestate";

const canvas = document.getElementById("game") as HTMLCanvasElement;

window.onload = () => {
  var game = new Game(innerHeight, innerHeight, canvas);
  game.animate(canvas);
}

