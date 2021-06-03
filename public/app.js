//global variables
let notes = ["C", "D", "E", "F", "G", "A", "H"];
var calculatescale = 1;
let alpha;

//Initialize Sockets
let socket = io();
    socket.on('connect', function () {
        console.log("Connected");
    });

window.addEventListener('load', function () {

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

//Membrane Synth
const synth = new Tone.MembraneSynth().toDestination();

//Sequence object
const synthPart = new Tone.Sequence(
    function(time, note) {
      synth.triggerAttackRelease(calculatescale, "10hz", time);
    },
    notes,
    "4n"
  );
  synthPart.start();

  document.getElementById("button").addEventListener("click", async () => {
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
      document.getElementById("beta").innerHTML = e.beta;
      document.getElementById("gama").innerHTML = e.gamma;
     
      let value = Math.floor(mapNumber(alpha, 0, 360, 0, 30));

      calculatescale = calculateNote(value).concat(calculateOctave(value));
console.log(calculatescale)
  let data = 1

  socket.emit('sendData', "2");
    });
  }
});
// synth start
document.getElementById("synthstart").addEventListener("click", async () => {
    await Tone.start();
    Tone.Transport.start();
  });
  
  //synth stop
  document.getElementById("synthstop").addEventListener("click", async () => {
    Tone.Transport.stop();
  });

  socket.emit('sendData', "2");