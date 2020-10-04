const audiosprite = require('audiosprite');
const fs = require('fs');

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
