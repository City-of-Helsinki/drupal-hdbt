# HDBT-theme

## Introduction

HDBT theme is a base theme for the City of Helsinki. It is based on the core theme stable9. The abbrevation comes from
the words Helsinki Drupal Base Theme. Style follows the [BEM methodology](http://getbem.com/) and javascript is written
as ES6. The JS and SCSS files are compiled and minified with webpack.

## Requirements

This theme requires Drupal core >= 9.1.0.

Requirements for developing:
- [NodeJS ( ^ 16.10 )](https://nodejs.org/en/)
- [NPM](https://npmjs.com/)

## Commands

| Command       | Description                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| nvm use       | Uses correct Node version chosen for the theme compiler.                          |
| npm i         | Install dependencies and link local packages.                                     |
| npm ci        | Install a project with a clean slate. Use especially in travis like environments. |
| npm run dev   | Compile styles for development environment. and watch file changes.               |
| npm run build | Build packages for production. Minify CSS/JS.                                     |

Setup the developing environment by running

    nvm use
    npm i

Explanations for commands.
- `nvm use` : Install and use the correct version of Node.
- `npm i` : As stated above; Install dependencies and link local packages.

## Structure for files and folders

```
hdbt
│   README.md
└───src
│   └───scss
│   │   │   styles.scss
│   └───js
│   │   │   common.js
│   └───icons
│       |   sprite.svg
│       └───subdir
│           |   some-icon.svg
└───dist
    └───css
    └───js
    └───icons
```

## Component library

Ready to use components can be explored from component library.
Component library is not installed by default, but it can be installed in same fashion as any other module.
Once installed it can be accessed in `/admin/appearance/hdbt/component-library`.

### Development

Add new components to the library manually via the twig template. `./templates/component_library/component-library--hdbt.html.twig`

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

## Component documentation

### Accordion paragraph
The accordion paragraph uses handorgel-javascript for the accordion functionality (https://github.com/oncode/handorgel)
and it is configured in the accordion-settings.js file under the theme. The handorger library is set up as a separate,
stand-alone library in the theme and an accordion library is set up to provide the settings file with dependency
to the handorgel-library.

Each accordion paragraph consists of accordion items and each of these items is also a paragraph, so it is a paragraph-
inception like we like to call it.

### Gallery paragraph
The Gallery paragraph is done using two separate javascript libraries: Splide (https://github.com/Splidejs/splide) and
Tiny Slider (https://github.com/ganlanyuan/tiny-slider). The Splide library is used to provide the actual gallery
functionality so it handles displaying the big images with arrows on both sides to move the slides back and forward.
The Splide library had all the tools to create thumbnails under the main gallery and link them, but the thumbnail-list
was not scrollable. To make it scrollable we brought in Tiny Slider and fused the two libraries to work together so
that thumbnails can be scrolled using the Tiny Slider. Both Splide and Tiny Slider are set up as a separate, stand-alone
libraries in the theme and they are brought together using gallery library that has dependency to both. The library
configuration and fusing is done in gallery-settings.js under the theme.

Much like the accordion the gallery also consist of gallery paragraph that in turn consists of gallery slide paragraphs.
This means that also the gallery paragraph is so-called paragraph-inception.

### Kuura Health Chat
Kuura Health chat is attached to a block id `block-kuurahealthchat` when adding the external library. This causes the
chat to appear in inline-mode which adds class `kuura-widget-container-inline` for the widget. These styles are
overridden in the `_kuura-health-chat.scss` file. If in some cases the chat doesn't appear on the site even if adding
it on the block layout, make sure that there is a block with the correct id on the html-dom.
