# HDBT-theme
## Introduction

HDBT theme is a base theme for the City of Helsinki. It is based on the core theme stable9. The abbrevation comes from
the words Helsinki Drupal Base Theme. Style follows the [BEM methodology](http://getbem.com/) and javascript is written
as ES6. The JS and SCSS files are compiled and minified with webpack.

## Requirements

This theme requires Drupal core >= 9.1.0.

Requirements for developing:
- [NodeJS](https://nodejs.org/en/)
- [NPM](https://npmjs.com/)
- optional [NVM](https://github.com/nvm-sh/nvm)

## Commands

| Command       | Description                                                                       |
|---------------|-----------------------------------------------------------------------------------|
| nvm use       | Uses correct Node version chosen for the theme compiler.                          |
| npm i         | Install dependencies and link local packages.                                     |
| npm ci        | Install a project with a clean slate. Use especially in travis like environments. |
| npm run dev   | Compile styles and js for development environment. and watch file changes.        |
| npm run build | Build packages for production. Minify CSS/JS.                                     |

Set up the developing environment by running

    nvm use
    npm i

Explanations for commands.
- `nvm use` : Install and use the correct version of Node.
- `npm i` : As stated above; Install dependencies and link local packages.

Related files.
- `.nvmrc` : Defines the node version used to compile the theme.
- `package.json and package-lock.json` : Defines the node modules for compiling the theme.
- `postcss.config.js and postcss.plugins.js` : Configurations for the postcss-tool that is run when the theme is built.
You can read more about the tool here: https://postcss.org/
- `webpack.config.js` : Configuration file for the webpack-tool that is used to actually build the theme. Similar tool
to Gulp or Grunt. Usually if there is something wrong with the compiled theme files the culprit can be found here.
- `webpack.svgToSprite.js` : This file is used to create a sprite of all the icons used on the site. It gets all the
icons from the src-folder, compiles them into a sprite under `dist/icons` and also creates a css-file where the icons are
referenced called _hdbt-icons.css_.

## Structure for files and folders

### The config-folder

The config-folder includes configurations that are used when installing a new project from scratch. These configuration
files are copied under the conf/cmi folder and used there so altering them under theme doesn't change anything unless
you are building a new instance.

### The dist- and src-folders

Under the src-folder there is all the theme components that are being compiled to dist-folder such as css, javascript,
icons and fonts. Dist-folder includes the compiled version of the same information created using the commands listed
under commands-title.

The theme styles under the scss-folder are structured by implementing principles from the itcss architecture but with
small adjustments to make it work for the needs of the project.

### Templates-folder

Under the templates folder the structure is similar to the base-theme stable9 with few additions such as the module
folder that includes templates for the helfi-prefixed modules that are created for this project.

### Translations-folder

Translations-folder includes translations to all the translatable strings that are provided by the hdbt-theme.

## Webpack entries

Any .js file in /src/js/ will be compiled to separate entry and minified into the /dist folder.
Typescript entrypoints must be added separately. See webpack.config.js.

### How to use entries in Drupal libraries

```
component-library:
  version: 1.x
  css:
    theme:
      dist/css/component-library.min.css: {}
  js:
    dist/js/component-library.min.js: {}
```

Library must be loaded on the page where it's used.
It can be added via preprocess function or in a twig template.

### Usage as a base-theme

When building new projects using the drupal-helfi-platform you are provided with this theme. To maintain upgradeability
of this theme you should never add it to your version control and/or make changes to this theme directly, but instead
create a sub-theme that uses this HDBT-theme as the base theme for your project. You can read more about building sub-themes here:
[https://www.drupal.org/docs/theming-drupal/creating-sub-themes](https://www.drupal.org/docs/theming-drupal/creating-sub-themes).

This theme is under constant development and features, fixes and improvements will be added in new releases. To benefit
from these updates use `composer update drupal/hdbt` to update the theme regularly. Please notice however that updating the
theme can break some of the functionality that you have done in your site so test the changes carefully before applying them.
The version control for this theme can be found from [https://github.com/City-of-Helsinki/drupal-hdbt](https://github.com/City-of-Helsinki/drupal-hdbt).

## How tos

### My javascript has unexpected errors when loading a page in Drupal.

If you have compiled the code with dev-flag (`nmp run dev`), then the sourcemaps expects the JS files to be found in correct places.
This means that JS preprocessing (minifying) should be turned off. Just add the following lines to local.settings.php.
```
$config['system.performance']['css']['preprocess'] = 0;
$config['system.performance']['js']['preprocess'] = 0;
```

### I need to rebuild caches every time I build the css or change the twig files. How can I automate it?

You can create a `local.settings.php` and `local.services.yml` files to `/sites/default/` folder and paste the following contents in them.

_Keep in mind that using the Null Cache Backend is the primary culprit for caching issues. F.e. Something works in local environment, but not in production environment._

local.services.yml:
```
parameters:
  twig.config:
    debug: true # Displays twig debug messages, developers like them
    auto_reload: true # Reloads the twig files on every request, so no drush cache rebuild is required
    cache: false # No twig internal cache, important: check the example.settings.local.php to fully disable the twig cache

services:
  cache.backend.null: # Defines a Cache Backend Factory which is just empty, it is not used by default
    class: Drupal\Core\Cache\NullBackendFactory
```
local.settings.php:
```
<?php
/**
 * @file
 * An example of Drupal 9 development environment configuration file.
 */
$settings['cache']['bins']['render'] = 'cache.backend.null';
$settings['cache']['bins']['page'] = 'cache.backend.null';
$settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';

$settings['skip_permissions_hardening'] = TRUE;

$config['system.performance']['css']['preprocess'] = 0;
$config['system.performance']['js']['preprocess'] = 0;
$config['system.logging']['error_level'] = 'some';
```
### I get some mysterious 404 errors on console after building my theme using the 'npm run dev'
The issue here is actually in the combination of source maps and theme js aggregation. The system cannot find the files
associated with source maps because the aggregation names the files differently. What you need to do is disable js
aggregation from Drupal. Go to /admin/config/development/performance and uncheck 'Aggregate JavaScript files'. Clear
site caches and you should be able to continue with your work.

### How can I add custom translations?
Add your UI translations to ``./translations/{fi/sv}.po`` files like it is explained in Translation in Drupal 8 documentation: https://www.drupal.org/docs/understanding-drupal/translation-in-drupal-8.
These translations consists of:

PHP
```
$this->t('Example', [], ['context' => 'My custom context'])
```
Twig
```
{{ 'Example'|t({}, {'context': 'My custom context'}) }}
```
JS
```
const variable = Drupal.t('Example', {}, {context: 'My custom context'});
```

And the way to add the actual translation in to f.e. `fi.po` is done like so:
```
msgctxt "My custom context"
msgid "Example"
msgstr "Esimerkki"
```

To see these translation changes in an instance, run in container shell:
```
drush locale:check && drush locale:update
```
And then flush all caches from top left drupal admin menu under "Druplicon".

### I have some php linter errors

You can lint or fix php in instance root's shell

To lint
```
vendor/bin/phpcs public/themes/contrib/hdbt --extensions=php,module,theme,inc --ignore="*.js,*.css" --standard=Drupal
```

To fix
```
vendor/bin/phpcbf public/themes/contrib/hdbt --extensions=php,module,theme,inc --ignore="*.js,*.css" --standard=Drupal
```

### How to develop React apps

Add new REACT_SEARCHES entrypoint into webpack.config.js.

Add new library to libraries.yml file.

Inside Drupal: Load correct Drupal library to the page. Run `npm run dev` and make sure caches are disabled.
Outside Drupal: Open React app index.html file in browser and run `npm run dev`.

To build minified js file into the /dist folder run `npm run build`.

## ESLint

We are using the airbnb. The current eslint config is the bare minimum that should pass always everywhere.
Extend as necessary.

### Why is it so hard?
 - the eslint rules might be used from root (or beyond root) due to husky being funny
 - prettier overrides airbnb if setup incorrectly
 - root eslint rules (inside instance) might be very old
 - instance gitignore excludes subsequent eslints
 - when developing modules/themes under instance, the rules might chain in an unpredictable way


### How to use the eslint rules
- please use formatting and lint rules included in this repository
- make sure that your IDE applies these rules and not others when using this repo in an instance
- always use eslint formatting with prettier, never only prettier
- always verify, never override lint-staged
- fix your code before commit
- only override eslint rules inline for readability
