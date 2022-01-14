const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Generates styles for each icon.
class svgToScss {
  constructor(inputPattern, outputFilename) {
    this.inputPattern = inputPattern;
    this.output = outputFilename;
    this.cssVariables = [];
    this.classes = [];
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('svgToCss', (compilation, callback) => {

      // Create --hdbt-icon--{icon name} CSS variables.
      let cssVariables = 'html{';
      while(this.cssVariables.length) {
        let fullFilename = this.cssVariables.shift();
        let filename = fullFilename.replace(/^.*[\\\/]/, '')
        let name = filename.split('.');
        cssVariables += `--hdbt-icon--${name[0]}: url(../icons/sprite.svg#${name[0]});`;
      }
      cssVariables += '}';

      // Create .hdbt-icon--{icon name} css classes.
      let cssClasses = '';
      while(this.classes.length) {
        let fullFilename = this.classes.shift();
        let filename = fullFilename.replace(/^.*[\\\/]/, '')
        let name = filename.split('.');
        cssClasses += `.hdbt-icon--${name[0]} {--url: var(--hdbt-icon--${name[0]});}`;
      }

      // Combine CSS variables and classes.
      let filelist = cssVariables + cssClasses;

      // Compile the assets.
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
        this.classes = [...new Set([...this.classes, pathname])];
        this.cssVariables = [...new Set([...this.cssVariables, pathname])];
      }
    });
  }
}
module.exports = svgToScss;
