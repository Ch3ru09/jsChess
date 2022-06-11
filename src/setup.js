const canvas =  document.createElement("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

var H = canvas.height = innerHeight;
var W = canvas.width = innerWidth;

var unit = H*0.8/8;