import { Application } from "pixi.js";

const app = new Application({ resizeTo: window });

document.body.appendChild(app.view);

// game loop
app.ticker.add((delta) => {
    // game runs here
});
