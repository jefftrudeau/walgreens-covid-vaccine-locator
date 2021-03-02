const fetch = require("node-fetch");
const geolib = require("geolib");

const DEBUG = false;

const RIGHT = 0;
const UP    = 1;
const LEFT  = 2;
const DOWN  = 3;

const degreeMap = [
  90,   // RIGHT
  0,    // UP
  270,  // LEFT
  180,  // DOWN
];

const directionMap = [
  "RIGHT",
  "UP",
  "LEFT",
  "DOWN",
];

// only an approximation;
// larger values will search larger total area
const maxMoves = 66;

// search radius is fixed at 25 miles, and we don't want any gaps
//
// if we take 4 points and make a square, and then draw a circle
// around each point (corner) with a radius of 25 miles,
// the 4 circles should all intersect at the center of the square;
//
// half the offset (distance between two points) is found by:
//   a² + b² = 25²
//   2a² = 25²
//   a = 17.677669529663688
//
// for approximation, we'll say adjacent search points are 35 miles apart
const offset = 56327;

// TODO support arguments
//console.log(process.argv);
let position = {
  latitude: 42.6763235,
  longitude: -71.014118,
};
let startDateTime = "2021-03-02";
let validStates = ["MA"];

let moves = 0; // total number of moves
let steps = 1; // number of moves in given direction
let direction = RIGHT;

let minLat = position.latitude;
let maxLat = position.latitude;
let minLng = position.longitude;
let maxLng = position.longitude;

const debug = (message) => DEBUG && console.log(message);

const makeRequest = (pos) =>
  fetch("https://www.walgreens.com/hcschedulersvc/svc/v1/immunizationLocations/availability", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appointmentAvailability: {
        startDateTime,
      },
      position: pos,
      radius: 25,
      serviceId: "99",
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      debug(`Searched 25 mile radius from ${pos.latitude}, ${pos.longitude} ...`);
      // TODO support arguments, make this more generic
      if (result.appointmentsAvailable && validStates.indexOf(result.stateCode) > -1) {
        console.log(result);
      }
      return result;
    });

const takeStep = () => {
  position = geolib.computeDestinationPoint(position, offset, degreeMap[direction]);
  minLat = Math.min(position.latitude, minLat);
  maxLat = Math.max(position.latitude, maxLat);
  minLng = Math.min(position.longitude, minLng);
  maxLng = Math.max(position.longitude, maxLng);
  makeRequest(position);
  moves++;
};

makeRequest(position);

while (moves < maxMoves) {
  for (let i = 0; i < steps; i++) {
    debug(`Taking ${i + 1}/${steps} steps ${directionMap[direction]}`);
    takeStep();
  }

  if (direction < DOWN) {
    direction++;
  }
  else {
    direction = RIGHT;
  }

  if (direction === LEFT || direction === RIGHT) {
    steps++;
  }
}

console.log(`
Searched ${moves} additional points.
Total area searched is approximately:
  top-left: ${maxLat}, ${minLng}
  top-right: ${maxLat}, ${maxLng}
  bottom-left: ${minLat}, ${minLng}
  bottom-right: ${minLat}, ${maxLng}
`);
