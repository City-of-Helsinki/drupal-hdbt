# HDBT Theme

![CI](https://github.com/City-of-Helsinki/drupal-hdbt/workflows/Lint/badge.svg)

## Introduction

HDBT theme is a base theme for the City of Helsinki. It is based on the core theme stable9. The abbrevation comes from
the words Helsinki Drupal Base Theme. Style follows the [BEM methodology](http://getbem.com/) and javascript is written
as ES6. The JS and SCSS files are compiled and minified with webpack.

## Requirements

This theme requires Drupal core >= 8.8.0.

Requirements for developing:
- [NodeJS ( ^ 12.18 )](https://nodejs.org/en/)
- [NPM](https://npmjs.com/)

## Commands

| Command       | Description                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| npm i         | Install dependencies and link local packages.                                     |
| npm ci        | Install a project with a clean slate. Use especially in travis like environments. |
| npm run dev   | Compile styles for development environment. and watch file changes.               |
| npm run build | Build packages for production. Minify CSS/JS.                                     |

Setup the developing environment by running

    nvm use
    npm i
    npx husky i

Explanations for commands.
- `nvm use` : Install and use the correct version of Node.
- `npm i` : As stated above; Install dependencies and link local packages.
- `npx husky i` : Execute husky package binary; Install git-hooks for the project.

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
