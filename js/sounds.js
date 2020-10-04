import { random } from "./utils.js";
import soundData from "../dist/soundData.js";

export const bank = {
}

const distanceVolumeOne = 32;

function loadSound(options) {
  console.log('sound options', options);
  const sound = new Howl(options);
  sound.pannerAttr().refDistance = distanceVolumeOne;
  sound.pannerAttr().maxDistance = 300;
  // sound.pannerAttr().distanceModel = 'linear';
  sound.pannerAttr().distanceModel = 'exponential';
  sound.pannerAttr().rolloffFactor = 2.4;
  // sound.pannerAttr().distanceModel = 'inverse';
  // sound.pannerAttr().rolloffFactor = 8;

  sound.pos(0, 0, 0);

  // debug sounds
  window.sound = sound;

  for (const name in options.sprite) {
    bank[name] = name;
  }

  console.log("sound bank", bank);

  return sound;
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
    soundHowl.pos(x, y, -distanceVolumeOne / 4, playId);
    
    console.log("sound at", soundName, x, y, playId, sound._src);
    return playId;
  }

  toHowl(soundName) {
    // console.log("to howl " + soundName);
    if (!bank[soundName]) {
      throw new Error("Invalid sound name: " + soundName);
    }
    return soundh;
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
}




/**
*  @param howl - the Howler object to use
*  @param targetVolume - number between 0 & 1
*  @param time - time (in ms) for the fade to complete
*  https://github.com/goldfire/howler.js/issues/1324
**/
var fade = (function() { 
  var intv;

  return function(howl, targetVolume, time) {
     clearInterval(intv);

     var vol = howl.volume();
     var delta = targetVolume - vol;
     var intervalMs = 20;
     var iterations = time / intervalMs;
     var volumeStep = delta / iterations;
     
     intv = setInterval(function() {
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
  return fade(Howler, 1, 200);
}

export function fadeOut() {
  return fade(Howler, 0, 200);
}

