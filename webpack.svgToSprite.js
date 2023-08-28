const fs = require('fs');
const md5 = require('md5');
const path = require('path');
const glob = require('glob');
const SVGSpriter = require('svg-sprite');

// Generates styles for each icon.
class svgToSprite {
  constructor(inputPattern, outputSvgSpriteFilename, outputIconJsonFilename) {

    // Input and output patterns.
    this.inputPattern = inputPattern;
    this.svgSpriteFilename = outputSvgSpriteFilename;
    this.svgToCssOutputFilename = `css/hdbt-icons.css`;
    this.svgToCkeditorCssOutputFilename = `css/ckeditor-icons.css`;
    this.svgToJsonOutputFilename = outputIconJsonFilename;

    // Icon class.
    this.iconClass = 'hel';

    // Mapped SVG files.
    this.files = [];
    this.cssVariables = [];
    this.ckeditorVariables = [];
    this.classes = [];

    // Sprite configuration.
    this.spriteHashFilename = '';
  }

  apply(compiler) {
    const pluginName = svgToSprite.name;
    const { webpack } = compiler;
    const { Compilation } = webpack;
    const { RawSource } = webpack.sources;

    // Tapping to the "thisCompilation" hook in order to further tap
    // to the compilation process on an earlier stage.
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {

      // Tapping to the assets processing pipeline on a specific stage.
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        () => {
          if (this.files) {
            // Create Spriter instance with custom configuration.
            let spriter = new SVGSpriter({
              mode: {
                stack: {
                  dest: "dist",
                  sprite: this.svgSpriteFilename,
                  rootviewbox: false,
                }
              }
            });

            // Add SVG files to Spriter instance.
            this.files.forEach(function(pathname) {
              spriter.add(pathname, null, fs.readFileSync(pathname, 'utf-8'));
            });

            // Compile the sprite.
            spriter.compile((error, result) => {
              for (let mode in result) {
                for (let resource in result[mode]) {
                  let hash = md5(result[mode][resource].contents).slice(-5);
                  let outputFilename = this.svgSpriteFilename.replace(/.svg/g, `-${hash}.svg`);

                  if (result[mode][resource].contents) {
                    this.spriteHashFilename = outputFilename;

                    // Adding new asset to the compilation, so it will be
                    // automatically generated by the webpack
                    // in the output directory.
                    compilation.emitAsset(
                      outputFilename,
                      new RawSource(result[mode][resource].contents)
                    );
                  }
                }
              }
            });
          }
        }
      );
    });

    // SVG to CSS.
    // Create styles for the icons.
    compiler.hooks.emit.tapAsync('svgToCss', (compilation, callback) => {
      let useOldClass = true; // TODO: UHF-8792 If sensible lets try to get rid of the hdbt-icon class. If that can be done, remove this (https://helsinkisolutionoffice.atlassian.net/browse/UHF-8792).

      // Create --hel-icon--{icon name} CSS variables.
      let cssVariables = [];

      while(this.cssVariables.length) {
        let fullFilename = this.cssVariables.shift();
        let filename = fullFilename.replace(/^.*[\\\/]/, '')
        let name = filename.split('.');
        cssVariables.push(`--${this.iconClass}-icon--${name[0]}:url(../../../../contrib/hdbt/dist/${this.spriteHashFilename}#${name[0]})`);
      }
      cssVariables = `:root{${ cssVariables.join(';') }}`;

      // Create .hel-icon--{icon name} or {theme-name}--{icon name} css classes.
      let cssClasses = '';
      while(this.classes.length) {
        let fullFilename = this.classes.shift();
        let filename = fullFilename.replace(/^.*[\\\/]/, '')
        let name = filename.split('.');
        cssClasses += `.${this.iconClass}-icon--${name[0]}{--url:var(--${this.iconClass}-icon--${name[0]})}`;

        // TODO: UHF-8792 If sensible lets try to get rid of the hdbt-icon class. If that can be done, remove this (https://helsinkisolutionoffice.atlassian.net/browse/UHF-8792).
        if (useOldClass) {
          cssClasses += `.hdbt-icon--${name[0]}{--url:var(--${this.iconClass}-icon--${name[0]})}`;
        }
      }

      // Add a URL as a CSS variable to the hel-icon mask-image.
      // If icons are used elsewhere (f.e. in a separate theme or module) this
      // variable will provide the correct URL for the icon.
      let hdbtIconUrl = `.${this.iconClass}-icon{` +
        `-webkit-mask-image:var(--url);` +
        `mask-image:var(--url)` +
      `}`;

      // TODO: UHF-8792 If sensible lets try to get rid of the hdbt-icon class. If that can be done, remove this (https://helsinkisolutionoffice.atlassian.net/browse/UHF-8792).
      if (useOldClass) {
        hdbtIconUrl += `.hdbt-icon::before{` +
          `-webkit-mask-image:var(--url);` +
          `mask-image:var(--url)` +
        `}`;
      }

      // Combine CSS variables and classes.
      let filelist = cssVariables + cssClasses + hdbtIconUrl;

      // Compile the assets.
      compilation.assets[this.svgToCssOutputFilename] = {
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

    // SVG to Ckeditor CSS.
    // Create styles for the icons for CKEditor.
    compiler.hooks.emit.tapAsync('svgToCkeditorCss', (compilation, callback) => {
      // Create [data-selected-icon={icon name}]::before styles.
      let cssClasses = '';
      while(this.ckeditorVariables.length) {
        let fullFilename = this.ckeditorVariables.shift();
        let filename = fullFilename.replace(/^.*[\\\/]/, '')
        let name = filename.split('.');
        cssClasses += `[data-selected-icon=${name[0]}]::before{` +
          `-webkit-mask-image:var(--${this.iconClass}-icon--${name[0]});` +
          `mask-image:var(--${this.iconClass}-icon--${name[0]})` +
          `}`;
      }

      // Combine CSS variables and classes.
      let filelist = cssClasses;

      // Compile the assets.
      compilation.assets[this.svgToCkeditorCssOutputFilename] = {
        source: function() {
          return filelist;
        },
        size: function() {
          return filelist.length;
        }
      };
      callback();
    });
    compiler.hooks.environment.tap('svgToCkeditorCss', this.checkForFiles.bind(this));
    compiler.hooks.watchRun.tap('svgToCkeditorCss', this.checkForFiles.bind(this));

    // SVG to JSON
    // Create a list of icons in JSON format.
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

      compilation.assets[this.svgToJsonOutputFilename] = {
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

  // Map files to suitable variables.
  checkForFiles() {
    glob.globSync(this.inputPattern).map((match) => {
      const pathname = path.resolve(match);
      const stats = fs.lstatSync(pathname);

      if (stats.isFile()) {
        this.classes = [...new Set([...this.classes, pathname])];
        this.cssVariables = [...new Set([...this.cssVariables, pathname])];
        this.ckeditorVariables = [...new Set([...this.ckeditorVariables, pathname])];
        this.files = [...new Set([...this.files, pathname])];
      }
    });
  }
}

module.exports = svgToSprite;
