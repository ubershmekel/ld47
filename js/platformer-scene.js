import Player from "./player.js";
import MouseTileMarker from "./mouse-tile-maker.js";
import { Sounds, bank, fadeOut, fadeIn } from "./sounds.js";
import { counter } from "./utils.js";

const tileIndex = {
  wind: 342,
  snake: 330,
  endGame: 317,
  ledge1: 325,
  ledge2: 326,
  ledge3: 327,
}

const ledgeX = {
  ledge1: 0,
  ledge2: 0,
  ledge3: 0,
  endGame: 0,
  firstSnake: 0,
}

/**
 * A class that extends Phaser.Scene and wraps up the core logic for the platformer level.
 */
export default class PlatformerScene extends Phaser.Scene {
  preload() {
    this.sounds = new Sounds();
    this.load.spritesheet(
      "player",
      "./assets/spritesheets/0x72-industrial-player-32px-extruded.png",
      {
        frameWidth: 32,
        frameHeight: 32,
        margin: 1,
        spacing: 2
      }
    );
    this.load.image("spike", "./assets/images/0x72-industrial-spike.png");
    this.load.image("tiles", "./assets/tilesets/0x72-industrial-tileset-32px-extruded.png");
    this.load.tilemapTiledJSON("map", "./assets/tilemaps/platformer.json");
  }

  create() {
    console.log("scene create()");

    // for debug
    window.scene = this;

    fadeIn();

    this.isPlayerDead = false;

    const map = this.make.tilemap({ key: "map" });
    const tiles = map.addTilesetImage("0x72-industrial-tileset-32px-extruded", "tiles");

    map.createDynamicLayer("Background", tiles);
    this.groundLayer = map.createDynamicLayer("Ground", tiles);
    map.createDynamicLayer("Foreground", tiles);
    
    const wind = map.createStaticLayer("Spawns", tiles);
    this.sounds.doOnce('setup-grid-sounds', () => {
      ledgeX.firstSnake = 99999;
      wind.forEachTile(tile => {
        if (tile.index === -1) {
          return;
        }
        if (tile.index === tileIndex.wind) {
          this.sounds.playWind(tile.pixelX, tile.pixelY);
        } else if (tile.index === tileIndex.snake) {
          this.sounds.playSnarl(tile.pixelX, tile.pixelY);
          if (tile.pixelX < ledgeX.firstSnake) {
            ledgeX.firstSnake = tile.pixelX;
          }
        } else if (tile.index === tileIndex.ledge1) {
          ledgeX.ledge1 = tile.pixelX;
        } else if (tile.index === tileIndex.ledge2) {
          ledgeX.ledge2 = tile.pixelX;
        } else if (tile.index === tileIndex.ledge3) {
          ledgeX.ledge3 = tile.pixelX;
        } else if (tile.index === tileIndex.endGame) {
          ledgeX.endGame = tile.pixelX;
        } else {
          console.log("unknown spawn type", tile.index, tile.pixelX);
        }
      });
    });

    // Instantiate a player instance at the location of the "Spawn Point" object in the Tiled map
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    this.player = new Player(this, spawnPoint.x, spawnPoint.y);

    // Collide the player against the ground layer - here we are grabbing the sprite property from
    // the player (since the Player class is not a Phaser.Sprite).
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider(this.player.sprite, this.groundLayer);

    // The map contains a row of spikes. The spike only take a small sliver of the tile graphic, so
    // if we let arcade physics treat the spikes as colliding, the player will collide while the
    // sprite is hovering over the spikes. We'll remove the spike tiles and turn them into sprites
    // so that we give them a more fitting hitbox.
    this.spikeGroup = this.physics.add.staticGroup();
    this.groundLayer.forEachTile(tile => {
      if (tile.index === 77) {
        const spike = this.spikeGroup.create(tile.getCenterX(), tile.getCenterY(), "spike");

        // The map has spikes rotated in Tiled (z key), so parse out that angle to the correct body
        // placement
        spike.rotation = tile.rotation;
        if (spike.angle === 0) spike.body.setSize(32, 6).setOffset(0, 26);
        else if (spike.angle === -90) spike.body.setSize(6, 32).setOffset(26, 0);
        else if (spike.angle === 90) spike.body.setSize(6, 32).setOffset(0, 0);

        this.groundLayer.removeTileAt(tile.x, tile.y);
      }
    });

    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.marker = new MouseTileMarker(this, map);

    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, "Arrow/WASD to move & jump", {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0);

    this.time.delayedCall(500, () => {
      this.sounds.say(bank.hey_buddy);
    })
    
    
    // Block view, we are blind
    this.viewBlock = this.add.rectangle(map.widthInPixels / 2, map.heightInPixels / 2, map.widthInPixels, map.heightInPixels, 0x111144);
  }

  placeDebugTile(worldPoint) {
    // Left click to draw platforms
    const prevTile = this.groundLayer.getTileAtWorldXY(worldPoint.x, worldPoint.y);
    if (!prevTile) {
      const tile = this.groundLayer.putTileAtWorldXY(6, worldPoint.x, worldPoint.y);
      if (tile) {
        // Place debug blocks that play a local sound 
        console.log("play!")
        tile.setCollision(true);
        this.sounds.play(bank.sounds, worldPoint.x, worldPoint.y);
      } else {
        // clicked outside of the game area
      }
    } 
  }

  checkLedgeProgress(deltaMs) {
    const x = this.player.sprite.x;
    if (x > ledgeX.endGame) {
      this.sounds.say(bank.ending);
    } else if (x > ledgeX.ledge3) {
      this.sounds.say(bank.climb_up_dont_leave);
      counter.timeLedge4Ms += deltaMs;
    } else if (x > ledgeX.firstSnake) {
      this.sounds.say(bank.dont_step_on_snakes);
    } else if (x > ledgeX.ledge2) {
      this.sounds.say(bank.got_over_pit);
      counter.timeLedge3Ms += deltaMs;
    } else if (x > ledgeX.ledge1) {
      this.sounds.say(bank.wow_ledge);
      counter.timeLedge2Ms += deltaMs;
    } else {
      counter.timeLedge1Ms += deltaMs;
    }

    if (counter.timeLedge1Ms > 60 * 1000 && counter.timeLedge2Ms < 10) {
      this.sounds.say(bank.ledge1_clue);
    }
  }

  update(time, deltaMs) {
    if (this.isPlayerDead) return;

    this.marker.update();
    this.player.update(time, deltaMs);
    this.sounds.checkSayQ();

    this.checkLedgeProgress(deltaMs);

    // if (this.sounds.bank.look._sounds[0]._panner) {
      // console.log("soundx", this.sounds.bank.look._sounds[0]._panner.positionX.value, Howler.ctx.listener.positionX.value);
    //}
    
    // audio position
    this.sounds.listenerPos(this.player.sprite.x, this.player.sprite.y);

    // Add a colliding tile at the mouse position
    const pointer = this.input.activePointer;
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    if (pointer.isDown) {
      // this.placeDebugTile(worldPoint);
    }

    if (
      this.player.sprite.y > this.groundLayer.height ||
      this.physics.world.overlap(this.player.sprite, this.spikeGroup)
    ) {
      // Flag that the player is dead so that we can stop update from running in the future
      this.isPlayerDead = true;

      counter.death += 1;
      const deathVariation = (counter.death % 3) + 1;
      this.sounds.sayAnyway('back_to_start_' + deathVariation);
      console.log("counters", counter);

      const cam = this.cameras.main;
      cam.shake(100, 0.05);
      cam.fade(500, 0, 0, 0);

      // Freeze the player to leave them on screen while fading but remove the marker immediately
      this.player.freeze();
      this.marker.destroy();

      fadeOut()

      cam.once("camerafadeoutcomplete", () => {
        // Howler.unload clears the cache, causing all files to redownload
        // Howler.unload();
        // Howler.stop();

        this.player.destroy();
        this.scene.restart();
      });
    }
  }
}
