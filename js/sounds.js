import { random } from "./utils.js";
import soundData from "../dist/soundData.js";

export const bank = {
}

const distanceVolumeOne = 32;
let sayingNowId = 0;

function loadSound(options) {
  console.log('sound options', options);
  const newHowl = new Howl(options);
  newHowl.pannerAttr().refDistance = distanceVolumeOne;
  newHowl.pannerAttr().maxDistance = 300;
  // newHowl.pannerAttr().distanceModel = 'linear';
  newHowl.pannerAttr().distanceModel = 'exponential';
  newHowl.pannerAttr().rolloffFactor = 2.4;
  // newHowl.pannerAttr().distanceModel = 'inverse';
  // newHowl.pannerAttr().rolloffFactor = 8;

  // newHowl.pos(0, 0, 0);

  // debug sounds
  window.newHowl = newHowl;

  for (const name in options.sprite) {
    bank[name] = name;
  }

  console.log("sound bank", bank);

  return newHowl;
}

const soundh = loadSound(soundData);

// export let bank = null;

// function loadBank() {
// bank = {};

// Howler.pos(this.x, this.y, -0.5);

// bank.wind = loadSound({
//   src: ['../assets/audio/wind.mp3'],
//   loop: true,
//   volume: 0.5,
// });

// bank.snarl = loadSound({
//   src: ['../assets/audio/snarl.mp3'],
//   loop: true,
//   volume: 0.5,
// });

// bank.look = loadSound({
//   src: ['../assets/audio/sounds.mp3'],
//   // sprite: {
//   //   lightning: [2000, 4147],
//   //   rain: [8000, 9962, true],
//   //   thunder: [19000, 13858],
//   //   music: [34000, 31994, true]
//   // },
//   // volume: 0
//   // loop: true,
// });
// }

// the member `states` gets reset every scene reset
const globalStates = {};
const sayQ = [];

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

  play(soundName, x, y) {
    // The `z` is some arbitrary value that makes the switch from
    // left to right not seems too sudden and harsh.
    // sound.pos(x, y, -distanceVolumeOne / 8);
    const soundHowl = this.toHowl(soundName);
    const playId = soundHowl.play(soundName);
    if (x !== undefined) {
      // a spatial sound!
      soundHowl.pos(x, y, -distanceVolumeOne / 4, playId);
    }

    console.log("sound at", soundName, x, y, playId, soundHowl._src);
    return playId;
  }

  toHowl(soundName) {
    // console.log("to howl " + soundName);
    if (!bank[soundName]) {
      throw new Error("Invalid sound name: " + soundName);
    }
    return soundh;
  }

  playJump() {
    const playId = this.play("jump1");
    soundh.volume(0.1, playId);
  }

  touchRightOn() {
    if (globalStates.touchRight) {
      return;
    }
    const playId = this.play("wall-touch-1");
    soundh.volume(0.1, playId);
    soundh.stereo(1.0, playId);
    soundh.loop(true, playId);
    globalStates.touchRight = playId;
  }

  touchRightOff() {
    if (!globalStates.touchRight) {
      return;
    }
    soundh.stop(globalStates.touchRight);
    delete globalStates.touchRight;
  }

  touchLeftOn() {
    if (globalStates.touchLeft) {
      return;
    }
    const playId = this.play("wall-touch-1");
    soundh.volume(0.1, playId);
    soundh.stereo(-1.0, playId);
    soundh.loop(true, playId);
    globalStates.touchLeft = playId;
  }

  touchLeftOff() {
    if (!globalStates.touchLeft) {
      return;
    }
    soundh.stop(globalStates.touchLeft);
    delete globalStates.touchLeft;
  }

  walkingOn() {
    if (globalStates.walking) {
      return;
    }
    const playId = this.play("step-1");
    soundh.volume(0.1, playId);
    soundh.stereo(0, playId);
    soundh.loop(true, playId);
    globalStates.walking = playId;
  }

  walkingOff() {
    if (!globalStates.walking) {
      return;
    }
    soundh.stop(globalStates.walking);
    delete globalStates.walking;
  }

  playLanded() {
    const playId = this.play("step-1");
    soundh.volume(0.1, playId);
    soundh.stereo(0, playId);
  }

  playSlipped() {
    const playId = this.play("slip-1");
    soundh.volume(0.1, playId);
    soundh.stereo(0, playId);
  }

  playFlying(intensity) {
    // intensity 0.0 - 1.0
    // console.log("fly intensity", intensity);
    if (globalStates.flying) {
      soundh.volume(intensity, globalStates.flying);
      return;
    }
    const playId = this.play("fly");
    globalStates.flying = playId;
    soundh.volume(intensity, playId);
    soundh.rate(0.5, playId);
    soundh.stereo(0, playId);
    soundh.loop(true, playId);
  }

  playBumpTop() {
    const playId = this.play("bump-top-1");
    soundh.volume(0.05, playId);
  }

  playWind(x, y) {
    const soundHowl = this.toHowl(bank.wind);
    const playId = this.play(bank.wind, x, y);
    // length ~5000 ms
    const offset = random(0, 3.0);
    const speed = random(0.5, 1.8);
    // console.log("windseek", offset, playId);
    // soundHowl.seek(offset, playId);
    soundHowl.rate(speed, playId);
    soundHowl.loop(true, playId);
    soundHowl.volume(0.5, playId);
  }

  playSnarl(x, y) {
    const soundHowl = this.toHowl(bank.snarl);
    const playId = this.play(bank.snarl, x, y);
    // length ~5000 ms
    const offset = random(0, 3.0);
    const speed = random(0.8, 2.0);
    // console.log("windseek", offset, playId);
    // soundHowl.seek(offset, playId);
    soundHowl.rate(speed, playId);
    soundHowl.loop(true, playId);
    soundHowl.volume(0.5, playId);
  }

  listenerPos(x, y) {
    // console.log("listenerPos", x, y);
    Howler.pos(x, y, 0);
  }

  doOnce(key, func) {
    if (globalStates[key]) {
      return;
    }
    globalStates[key] = true;
    func();
  }

  say(line) {
    if (!globalStates['said']) {
      globalStates['said'] = {};
    }
    if (globalStates['said'][line]) {
      // console.log("already said line", line);
      return;
    } else {
      globalStates['said'][line] = true;
    }

    sayQ.push(line);
    this.checkSayQ();
  }

  checkSayQ() {
    if (sayQ.length == 0) {
      return;
    }
    if (sayingNowId) {
      const isSayingSomething = soundh.playing(sayingNowId);
      if (isSayingSomething) {
        soundh.on('end', this.checkSayQ, sayingNowId);
        return;
      }
    }
    const line = sayQ.shift();
    sayingNowId = this.play(line);
    soundh.volume(0.4, sayingNowId);
  }

  lastCliff = null;

  playCliffOnLeft() {
    this.playCliffOnSide(-1.0);
  }

  playCliffOnRight() {
    this.playCliffOnSide(1.0);
  }

  playNoCliff() {
    this.lastCliff = null;
  }

  playCliffOnSide(side) {
    const now = new Date().getTime();
    if (this.lastCliff) {
      if (this.lastCliff === side) {
        return;
      }
      // const delta = now - this.lastCliff;
      // if (delta < 1500) {
      //   return;
      // }
    }
    this.lastCliff = side;
    const playId = this.play(bank.rocks_1);
    soundh.volume(0.3, playId);
    soundh.stereo(side, playId);
  }

}




/**
*  @param howl - the Howler object to use
*  @param targetVolume - number between 0 & 1
*  @param time - time (in ms) for the fade to complete
*  https://github.com/goldfire/howler.js/issues/1324
**/
var fade = (function () {
  var intv;

  return function (howl, targetVolume, time) {
    clearInterval(intv);

    var vol = howl.volume();
    var delta = targetVolume - vol;
    var intervalMs = 20;
    var iterations = time / intervalMs;
    var volumeStep = delta / iterations;

    intv = setInterval(function () {
      iterations -= 1;
      vol += volumeStep;
      //  console.log("fade step", vol);
      howl.volume(vol);
      if (iterations === 0) {
        clearInterval(intv);
      }
    }, intervalMs);
  }
}());

export function fadeIn() {
  // return fade(Howler, 1, 200);
}

export function fadeOut() {
  // return fade(Howler, 0, 200);
}

