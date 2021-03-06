import { random } from "./utils.js";
import soundData from "../dist/soundData.js";

export const bank = {
}

const globalStates = {};
const sayQ = [];
globalStates.sayingNowId = 0;
const distanceVolumeOne = 32;
const soundh = loadSound(soundData);

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

export class Sounds {
  scene = null;
  constructor(scene) {
    this.scene = scene;
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

  walkingOn(rate) {
    if (rate < 0.5) {
      rate = 0.5;
    }
    if (rate > 1.0) {
      rate = 1.0;
    }
    if (globalStates.walking) {
      // console.log("walk rate", rate);
      soundh.rate(rate, globalStates.walking);
      return;
    }
    const playId = this.play("step-1");
    soundh.rate(rate, playId);
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

  playLanded(tileY) {
    // top tileY is 5, bottom is 17
    // divided by 3 that means [1, 5];
    // dd = tileY / 3
    // 5 - dd = [0, 4]
    const toPlay = 5 - Math.floor(tileY / 3)
    const playId = this.play("piano_a" + toPlay);
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
    soundh.volume(0.15, playId);
  }

  playBird(x, y) {
    const soundHowl = this.toHowl(bank.bird);
    const playId = this.play(bank.bird, x, y);
    const speed = random(0.8, 1.2);
    soundHowl.rate(speed, playId);
    soundHowl.loop(true, playId);
    soundHowl.volume(0.2, playId);
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

  sayAnyway(line) {
    sayQ.push(line);
    this.checkSayQ();
  }

  say(line) {
    // this `say` makes sure we never repeat a line.
    if (!globalStates['said']) {
      globalStates['said'] = {};
    }
    if (globalStates['said'][line]) {
      // console.log("already said line", line);
      return;
    } else {
      globalStates['said'][line] = true;
    }
    this.sayAnyway(line);
  }

  isSaying() {
    if (!globalStates.sayingNowId) {
      return false;
    }
    return soundh.playing(globalStates.sayingNowId);
  }

  // verifyPausedWhileSay() {
  //   console.log("verifyPausedWhileSay");
  //   if (this.isSaying()) {
  //     this.scene.scene.pause();
  //     setTimeout(() => {
  //       // arrow function to save `this`
  //       this.verifyPausedWhileSay();
  //     }, 20);
  //   } else {
  //     this.scene.scene.resume();
  //   }
  // }

  checkSayQ() {
    if (this.isSaying()) {
      return;
    }
    if (sayQ.length == 0) {
      return;
    }
    const line = sayQ.shift();
    globalStates.sayingNowId = this.play(line);
    soundh.volume(0.4, globalStates.sayingNowId);
    // this.verifyPausedWhileSay();
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

  playLoveWalls() {
    this.doOnce('love-walls', () => {
      const playId = this.play(bank.love_wall);
      soundh.volume(0.3, playId);
    });
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

