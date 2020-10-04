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

let game = null;

document.body.addEventListener('click', function() {
  // Waiting for a click to avoid the Audio Context being paused
  // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
  
  // context.resume().then(() => {
    // sound.play();
    if (!game) {
      console.log('Game started');
      game = new Phaser.Game(config);
    }
  // });
});

// Allow users to cheat by just typing "cheat" into the console
window.cheat = new Image();
Object.defineProperty(window.cheat, 'id', {
  get: function() {
    window.scene.viewBlock.visible = false
  }
});
// `cheaa` prevents `cheat` from auto-completing after `ch`
window.cheaa = null;

