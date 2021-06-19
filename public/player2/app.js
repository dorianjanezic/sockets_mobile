//global variables tone.js + p5.js
let notes = ["C", "D", "E", "F", "G", "A", "B"];
let calculatescale = 1;
let anglea, beta, gamma;
let player;
let breath;
// let entrance;
let entrance1;
let earthquake;
let bridge;
let whale1;
let dolphin;
let ice;
let myFont;
let filtervalue;
let playing;
let playerstarted = false;
let startrotation = false;
let playerstarted1 = false;
let start_effect = false;
let breath_start = false;
let earthquake_start = false;
let bridge_start = false;
let whale1_start = false;
let dolphin_start = false;
let ice_start = false;
let state = 1;
let effects = [];
let sensorValue = 0;
let canvas;
let filter;
let sampler;
let sampler1;
let sampler2;
let synthPart;

//PRELOAD
function preload() {
  myFont = loadFont("arialbold.ttf");
  player = new Tone.Player("assets/watersample.wav");
  player.loop = true;
  breath = new Tone.Player("assets/breath.wav").toDestination();
  // entrance = new Tone.Player("assets/entrance.wav").toDestination();
  entrance1 = new Tone.Player("assets/entrance1.wav").toDestination();
  earthquake = new Tone.Player("assets/earthquake.wav").toDestination();
  bridge = new Tone.Player("assets/bridge-1.wav").toDestination();
  whale1 = new Tone.Player("assets/whale1.wav").toDestination();
  dolphin = new Tone.Player("assets/dolphin.wav").toDestination();
  ice = new Tone.Player("assets/ice.wav").toDestination();
  filter = new Tone.Filter(400, "lowpass").toDestination();
  player.connect(filter);
  sampler = new Tone.Sampler(
    { C3: "assets/1st_chord_filter.wav" },
    function() {}
  );
  sampler.toDestination();
  sampler2 = new Tone.Sampler({ C3: "assets/bomb.wav" }, function() {});
  sampler2.toDestination();
  synthPart = new Tone.Sequence(
    function(time, note) {
      sampler.triggerAttack(calculatescale);
    },
    notes,
    "1n"
  );
}

//Initialize Sockets ADD A SOUND FOR WHEN A USER JOINS
let player2 = io("/player2");
player2.on("connect", function(data) {
  console.log("Connected");
});

//access gyroscope-sensor and start the UX
document.getElementById("button").addEventListener("click", async () => {
  if (isIOSDevice()) {
    getAccel();
    textFont(myFont);
    fill(255);
    textSize(24);
    text("rotate to find an ocean", 20, height / 2);
    await Tone.start();
    Tone.Transport.start();
    synthPart.start();
  } else {
    startDeviceOrientation();
    console.log("here");
    textFont(myFont);
    fill(255);
    textSize(24);
    text("rotate to find an ocean", width/3, height / 2);
    await Tone.start();
    Tone.Transport.start();
    synthPart.start();
  }
});

//access accelerometer sensor
window.addEventListener("devicemotion", function(event) {
  if (event.acceleration.x > 10) {
    sampler2.triggerAttackRelease("C3");
    player1.emit("playerstart", "play");
  }
});

document
  .getElementById("accelPermsButton")
  .addEventListener("click", async () => {
    console.log("ab");
    if (isIOSDevice()) {
      console.log("I am an IOS device!");
      getAccel();
    }
  });

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  background(0);
}

function draw() {
  if (anglea < 1 && state == 1) {
    background(0);
    console.log("in first");
    player.start();
    entrance1.start();
    state = 2;
  }
  if (state == 2) {
    background(0);
    textSize(12);
    text("point your phone towards the ground to dive", width/3, 40);
    startEffect();
    console.log("in sec");
    if (beta < 20) {
      state = 3;
    }
  }

  if (state == 3) {
    background(0);
    textSize(12);
    text("now slowly start rotating to your left", width/3, 40);
    console.log("in third");
    startEffect();
    if (breath_start == false) {
      breath.start();
      breath_start = true;
    };
    if (anglea > 40 && anglea < 42) {
     state = 4;
  };
}
    if (state == 4) {
      console.log("in 4th");
      background(0);
      textSize(12);
      text("earthquake", 20, windowHeight/2);
      startEffect();
      if (earthquake_start == false) {
      earthquake.start();
      earthquake_start = true;
      };

      if (anglea > 80 && anglea < 82) {
        state = 5
      };
    };

    if (state == 5) {
      console.log("in 5th");
      background(0);
      textSize(12);
      text("bridge", 20, windowHeight/2);
      startEffect();
      if (bridge_start == false) {
        bridge.start();
        bridge_start = true;
      };
      if (anglea > 120 && anglea < 122) {
        state = 6;
      };
    };

      if (state == 6) {
        console.log("in 6th");
      background(0);
      textSize(12);
      text("whale", 20, windowHeight/2);
      startEffect();
      if (whale1_start == false) {
        whale1.start();
        whale1_start = true;
      };

      if (anglea > 160 && anglea < 162) {
        state = 7;
      };
      };

      if (state == 7) {
        console.log("in 7th");
      background(0);
      textSize(12);
      text("dolphin", 20, windowHeight/2);
      startEffect();
      if (dolphin_start == false) {
        dolphin.start();
        dolphin_start = true;
      };

      if (anglea > 200 && anglea < 202) {
        state = 8;
      }
      };

      if (state == 8) {
        console.log("in 7th");
      background(0);
      textSize(12);
      text("ice", 20, windowHeight/2);
      startEffect();
      if (ice_start == false) {
        ice.start();
        ice_start = true;
      };
      };
    };

    //if (neki){
    //  state = 4;
    //}

  

  // if (startrotation == true && beta < 10) {
  //   background(0);
  //   fill(255, 200);
  //   textFont(myFont);
  //   textSize(40);
  //   text("slowly rotate to your left to reach the bottom of the ocean",width / 5, height / 2);
  //   startEffect();
  // }


function startEffect() {
  sensorValue = mapNumber(anglea, 0, 360, -1.0, 1.0);
  let x = width / 2;
  let y = height / 2;
  let dia = map(sensorValue, -1, 1, 1, 1000);
  if (frameCount % 60 == 0) {
    effects.push(new Effect(x, y, dia));
  }

  for (let e of effects) {
    e.grow();
    e.age();
    e.display();
  }

  while (effects.length > 500) {
    effects.splice(0, 1);
  }

  for (let i = effects.length - 1; i >= 0; i--) {
    let e = effects[i];
    if (e.isDone) {
      effects.splice(i, 1);
    }
  }
}

// if (startrotation == false) {
//   background(56,115,133)
//   fill(56,115,133)
// textFont(myFont)
// textSize(40)
// text('slowly rotate to your left to reach the bottom of the ocean', width/5, height/2);
// startrotation = true;
// }

//map range
function mapNumber(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

//function for choosing index of notes array
function calculateNote(valueString) {
  let iterval = parseInt(valueString) % 7;
  return notes[iterval];
}

//function for defining octave
function calculateOctave(valueString) {
  let iterval = Math.floor(parseInt(valueString) / 7);
  return iterval.toString();
}

function isIOSDevice() {
  return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}

//android devices access motion sensor
function getAccel() {
  console.log("a");
  DeviceMotionEvent.requestPermission().then(response => {
    if (response == "granted") {
      // Add a listener to get smartphone orientation
      // in the alpha-beta-gamma axes (units in degrees)
      window.addEventListener("deviceorientation", e => {
        console.log(e);
        anglea = e.alpha;
        beta = e.beta;
        gamma = e.gamma;

        filter.frequency.value = mapNumber(beta, 100, -10, 0, 720);
        let value = Math.floor(mapNumber(anglea, 0, 360, 0, 30));
        calculatescale = calculateNote(value).concat(calculateOctave(value));
        player2.emit("sendData", calculatescale);
      });
    }
  });
}

//Console log euler angles
function startDeviceOrientation() {
  window.addEventListener("deviceorientation", e => {
    anglea = e.alpha;
    beta = e.beta;
    gamma = e.gamma;

    let value = Math.floor(mapNumber(anglea, 0, 360, 0, 30));
    calculatescale = calculateNote(value).concat(calculateOctave(value));

    filter.frequency.value = mapNumber(beta, 100, -10, 0, 720);
    player2.emit("sendData", calculatescale);
  });
}

class Effect {
  constructor(x, y, dia) {
    this.x = x;
    this.y = y;
    this.dia = dia;

    this.growSpeed = 0.5;
    this.lifespan = 2;
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
    stroke(255, 200 * this.lifespan);
    strokeWeight(1);
    noFill();
    ellipse(this.x, this.y, this.dia, this.dia);
    pop();
  }
}

