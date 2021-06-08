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
  
//   button = createButton('submit');
//   button.position(350, 100);
  
//    let idinp = createInput('username');
//    idinp.position(50, 100);
//    idinp.size(100);
//    idinp.input(myInputEvent);
  
//   let topicinp = createInput('topic');
//   topicinp.position(200,100);
//   topicinp.size(100);
  
}

function draw() {
  background(0);

  // var vol = mic.getLevel();
  
  //background circles
  fill(255,255,255,200)
  noStroke()
  
  if (x > width || x < 0) {
    xspeed *= -1
  }
  
   x = x + xspeed;

  // + (vol*10000) 
  circle(x, windowHeight/2,200)
  
  if (x1 > width || x1 < 0) {
    x1speed *= -1
  }
  
  x1 = x1 + x1speed
  // + (vol*10000)
  circle(x1,windowHeight/2,200)
  
  //center circle
  fill(53, 171, 28,170)
  
  if (y < 0 || y > windowHeight/2) {
    yspeed *= 0
  }
  y = y + yspeed
  // + (vol*10000)
  circle(windowWidth/2,y, 200)
  
  //text biophonica
  fill(255,200);
  textFont(myFont);
  textSize(64);
  text('biophonica', windowWidth/2-175,windowHeight/2+300);
};

function myInputEvent() {
  console.log('you are typing: ', this.value());
}