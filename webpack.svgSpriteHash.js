const fs = require('fs');
const md5File = require('md5-file')

// Rename filename with hash.
class svgSpriteHash {
  constructor(path, name, type) {
    this.path = path;
    this.name = name;
    this.type = type;
  }

  apply(compiler) {
    // Run svgSpriteHash script when other hooks have been run.
    compiler.hooks.done.tap('svgSpriteHash', (compilation) => {
      const fileName = `${this.path}/${this.name}.${this.type}`;
      const hash = md5File.sync(fileName);
      const newPathToFilename = `${this.path}/${this.name}-${hash}.${this.type}`;
      const newFilename = `${this.name}-${hash}.${this.type}`;

      // Rename the filename.
      fs.rename(fileName, newPathToFilename , function(err) {
        if (err) return console.log(`ERROR while trying to rename ${fileName}: ` + err);
      });

      // Update current sprite revision to .hdbt-icons.css.
      fs.readFile('./dist/css/hdbt-icons.css', 'utf8', function (err,data) {
        if (err) return console.log(`ERROR while trying to read hdbt-icons.css: ` + err);
        let result = data.replace(new RegExp('icons/sprite.svg', 'g'), `icons/${newFilename}`);

        fs.writeFile('./dist/css/hdbt-icons.css', result, 'utf8', function (err) {
          if (err) return console.log(`ERROR while trying to write hdbt-icons.css: ` + err);
        });
      });

    });
  }
}
module.exports = svgSpriteHash;
