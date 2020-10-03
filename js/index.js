/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Tileset by 0x72 under CC-0, https://0x72.itch.io/16x16-industrial-tileset
 */

import PlatformerScene from "./platformer-scene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  backgroundColor: "#1d212d",
  scene: PlatformerScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 }
    }
  }
};

const game = new Phaser.Game(config);

//Howler.pos(this.x, this.y, -0.5);
const sound = new Howl({
  src: ['./audio/sounds.mp3'],
  // sprite: {
  //   lightning: [2000, 4147],
  //   rain: [8000, 9962, true],
  //   thunder: [19000, 13858],
  //   music: [34000, 31994, true]
  // },
  // volume: 0
});

sound.play();


