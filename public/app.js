
    let players = [];
    
    function setup() {
        console.log("setup");
        scale = Tonal.Scale.get("C4 major").notes;
        ready = true;
        sendPresence();
    };    

    function sendPresence() {
        console.log("sending connection");
        let data = {
            "synth" : true,
            "synthSetting" : "Sampler({urls: {C4: 'C4.wav'},onload: () => {console.log('loaded');}})",
            "controls" : [
                {
                    "name" : "pitch"
                },
                {
                    "name" : "envelope",
                    "attack" : 0.1,
                    "decay" : 0,
                    "sustain" : 1,
                    "release" : 0.2
                },
                {
                    "name" : "volume",
                    "startVal" : 3
                },
                {
                    "name" : "distortion",
                    "startVal" : 0.8
                }
            ]
        };
        socket.emit('sendPresence', data);
    }



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

function getAccel() {
    console.log("a");
    DeviceMotionEvent.requestPermission().then(response => {
      if (response == "granted") {
        // Add a listener to get smartphone orientation
        // in the alpha-beta-gamma axes (units in degrees)
        window.addEventListener("deviceorientation", e => {
          console.log(e);
          alphaAngle = document.getElementById("alpha").innerHTML = e.alpha;
          document.getElementById("beta").innerHTML = e.beta;
          document.getElementById("gama").innerHTML = e.gamma;
        });
      };
    });
  };

  document.getElementById("button").addEventListener("click", async () => {
    if (isIOSDevice()) {
  getAccel();
} else {
  startDeviceOrientation();
}
});

//console log euler angles
    function startDeviceOrientation() {
        window.addEventListener("deviceorientation", e => {
        console.log(e);
        alphaAngle = document.getElementById("alpha").innerHTML = e.alpha;
        document.getElementById("beta").innerHTML = e.beta;
        document.getElementById("gama").innerHTML = e.gamma;
        });
    };


});

function keyPressed() {
    if (ready) {
      // let noteNumber = floor(map(mouseX, 0, width, -7, 7));
        noteNumber = 0;
        let note = [];
  
        switch (key) {
            case "s":
            noteNumber = 0;
            break;
            case "q":
            noteNumber = 1;
            break;
            case "w":
            noteNumber = 2;
            break;
            case "e":
            noteNumber = 3;
            break;
            case "a":
            noteNumber = 4;
            break;
            case "d":
            noteNumber = 5;
            break;
            case "z":
            noteNumber = 6;
            break;
            case "x":
            noteNumber = 7;
            break;
            case "c":
            noteNumber = 8;
            break;
      }
      let note1 = mapNote(noteNumber, scale);
      let note2 = mapNote(noteNumber + 4, scale);
      let note3 = mapNote(noteNumber + 8, scale);
      note.push(note1);
      note.push(note2);
      note.push(note3);
      console.log(note);
      note = '"' + note + '"';

      let value = {
        "pitch" : note
        }
        sendData(value);
    }
}

function mapNote(noteNumber, scale) {
    let numNotes = scale.length;
    let i = modulo(noteNumber, numNotes);
    let note = scale[i];
    let octaveTranspose = floor(noteNumber / numNotes);
    let interval = Tonal.Interval.fromSemitones(octaveTranspose * 12);
    return Tonal.Note.transpose(note, interval);
}

function modulo(n, m) {
    return ((n % m) + m) % m;
}

//Send Data From DOM Event Listeners
function sendData(value) {
    let data = {
        "value" : value
    }
    console.log(data);
    socket.emit('sendData', data);
}
//Get new performer connection
socket.on('getPresence', (data) => {
    console.log(data);
    let newPerformer = new Performer(data);
    ready = false;
    newPerformer.setupInstrument();
    activePerformers.push(players);
    // console.log(activePerformers);
});

//Get data from active performers
socket.on('getData', (data) => {
    // console.log(data);
    for (j = 0; j < players.length; j++) {
        if (players[j].id === data.socketID) {
            players[j].checkData(data.value);
        }
    };
});