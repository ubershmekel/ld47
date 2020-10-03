
const sounds = {
  look: "look",
}

const distanceVolumeOne = 32;

export default class Sounds {
  bank = {};

  constructor() {

    //Howler.pos(this.x, this.y, -0.5);
    // this.bank.silence = new Howl({
    //   src: ['../assets/audio/silence.mp3'],
    // });

    this.bank.look = new Howl({
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

    this.bank.look.pannerAttr().refDistance = distanceVolumeOne;

    // Init pos(0,0,0) because otherwise the first sound gets center-panned
    // and tweened into its final position which sounds odd.
    // I'm guessing the browser panner is not set up before the first `pos` call.
    this.bank.look.pos(0, 0, 0);
  }

  play(sound, x, y) {
    sound.pos(x, y, -distanceVolumeOne / 8);
    const playId = sound.play();
    // sound.pos(x, y, -distanceVolumeOne / 4, playId);
    
    console.log("sound at", x, y);
  }

  listenerPos(x, y) {
    // console.log("listenerPos", x, y);
    Howler.pos(x, y, 0);
  }
}

