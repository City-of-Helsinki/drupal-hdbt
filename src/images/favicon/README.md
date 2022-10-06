# Hel.fi favicon

Many of the favicon instructions online are out of date and overly verbose. Here is the sweetspot for favicons that we use in hel.fi website. Only the necessary files are here, for example the safari svg silhouette is no longer needed, read more from the [blog post this work is based on](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs).

Logo is black on white, and where svg icon is supported it adapts to users darkmode preference. Previously we had transparent background on the favicon and this was problematic with dark skins of some browsers.

The logo layout is taken from Helsinki Design System (HDS) [favicon instructions](https://hds.hel.fi/foundation/visual-assets/favicon). Like in the HDS favicon package, the logo has padding around the shape same amount as the logo border width. The original logo shape for the sketchfile is from the visual styleguide as linked in [HDS logo page](https://hds.hel.fi/foundation/visual-assets/logo) as the svg version in HDS was overly compressed resulting in poor quality where svg would be used in large size.

## HTML Code

We should use this code to include the favicons on the site. (of course with proper paths)

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
```

### Explanation of the above HTML code:

* `favicon.ico` file with 16px and 32px versions with white backcround, preferrably should be shared (also) from root folder of website
* `favicon.svg` is the 512px version, with handwritten darkmode support added to switch between white and black background version.
* `apple-touch-icon.png` is 180px version, with extra 20px padding on sides to accomodate Apple iOS design recommendations.
* `manifest.webmanifest` tells systems that support it what files to use. Adapted from HDS, see changes and other contents below.
  * short name "hel.fi" that will be used as a name and most places
  * description "Helsingin kaupunki" that will be used when adding shortcut
  * contains reference to `favicon_192.png`
  * contains reference to `favicon_512.png`
  * theme color: `#ffffff` from HDS
  * background color: `#ffffff` from HDS
  * display mode: "browser" as we're not serving an application like HDS usually does, but a website

## Relevant files contained in this package:

* [favicon.ico](favicon.ico) 16px and 32px png images in .ico format, this should be served (also) in <https://www.hel.fi/favicon.ico> for RSS readers and others that do not read HTML when getting the file
* [favicon.svg](favicon.svg) 512px with handwritten darkmode support that flips colors to dark background while in darkmode
* [apple-touch-icon.png](apple-touch-icon.png) 180px version with 20px padding for apple devices homescreens
* [manifest.webmanifest](manifest.webmanifest) Links to bigger png files, name and color settings
* [favicon_192.svg](favicon_192.svg) 192px png version for webmanifest
* [favicon_512.png](favicon_512.png) 512px png version for webmanifest

### Additional files:
* `README.md` This file
* [hel.fi_favicon.sketch](hel.fi_favicon.sketch) origin of generated images
* [favicon_16.png](favicon_16.png) source file for generating favicon.ico, not used in HTML directly
* [favicon_32.png](favicon_32.png) source file for generating favicon.ico, not used in HTML directly

## Steps to regenerate these files

If you need to do changes to the logo for any reason, please follow Helsinki [visual indentity guidelines](https://brand.hel.fi/en/logo/).

### Requirements

* Sketch (sorry, only on macos with a licence, ask a designer to help if needed)
* `optipng` (osx homebrew: `brew install optipng`) to optimise .png files
* `svgo` via `npx` to optimise .svg files
* ImageMagick `convert` to combine .png files to .ico format

### Steps

* Export images from sketch
* Optimise png images `optipng -o7 *.png`
* Generate .ico file from 16px and 32px files: `convert favicon_32.png favicon_16.png favicon.ico`
* Optimise svg file `npx svgo --multipass favicon.svg`
* Edit the svg file with your favorite text editor, add `<style>.r{fill:#fff}.l{fill:#000}@media (prefers-color-scheme:dark){.r{fill:#000}.l{fill:#fff}}</style>` to handle mode switch, and `class="r"` to rectangle and `class="l"` to logo for targeting the css, remove fill attributes from icons and check that the logo works in darkmode and lightmode.
* Add the webmanifest file and link to 192 and 512px versions from it.
