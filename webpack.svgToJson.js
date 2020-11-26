const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Generates a list of all files in inputPattern path and saves them as JSON.
class svgToJson {
  constructor(inputPattern, outputFilename) {
    this.inputPattern = inputPattern;
    this.output = outputFilename;
    this.files = [];
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('svgToJson', (compilation, callback) => {
      let filelist = '[';
      const last = this.files[this.files.length - 1];

      while(this.files.length) {
        let fullfilename = this.files.shift();
        let filename = fullfilename.replace(/^.*[\\\/]/, '')
        let name = filename.split('.');
        let divider = (fullfilename === last) ? '"' : '",';
        filelist += '"' + name[0] + divider;
      }
      filelist += ']';

      compilation.assets[this.output] = {
        source: function() {
          return filelist;
        },
        size: function() {
          return filelist.length;
        }
      };
      callback();
    });
    compiler.hooks.environment.tap('svgToJson', this.checkForFiles.bind(this));
    compiler.hooks.watchRun.tap('svgToJson', this.checkForFiles.bind(this));
  }

  checkForFiles() {
    glob.sync(this.inputPattern).map((match) => {
      const pathname = path.resolve(match);
      const stats = fs.lstatSync(pathname);

      if (stats.isFile()) {
        this.files = [...new Set([...this.files, pathname])];
      }
    });
  }
}
module.exports = svgToJson;
