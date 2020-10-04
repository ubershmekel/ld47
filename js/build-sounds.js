const audiosprite = require('audiosprite');
const fs = require('fs');
const pathToFfmpeg = require('ffmpeg-static');

// pathToFfmpeg /opt/build/repo/node_modules/ffmpeg-static/ffmpeg

console.log("pathToFfmpeg", pathToFfmpeg);
const ffmpegDir = pathToFfmpeg.substring(0, pathToFfmpeg.lastIndexOf('/'));
console.log("ffmpegDir", ffmpegDir);
let sep = ';';
if (process.env.path.indexOf(sep) < 0) {
  // This assumes a path var with at least 2 things in it.
  // I'm ok with that.
  sep = ':';
}
process.env.path += sep + ffmpegDir;

const root = './assets/audio/';
const outDir = './dist/'

fs.mkdirSync(outDir, { recursive: true })

var files = fs.readdirSync(root).map(dir => root + dir);
console.log("listdir", files)
var opts = {
  output: outDir + 'soundsprites',
  format: 'howler2',
  // logger: {
  //   debug: console.log,
  //   info: console.log,
  //   log: console.log,
  // }
}

process.env.path += ' /opt/build/repo/node_modules/ffmpeg-static/'

audiosprite(files, opts, function(err, obj) {
  if (err) return console.error(err)

  const dataText = 'export default ' + JSON.stringify(obj, null, 2);

  // console.log(JSON.stringify(obj, null, 2))
  fs.writeFile(outDir + "soundData.js", dataText, function(err) {
    if (err) {
      throw err;
    }
    console.log('complete');
  });
})
