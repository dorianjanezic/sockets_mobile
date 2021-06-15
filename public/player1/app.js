//global variables tone.js
let notes = ["C", "D", "E", "F", "G", "A", "B"];
var calculatescale = 1;
let anglea, beta, gamma;
let synthPart1;
let player = new Tone.Player("assets/water_up.wav");
player.loop = true;
let synth1 = new Tone.MetalSynth().toDestination();
let musicplayed = false;
let filtervalue;
const delay = new Tone.Delay(1).toDestination();
let incomingmsg;
//global variables p5
let canvas;
let myFont;
let sizespeed = 1.2;
let size = 1;
let playing;
let effects = [];
let sensorValue = 0;

var px = 50; // Position x and y
var py = 50;
var vx = 0.0; // Velocity x and y
var vy = 0.0;
var updateRate = 1/60; // Sensor refresh rate

//Membrane Synth
const synth = new Tone.MembraneSynth().toDestination();

//filter
const filter = new Tone.Filter(400, "lowpass").toDestination();

//reverb
let reverb = new Tone.Reverb(gamma);

//gain
const gain = new Tone.Volume(-100);

//player
player.connect(filter);

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
      sampler.triggerAttack(incomingmsg);
    },
    notes,
    "1n"
  );

function preload() {
  myFont = loadFont('arialbold.ttf');
};
  
function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
};

  
function setup() {
  background(0);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index', '-1');

};

function draw() {
  background(0);
  sensorValue = mapNumber(beta, -60, 90, -1.0, 1.0);
  let x = random(200,windowWidth-30);
  let y = random(200,windowWidth-30);
  let dia = map(sensorValue, -1, 1, 1, 1000);
  if (frameCount % 60 == 0) {
    effects.push(new Effect(x, y, dia));
  };

  for (let e of effects) {
    e.grow();
    e.age();
    e.display();
  }

  while (effects.length > 500) {
    effects.splice(0,1);
  };

  for (let i = effects.length -1; i >= 0; i--) {
    let e = effects[i];
    if (e.isDone) {
      effects.splice(i,1)
    }
  }
};

class Effect {
  constructor(x, y, dia) {
    this.x = x;
    this.y = y;
    this.dia = dia;

    this.growSpeed = 0.5;
    this.lifespan = 5;
    this.lifeReduction = random(0.01, 0.02);
    this.isDone = 0;
  }
  grow() {
    this.dia += this.growSpeed;
  }
  age() {
    if (this.lifespan > 0) {
      this.lifespan -= this.lifeReduction;
    } else {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  display() {
    push();
    stroke(255, 255* this.lifespan);
    strokeWeight(0.5)
    noFill();
    circle(this.x, this.y, this.dia);
    pop();
  }
}

//Initialize Sockets
let player1 = io('/player1');
    player1.on('connect', function () {
        console.log("Connected");
    });
    
//map range
  function mapNumber(number, inMin, inMax, outMin, outMax) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };

//modulo for determining the note out of scale array
function calculateNote (valueString) {
  let iterval = parseInt(valueString)% 7;
  return (notes[iterval]);
};

//octave calculation
function calculateOctave (valueString) {
  let iterval = Math.floor(parseInt(valueString)/ 7);
  return (iterval.toString());
};    

// document.getElementById("synthstart").addEventListener("click", async () => {
//   await Tone.start();
//   player.start()
//   Tone.Transport.start();
// });
    
// document.getElementById("collab").addEventListener("click", async () => {
//   synthPart.start();
//   await Tone.start();
//   Tone.Transport.start();
// });
      
// // synth stop
// document.getElementById("synthstop").addEventListener("click", async () => {
//   Tone.Transport.stop();
//   player.stop();
// });

window.addEventListener('load', function () {

  document.getElementById("button").addEventListener("click", async () => {
    console.log("here");
    if (isIOSDevice()) {
      getAccel();
    } else {
    startDeviceOrientation();
      }
playing = !playing;

if (playing) {
  await Tone.start();
  player.start()
  Tone.Transport.start();
  synthPart.start();
  await Tone.start();
  Tone.Transport.start();
  document.getElementById('button').style.visibility = 'hidden';

  
} else {
  Tone.Transport.stop();
  player.stop();
  
}

  });

  window.addEventListener('devicemotion', function(event) {
    // console.log(
    //   event.acceleration.x + ' m/s2',
    //   event.acceleration.y + " m/s2 ",
    //   event.acceleration.z + " m/s2");

    if (event.acceleration.x > 5) {
      sampler1.triggerAttackRelease("C3");
      player1.emit('playerstart', 'play');
    }
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
          gamma = document.getElementById("gama").innerHTML = e.gamma;
          filtervalue = filter.frequency.value = mapNumber (beta, -30, 100, 0, 720);
          player1.emit('filterValue', beta);

          let value = Math.floor(mapNumber(anglea, 0, 360, 0, 30));
          calculatescale = calculateNote(value).concat(calculateOctave(value));
        });
      };
    });
  };

  function startDeviceOrientation() {
    window.addEventListener("deviceorientation", e => {
      console.log(e);
      anglea = e.alpha;
      beta = e.beta;
      gamma = e.gamma;
     
      let value = Math.floor(mapNumber(anglea, 0, 360, 0, 30));
      calculatescale = calculateNote(value).concat(calculateOctave(value));
      player1.emit('sendData', calculatescale);

      filtervalue = filter.frequency.value = mapNumber (beta, 0, 100, 0, 720);
      player1.emit('filterValue', beta);

      reverb.value = mapNumber (beta, 0, 200, 0, 100);
    });
  };
});

//listening for socket messages(note && octave)
player1.on("hello", (data) => {

incomingmsg = data;
});

player1.on('playerstart', (data) => {
  sampler2.triggerAttackRelease("C3");
});