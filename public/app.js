//global variables
let notes = ["C", "D", "E", "F", "G", "A", "H"];
var calculatescale = 1;
let alpha, beta, gamma;
let synthPart1;
let player = new Tone.Player("assets/water_up.wav", {loop: true});//add loop
let synth1 = new Tone.MetalSynth().toDestination();
let musicplayed = false;
let filtervalue;
const delay = new Tone.Delay(1).toDestination();


//Membrane Synth
const synth = new Tone.MembraneSynth().toDestination();

//filter
const filter = new Tone.Filter(400, "lowpass").toDestination();

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
  "C3" : "assets/cow.wav"
},
function(){
});
sampler1.toDestination()
//Sequence object (lower the volume of the sample)
const synthPart = new Tone.Sequence(
    function(time, note) {
      sampler.triggerAttack(calculatescale);
    },
    notes,
    "1n"
  );
  synthPart.start();

//Initialize Sockets
let socket = io();
    socket.on('connect', function () {
        console.log("Connected");
    });

window.addEventListener('load', function () {



  window.addEventListener('devicemotion', function(event) {
    console.log(
      event.acceleration.x + ' m/s2',
      event.acceleration.y + " m/s2 ",
      event.acceleration.z + " m/s2");

    if (event.acceleration.x > 0.1) {
      sampler1.triggerAttackRelease("C3");
    }
  });


var px = 50; // Position x and y
var py = 50;
var vx = 0.0; // Velocity x and y
var vy = 0.0;
var updateRate = 1 / 60; // Sensor refresh rate
// synth start
function isIOSDevice() {
  return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}
document
  .getElementById("accelPermsButton")
  .addEventListener("click", async () => {
    console.log("ab");
    
    if (isIOSDevice()) {
      console.log("I am an IOS device!");
      getAccel();
    }
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

          let value = Math.floor(mapNumber(alpha, 0, 360, 0, 30));
          calculatescale = calculateNote(value).concat(calculateOctave(value));
        });
      };
    });
  };

//map range
function mapNumber(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

function calculateNote (valueString) {
    let iterval = parseInt(valueString)% 7;
    return (notes[iterval]);
  };
function calculateOctave (valueString) {
    let iterval = Math.floor(parseInt(valueString)/ 7);
    return (iterval.toString());
  };

  document.getElementById("button").addEventListener("click", async () => {
    console.log("here");
    if (isIOSDevice()) {
  getAccel();
} else {
  startDeviceOrientation();
}
});

//Console log euler angles
  function startDeviceOrientation() {
    window.addEventListener("deviceorientation", e => {
      console.log(e);
      alpha = document.getElementById("alpha").innerHTML = e.alpha;
      beta = document.getElementById("beta").innerHTML = e.beta;
      gamma = document.getElementById("gama").innerHTML = e.gamma;
     
      let value = Math.floor(mapNumber(alpha, 0, 360, 0, 30));

      calculatescale = calculateNote(value).concat(calculateOctave(value));

      filtervalue = filter.frequency.value = mapNumber (beta, 0, 100, 0, 720);
      socket.emit('filterValue', filtervalue);

      reverb.value = mapNumber (beta, 0, 200, 0, 100);
      console.log(reverb.value);

    socket.emit('sendData', calculatescale);
    });
  }
});
document.getElementById("synthstart").addEventListener("click", async () => {
  await Tone.start();
  player.start()
  Tone.Transport.start();
});

document.getElementById("collab").addEventListener("click", async () => {
  await Tone.start();
  Tone.Transport.start();
  player.start()
});
  
// synth stop
  document.getElementById("synthstop").addEventListener("click", async () => {
    Tone.Transport.stop();
    player.stop();
  });

  //listening for socket messages(note && octave)
  socket.on("hello", (data) => {
    console.log(data);

//Membrane Synth
// if (musicplayed == false) {
  setTimeout(function(){

    sampler.triggerAttackRelease(data);
  }, 500); 
  // synthPart1 = new Tone.Loop(
  //   function(time) {
  //     synth1.triggerAttackRelease(data);
  //   }, "8n").start(0)
  //   synthPart1.start()
  // musicplayed = true
  // }
});

socket.on('filterValue', (data) => {
  filter.frequency.value = data;
  console.log(filter.frequency.value)
  player.connect(filter);
});