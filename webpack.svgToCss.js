const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Generates styles for each icon.
class svgToScss {
  constructor(inputPattern, outputFilename, theme) {
    this.inputPattern = inputPattern;
    this.output = outputFilename;
    this.theme = theme;
    this.files = [];
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('svgToCss', (compilation, callback) => {

      let filelist = '';

      while(this.files.length) {
        let fullFilename = this.files.shift();
        let svg = fullFilename.split('/' + this.theme + '/')[1];
        let filename = fullFilename.replace(/^.*[\\\/]/, '')
        let name = filename.split('.');
        filelist += `.hdbt-icon--${name[0]}::after{mask-image:url('../../${svg}');-webkit-mask-image:url('../../${svg}');}`;
      }

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
    compiler.hooks.environment.tap('svgToCss', this.checkForFiles.bind(this));
    compiler.hooks.watchRun.tap('svgToCss', this.checkForFiles.bind(this));
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
module.exports = svgToScss;
