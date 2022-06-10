const canvas =  document.createElement("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const H = canvas.height = innerHeight;
const W = canvas.width = innerWidth;

const unit = 60;