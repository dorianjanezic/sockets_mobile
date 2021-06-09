console.log("hello");
//global variables
let button;
let canvas;
var mic;

//load font
let myFont;
function preload() {
  myFont = loadFont('arialbold.ttf');
}

function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  // mic = new p5.AudioIn();
  // mic.start();
  x = 0
  xspeed = 1
  x1 = width
  x1speed = 1
  y = 0
  yspeed = 0.5
};

function draw() {
    background(0);

    fill(56,115,133);
    textFont(myFont);
    textSize(64);
    text('oceania', windowWidth/2-130,windowHeight/5);
}