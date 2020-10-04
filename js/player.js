/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
const maxVelocityY = 800;
const maxVelocityX = 300;

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.wasInAir = false;
    this.justJumped = false;

    // Create the animations we need from the player spritesheet
    const anims = scene.anims;
    anims.create({
      key: "player-idle",
      frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1
    });
    anims.create({
      key: "player-run",
      frames: anims.generateFrameNumbers("player", { start: 8, end: 15 }),
      frameRate: 12,
      repeat: -1
    });

    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, "player", 0)
      .setDrag(1000, 0)
      .setMaxVelocity(maxVelocityX, maxVelocityY)
      .setSize(18, 24)
      .setOffset(7, 9);

    // for debugging
    window.sprite = this.sprite;

    // Track the arrow keys & WASD
    const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      w: W,
      a: A,
      d: D
    });
  }

  freeze() {
    this.sprite.body.moves = false;
  }

  update() {
    const { keys, sprite } = this;
    const onGround = sprite.body.blocked.down;
    // const acceleration = onGround ? 600 : 200;
    const acceleration = 600;
    // console.log("sprite xy", this.sprite.x, this.sprite.y);
    //Howler.pos(this.sprite.x, this.sprite.y, 0);

    if (!onGround && !this.wasInAir && !this.justJumped) {
      // You were on the ground, now you're not,
      // and you didn't jump. You slipped.
      this.scene.sounds.playSlipped();
    }

    // Only allow the player to jump if they are on the ground
    if (onGround && (keys.up.isDown || keys.w.isDown)) {
      // 🦘☝
      console.log("jump");
      sprite.setVelocityY(-480);
      this.scene.sounds.playJump();
      this.justJumped = true;
    } else {
      this.justJumped = false;
    }

    // Update the animation/texture based on the state of the player
    if (onGround) {
      if (sprite.body.velocity.x !== 0) {
        sprite.anims.play("player-run", true);
        this.scene.sounds.walkingOn(Math.abs(sprite.body.velocity.x / maxVelocityX));
      } else {
        sprite.anims.play("player-idle", true);
        this.scene.sounds.walkingOff();
      }
      if (this.wasInAir) {
        this.scene.sounds.playLanded();
      }
      this.wasInAir = false;
    } else {
      this.wasInAir = true;
      sprite.anims.stop();
      sprite.setTexture("player", 10);
      this.scene.sounds.walkingOff();
    }

    // Flying sound based on y velocity
    this.scene.sounds.playFlying(0.08 * Math.abs(sprite.body.velocity.y / maxVelocityY));

    // is on ledge?
    const tile = this.scene.groundLayer.getTileAtWorldXY(sprite.x, sprite.y, true);
    if (tile) {
      const underRight = this.scene.groundLayer.getTileAt(tile.x + 1, tile.y + 1, true);
      const underJust = this.scene.groundLayer.getTileAt(tile.x, tile.y + 1, true);
      const underLeft = this.scene.groundLayer.getTileAt(tile.x - 1, tile.y + 1, true);
      // console.log('tilexy', tile.x, tile.y, underLeft.index, underJust.index, underRight.index);
      if (onGround && underJust.index === -1) {
        // a few pixels from falling
        if (underRight.index !== -1) {
          this.scene.sounds.playCliffOnLeft();
        } else if (underLeft.index !== -1) {
          this.scene.sounds.playCliffOnRight();
        }
      } else {
        this.scene.sounds.playNoCliff();
      }
    }

    // Apply horizontal acceleration when left/a or right/d are applied
    if (keys.left.isDown || keys.a.isDown) {
      // 👈
      sprite.setAccelerationX(-acceleration);
      // sprite.setVelocityX(-130);
      // No need to have a separate set of graphics for running to the left & to the right. Instead
      // we can just mirror the sprite.
      sprite.setFlipX(true);
    } else if (keys.right.isDown || keys.d.isDown) {
      // 👉
      // sprite.setVelocityX(130);
      sprite.setAccelerationX(acceleration);
      sprite.setFlipX(false);
    } else {
      sprite.setAccelerationX(0);
    }

    // BUMP SOUNDS
    if (sprite.body.blocked.up) {
      this.scene.sounds.playBumpTop();
    }
    if (sprite.body.blocked.right) {
      this.scene.sounds.touchRightOn();
    } else {
      this.scene.sounds.touchRightOff();
    }
    if (sprite.body.blocked.left) {
      this.scene.sounds.touchLeftOn();
    } else {
      this.scene.sounds.touchLeftOff();
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}
