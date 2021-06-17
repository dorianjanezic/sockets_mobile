
//global variables
let notes = ["C", "D", "E", "F"];
let calculatescale = 1;
let anglea, beta, gamma;
let player = new Tone.Player("assets/watersample.wav");//add loop
let breath = new Tone.Player("assets/breath.wav").toDestination();
player.loop = true;
let filtervalue;
let playing;
let playerstarted = false;
let startrotation = false;
let effects = [];
let sensorValue = 0;

//global p5 variables
let canvas;

const filter = new Tone.Filter(400, "lowpass").toDestination();
player.connect(filter);

var sampler = new Tone.Sampler({
  "C3" : "assets/1st_chord_filter.wav"
},
function(){
});
sampler.toDestination();

var sampler1 = new Tone.Sampler({
  "C3" : "assets/whaleedit.wav"
},
function(){
});
sampler1.toDestination()

var sampler2 = new Tone.Sampler({
  "C3" : "assets/bomb.wav"
},
function(){
});
sampler2.toDestination()

const synthPart = new Tone.Sequence(
  function(time, note) {
    sampler.triggerAttack(calculatescale);
  },
  notes,
  "1n"
);

//load font
let myFont;
function preload() {
  myFont = loadFont('arialbold.ttf');
};

function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
};

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  background(0)
  
  
};

function draw() {
  if (anglea == 0 && playerstarted == false) {
  background(56,115,133);
  player.start();
  breath.start();
  playerstarted = true;
  };
  if (playerstarted == true) {
    background(0);
    fill(255,200)
    textFont(myFont)
    textSize(40)
    text('point your phone towards the ground to dive into the water', width/5, height/2);
    startrotation = true;
    startRot();
  }

  if (startrotation == true && beta < 10) {
    background(0)
    fill(255,200)
  textFont(myFont)
  textSize(40)
  text('slowly rotate to your left to reach the bottom of the ocean', width/5, height/2);
  startRot();
  }
}

 function startRot() {
  sensorValue = mapNumber(beta, -60, 90, -1.0, 1.0);
  let x = width/2;
  let y = height/2;
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

  // if (startrotation == false) {
  //   background(56,115,133)
  //   fill(56,115,133)
  // textFont(myFont)
  // textSize(40)
  // text('slowly rotate to your left to reach the bottom of the ocean', width/5, height/2);
  // startrotation = true;
  // }

class Effect {
  constructor(x, y, dia) {
    this.x = x;
    this.y = y;
    this.dia = dia;

    this.growSpeed = -0.5;
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
    stroke(56,115,133*this.lifespan);
    strokeWeight(0.5)
    noFill();
    ellipse(this.x, this.y, this.dia, this.dia);
    pop();
  }
}

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


//Initialize Sockets
let player2 = io('/player2');
    player2.on('connect', function (data) {
        console.log("Connected");
    });

window.addEventListener('load', function () {

  document.getElementById("button").addEventListener("click", async () => {
    console.log("here");
      if (isIOSDevice()) {
        getAccel();
        
      } else {
      startDeviceOrientation();
      };
      playing = !playing;
      
      if (playing) {
        textFont(myFont)
        fill(255);
        textSize(64)
        text('rotate to find an ocean', width/3.1, height/2);
        await Tone.start();
        Tone.Transport.start();
        synthPart.start();
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
          
          
          let value = Math.floor(mapNumber(anglea, 0, 360, 0, 30));
          calculatescale = calculateNote(value).concat(calculateOctave(value));
          player2.emit('sendData', calculatescale);
        });
      };
    });
  };

        //Console log euler angles
        function startDeviceOrientation() {
          window.addEventListener("deviceorientation", e => {
            
            anglea = document.getElementById("alpha").innerHTML = e.alpha;
            beta = document.getElementById("beta").innerHTML = e.beta;
            document.getElementById("gama").innerHTML = e.gamma;
        
            let value = Math.floor(mapNumber(anglea, 0, 360, 0, 30));
            calculatescale = calculateNote(value).concat(calculateOctave(value));
            
            filter.frequency.value = mapNumber (beta, 100,-10, 0, 720);
            player2.emit('sendData', calculatescale);
      
        
          });
        };

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
    

});


//   //listening for socket messages(note && octave)
// player2.on("hello", (data) => {
//   console.log(data);
// });

// player2.on('filter', (data) => {
// //map range
// function mapNumber(number, inMin, inMax, outMin, outMax) {
//   return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
// };
//   filter.frequency.value = mapNumber (data, 0, 100, 0, 600)

// //player
// player.connect(filter).connect(reverb);
// console.log("hey")
// });

// player2.on('playerstart', (data) => {
//   sampler1.triggerAttackRelease("C3");
//   // sampler1.start();
// });