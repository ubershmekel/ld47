import { random } from "./utils.js";

const sounds = {
  look: "look",
}

const distanceVolumeOne = 32;

function loadSound(options) {
  const sound = new Howl(options);
  sound.pannerAttr().refDistance = distanceVolumeOne;
  sound.pannerAttr().maxDistance = 300;
  // sound.pannerAttr().distanceModel = 'linear';
  sound.pannerAttr().distanceModel = 'exponential';
  sound.pannerAttr().rolloffFactor = 2.4;
  // sound.pannerAttr().distanceModel = 'inverse';
  // sound.pannerAttr().rolloffFactor = 8;

  sound.pos(0, 0, 0);
  return sound;
}

export let bank = null;

function loadBank() {
  bank = {};

  // Howler.pos(this.x, this.y, -0.5);

  bank.wind = loadSound({
    src: ['../assets/audio/wind.mp3'],
    loop: true,
    volume: 0.5,
  });

  bank.look = loadSound({
    src: ['../assets/audio/sounds.mp3'],
    // sprite: {
    //   lightning: [2000, 4147],
    //   rain: [8000, 9962, true],
    //   thunder: [19000, 13858],
    //   music: [34000, 31994, true]
    // },
    // volume: 0
    // loop: true,
  });
}

export class Sounds {

  constructor() {
    if (!bank) {
      loadBank();
    }


    // this.bank.look.pannerAttr().refDistance = distanceVolumeOne;

    // Init pos(0,0,0) because otherwise the first sound gets center-panned
    // and tweened into its final position which sounds odd.
    // I'm guessing the browser panner is not set up before the first `pos` call.
    // this.bank.look.pos(0, 0, 0);
  }

  play(sound, x, y) {
    // The `z` is some arbitrary value that makes the switch from
    // left to right not seems too sudden and harsh.
    // sound.pos(x, y, -distanceVolumeOne / 8);

    const playId = sound.play();
    sound.pos(x, y, -distanceVolumeOne / 4, playId);
    
    console.log("sound at", x, y);
    return playId;
  }

  playWind(x, y) {
    const playId = this.play(bank.wind, x, y);
    // length ~5000 ms
    const offset = random(0, 3.0);
    console.log("windseek", offset, playId);
    // this.bank.wind.seek(offset, playId);
  }

  listenerPos(x, y) {
    // console.log("listenerPos", x, y);
    Howler.pos(x, y, 0);
  }
}

