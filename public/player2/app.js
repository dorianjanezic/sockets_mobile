//global variables
let notes = ["C", "D", "E", "F"];
let sequence = ["C1", "D1", "E1", "F1", "G2", "A1", "B1"];
var calculatescale = 1;
let alpha, beta, gamma;
let synthPart1;
let player = new Tone.Player("assets/water_up.wav");//add loop
player.loop = true;
let synth1 = new Tone.MetalSynth().toDestination();
let musicplayed = false;
let filtervalue;
const delay = new Tone.Delay(1).toDestination();
//global p5 variables
let button;
let canvas;
var mic;

var formResolution = 15;
var stepSize = 2;
var distortionFactor = 1;
var initRadius = 150;
var centerX;
var centerY;
var x = [];
var y = [];

var filled = false;
var freeze = false;


//filter
const filter = new Tone.Filter(400, "lowpass").toDestination();

//Membrane Synth
const synth = new Tone.MembraneSynth().toDestination();

player.connect(filter)

//reverb
let reverb = new Tone.Reverb(gamma);

//gain
const gain = new Tone.Volume(-100);

//player
player.connect(filter).connect(reverb);

//sampler 1
var sampler = new Tone.Sampler({
  "C3" : "assets/1st_chord_filter.wav"
},
function(){
});
sampler.connect(gain).toDestination();

//sampler 2 
var sampler1 = new Tone.Sampler({
  "C3" : "assets/whaleedit.wav"
},
function(){
});
sampler1.toDestination()
//sampler 3 
var sampler2 = new Tone.Sampler({
  "C3" : "assets/bomb.wav"
},
function(){
});
sampler2.toDestination()
//Sequence object (lower the volume of the sample)
const synthPart = new Tone.Sequence(
    function(time, note) {
      sampler.triggerAttack(calculatescale);
    },
    notes,
    "1n"
  );
  synthPart.start();

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



  // init shape
  centerX = width / 2;
  centerY = height / 2;
  var angle = radians(360 / formResolution);
  for (var i = 0; i < formResolution; i++) {
    x.push(cos(angle * i) * initRadius);
    y.push(sin(angle * i) * initRadius);
  }

  stroke(0, 50);
  strokeWeight(0.75);
  background(255);
}

function draw() {
  colorvalue = mapNumber (alpha, 0, 360, 0, 255)
    

    fill(56,115,133);
    textFont(myFont);
    textSize(64);
 
    text('oceania', windowWidth/2-130,windowHeight/2);


    // floating towards mouse position
  centerX += (mouseX - centerX) * 0.01;
  centerY += (mouseY - centerY) * 0.01;


  // calculate new points
  for (var i = 0; i < formResolution; i++) {
    x[i] += random(-stepSize, stepSize);
    y[i] += random(-stepSize, stepSize);
    // uncomment the following line to show position of the agents
    // ellipse(x[i] + centerX, y[i] + centerY, 5, 5);
  }

  if (filled) {
    fill(random(255));
  } else {
    noFill();
  }

  beginShape();
  // first controlpoint
  curveVertex(x[formResolution - 1] + centerX, y[formResolution - 1] + centerY);

  // only these points are drawn
  for (var i = 0; i < formResolution; i++) {
    curveVertex(x[i] + centerX, y[i] + centerY);
  }
  curveVertex(x[0] + centerX, y[0] + centerY);

  // end controlpoint
  curveVertex(x[1] + centerX, y[1] + centerY);
  endShape();
}

function mousePressed() {
  // init shape on mouse position
  centerX = mouseX;
  centerY = mouseY;
  var angle = radians(360 / formResolution);
  var radius = initRadius * random(0.5, 1);
  for (var i = 0; i < formResolution; i++) {
    x[i] = cos(angle * i) * initRadius;
    y[i] = sin(angle * i) * initRadius;
  }
}

//Initialize Sockets
let player2 = io('/player2');
    player2.on('connect', function (data) {
        console.log("Connected");
    });

//map range
function mapNumber(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

function calculateNote (valueString) {
    let iterval = parseInt(valueString)% 7;
    return (notes[iterval])
};
function calculateOctave (valueString) {
    let iterval = Math.floor(parseInt(valueString)/ 7);
    return (iterval.toString());
};

document.getElementById("synthstart").addEventListener("click", async () => {
  await Tone.start();
  Tone.Transport.start();
});

document.getElementById("collab").addEventListener("click", async () => {
  await Tone.start();
  player.start()
});
  
// synth stop
document.getElementById("synthstop").addEventListener("click", async () => {
  Tone.Transport.stop();
  player.stop();
});

window.addEventListener('load', function () {

  document.getElementById("button").addEventListener("click", async () => {
    console.log("here");
      if (isIOSDevice()) {
        getAccel();
      } else {
      startDeviceOrientation();
      }; 
  });

  window.addEventListener('devicemotion', function(event) {
    // console.log(
    //   event.acceleration.x + ' m/s2',
    //   event.acceleration.y + " m/s2 ",
    //   event.acceleration.z + " m/s2");

    if (event.acceleration.x > 10) {
      sampler2.triggerAttackRelease("C3");
      player1.emit('playerstart', 'play');
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
          alpha = document.getElementById("alpha").innerHTML = e.alpha;
          document.getElementById("beta").innerHTML = e.beta;
          document.getElementById("gama").innerHTML = e.gamma;

          if (alpha = 0) {
            background(100,100,100)
          }
          let value = Math.floor(mapNumber(alpha, 0, 360, 0, 7));
          calculatescale = calculateNote(value).concat(calculateOctave(value));
          player2.emit('sendData', calculatescale);
        });
      };
    });
  };

  //Console log euler angles
  function startDeviceOrientation() {
    window.addEventListener("deviceorientation", e => {
      console.log(e);
      alpha = e.alpha;
      beta = e.beta;
      gamma = e.gamma;
     
      let value = Math.floor(mapNumber(alpha, 0, 360, 0, 30));

      calculatescale = calculateNote(value).concat(calculateOctave(value));
      player2.emit('sendData', calculatescale);

      reverb.value = mapNumber (beta, 0, 200, 0, 100);
      console.log(reverb.value);
    });
  };
});

  //listening for socket messages(note && octave)
player2.on("hello", (data) => {
  console.log(data);
});

player2.on('filter', (data) => {
//map range
function mapNumber(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};
  filter.frequency.value = mapNumber (data, 0, 100, 0, 600)

//player
player.connect(filter).connect(reverb);
console.log("hey")
});

player2.on('playerstart', (data) => {
  sampler1.triggerAttackRelease("C3");
  // sampler1.start();
});