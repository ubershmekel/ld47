# Don't Go

* [Go play now](https://dontgo.netlify.app/) but make sure you're wearing 
* A platformer you can play without your eyes. Listen to the sounds that indicate you're close to danger and from where.
* Built for [Ludum Dare 47](https://ldjam.com/events/ludum-dare/47/dont-go) and you can find some clues in the spoiler tags there if you click the black rectangles.

# How to develop this locally

```
npm install
npm run build-sounds
# now open index.html from a web server
# eg:
http-server
```

# How to build for production

```
npm install
npm run build
# results from parcel are in the `output` folder.
```

# Credits

* Secret underlying tileset by 0x72 - https://0x72.itch.io/16x16-industrial-tileset
* Platformer example base by Michael Hadley - https://itnext.io/modular-game-worlds-in-phaser-3-tilemaps-2-dynamic-platformer-3d68e73d494a
* Game engine is Phaser 3 https://photonstorm.github.io
* Audio engine is HowlerJs https://howlerjs.com/

