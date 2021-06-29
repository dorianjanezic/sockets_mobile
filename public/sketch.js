
//global variables
let button;
let canvas;
var mic;
let anglea, beta, gamma;

//load font
let myFont;
function preload() {
  myFont = loadFont('biome.ttf');
}

function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}

window.addEventListener('load', function () {

  document.getElementById("motion").addEventListener("click", async () => {
    console.log("here");
      if (isIOSDevice()) {
        getAccel();
        
      } else {
      startDeviceOrientation();
  };
});

  function isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  };

  document.getElementById("accelPermsButton").addEventListener("click", async () => {
    console.log("ab");
    
    if (isIOSDevice()) {
      console.log("I am an IOS device!");
      getAccel();
    };
  });

  //android devices access motion sensor
  function getAccel() {
    console.log("a");
    DeviceMotionEvent.requestPermission().then(response => {
      if (response == "granted") {
        // Add a listener to get smartphone orientation
        // in the alpha-beta-gamma axes (units in degrees)
        window.addEventListener("deviceorientation", e => {
          console.log(e);
          anglea = document.getElementById("alpha").innerHTML = e.alpha;
          beta = document.getElementById("beta").innerHTML = e.beta;
          document.getElementById("gama").innerHTML = e.gamma;
        });
      };
    });
  };

      //Console log euler angles
    function startDeviceOrientation() {
      window.addEventListener("deviceorientation", e => {
        anglea = e.alpha;
        beta  = e.beta;
        gamma = e.gamma;
      });
    };
});
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  // mic = new p5.AudioIn();
  // mic.start();
  x = 1
  xspeed = 2
  x1 = width
  x1speed = -2
  y = 0
  yspeed = 1

  let player = new Tone.Player("assets/32_50.wav");
  player.autostart = true;

  //text biophonica

  
//   button = createButton('submit');
//   button.position(350, 100);
  
//    let idinp = createInput('username');
//    idinp.position(50, 100);
//    idinp.size(100);
//    idinp.input(myInputEvent);
  
//   let topicinp = createInput('topic');
//   topicinp.position(200,100);
//   topicinp.size(100);
  background(0);
}

function draw() {
  background(0)
  stroke(56,115,133)
  noFill()
strokeWeight(map(gamma, -60, 60, 0, 0.4));
circle(windowWidth/2, windowHeight/2, (map(beta,-20,60,0, windowHeight)*3)*cos(millis(100)));
  // var vol = mic.getLevel();
  
  // /background circles
  noFill()
 stroke(56,115,133)
 strokeWeight(2)
  
  if (x == width || x == 0) {
    xspeed *= -1
  }
  
   x = x + xspeed;

  // + (vol*10000) 
  circle(x, windowHeight/2 +18,200)
  
  if (x1 == 0 || x == width)  {
    x1speed *= -1
  }
  
  x1 = x1 + x1speed
  // + (vol*10000)
  circle(x1,windowHeight/2 + 18 ,200)
  
  //center circle
  // fill(53, 171, 28,170)
  noFill()
  
  if (y < 0 || y > windowHeight/2 ) {
    yspeed *= 0
  }
  y = y + yspeed
  // + (vol*10000)
  circle(windowWidth/2,y + 18, 198)

  noFill();
  stroke(56, 115, 133);
  strokeWeight(1);
  textFont(myFont);
  textSize(86);
  textAlign(CENTER, CENTER)
  text('biophonica', windowWidth/2,50);

  // if (xspeed == 0) {
    
  // }

  // fill(255,200)
  // textFont(myFont)
  // textSize(20)
  // text('Geophony is a category of eco-acoustics which has the longest history and it relates to natural forces, such as water, wind and thunder.',width/2,20)
  // fill(255,200)
  // textFont(myFont)
  // textSize(20)
  // text('Vocalizations of animal sounds are categorized as biophony elemnent of bioacoustics', width/2, 40)
  // fill(255,200)
  // textFont(myFont);
  // textSize(20)
  // text('while antropophony represnt human generated soun from either humans, themselves, or the electro-mechanical technologies they employ.', width/2, 60)
  
};

function myInputEvent() {
  console.log('you are typing: ', this.value());
}